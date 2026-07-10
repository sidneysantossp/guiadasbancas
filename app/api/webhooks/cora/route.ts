import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function hasValidWebhookToken(request: NextRequest): Promise<boolean> {
  let expectedToken = process.env.CORA_WEBHOOK_TOKEN || "";

  if (!expectedToken) {
    const { data } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "cora_webhook_token")
      .maybeSingle();

    expectedToken = data?.value || "";
  }

  if (!expectedToken) {
    return process.env.NODE_ENV !== "production";
  }

  const receivedToken =
    request.headers.get("x-cora-token") ||
    request.headers.get("cora-access-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return receivedToken === expectedToken;
}

function normalizeStatus(value?: string | null) {
  const status = String(value || "").trim().toUpperCase();
  if (status === "PAID") return "confirmed";
  if (status === "LATE" || status === "OVERDUE") return "overdue";
  if (status === "CANCELLED" || status === "CANCELED") return "cancelled";
  return "pending";
}

function extractInvoice(body: any) {
  const invoice = body?.invoice || body?.data?.invoice || body?.resource || body?.data || body;
  return {
    id: String(invoice?.id || invoice?.invoice_id || body?.id || "").trim(),
    code: invoice?.code || body?.code || null,
    status: invoice?.status || body?.status || body?.event_type || body?.event || null,
    amount: Number(invoice?.total_amount || invoice?.amount || body?.amount || 0) / 100,
    raw: body,
  };
}

export async function POST(request: NextRequest) {
  if (!(await hasValidWebhookToken(request))) {
    return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const invoice = extractInvoice(body);

    if (!invoice.id) {
      return NextResponse.json({ received: true, processed: false, message: "Sem invoice id" });
    }

    const { data: paymentRecord, error: paymentError } = await supabaseAdmin
      .from("payments")
      .select("*, subscription:subscriptions(*, plan:plans(id, name, billing_cycle))")
      .eq("asaas_payment_id", invoice.id)
      .maybeSingle();

    if (paymentError) {
      throw new Error(paymentError.message);
    }

    if (!paymentRecord) {
      return NextResponse.json({ received: true, processed: false, message: "Pagamento local não encontrado" });
    }

    const newStatus = normalizeStatus(invoice.status);
    const paid = newStatus === "confirmed";
    const now = new Date().toISOString();

    await supabaseAdmin
      .from("payments")
      .update({
        status: newStatus,
        paid_at: paid ? now : null,
        metadata: {
          ...(paymentRecord.metadata || {}),
          provider: "cora",
          provider_status: invoice.status,
          webhook_payload: invoice.raw,
        },
      })
      .eq("id", paymentRecord.id);

    const subscription = Array.isArray(paymentRecord.subscription)
      ? paymentRecord.subscription[0]
      : paymentRecord.subscription;

    if (paid && subscription?.id) {
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          current_period_start: now,
          current_period_end: calculateNextPeriodEnd(subscription.plan?.billing_cycle),
          trial_ends_at: null,
          cancelled_at: null,
          cancel_reason: null,
        })
        .eq("id", subscription.id);

      await supabaseAdmin.from("notifications").insert({
        banca_id: paymentRecord.banca_id,
        type: "payment_confirmed",
        title: "Pagamento confirmado!",
        message: `Seu pagamento de R$ ${Number(paymentRecord.amount || invoice.amount || 0).toFixed(2)} foi confirmado. O Premium já está ativo na banca.`,
        data: {
          payment_id: paymentRecord.id,
          provider: "cora",
          provider_payment_id: invoice.id,
        },
      });
    }

    if (newStatus === "overdue" && subscription?.id) {
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "overdue" })
        .eq("id", subscription.id);
    }

    return NextResponse.json({ received: true, processed: true, status: newStatus });
  } catch (error: any) {
    console.error("[WEBHOOK/CORA] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao processar webhook Cora" },
      { status: 500 }
    );
  }
}
