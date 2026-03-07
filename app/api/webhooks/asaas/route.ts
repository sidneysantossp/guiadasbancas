import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findSubscriptionBindingByAsaasId } from "@/lib/subscription-billing";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

// Webhook do Asaas para notificações de pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("[WEBHOOK/ASAAS] Evento recebido:", body.event);
    console.log("[WEBHOOK/ASAAS] Payload:", JSON.stringify(body, null, 2));

    const { event, payment } = body;

    if (!payment?.id) {
      return NextResponse.json({ received: true, message: "No payment data" });
    }

    const asaasSubscriptionId =
      typeof payment.subscription === "string"
        ? payment.subscription
        : typeof payment.subscription?.id === "string"
          ? payment.subscription.id
          : typeof body.subscription?.id === "string"
            ? body.subscription.id
            : null;

    // Buscar pagamento no banco
    let { data: paymentRecord } = await supabaseAdmin
      .from("payments")
      .select("*, subscription:subscriptions(*, plan:plans(billing_cycle))")
      .eq("asaas_payment_id", payment.id)
      .maybeSingle();

    if (!paymentRecord && asaasSubscriptionId) {
      const binding = await findSubscriptionBindingByAsaasId(asaasSubscriptionId);
      if (binding) {
        const createdStatusMap: Record<string, string> = {
          PENDING: "pending",
          RECEIVED: "received",
          CONFIRMED: "confirmed",
          OVERDUE: "overdue",
        };

        const { data: createdPaymentRecord } = await supabaseAdmin
          .from("payments")
          .insert({
            subscription_id: binding.localSubscriptionId,
            banca_id: binding.bancaId,
            asaas_payment_id: payment.id,
            asaas_invoice_url: payment.invoiceUrl || null,
            asaas_bank_slip_url: payment.bankSlipUrl || null,
            amount: Number(payment.value || binding.effectivePrice || 0),
            status: createdStatusMap[payment.status] || "pending",
            payment_method: String(payment.billingType || binding.billingType || "").toLowerCase(),
            due_date: payment.dueDate || null,
            description: payment.description || `Assinatura recorrente ${binding.planId}`,
          })
          .select("*, subscription:subscriptions(*, plan:plans(billing_cycle))")
          .maybeSingle();

        paymentRecord = createdPaymentRecord;
      }
    }

    if (!paymentRecord) {
      console.log("[WEBHOOK/ASAAS] Pagamento não encontrado no banco:", payment.id);
      return NextResponse.json({ received: true, message: "Payment not found in database" });
    }

    // Mapear status do Asaas para nosso sistema
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

    const newStatus = statusMap[payment.status] || "pending";

    // Atualizar status do pagamento
    await supabaseAdmin
      .from("payments")
      .update({
        status: newStatus,
        paid_at: payment.status === "RECEIVED" || payment.status === "CONFIRMED" 
          ? new Date().toISOString() 
          : null,
        net_amount: payment.netValue,
      })
      .eq("id", paymentRecord.id);

    console.log("[WEBHOOK/ASAAS] Pagamento atualizado:", paymentRecord.id, "->", newStatus);

    // Se pagamento confirmado, ativar assinatura
    if (newStatus === "received" || newStatus === "confirmed") {
      // Atualizar assinatura para ativa
      if (paymentRecord.subscription_id) {
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: calculateNextPeriodEnd((paymentRecord as any)?.subscription?.plan?.billing_cycle),
          })
          .eq("id", paymentRecord.subscription_id);

        console.log("[WEBHOOK/ASAAS] Assinatura ativada:", paymentRecord.subscription_id);
      }

      // Notificar confirmação do pagamento sem alterar a publicação da banca
      if (paymentRecord.banca_id) {
        await supabaseAdmin.from("notifications").insert({
          banca_id: paymentRecord.banca_id,
          type: "payment_confirmed",
          title: "Pagamento confirmado! 🎉",
          message: `Seu pagamento de R$ ${payment.value?.toFixed(2)} foi confirmado. Sua assinatura já está ativa no painel.`,
          data: { payment_id: paymentRecord.id },
        });
      }
    }

    // Se pagamento vencido, criar notificação
    if (newStatus === "overdue") {
      if (paymentRecord.banca_id) {
        await supabaseAdmin.from("notifications").insert({
          banca_id: paymentRecord.banca_id,
          type: "payment_overdue",
          title: "Pagamento vencido",
          message: `Seu pagamento de R$ ${payment.value?.toFixed(2)} está vencido. Regularize para manter sua banca ativa.`,
          data: { payment_id: paymentRecord.id },
        });

        // Atualizar assinatura para overdue
        if (paymentRecord.subscription_id) {
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "overdue" })
            .eq("id", paymentRecord.subscription_id);
        }
      }
    }

    return NextResponse.json({ received: true, processed: true });
  } catch (error: any) {
    console.error("[WEBHOOK/ASAAS] Erro:", error);
    return NextResponse.json(
      { received: true, error: error.message },
      { status: 500 }
    );
  }
}

// Asaas pode fazer GET para verificar se o webhook está ativo
export async function GET() {
  return NextResponse.json({ status: "ok", service: "Guia das Bancas Webhook" });
}
