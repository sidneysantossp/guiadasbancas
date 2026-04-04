import {
  claimPaidPlanTrial,
  hasBancaUsedPaidPlanTrial,
  readPaidPlanTrialDays,
} from "@/lib/subscription-billing";
import { supabaseAdmin } from "@/lib/supabase";

type PlanRecord = {
  id: string;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  type?: string | null;
  price?: number | null;
  billing_cycle?: string | null;
  features?: string[] | null;
  limits?: Record<string, any> | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
  sort_order?: number | null;
};

type SubscriptionRecord = {
  id: string;
  banca_id: string;
  plan_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
};

type ActiveSubscriptionRow = SubscriptionRecord & {
  trial_ends_at?: string | null;
  plan?: {
    id: string;
    type?: string | null;
    price?: number | null;
  } | {
    id: string;
    type?: string | null;
    price?: number | null;
  }[] | null;
};

function normalizeSubscriptionPlan(plan: ActiveSubscriptionRow["plan"]): {
  id: string;
  type?: string | null;
  price?: number | null;
} | null {
  if (Array.isArray(plan)) {
    return plan[0] || null;
  }

  return plan || null;
}

async function resolveInitialPlan(preferredPlanId?: string | null): Promise<PlanRecord | null> {
  if (preferredPlanId) {
    const { data: preferredPlan, error: preferredPlanError } = await supabaseAdmin
      .from("plans")
      .select("id, type, price, is_default, is_active, sort_order")
      .eq("id", preferredPlanId)
      .eq("is_active", true)
      .maybeSingle();

    if (preferredPlanError) {
      console.warn("[banca-subscription] Falha ao buscar plano preferido:", preferredPlanError.message);
    }

    if (preferredPlan) {
      return preferredPlan as PlanRecord;
    }
  }

  const { data: plans, error } = await supabaseAdmin
    .from("plans")
    .select("id, type, price, is_default, is_active, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const activePlans = (plans || []) as PlanRecord[];
  if (activePlans.length === 0) {
    return null;
  }

  return (
    activePlans.find((plan) => plan.type === "free" || Number(plan.price || 0) === 0) ||
    activePlans.find((plan) => plan.is_default) ||
    activePlans[0] ||
    null
  );
}

async function resolvePremiumPlan(): Promise<PlanRecord | null> {
  const { data: plans, error } = await supabaseAdmin
    .from("plans")
    .select("id, type, price, is_default, is_active, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const activePlans = (plans || []) as PlanRecord[];
  const currentPremiumPlan =
    activePlans.find((plan) => {
      const planType = String(plan.type || "").toLowerCase();
      return planType !== "free" && Number(plan.price || 0) > 0;
    }) || null;

  if (currentPremiumPlan) {
    return currentPremiumPlan;
  }

  return ensureDefaultPremiumPlan();
}

export async function ensureDefaultPremiumPlan(): Promise<PlanRecord | null> {
  const { data: existingPremium, error: existingPremiumError } = await supabaseAdmin
    .from("plans")
    .select("id, name, slug, description, type, price, billing_cycle, features, limits, is_default, is_active, sort_order")
    .eq("is_active", true)
    .or("type.eq.premium,slug.eq.premium")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingPremiumError) {
    throw new Error(existingPremiumError.message);
  }

  if (existingPremium) {
    return existingPremium as PlanRecord;
  }

  const now = new Date().toISOString();
  const premiumPlanPayload = {
    name: "Premium",
    slug: "premium",
    description: "Plano premium por banca com distribuidores, campanhas, publi editorial, destaque e suporte prioritário.",
    type: "premium",
    price: 149,
    billing_cycle: "monthly",
    features: [
      "Campanhas",
      "Colaboradores",
      "Publi editorial",
      "Destaque na plataforma",
      "Distribuidores",
      "Suporte prioritário",
    ],
    limits: {
      max_products: 1000,
      max_images_per_product: 10,
      distributor_catalog: true,
      partner_directory: true,
    },
    is_active: true,
    is_default: false,
    sort_order: 10,
    created_at: now,
    updated_at: now,
  };

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("plans")
    .insert(premiumPlanPayload)
    .select("id, name, slug, description, type, price, billing_cycle, features, limits, is_default, is_active, sort_order")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: duplicatedPremium, error: duplicatedPremiumError } = await supabaseAdmin
        .from("plans")
        .select("id, name, slug, description, type, price, billing_cycle, features, limits, is_default, is_active, sort_order")
        .eq("is_active", true)
        .or("type.eq.premium,slug.eq.premium")
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (duplicatedPremiumError) {
        throw new Error(duplicatedPremiumError.message);
      }

      return (duplicatedPremium as PlanRecord | null) || null;
    }

    throw new Error(insertError.message);
  }

  return inserted as PlanRecord;
}

