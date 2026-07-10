import { NextRequest, NextResponse } from "next/server";
import {
  cancelSubscription,
  createSubscription,
  findOrCreateCustomer,
  formatDueDate,
  getPaymentPixQrCode,
  getSubscriptionPayments,
} from "@/lib/asaas";
import { createCoraInvoice } from "@/lib/cora";
import { downgradeBancaToFreePlan, ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";
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
  removeSubscriptionBindingByBancaId,
  resolvePlanPricing,
  saveBancaPricingOverride,
  saveSubscriptionBinding,
} from "@/lib/subscription-billing";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import { RECURRING_BILLING_ENABLED } from "@/lib/jornaleiro-billing";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function addDaysToIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function extractRemoteIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  }

  return request.headers.get("x-real-ip") || "127.0.0.1";
}

function digitsOnly(value: string | null | undefined) {
  return String(value || "").replace(/\D/g, "");
}

async function readPaymentGateway(): Promise<"asaas" | "cora"> {
  const envGateway = String(process.env.PAYMENT_GATEWAY || "").trim().toLowerCase();
  if (envGateway === "cora") return "cora";
  if (envGateway === "asaas") return "asaas";

  const { data } = await supabaseAdmin
    .from("system_settings")
    .select("value")
    .eq("key", "payment_gateway")
    .maybeSingle();

  return String(data?.value || "").trim().toLowerCase() === "cora" ? "cora" : "asaas";
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

async function createOrUpdateOpenSubscription(params: {
  bancaId: string;
  planId: string;
  status: "trial" | "pending";
  asaasCustomerId: string;
  currentPeriodEnd: string | null;
}) {
  const now = new Date().toISOString();
  const { data: existingSubscription, error: existingError } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("banca_id", params.bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingSubscription?.id) {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        plan_id: params.planId,
        status: params.status,
        asaas_customer_id: params.asaasCustomerId,
        current_period_start: now,
        current_period_end: params.currentPeriodEnd,
        cancelled_at: null,
        cancel_reason: null,
      })
      .eq("id", existingSubscription.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      banca_id: params.bancaId,
      plan_id: params.planId,
      status: params.status,
      asaas_customer_id: params.asaasCustomerId,
      current_period_start: now,
      current_period_end: params.currentPeriodEnd,
    })
    .select()
    .single();

  if (!error) {
    return data;
  }

  if (error.code !== "23505") {
    throw error;
  }

  const { data: concurrentSubscription, error: concurrentError } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("banca_id", params.bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (concurrentError) throw concurrentError;

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("subscriptions")
    .update({
      plan_id: params.planId,
      status: params.status,
      asaas_customer_id: params.asaasCustomerId,
      current_period_start: now,
      current_period_end: params.currentPeriodEnd,
      cancelled_at: null,
      cancel_reason: null,
    })
    .eq("id", concurrentSubscription.id)
    .select()
    .single();

  if (updateError) throw updateError;
  return updated;
}

