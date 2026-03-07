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
  const { data: subscription, error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      banca_id: bancaId,
      plan_id: initialPlan.id,
      status: "active",
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