function addDaysFromNowIso(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export async function ensureBancaHasOnboardingPlan(
  bancaId: string,
  options?: { preferredPlanId?: string | null }
): Promise<SubscriptionRecord | null> {
  const preferredPlanId = options?.preferredPlanId ?? null;

  const { data: existingSubscription, error: existingSubscriptionError } = await supabaseAdmin
    .from("subscriptions")
    .select("id, banca_id, plan_id, status, current_period_start, current_period_end")
    .eq("banca_id", bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSubscriptionError) {
    throw new Error(existingSubscriptionError.message);
  }

  if (existingSubscription) {
    return existingSubscription as SubscriptionRecord;
  }

  const initialPlan = await resolveInitialPlan(preferredPlanId);
  if (!initialPlan) {
    console.warn("[banca-subscription] Nenhum plano ativo encontrado para onboarding da banca:", bancaId);
    return null;
  }

  const now = new Date().toISOString();
  const isPaidPlan =
    Number(initialPlan.price || 0) > 0 &&
    String(initialPlan.type || "free").toLowerCase() !== "free";
  const { data: subscription, error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      banca_id: bancaId,
      plan_id: initialPlan.id,
      status: isPaidPlan ? "pending" : "active",
      current_period_start: now,
      current_period_end: null,
    })
    .select("id, banca_id, plan_id, status, current_period_start, current_period_end")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return subscription as SubscriptionRecord;
}

export async function ensureBancaHasPremiumTrialAccess(
  bancaId: string
): Promise<SubscriptionRecord | null> {
  const { data: currentSubscription, error: currentSubscriptionError } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      current_period_start,
      current_period_end,
      trial_ends_at,
      plan:plans(id, type, price)
    `)
    .eq("banca_id", bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (currentSubscriptionError) {
    throw new Error(currentSubscriptionError.message);
  }

  const currentPlan = normalizeSubscriptionPlan((currentSubscription as ActiveSubscriptionRow | null)?.plan || null);
  const currentPlanType = String(currentPlan?.type || "free").toLowerCase();
  const currentPlanPrice = Number(currentPlan?.price || 0);

  if (
    currentSubscription &&
    currentPlanType !== "free" &&
    currentPlanPrice > 0 &&
    ["trial", "active", "pending", "overdue"].includes(String(currentSubscription.status || "").toLowerCase())
  ) {
    return currentSubscription as SubscriptionRecord;
  }

  const premiumPlan = await resolvePremiumPlan();
  if (!premiumPlan) {
    console.warn("[banca-subscription] Nenhum plano premium ativo encontrado para trial da banca:", bancaId);
    return currentSubscription as SubscriptionRecord | null;
  }

  const alreadyUsedTrial = await hasBancaUsedPaidPlanTrial(bancaId);
  const trialDays = alreadyUsedTrial ? 0 : await readPaidPlanTrialDays();
  if (trialDays <= 0) {
    return currentSubscription as SubscriptionRecord | null;
  }

  const trialClaim = await claimPaidPlanTrial(bancaId);
  if (!trialClaim.claimedNow && !trialClaim.alreadyClaimed) {
    return currentSubscription as SubscriptionRecord | null;
  }

  if (!trialClaim.claimedNow && alreadyUsedTrial) {
    return currentSubscription as SubscriptionRecord | null;
  }

  const now = new Date().toISOString();
  const trialEndsAt = addDaysFromNowIso(trialDays);

  if (currentSubscription?.id) {
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        plan_id: premiumPlan.id,
        status: "trial",
        current_period_start: now,
        current_period_end: trialEndsAt,
        trial_ends_at: trialEndsAt,
        cancelled_at: null,
        cancel_reason: null,
      })
      .eq("id", currentSubscription.id)
      .select("id, banca_id, plan_id, status, current_period_start, current_period_end")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return updated as SubscriptionRecord;
  }

  const { data: created, error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      banca_id: bancaId,
      plan_id: premiumPlan.id,
      status: "trial",
      current_period_start: now,
      current_period_end: trialEndsAt,
      trial_ends_at: trialEndsAt,
    })
    .select("id, banca_id, plan_id, status, current_period_start, current_period_end")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return created as SubscriptionRecord;
}

export async function downgradeBancaToFreePlan(
  bancaId: string,
  options?: {
    cancelReason?: string | null;
    cancelledAt?: string | null;
    matchSubscriptionId?: string | null;
  }
): Promise<{
  cancelledSubscriptions: ActiveSubscriptionRow[];
  freeSubscription: SubscriptionRecord | null;
}> {
  const cancelledAt = options?.cancelledAt || new Date().toISOString();
  const cancelReason = options?.cancelReason || "Downgrade automático para o plano Free";
  const matchSubscriptionId = options?.matchSubscriptionId || null;

  const { data: activeSubscriptions, error: activeSubscriptionsError } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      current_period_start,
      current_period_end,
      trial_ends_at,
      plan:plans(id, type, price)
    `)
    .eq("banca_id", bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false });

  if (activeSubscriptionsError) {
    throw new Error(activeSubscriptionsError.message);
  }

  const paidSubscriptions = (activeSubscriptions || []).filter((subscription) => {
    if (matchSubscriptionId && subscription.id !== matchSubscriptionId) {
      return false;
    }

    const plan = normalizeSubscriptionPlan((subscription as ActiveSubscriptionRow).plan);
    const planType = String(plan?.type || "free").toLowerCase();
    const planPrice = Number(plan?.price || 0);
    return planType !== "free" && planPrice > 0;
  }) as ActiveSubscriptionRow[];

  if (paidSubscriptions.length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
        current_period_end: cancelledAt,
        cancelled_at: cancelledAt,
        cancel_reason: cancelReason,
        trial_ends_at: null,
      })
      .in(
        "id",
        paidSubscriptions.map((subscription) => subscription.id)
      );

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  const freeSubscription = await ensureBancaHasOnboardingPlan(bancaId);

  return {
    cancelledSubscriptions: paidSubscriptions,
    freeSubscription,
  };
}