// GET - Obter assinatura atual do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const banca = await loadActiveJornaleiroBancaRow<{
      id: string;
      name: string;
      email: string | null;
      whatsapp: string | null;
      cep: string | null;
      address_obj?: Record<string, any> | null;
      addressobj?: Record<string, any> | null;
    }>({
      userId: user.id,
      select: "id, name, email, whatsapp, cep, address_obj, addressobj",
    });

    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
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

    const { data: requesterProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("full_name, phone, cpf")
      .eq("id", user.id)
      .maybeSingle();

    // Buscar últimos pagamentos
    const { data: payments } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("banca_id", banca.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json(
      {
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
          has_onboarding_premium_access: entitlements.hasOnboardingPremiumAccess,
          onboarding_premium_ends_at: entitlements.onboardingPremiumEndsAt,
        },
        payments: payments || [],
        banca: {
          id: banca.id,
          name: banca.name,
          email: banca.email,
          whatsapp: banca.whatsapp,
          cep: banca.cep,
          address_obj: banca.address_obj || banca.addressobj || null,
        },
        requester_profile: requesterProfile
          ? {
              full_name: requesterProfile.full_name || null,
              phone: requesterProfile.phone || null,
              cpf: requesterProfile.cpf || null,
            }
          : null,
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// POST - Criar/atualizar assinatura (checkout)
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await request.json();
    const { plan_id, billing_type = "PIX", card } = body;

    if (!plan_id) {
      return NextResponse.json(
        { success: false, error: "Plano não informado" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    // Buscar plano
    const { data: plan } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .eq("is_active", true)
      .single();

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Plano não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (!RECURRING_BILLING_ENABLED && Number(plan.price || 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "A cobrança recorrente por plano está pausada neste momento. Campanhas e divulgações serão tratadas individualmente pelo suporte.",
          code: "RECURRING_BILLING_DISABLED",
          upgrade_url: "/jornaleiro/dashboard",
        },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const banca = await loadActiveJornaleiroBancaRow<{
      id: string;
      name: string;
      email: string | null;
      whatsapp: string | null;
      cotista_cnpj_cpf: string | null;
      is_cotista: boolean | null;
      cotista_id: string | null;
      created_at: string | null;
      address: string | null;
      cep: string | null;
      address_obj?: Record<string, any> | null;
      addressobj?: Record<string, any> | null;
    }>({
      userId: user.id,
      select: "id, name, email, whatsapp, cotista_cnpj_cpf, is_cotista, cotista_id, created_at, address, cep, address_obj, addressobj",
    });

    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
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
      const { freeSubscription } = await downgradeBancaToFreePlan(banca.id, {
        cancelReason: "Migração manual para o plano Free",
      });

      return NextResponse.json(
        {
          success: true,
          subscription: freeSubscription,
          message: "Plano gratuito ativado com sucesso! Seu painel já está liberado.",
        },
        { headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const [pricingPreview, paidPlanTrialDays, paidPlanTrialAlreadyUsed, currentEntitlements] = await Promise.all([
      resolvePlanPricing(plan, banca.id),
      readPaidPlanTrialDays(),
      hasBancaUsedPaidPlanTrial(banca.id),
      resolveBancaPlanEntitlements({
        id: banca.id,
        is_cotista: banca.is_cotista,
        cotista_id: banca.cotista_id,
        created_at: banca.created_at,
      }),
    ]);

    let trialDaysApplied = 0;
    let claimedTrialNow = false;

    if (
      Number(plan.price || 0) > 0 &&
      (plan.type || "").toLowerCase() !== "free" &&
      !currentEntitlements.onboardingPremiumEndsAt &&
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
    const { data: requesterProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("full_name, phone, cpf")
      .eq("id", user.id)
      .maybeSingle();

    const cpfCnpj = digitsOnly(banca.cotista_cnpj_cpf || (requesterProfile as any)?.cpf || null);
    const billingEmail = banca.email || user.email;
    const structuredAddress =
      (banca.address_obj && typeof banca.address_obj === "object" ? banca.address_obj : null) ||
      (banca.addressobj && typeof banca.addressobj === "object" ? banca.addressobj : null);

    if (!billingEmail) {
      return NextResponse.json(
        { success: false, error: "Defina um email da banca antes de contratar um plano." },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    const dueDate = formatDueDate(undefined, trialDaysApplied > 0 ? trialDaysApplied : 3);
    const trialEndsAt = trialDaysApplied > 0 ? addDaysToIso(trialDaysApplied) : null;
    const requestedBillingType = String(billing_type || "PIX").toUpperCase();
    const normalizedBillingType: "BOLETO" | "PIX" | "CREDIT_CARD" =
      requestedBillingType === "BOLETO"
        ? "BOLETO"
        : requestedBillingType === "CREDIT_CARD"
          ? "CREDIT_CARD"
          : "PIX";
    const paymentGateway = await readPaymentGateway();

    const previousBinding = await findSubscriptionBindingByBancaId(banca.id);
    if (previousBinding?.asaasSubscriptionId) {
      try {
        await cancelSubscription(previousBinding.asaasSubscriptionId);
      } catch (cancelError: any) {
        console.warn("[API/JORNALEIRO/SUBSCRIPTION] Falha ao cancelar assinatura remota anterior:", cancelError?.message || cancelError);
      }
      await removeSubscriptionBindingByAsaasId(previousBinding.asaasSubscriptionId);
    }

    if (paymentGateway === "cora") {
      if (normalizedBillingType === "CREDIT_CARD") {
        return NextResponse.json(
          { success: false, error: "A Cora está disponível apenas para PIX e boleto neste checkout." },
          { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }

      const subscription = await createOrUpdateOpenSubscription({
        bancaId: banca.id,
        planId: plan.id,
        status: trialDaysApplied > 0 ? "trial" : "pending",
        asaasCustomerId: `cora:${banca.id}`,
        currentPeriodEnd: trialEndsAt,
      });

      try {
        const externalReference = `gb-sub:${subscription.id}`;
        const invoice = await createCoraInvoice({
          code: externalReference,
          externalReference,
          customer: {
            name: banca.name,
            email: billingEmail,
            document: cpfCnpj || null,
            phone: banca.whatsapp || (requesterProfile as any)?.phone || null,
            address: {
              street: structuredAddress?.street || banca.address || null,
              number: structuredAddress?.number || "S/N",
              district: structuredAddress?.neighborhood || null,
              city: structuredAddress?.city || null,
              state: structuredAddress?.uf || null,
              zipCode: structuredAddress?.cep || banca.cep || null,
              complement: structuredAddress?.complement || null,
            },
          },
          amount: pricing.effectivePrice,
          dueDate,
          description: pricing.promotionLabel
            ? `${plan.name} - ${pricing.promotionLabel}`
            : trialDaysApplied > 0
              ? `Assinatura ${plan.name} - ${trialDaysApplied} dias de degustação`
              : `Assinatura ${plan.name} - Guia das Bancas`,
          paymentForms: normalizedBillingType === "BOLETO" ? ["BANK_SLIP"] : ["PIX"],
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

        const { data: paymentRecord } = await supabaseAdmin
          .from("payments")
          .insert({
            subscription_id: subscription.id,
            banca_id: banca.id,
            asaas_payment_id: invoice.id,
            asaas_invoice_url: invoice.invoiceUrl,
            asaas_bank_slip_url: invoice.bankSlipUrl,
            asaas_pix_qrcode: invoice.pixQrCodeUrl,
            asaas_pix_code: invoice.pixCode,
            amount: pricing.effectivePrice,
            status: "pending",
            payment_method: normalizedBillingType.toLowerCase(),
            due_date: invoice.dueDate || dueDate,
            description: pricing.promotionLabel
              ? `Assinatura ${plan.name} - ${pricing.promotionLabel}`
              : `Assinatura ${plan.name}`,
            metadata: {
              provider: "cora",
              provider_payment_id: invoice.id,
              provider_code: invoice.code,
              provider_status: invoice.status,
              raw: invoice.raw,
            },
          })
          .select()
          .maybeSingle();

        await supabaseAdmin.from("notifications").insert({
          banca_id: banca.id,
          type: "payment_created",
          title: "Nova cobrança gerada",
          message: `Cobrança Cora de R$ ${pricing.effectivePrice.toFixed(2)} para o plano ${plan.name} gerada com sucesso.`,
          data: {
            payment_id: paymentRecord?.id,
            provider: "cora",
            provider_payment_id: invoice.id,
            promo_applied: pricing.promoApplied,
            trial_days_applied: trialDaysApplied,
          },
        });

        return NextResponse.json(
          {
            success: true,
            subscription,
            payment: {
              id: paymentRecord?.id,
              asaas_id: invoice.id,
              provider: "cora",
              provider_payment_id: invoice.id,
              invoice_url: invoice.invoiceUrl,
              bank_slip_url: invoice.bankSlipUrl,
              pix_qrcode: invoice.pixQrCodeUrl,
              pix_code: invoice.pixCode,
              due_date: invoice.dueDate || dueDate,
              amount: pricing.effectivePrice,
              recurring: false,
              original_amount: pricing.originalPrice,
              promotion_label: pricing.promotionLabel,
              trial_days_applied: trialDaysApplied,
              trial_ends_at: trialEndsAt,
              billing_type: normalizedBillingType,
            },
            message:
              trialDaysApplied > 0
                ? `Período de degustação de ${trialDaysApplied} dias ativado com cobrança Cora gerada.`
                : "Cobrança Cora criada com sucesso.",
          },
          { headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      } catch (coraError) {
        await clearBancaPricingOverride(banca.id);
        await downgradeBancaToFreePlan(banca.id, {
          cancelReason: "Falha ao gerar cobrança Cora. Banca retornou ao plano Free.",
          matchSubscriptionId: subscription.id,
        });

        if (claimedLaunchOfferNow) {
          await releasePremiumLaunchOffer(banca.id);
        }
        if (claimedTrialNow) {
          await releasePaidPlanTrial(banca.id);
        }
        throw coraError;
      }
    }

    // Criar ou buscar cliente no Asaas
    const customer = await findOrCreateCustomer({
      name: banca.name,
      email: billingEmail,
      cpfCnpj: cpfCnpj || undefined,
      phone: banca.whatsapp || undefined,
      externalReference: banca.id,
      postalCode: digitsOnly(structuredAddress?.cep || banca.cep || undefined) || undefined,
      address: structuredAddress?.street || banca.address || undefined,
      addressNumber: structuredAddress?.number || undefined,
      complement: structuredAddress?.complement || undefined,
      province: structuredAddress?.neighborhood || undefined,
      city: structuredAddress?.city || undefined,
      state: structuredAddress?.uf || undefined,
    });

    const subscription = await createOrUpdateOpenSubscription({
      bancaId: banca.id,
      planId: plan.id,
      status: trialDaysApplied > 0 ? "trial" : "pending",
      asaasCustomerId: customer.id,
      currentPeriodEnd: trialEndsAt,
    });
    let asaasSubscription: any = null;
    let firstPayment: any = null;
    let pixData = null;

    try {
      if (normalizedBillingType === "CREDIT_CARD") {
        const cardNumber = digitsOnly(card?.number);
        const cardCvv = digitsOnly(card?.ccv);
        const expiryMonth = digitsOnly(card?.expiryMonth);
        const expiryYear = digitsOnly(card?.expiryYear);
        const holderName = String(card?.holderName || requesterProfile?.full_name || banca.name || "").trim();
        const holderCpfCnpj = digitsOnly(card?.holderCpfCnpj || cpfCnpj);
        const holderPhone = digitsOnly(card?.holderPhone || banca.whatsapp || (requesterProfile as any)?.phone || "");
        const holderEmail = String(card?.holderEmail || billingEmail || "").trim().toLowerCase();
        const holderPostalCode = digitsOnly(structuredAddress?.cep || banca.cep || "");
        const holderAddressNumber = String(card?.holderAddressNumber || structuredAddress?.number || "S/N").trim();

        if (!holderName || !holderCpfCnpj || !holderEmail || !holderPostalCode) {
          throw new Error("Dados do titular incompletos para ativar o Premium.");
        }

        if (!cardNumber || !cardCvv || !expiryMonth || !expiryYear) {
          throw new Error("Preencha os dados do cartão para ativar o Premium.");
        }

        asaasSubscription = await createSubscription({
          customer: customer.id,
          billingType: "CREDIT_CARD",
          value: pricing.effectivePrice,
          cycle: plan.billing_cycle,
          nextDueDate: dueDate,
          description: pricing.promotionLabel
            ? `${plan.name} - ${pricing.promotionLabel}`
            : trialDaysApplied > 0
              ? `Assinatura ${plan.name} - ${trialDaysApplied} dias de degustação`
              : `Assinatura ${plan.name} - Guia das Bancas`,
          externalReference: `gb-sub:${subscription.id}`,
          remoteIp: extractRemoteIp(request),
          creditCard: {
            holderName,
            number: cardNumber,
            expiryMonth,
            expiryYear,
            ccv: cardCvv,
          },
          creditCardHolderInfo: {
            name: holderName,
            email: holderEmail,
            cpfCnpj: holderCpfCnpj,
            postalCode: holderPostalCode,
            addressNumber: holderAddressNumber,
            addressComplement: String(card?.holderAddressComplement || structuredAddress?.complement || "").trim() || undefined,
            phone: holderPhone || undefined,
            mobilePhone: holderPhone || undefined,
            address: structuredAddress?.street || banca.address || undefined,
            province: structuredAddress?.neighborhood || undefined,
            city: structuredAddress?.city || undefined,
            state: structuredAddress?.uf || undefined,
          },
        });
      } else {
        asaasSubscription = await createSubscription({
          customer: customer.id,
          billingType: normalizedBillingType,
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
      }

      const { data: syncedSubscription, error: subscriptionSyncError } = await supabaseAdmin
        .from("subscriptions")
        .update({
          asaas_subscription_id: asaasSubscription.id,
          trial_ends_at: trialEndsAt,
          current_period_end: trialEndsAt,
          status: trialDaysApplied > 0 ? "trial" : "pending",
        })
        .eq("id", subscription.id)
        .select()
        .single();

      if (subscriptionSyncError) {
        throw subscriptionSyncError;
      }

      if (syncedSubscription) {
        Object.assign(subscription, syncedSubscription);
      }

      await saveSubscriptionBinding({
        asaasSubscriptionId: asaasSubscription.id,
        localSubscriptionId: subscription.id,
        bancaId: banca.id,
        planId: plan.id,
        effectivePrice: pricing.effectivePrice,
        billingType: normalizedBillingType,
        asaasCustomerId: customer.id,
        status: trialDaysApplied > 0 ? "trial" : "pending",
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

      if (normalizedBillingType === "PIX" && firstPayment?.id) {
        try {
          pixData = await getPaymentPixQrCode(firstPayment.id);
        } catch (e) {
          console.error("Erro ao buscar QR Code PIX:", e);
        }
      }
    } catch (subscriptionError) {
      if (asaasSubscription?.id) {
        try {
          await cancelSubscription(asaasSubscription.id);
        } catch (cancelError: any) {
          console.warn("[API/JORNALEIRO/SUBSCRIPTION] Falha ao desfazer assinatura remota após erro:", cancelError?.message || cancelError);
        }
      }

      await removeSubscriptionBindingByBancaId(banca.id);
      await clearBancaPricingOverride(banca.id);

      await downgradeBancaToFreePlan(banca.id, {
        cancelReason: "Falha ao ativar o Premium. Banca retornou ao plano Free.",
        matchSubscriptionId: subscription.id,
      });

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
          payment_method: normalizedBillingType.toLowerCase(),
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

    return NextResponse.json(
      {
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
          billing_type: normalizedBillingType,
        },
        message:
          trialDaysApplied > 0
            ? `Período de degustação de ${trialDaysApplied} dias ativado com sucesso.`
            : "Assinatura criada com sucesso! A primeira cobrança foi gerada.",
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// DELETE - Cancelar assinatura premium desta banca e voltar para o Free
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const banca = await loadActiveJornaleiroBancaRow<{
      id: string;
      name: string;
      email: string | null;
    }>({
      userId: user.id,
      select: "id, name, email",
    });

    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const { data: currentSubscription, error: subscriptionError } = await supabaseAdmin
      .from("subscriptions")
      .select("id, banca_id, plan_id, status, asaas_customer_id, current_period_start, current_period_end")
      .eq("banca_id", banca.id)
      .in("status", ["active", "trial", "pending", "overdue"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      throw subscriptionError;
    }

    const binding = await findSubscriptionBindingByBancaId(banca.id);

    if (binding?.asaasSubscriptionId) {
      try {
        await cancelSubscription(binding.asaasSubscriptionId);
      } catch (cancelError: any) {
        console.warn("[API/JORNALEIRO/SUBSCRIPTION] Falha ao cancelar assinatura remota:", cancelError?.message || cancelError);
      }

      await removeSubscriptionBindingByAsaasId(binding.asaasSubscriptionId);
    }

    await clearBancaPricingOverride(banca.id);
    const { freeSubscription } = await downgradeBancaToFreePlan(banca.id, {
      cancelReason: "Cancelamento manual do Premium",
      matchSubscriptionId: currentSubscription?.id || null,
    });

    await supabaseAdmin.from("notifications").insert({
      banca_id: banca.id,
      type: "subscription_cancelled",
      title: "Premium cancelado",
      message: `A banca ${banca.name} voltou a operar no plano Free.`,
      data: {
        banca_id: banca.id,
        local_subscription_id: currentSubscription?.id || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        subscription: freeSubscription,
        message: "Premium cancelado com sucesso. Sua banca voltou a operar no plano Free.",
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/JORNALEIRO/SUBSCRIPTION] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao cancelar assinatura" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
