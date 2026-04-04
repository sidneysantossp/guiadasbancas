import { supabaseAdmin } from "@/lib/supabase";

type PlanRecord = {
  id: string;
  type?: string | null;
  price?: number | null;
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
