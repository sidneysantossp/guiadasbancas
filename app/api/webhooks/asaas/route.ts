import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { downgradeBancaToFreePlan } from "@/lib/banca-subscription";
import { syncWholesaleOrderPaymentFromAsaas } from "@/lib/modules/atacado/service";
import {
  clearBancaPricingOverride,
  findSubscriptionBindingByAsaasId,
  removeSubscriptionBindingByAsaasId,
  saveSubscriptionBinding,
} from "@/lib/subscription-billing";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LocalSubscriptionContext = {
  id: string;
  banca_id: string;
  plan_id: string;
  status: string;
  asaas_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  plan?: {
    id: string;
    name?: string | null;
    billing_cycle?: string | null;
  } | null;
};

function calculateNextPeriodEnd(billingCycle?: string | null): string {
  const nextPeriodEnd = new Date();
  const cycle = (billingCycle || "monthly").toLowerCase();

  switch (cycle) {
    case "quarterly":
      nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 3);
      break;
    case "semiannual":
      nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 6);
      break;
    case "annual":
      nextPeriodEnd.setFullYear(nextPeriodEnd.getFullYear() + 1);
      break;
    default:
      nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);
      break;
  }

  return nextPeriodEnd.toISOString();
}

function normalizePaymentStatus(rawStatus?: string | null): string {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    RECEIVED: "received",
    CONFIRMED: "confirmed",
    OVERDUE: "overdue",
    REFUNDED: "refunded",
    RECEIVED_IN_CASH: "received",
    REFUND_REQUESTED: "pending",
    CHARGEBACK_REQUESTED: "pending",
    CHARGEBACK_DISPUTE: "pending",
    AWAITING_CHARGEBACK_REVERSAL: "pending",
    DUNNING_REQUESTED: "overdue",
    DUNNING_RECEIVED: "received",
    AWAITING_RISK_ANALYSIS: "pending",
  };

  return statusMap[String(rawStatus || "").toUpperCase()] || "pending";
}

function normalizeIsoDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function extractAsaasSubscriptionId(body: any, payment: any): string | null {
  return typeof payment?.subscription === "string"
    ? payment.subscription
    : typeof payment?.subscription?.id === "string"
      ? payment.subscription.id
      : typeof body?.subscription === "string"
        ? body.subscription
        : typeof body?.subscription?.id === "string"
          ? body.subscription.id
          : null;
}

function extractExternalReference(body: any, payment: any): string | null {
  return typeof payment?.externalReference === "string"
    ? payment.externalReference
    : typeof body?.subscription?.externalReference === "string"
      ? body.subscription.externalReference
      : null;
}

function isSubscriptionCancellationEvent(event: string): boolean {
  return ["SUBSCRIPTION_DELETED", "SUBSCRIPTION_INACTIVATED"].includes(event);
}

