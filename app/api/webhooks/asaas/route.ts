import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Buscar pagamento no banco
    const { data: paymentRecord } = await supabaseAdmin
      .from("payments")
      .select("*, subscription:subscriptions(*)")
      .eq("asaas_payment_id", payment.id)
      .single();

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

    // Se pagamento confirmado, ativar assinatura e banca
    if (newStatus === "received" || newStatus === "confirmed") {
      // Atualizar assinatura para ativa
      if (paymentRecord.subscription_id) {
        const nextPeriodEnd = new Date();
        nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1); // +1 mês por padrão

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: nextPeriodEnd.toISOString(),
          })
          .eq("id", paymentRecord.subscription_id);

        console.log("[WEBHOOK/ASAAS] Assinatura ativada:", paymentRecord.subscription_id);
      }

      // Ativar banca
      if (paymentRecord.banca_id) {
        await supabaseAdmin
          .from("bancas")
          .update({ active: true })
          .eq("id", paymentRecord.banca_id);

        console.log("[WEBHOOK/ASAAS] Banca ativada:", paymentRecord.banca_id);

        // Criar notificação de confirmação
        await supabaseAdmin.from("notifications").insert({
          banca_id: paymentRecord.banca_id,
          type: "payment_confirmed",
          title: "Pagamento confirmado! 🎉",
          message: `Seu pagamento de R$ ${payment.value?.toFixed(2)} foi confirmado. Sua banca está ativa!`,
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
