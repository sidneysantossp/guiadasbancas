import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import {
  cancelSubscription,
  createSubscription,
  findOrCreateCustomer,
  formatDueDate,
  getPaymentPixQrCode,
  getSubscriptionPayments,
} from "@/lib/asaas";
import { ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import {
  claimPaidPlanTrial,
  claimPremiumLaunchOffer,
  clearBancaPricingOverride,
  findSubscriptionBindingByBancaId,
  getBancaPricingOverride,
  hasBancaUsedPaidPlanTrial,
  readPaidPlanTrialDays,
  releasePremiumLaunchOffer,
  releasePaidPlanTrial,
  removeSubscriptionBindingByAsaasId,
  resolvePlanPricing,
  saveBancaPricingOverride,
  saveSubscriptionBinding,
} from "@/lib/subscription-billing";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function addDaysToIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

async function waitForFirstSubscriptionPayment(asaasSubscriptionId: string) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const payments = await getSubscriptionPayments(asaasSubscriptionId);
    const firstPayment = (payments.data || [])
      .slice()
      .sort((a: any, b: any) => {
        const dateA = new Date(a?.dueDate || 0).getTime();
        const dateB = new Date(b?.dueDate || 0).getTime();
        return dateA - dateB;
      })[0];

    if (firstPayment?.id) {
      return firstPayment;
    }

    await sleep(700);
  }

  return null;
}

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
    let { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select(`
        *,
        plan:plans(*)
      `)
      .eq("banca_id", banca.id)
      .in("status", ["active", "trial", "pending", "overdue"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subscription) {
      await ensureBancaHasOnboardingPlan(banca.id);

      const { data: onboardingSubscription } = await supabaseAdmin
        .from("subscriptions")
        .select(`
          *,
          plan:plans(*)
        `)
        .eq("banca_id", banca.id)
        .in("status", ["active", "trial", "pending", "overdue"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      subscription = onboardingSubscription;
    }

    const pricingOverride = await getBancaPricingOverride(banca.id);
    if (subscription?.plan && pricingOverride && pricingOverride.planId === subscription.plan_id) {
      subscription.plan = {
        ...subscription.plan,
        price: pricingOverride.effectivePrice,
        original_price: pricingOverride.originalPrice,
        promotion_label: pricingOverride.promotionLabel,
        promo_applied: pricingOverride.promoApplied,
      };
    }

    const entitlements = await resolveBancaPlanEntitlements({ id: banca.id });

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
      effective_plan: entitlements.plan,
      requested_plan: entitlements.requestedPlan,
      entitlements: {
        plan_type: entitlements.planType,
        paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
        overdue_features_locked: entitlements.overdueFeaturesLocked,
        overdue_in_grace_period: entitlements.overdueInGracePeriod,
        overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
      },
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
      const previousBinding = await findSubscriptionBindingByBancaId(banca.id);
      if (previousBinding?.asaasSubscriptionId) {
        try {
          await cancelSubscription(previousBinding.asaasSubscriptionId);
        } catch (cancelError: any) {
          console.warn("[API/JORNALEIRO/SUBSCRIPTION] Falha ao cancelar assinatura remota anterior:", cancelError?.message || cancelError);
        }

        await removeSubscriptionBindingByAsaasId(previousBinding.asaasSubscriptionId);
      }

      await clearBancaPricingOverride(banca.id);
      const subscription = await ensureBancaHasOnboardingPlan(banca.id, { preferredPlanId: plan.id });

      return NextResponse.json({
        success: true,
        subscription,
        message: "Plano gratuito ativado com sucesso! Seu painel já está liberado.",
      });
    }

    const [pricingPreview, paidPlanTrialDays, paidPlanTrialAlreadyUsed] = await Promise.all([
      resolvePlanPricing(plan, banca.id),
      readPaidPlanTrialDays(),
      hasBancaUsedPaidPlanTrial(banca.id),
    ]);

    let trialDaysApplied = 0;
    let claimedTrialNow = false;

    if (
      Number(plan.price || 0) > 0 &&
      (plan.type || "").toLowerCase() !== "free" &&
      paidPlanTrialDays > 0 &&
      !paidPlanTrialAlreadyUsed
    ) {
      const trialClaim = await claimPaidPlanTrial(banca.id);
      if (trialClaim.claimedNow) {
        trialDaysApplied = paidPlanTrialDays;
        claimedTrialNow = true;
      }
    }

    let claimedLaunchOfferNow = false;
    let pricing = pricingPreview;

    if (pricingPreview.promoApplied && pricingPreview.effectivePrice < Number(plan.price || 0)) {
      const claimResult = await claimPremiumLaunchOffer(banca.id);
      if (claimResult.claimedNow) {
        claimedLaunchOfferNow = true;
      }
      pricing = await resolvePlanPricing(plan, banca.id);
    }

    // Para planos pagos, criar assinatura recorrente no Asaas
    const cpfCnpj = banca.cnpj || banca.cpf;
    
    // Criar ou buscar cliente no Asaas
    const customer = await findOrCreateCustomer({
      name: banca.name,
      email: banca.email,
      cpfCnpj: cpfCnpj || undefined,
      phone: banca.whatsapp || undefined,
      externalReference: banca.id,
    });

    const previousBinding = await findSubscriptionBindingByBancaId(banca.id);
    if (previousBinding?.asaasSubscriptionId) {
      try {
        await cancelSubscription(previousBinding.asaasSubscriptionId);
      } catch (cancelError: any) {
        console.warn("[API/JORNALEIRO/SUBSCRIPTION] Falha ao cancelar assinatura remota anterior:", cancelError?.message || cancelError);
      }
      await removeSubscriptionBindingByAsaasId(previousBinding.asaasSubscriptionId);
    }

    // Criar assinatura local pendente
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        banca_id: banca.id,
        plan_id: plan.id,
        status: trialDaysApplied > 0 ? "trial" : "pending",
        asaas_customer_id: customer.id,
        current_period_start: new Date().toISOString(),
        current_period_end: trialDaysApplied > 0 ? addDaysToIso(trialDaysApplied) : null,
      }, { onConflict: "banca_id" })
      .select()
      .single();

    if (subError) throw subError;

    const dueDate = formatDueDate(undefined, trialDaysApplied > 0 ? trialDaysApplied : 3);
    const trialEndsAt = trialDaysApplied > 0 ? addDaysToIso(trialDaysApplied) : null;
    let asaasSubscription: any = null;
    let firstPayment: any = null;
    let pixData = null;

    try {
      asaasSubscription = await createSubscription({
        customer: customer.id,
        billingType: billing_type,
        value: pricing.effectivePrice,
        cycle: plan.billing_cycle,
        nextDueDate: dueDate,
        description: pricing.promotionLabel
          ? `${plan.name} - ${pricing.promotionLabel}`
          : trialDaysApplied > 0
            ? `Assinatura ${plan.name} - ${trialDaysApplied} dias de degustação`
          : `Assinatura ${plan.name} - Guia das Bancas`,
        externalReference: `gb-sub:${subscription.id}`,
      });

      await saveSubscriptionBinding({
        asaasSubscriptionId: asaasSubscription.id,
        localSubscriptionId: subscription.id,
        bancaId: banca.id,
        planId: plan.id,
        effectivePrice: pricing.effectivePrice,
        billingType: billing_type,
        createdAt: new Date().toISOString(),
      });

      await saveBancaPricingOverride({
        bancaId: banca.id,
        planId: plan.id,
        effectivePrice: pricing.effectivePrice,
        originalPrice: pricing.originalPrice,
        promoApplied: pricing.promoApplied,
        promotionLabel: pricing.promotionLabel,
        updatedAt: new Date().toISOString(),
      });

      firstPayment = await waitForFirstSubscriptionPayment(asaasSubscription.id);

      if (billing_type === "PIX" && firstPayment?.id) {
        try {
          pixData = await getPaymentPixQrCode(firstPayment.id);
        } catch (e) {
          console.error("Erro ao buscar QR Code PIX:", e);
        }
      }
    } catch (subscriptionError) {
      if (claimedLaunchOfferNow) {
        await releasePremiumLaunchOffer(banca.id);
      }
      if (claimedTrialNow) {
        await releasePaidPlanTrial(banca.id);
      }
      throw subscriptionError;
    }

    // Registrar primeira cobrança, se o Asaas já a tiver gerado
    let paymentRecord: any = null;
    if (firstPayment?.id) {
      const { data: createdPayment } = await supabaseAdmin
        .from("payments")
        .insert({
          subscription_id: subscription.id,
          banca_id: banca.id,
          asaas_payment_id: firstPayment.id,
          asaas_invoice_url: firstPayment.invoiceUrl,
          asaas_bank_slip_url: firstPayment.bankSlipUrl,
          asaas_pix_qrcode: pixData?.encodedImage,
          asaas_pix_code: pixData?.payload,
          amount: pricing.effectivePrice,
          status: "pending",
          payment_method: billing_type.toLowerCase(),
          due_date: firstPayment.dueDate || dueDate,
          description: pricing.promotionLabel
            ? `Assinatura ${plan.name} - ${pricing.promotionLabel}`
            : `Assinatura ${plan.name}`,
        })
        .select()
        .maybeSingle();

      paymentRecord = createdPayment;
    }

    // Criar notificação
    await supabaseAdmin.from("notifications").insert({
      banca_id: banca.id,
      type: "payment_created",
      title: "Nova cobrança gerada",
      message: `Assinatura recorrente de R$ ${pricing.effectivePrice.toFixed(2)} para o plano ${plan.name} gerada com sucesso.`,
      data: {
        payment_id: paymentRecord?.id,
        asaas_payment_id: firstPayment?.id || null,
        asaas_subscription_id: asaasSubscription?.id || null,
        promo_applied: pricing.promoApplied,
        trial_days_applied: trialDaysApplied,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      payment: {
        id: paymentRecord?.id,
        asaas_id: firstPayment?.id || null,
        asaas_subscription_id: asaasSubscription?.id || null,
        invoice_url: firstPayment?.invoiceUrl || null,
        bank_slip_url: firstPayment?.bankSlipUrl || null,
        pix_qrcode: pixData?.encodedImage,
        pix_code: pixData?.payload,
        due_date: firstPayment?.dueDate || dueDate,
        amount: pricing.effectivePrice,
        recurring: true,
        original_amount: pricing.originalPrice,
        promotion_label: pricing.promotionLabel,
        trial_days_applied: trialDaysApplied,
        trial_ends_at: trialEndsAt,
      },
      message:
        trialDaysApplied > 0
          ? `Período de degustação de ${trialDaysApplied} dias ativado com sucesso.`
          : "Assinatura criada com sucesso! A primeira cobrança foi gerada.",
    });
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