function hasValidWebhookToken(request: NextRequest): boolean {
  const expectedToken =
    process.env.ASAAS_WEBHOOK_TOKEN ||
    process.env.ASAAS_WEBHOOK_ACCESS_TOKEN ||
    process.env.SAAS_WEBHOOK_TOKEN;

  if (!expectedToken) {
    return process.env.NODE_ENV !== "production";
  }

  const receivedToken =
    request.headers.get("asaas-access-token") ||
    request.headers.get("x-asaas-access-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return receivedToken === expectedToken;
}

function buildWebhookEventKey(body: any, event: string, payment: any, subscriptionPayload: any): string {
  if (typeof body?.id === "string" && body.id.trim()) {
    return body.id.trim();
  }

  const stableParts = [
    event,
    payment?.id || "",
    payment?.status || "",
    payment?.dueDate || "",
    payment?.paymentDate || "",
    payment?.clientPaymentDate || "",
    typeof payment?.subscription === "string" ? payment.subscription : payment?.subscription?.id || "",
    typeof body?.subscription === "string" ? body.subscription : body?.subscription?.id || subscriptionPayload?.id || "",
    subscriptionPayload?.status || "",
    subscriptionPayload?.nextDueDate || "",
  ];

  return createHash("sha256")
    .update(stableParts.join("|") || JSON.stringify(body || {}))
    .digest("hex");
}

async function registerWebhookEvent(params: {
  eventKey: string;
  eventType: string;
  providerPaymentId: string | null;
  providerSubscriptionId: string | null;
  payload: any;
}): Promise<{ id: string | null; duplicateProcessed: boolean }> {
  const { data, error } = await supabaseAdmin
    .from("billing_webhook_events")
    .insert({
      provider: "asaas",
      event_key: params.eventKey,
      event_type: params.eventType,
      provider_payment_id: params.providerPaymentId,
      provider_subscription_id: params.providerSubscriptionId,
      payload: params.payload || {},
      processing_status: "processing",
    })
    .select("id, processing_status")
    .single();

  if (!error) {
    return { id: data.id, duplicateProcessed: false };
  }

  if (error.code === "23505") {
    const { data: existing } = await supabaseAdmin
      .from("billing_webhook_events")
      .select("id, processing_status")
      .eq("provider", "asaas")
      .eq("event_key", params.eventKey)
      .maybeSingle();

    if (existing?.processing_status === "processed") {
      return { id: existing.id, duplicateProcessed: true };
    }

    if (existing?.id) {
      await supabaseAdmin
        .from("billing_webhook_events")
        .update({
          processing_status: "processing",
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      return { id: existing.id, duplicateProcessed: false };
    }
  }

  const missingTable =
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /relation .* does not exist/i.test(error.message || "") ||
    /Could not find the table/i.test(error.message || "");

  if (missingTable) {
    return { id: null, duplicateProcessed: false };
  }

  throw new Error(error.message);
}

async function markWebhookEventProcessed(
  webhookEventId: string | null,
  context: { subscriptionId?: string | null; bancaId?: string | null } = {}
) {
  if (!webhookEventId) return;

  await supabaseAdmin
    .from("billing_webhook_events")
    .update({
      processing_status: "processed",
      processed_at: new Date().toISOString(),
      subscription_id: context.subscriptionId || null,
      banca_id: context.bancaId || null,
      error_message: null,
    })
    .eq("id", webhookEventId);
}

async function markWebhookEventFailed(webhookEventId: string | null, error: any) {
  if (!webhookEventId) return;

  await supabaseAdmin
    .from("billing_webhook_events")
    .update({
      processing_status: "failed",
      error_message: error?.message || "Erro desconhecido",
      updated_at: new Date().toISOString(),
    })
    .eq("id", webhookEventId);
}

async function loadLocalSubscriptionById(id: string): Promise<LocalSubscriptionContext | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      asaas_subscription_id,
      current_period_start,
      current_period_end,
      trial_ends_at,
      plan:plans(id, name, billing_cycle)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as LocalSubscriptionContext | null) || null;
}

async function loadLocalSubscriptionByAsaasId(asaasSubscriptionId: string): Promise<LocalSubscriptionContext | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      asaas_subscription_id,
      current_period_start,
      current_period_end,
      trial_ends_at,
      plan:plans(id, name, billing_cycle)
    `)
    .eq("asaas_subscription_id", asaasSubscriptionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as LocalSubscriptionContext | null) || null;
}

async function resolveLocalSubscriptionContext(params: {
  binding: Awaited<ReturnType<typeof findSubscriptionBindingByAsaasId>> | null;
  asaasSubscriptionId: string | null;
  externalReference: string | null;
}): Promise<LocalSubscriptionContext | null> {
  const { binding, asaasSubscriptionId, externalReference } = params;

  if (binding?.localSubscriptionId) {
    const boundSubscription = await loadLocalSubscriptionById(binding.localSubscriptionId);
    if (boundSubscription) return boundSubscription;
  }

  if (asaasSubscriptionId) {
    const byAsaasId = await loadLocalSubscriptionByAsaasId(asaasSubscriptionId);
    if (byAsaasId) return byAsaasId;
  }

  if (externalReference?.startsWith("gb-sub:")) {
    const localSubscriptionId = externalReference.replace("gb-sub:", "");
    if (localSubscriptionId) {
      const byLocalId = await loadLocalSubscriptionById(localSubscriptionId);
      if (byLocalId) return byLocalId;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  let webhookEventId: string | null = null;

  try {
    if (!hasValidWebhookToken(request)) {
      return NextResponse.json(
        { received: false, error: "Invalid Asaas webhook token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const event = String(body?.event || "").toUpperCase();
    const payment = body?.payment && typeof body.payment === "object" ? body.payment : null;
    const subscriptionPayload = body?.subscription && typeof body.subscription === "object" ? body.subscription : null;

    console.log("[WEBHOOK/ASAAS] Evento recebido:", event);

    const asaasPaymentId = typeof payment?.id === "string" ? payment.id : null;
    const asaasSubscriptionId = extractAsaasSubscriptionId(body, payment);
    const externalReference = extractExternalReference(body, payment);
    const eventKey = buildWebhookEventKey(body, event, payment, subscriptionPayload);
    const registeredEvent = await registerWebhookEvent({
      eventKey,
      eventType: event,
      providerPaymentId: asaasPaymentId,
      providerSubscriptionId: asaasSubscriptionId,
      payload: body,
    });

    webhookEventId = registeredEvent.id;

    if (registeredEvent.duplicateProcessed) {
      return NextResponse.json({
        received: true,
        processed: true,
        duplicate: true,
        source: "webhook-idempotency",
      });
    }

    const wholesaleOrder = payment
      ? await syncWholesaleOrderPaymentFromAsaas({
          asaasPaymentId,
          externalReference,
          payment,
          event,
        })
      : null;

    if (wholesaleOrder) {
      await markWebhookEventProcessed(webhookEventId, {
        bancaId: wholesaleOrder.banca_id,
      });

      return NextResponse.json({
        received: true,
        processed: true,
        source: "own-wholesale-order",
      });
    }

    let binding = asaasSubscriptionId ? await findSubscriptionBindingByAsaasId(asaasSubscriptionId) : null;
    let localSubscription = await resolveLocalSubscriptionContext({
      binding,
      asaasSubscriptionId,
      externalReference,
    });

    if (localSubscription && asaasSubscriptionId) {
      const nextDueDate = normalizeIsoDate(subscriptionPayload?.nextDueDate);
      const trialEndsAt = localSubscription.status === "trial" ? nextDueDate || localSubscription.trial_ends_at : localSubscription.trial_ends_at;

      const { error: syncSubscriptionError } = await supabaseAdmin
        .from("subscriptions")
        .update({
          asaas_subscription_id: asaasSubscriptionId,
          current_period_end: nextDueDate || localSubscription.current_period_end,
          trial_ends_at: trialEndsAt,
        })
        .eq("id", localSubscription.id);

      if (syncSubscriptionError) {
        throw new Error(syncSubscriptionError.message);
      }

      if (!binding) {
        await saveSubscriptionBinding({
          asaasSubscriptionId,
          localSubscriptionId: localSubscription.id,
          bancaId: localSubscription.banca_id,
          planId: localSubscription.plan_id,
          effectivePrice: Number(payment?.value || subscriptionPayload?.value || 0),
          billingType: String(payment?.billingType || subscriptionPayload?.billingType || "CREDIT_CARD").toUpperCase(),
          asaasCustomerId:
            typeof payment?.customer === "string"
              ? payment.customer
              : typeof subscriptionPayload?.customer === "string"
                ? subscriptionPayload.customer
                : null,
          status: localSubscription.status,
          createdAt: new Date().toISOString(),
        });
        binding = await findSubscriptionBindingByAsaasId(asaasSubscriptionId);
      }
    }

    let paymentRecord: any = null;
    if (asaasPaymentId) {
      const { data: foundPaymentRecord } = await supabaseAdmin
        .from("payments")
        .select("*, subscription:subscriptions(*, plan:plans(id, name, billing_cycle))")
        .eq("asaas_payment_id", asaasPaymentId)
        .maybeSingle();

      paymentRecord = foundPaymentRecord;
    }

    if (!paymentRecord && asaasPaymentId && localSubscription) {
      const { data: createdPaymentRecord, error: createdPaymentError } = await supabaseAdmin
        .from("payments")
        .insert({
          subscription_id: localSubscription.id,
          banca_id: localSubscription.banca_id,
          asaas_payment_id: asaasPaymentId,
          asaas_invoice_url: payment?.invoiceUrl || null,
          asaas_bank_slip_url: payment?.bankSlipUrl || null,
          amount: Number(payment?.value || 0),
          status: normalizePaymentStatus(payment?.status),
          payment_method: String(payment?.billingType || binding?.billingType || "").toLowerCase() || null,
          due_date: payment?.dueDate || null,
          description: payment?.description || `Assinatura recorrente ${localSubscription.plan?.name || localSubscription.plan_id}`,
          metadata: {
            event,
            asaas_subscription_id: asaasSubscriptionId,
          },
        })
        .select("*, subscription:subscriptions(*, plan:plans(id, name, billing_cycle))")
        .maybeSingle();

      if (createdPaymentError) {
        throw new Error(createdPaymentError.message);
      }

      paymentRecord = createdPaymentRecord;
    }

    if (!localSubscription && paymentRecord?.subscription_id) {
      localSubscription = await loadLocalSubscriptionById(paymentRecord.subscription_id);
    }

    const bancaId = localSubscription?.banca_id || binding?.bancaId || paymentRecord?.banca_id || null;

    if (isSubscriptionCancellationEvent(event) && bancaId) {
      const cancelledAt = new Date().toISOString();

      if (asaasSubscriptionId) {
        await removeSubscriptionBindingByAsaasId(asaasSubscriptionId);
      }

      await clearBancaPricingOverride(bancaId);
      await downgradeBancaToFreePlan(bancaId, {
        cancelReason: `Assinatura cancelada no Asaas (${event})`,
        cancelledAt,
        matchSubscriptionId: localSubscription?.id || binding?.localSubscriptionId || null,
      });

      await supabaseAdmin.from("notifications").insert({
        banca_id: bancaId,
        type: "subscription_cancelled",
        title: "Premium cancelado",
        message: "A assinatura Premium foi cancelada no Asaas e a banca voltou a operar no plano Free.",
        data: {
          asaas_subscription_id: asaasSubscriptionId,
          local_subscription_id: localSubscription?.id || binding?.localSubscriptionId || null,
          event,
        },
      });

      await markWebhookEventProcessed(webhookEventId, {
        subscriptionId: localSubscription?.id || binding?.localSubscriptionId || null,
        bancaId,
      });

      return NextResponse.json({ received: true, processed: true, source: "subscription-cancel" });
    }

    if (localSubscription && asaasSubscriptionId && ["SUBSCRIPTION_CREATED", "SUBSCRIPTION_UPDATED"].includes(event)) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          asaas_subscription_id: asaasSubscriptionId,
          current_period_end: normalizeIsoDate(subscriptionPayload?.nextDueDate) || localSubscription.current_period_end,
          trial_ends_at:
            localSubscription.status === "trial"
              ? normalizeIsoDate(subscriptionPayload?.nextDueDate) || localSubscription.trial_ends_at
              : localSubscription.trial_ends_at,
        })
        .eq("id", localSubscription.id);

      await markWebhookEventProcessed(webhookEventId, {
        subscriptionId: localSubscription.id,
        bancaId: localSubscription.banca_id,
      });

      return NextResponse.json({ received: true, processed: true, source: "subscription-sync" });
    }

    if (!paymentRecord) {
      await markWebhookEventProcessed(webhookEventId, {
        subscriptionId: localSubscription?.id || null,
        bancaId,
      });

      return NextResponse.json({ received: true, processed: false, message: "No matching local payment" });
    }

    const newStatus = normalizePaymentStatus(payment?.status);

    await supabaseAdmin
      .from("payments")
      .update({
        status: newStatus,
        paid_at: newStatus === "received" || newStatus === "confirmed" ? new Date().toISOString() : null,
        net_amount: Number(payment?.netValue || 0) || null,
        metadata: {
          ...(paymentRecord.metadata || {}),
          event,
          asaas_subscription_id: asaasSubscriptionId,
          raw_status: payment?.status || null,
        },
      })
      .eq("id", paymentRecord.id);

    if ((newStatus === "received" || newStatus === "confirmed") && localSubscription) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          asaas_subscription_id: asaasSubscriptionId || localSubscription.asaas_subscription_id,
          current_period_start: new Date().toISOString(),
          current_period_end: calculateNextPeriodEnd(localSubscription.plan?.billing_cycle),
          trial_ends_at: null,
          cancelled_at: null,
          cancel_reason: null,
        })
        .eq("id", localSubscription.id);

      if (bancaId) {
        await supabaseAdmin.from("notifications").insert({
          banca_id: bancaId,
          type: "payment_confirmed",
          title: "Pagamento confirmado! 🎉",
          message: `Seu pagamento de R$ ${Number(payment?.value || 0).toFixed(2)} foi confirmado. O Premium já está ativo na banca.`,
          data: {
            payment_id: paymentRecord.id,
            asaas_payment_id: asaasPaymentId,
            asaas_subscription_id: asaasSubscriptionId,
          },
        });
      }
    }

    if (newStatus === "overdue" && localSubscription) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "overdue",
          asaas_subscription_id: asaasSubscriptionId || localSubscription.asaas_subscription_id,
        })
        .eq("id", localSubscription.id);

      if (bancaId) {
        await supabaseAdmin.from("notifications").insert({
          banca_id: bancaId,
          type: "payment_overdue",
          title: "Pagamento vencido",
          message: `A cobrança de R$ ${Number(payment?.value || 0).toFixed(2)} venceu. Regularize para manter os recursos Premium.`,
          data: {
            payment_id: paymentRecord.id,
            asaas_payment_id: asaasPaymentId,
            asaas_subscription_id: asaasSubscriptionId,
          },
        });
      }
    }

    await markWebhookEventProcessed(webhookEventId, {
      subscriptionId: localSubscription?.id || paymentRecord?.subscription_id || null,
      bancaId,
    });

    return NextResponse.json({ received: true, processed: true, source: "payment" });
  } catch (error: any) {
    try {
      await markWebhookEventFailed(webhookEventId, error);
    } catch (eventError) {
      console.warn("[WEBHOOK/ASAAS] Falha ao registrar erro do evento:", eventError);
    }
    console.error("[WEBHOOK/ASAAS] Erro:", error);
    return NextResponse.json(
      { received: true, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "Guia das Bancas Webhook" });
}
