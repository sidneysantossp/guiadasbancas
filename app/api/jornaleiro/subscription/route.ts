import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { findOrCreateCustomer, createPayment, formatDueDate, getPaymentPixQrCode } from "@/lib/asaas";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Obter assinatura atual do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    // Buscar banca do usuário
    const { data: banca } = await supabaseAdmin
      .from("bancas")
      .select("id, name, email")
      .eq("user_id", session.user.id)
      .single();

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    // Buscar assinatura ativa
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select(`
        *,
        plan:plans(*)
      `)
      .eq("banca_id", banca.id)
      .in("status", ["active", "trial", "pending", "overdue"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Buscar últimos pagamentos
    const { data: payments } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("banca_id", banca.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      subscription,
      payments: payments || [],
      banca: { id: banca.id, name: banca.name, email: banca.email },
    });
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Criar/atualizar assinatura (checkout)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { plan_id, billing_type = "PIX" } = body;

    if (!plan_id) {
      return NextResponse.json({ success: false, error: "Plano não informado" }, { status: 400 });
    }

    // Buscar plano
    const { data: plan } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .eq("is_active", true)
      .single();

    if (!plan) {
      return NextResponse.json({ success: false, error: "Plano não encontrado" }, { status: 404 });
    }

    // Buscar banca
    const { data: banca } = await supabaseAdmin
      .from("bancas")
      .select("id, name, email, whatsapp, cnpj, cpf")
      .eq("user_id", session.user.id)
      .single();

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    // Se for plano gratuito, ativar diretamente
    if (plan.type === "free" || plan.price === 0) {
      const { data: subscription, error } = await supabaseAdmin
        .from("subscriptions")
        .upsert({
          banca_id: banca.id,
          plan_id: plan.id,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: null,
        }, { onConflict: "banca_id" })
        .select()
        .single();

      if (error) throw error;

      // Ativar banca
      await supabaseAdmin
        .from("bancas")
        .update({ active: true })
        .eq("id", banca.id);

      return NextResponse.json({
        success: true,
        subscription,
        message: "Plano gratuito ativado com sucesso!",
      });
    }

    // Para planos pagos, criar cobrança no Asaas
    const cpfCnpj = banca.cnpj || banca.cpf;
    
    // Criar ou buscar cliente no Asaas
    const customer = await findOrCreateCustomer({
      name: banca.name,
      email: banca.email,
      cpfCnpj: cpfCnpj || undefined,
      phone: banca.whatsapp || undefined,
      externalReference: banca.id,
    });

    // Criar cobrança
    const dueDate = formatDueDate();
    const payment = await createPayment({
      customer: customer.id,
      billingType: billing_type,
      value: plan.price,
      dueDate,
      description: `Assinatura ${plan.name} - Guia das Bancas`,
      externalReference: `${banca.id}:${plan.id}`,
    });

    // Se for PIX, buscar QR Code
    let pixData = null;
    if (billing_type === "PIX") {
      try {
        pixData = await getPaymentPixQrCode(payment.id);
      } catch (e) {
        console.error("Erro ao buscar QR Code PIX:", e);
      }
    }

    // Criar assinatura pendente
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        banca_id: banca.id,
        plan_id: plan.id,
        status: "pending",
        asaas_customer_id: customer.id,
        current_period_start: new Date().toISOString(),
      }, { onConflict: "banca_id" })
      .select()
      .single();

    if (subError) throw subError;

    // Registrar pagamento
    const { data: paymentRecord } = await supabaseAdmin
      .from("payments")
      .insert({
        subscription_id: subscription.id,
        banca_id: banca.id,
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
        asaas_bank_slip_url: payment.bankSlipUrl,
        asaas_pix_qrcode: pixData?.encodedImage,
        asaas_pix_code: pixData?.payload,
        amount: plan.price,
        status: "pending",
        payment_method: billing_type.toLowerCase(),
        due_date: dueDate,
        description: `Assinatura ${plan.name}`,
      })
      .select()
      .single();

    // Criar notificação
    await supabaseAdmin.from("notifications").insert({
      banca_id: banca.id,
      type: "payment_created",
      title: "Nova cobrança gerada",
      message: `Cobrança de R$ ${plan.price.toFixed(2)} para o plano ${plan.name}`,
      data: { payment_id: paymentRecord?.id, asaas_payment_id: payment.id },
    });

    return NextResponse.json({
      success: true,
      subscription,
      payment: {
        id: paymentRecord?.id,
        asaas_id: payment.id,
        invoice_url: payment.invoiceUrl,
        bank_slip_url: payment.bankSlipUrl,
        pix_qrcode: pixData?.encodedImage,
        pix_code: pixData?.payload,
        due_date: dueDate,
        amount: plan.price,
      },
    });
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
