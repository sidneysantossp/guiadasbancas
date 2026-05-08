import { downgradeBancaToFreePlan, ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";
import { supabaseAdmin } from "@/lib/supabase";

type PlanType = "free" | "start" | "premium" | string;
type NormalizedPlanType = "free" | "premium";

type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string | null;
  type: PlanType;
  price: number;
  billing_cycle: string | null;
  features: string[];
  limits: Record<string, any>;
  is_active: boolean;
};

type SubscriptionRow = {
  id: string;
  banca_id: string;
  plan_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  plan: SubscriptionPlan | null;
};

type BancaPlanContext = {
  id: string;
  is_cotista?: boolean | null;
  cotista_id?: string | null;
  created_at?: string | null;
};

type PendingPaymentRow = {
  due_date: string | null;
  created_at?: string | null;
  status?: string | null;
};

export type BancaPlanEntitlements = {
  subscription: SubscriptionRow | null;
  plan: SubscriptionPlan | null;
  requestedPlan: SubscriptionPlan | null;
  planType: PlanType;
  productLimit: number | null;
  maxImagesPerProduct: number | null;
  canManageManualProducts: boolean;
  canManageOrders: boolean;
  canUseCoupons: boolean;
  canAccessIntelligence: boolean;
  canAccessAcademy: boolean;
  canAccessSupport: boolean;
  canSellViaWhatsapp: boolean;
  canManageInventory: boolean;
  canAccessCampaigns: boolean;
  canManageCollaborators: boolean;
  canAccessEditorial: boolean;
  canAccessFeaturedPlacement: boolean;
  canAccessDistributorCatalog: boolean;
  canAccessPartnerDirectory: boolean;
  hasPrioritySupport: boolean;
  isLegacyCotistaLinked: boolean;
  paidFeaturesLockedUntilPayment: boolean;
  overdueFeaturesLocked: boolean;
  overdueInGracePeriod: boolean;
  overdueGraceEndsAt: string | null;
  hasOnboardingPremiumAccess: boolean;
  onboardingPremiumEndsAt: string | null;
};

const DEFAULT_OVERDUE_GRACE_DAYS = 5;
const DEFAULT_ONBOARDING_PREMIUM_DAYS = 30;

function normalizeFeatures(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return [];
}

function normalizeLimits(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, any>;
}

function readNumericLimit(limits: Record<string, any>, key: string): number | null {
  const raw = limits[key];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
}

function hasFeature(features: string[], patterns: RegExp[]): boolean {
  return features.some((feature) => patterns.some((pattern) => pattern.test(feature)));
}

function normalizePlanType(planType: PlanType | null | undefined): NormalizedPlanType {
  return planType === "premium" || planType === "start" ? "premium" : "free";
}

function resolveBooleanAccess(params: {
  planType: PlanType;
  limits: Record<string, any>;
  features: string[];
  premiumPatterns?: RegExp[];
  freePatterns?: RegExp[];
  defaultFree: boolean;
}) {
  const { planType, limits, features, premiumPatterns = [], freePatterns = [], defaultFree } = params;
  const normalizedPlanType = normalizePlanType(planType);

  if (normalizedPlanType === "premium") {
    return true;
  }

  if (normalizedPlanType === "free") {
    if (freePatterns.length > 0 && hasFeature(features, freePatterns)) {
      return true;
    }
    return defaultFree;
  }

  if (premiumPatterns.length > 0 && hasFeature(features, premiumPatterns)) {
    return true;
  }

  if (freePatterns.length > 0 && hasFeature(features, freePatterns)) {
    return true;
  }

  return defaultFree;
}

async function readCurrentSubscription(bancaId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      current_period_start,
      current_period_end,
      trial_ends_at,
      plan:plans(
        id,
        name,
        slug,
        type,
        price,
        billing_cycle,
        features,
        limits,
        is_active
      )
    `)
    .eq("banca_id", bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const plan = (data.plan || null) as any;

  return {
    ...(data as any),
    plan: plan
      ? {
          ...plan,
          type: (plan.type || "free") as PlanType,
          price: Number(plan.price || 0),
          features: normalizeFeatures(plan.features),
          limits: normalizeLimits(plan.limits),
          is_active: plan.is_active !== false,
        }
      : null,
  } as SubscriptionRow;
}

async function readFallbackPlan(): Promise<SubscriptionPlan | null> {
  const { data, error } = await supabaseAdmin
    .from("plans")
    .select("id, name, slug, type, price, billing_cycle, features, limits, is_active, is_default, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const plans = (data || []) as any[];
  const selectedPlan =
    plans.find((plan) => plan.type === "free" || Number(plan.price || 0) === 0) ||
    plans.find((plan) => plan.is_default) ||
    plans[0] ||
    null;

  if (!selectedPlan) {
    return null;
  }

  return {
    ...selectedPlan,
    type: (selectedPlan.type || "free") as PlanType,
    price: Number(selectedPlan.price || 0),
    features: normalizeFeatures(selectedPlan.features),
    limits: normalizeLimits(selectedPlan.limits),
    is_active: selectedPlan.is_active !== false,
  } as SubscriptionPlan;
}

async function readOverdueGraceDays(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("value")
    .eq("key", "subscription_overdue_grace_days")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const parsed = Number(data?.value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_OVERDUE_GRACE_DAYS;
  }

  return Math.floor(parsed);
}

async function readLatestOpenPayment(subscriptionId: string): Promise<PendingPaymentRow | null> {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select("due_date, created_at, status")
    .eq("subscription_id", subscriptionId)
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as PendingPaymentRow | null) || null;
}

async function readBancaCreatedAt(bancaId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("created_at")
    .eq("id", bancaId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.created_at || null;
}

async function bancaHasPaidSubscriptionHistory(bancaId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      plan:plans(
        id,
        type,
        price
      )
    `)
    .eq("banca_id", bancaId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).some((row: any) => {
    const plan = Array.isArray(row?.plan) ? row.plan[0] : row?.plan;
    const planType = String(plan?.type || "free").toLowerCase();
    const planPrice = Number(plan?.price || 0);
    return planType !== "free" && planPrice > 0;
  });
}

function addDaysToIso(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function isPaidSubscriptionPlan(plan: SubscriptionPlan | null | undefined): boolean {
  return Boolean(plan) && (plan?.type || "free") !== "free" && Number(plan?.price || 0) > 0;
}

function isExpiredDate(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  return new Date() > date;
}

export async function resolveBancaPlanEntitlements(banca: BancaPlanContext): Promise<BancaPlanEntitlements> {
  let subscription = await readCurrentSubscription(banca.id);

  if (!subscription) {
    await ensureBancaHasOnboardingPlan(banca.id);
    subscription = await readCurrentSubscription(banca.id);
  }

  let subscriptionPlan = subscription?.plan || null;

  if (
    subscription?.status === "trial" &&
    isPaidSubscriptionPlan(subscriptionPlan) &&
    isExpiredDate(subscription.trial_ends_at || subscription.current_period_end)
  ) {
    const expiredAt = subscription.trial_ends_at || subscription.current_period_end || new Date().toISOString();
    await downgradeBancaToFreePlan(banca.id, {
      cancelReason: "Trial Premium expirado. Banca retornou ao plano Free.",
      cancelledAt: expiredAt,
    });
    subscription = await readCurrentSubscription(banca.id);
    subscriptionPlan = subscription?.plan || null;
  }

  const paidFeaturesLockedUntilPayment =
    subscription?.status === "pending" &&
    Boolean(subscriptionPlan) &&
    isPaidSubscriptionPlan(subscriptionPlan);
  let overdueFeaturesLocked = false;
  let overdueInGracePeriod = false;
  let overdueGraceEndsAt: string | null = null;

  if (
    subscription?.status === "overdue" &&
    Boolean(subscriptionPlan) &&
    isPaidSubscriptionPlan(subscriptionPlan)
  ) {
    const [graceDays, latestOpenPayment] = await Promise.all([
      readOverdueGraceDays(),
      readLatestOpenPayment(subscription.id),
    ]);

    const baseDate = latestOpenPayment?.due_date || latestOpenPayment?.created_at || subscription.current_period_end || subscription.current_period_start;

    if (baseDate) {
      overdueGraceEndsAt = addDaysToIso(baseDate, graceDays);
      overdueInGracePeriod = new Date() <= new Date(overdueGraceEndsAt);
      overdueFeaturesLocked = !overdueInGracePeriod;
    } else {
      overdueFeaturesLocked = true;
      overdueInGracePeriod = false;
    }
  }

  const fallbackPlan =
    paidFeaturesLockedUntilPayment || overdueFeaturesLocked
      ? await readFallbackPlan()
      : null;
  const plan = fallbackPlan || subscriptionPlan || null;
  const requestedPlan = paidFeaturesLockedUntilPayment ? subscriptionPlan : null;
  const features = plan?.features || [];
  const limits = plan?.limits || {};
  const basePlanType = normalizePlanType((plan?.type || "free") as PlanType);

  let hasOnboardingPremiumAccess = false;
  let onboardingPremiumEndsAt: string | null = null;
  const bancaCreatedAt = banca.created_at ?? (await readBancaCreatedAt(banca.id));

  if (basePlanType === "free" && bancaCreatedAt) {
    onboardingPremiumEndsAt = addDaysToIso(bancaCreatedAt, DEFAULT_ONBOARDING_PREMIUM_DAYS);
    const stillInsideOnboardingWindow = new Date() <= new Date(onboardingPremiumEndsAt);

    if (stillInsideOnboardingWindow) {
      const hasPaidHistory = await bancaHasPaidSubscriptionHistory(banca.id);
      hasOnboardingPremiumAccess = !hasPaidHistory;
    }
  }

  const accessPlanType: PlanType = hasOnboardingPremiumAccess ? "premium" : basePlanType;
  const planType = normalizePlanType(accessPlanType);
  const isLegacyCotistaLinked = banca.is_cotista === true || Boolean(banca.cotista_id);
  const productLimit =
    hasOnboardingPremiumAccess
      ? null
      : readNumericLimit(limits, "max_products") || (planType === "free" ? 10 : null);

  const planIncludesPartnerDirectory =
    accessPlanType === "premium" ||
    Boolean(limits.partner_directory) ||
    hasFeature(features, [/distribuidor/i, /parceir/i]);

  const planIncludesDistributorCatalog =
    accessPlanType === "premium" ||
    Boolean(limits.distributor_catalog) ||
    hasFeature(features, [/cat[aá]logo/i, /distribuidor/i, /fornecedor/i]);

  const canAccessCampaigns = resolveBooleanAccess({
    planType: accessPlanType,
    limits,
    features,
    premiumPatterns: [/campanh/i],
    defaultFree: false,
  });

  const canManageCollaborators = resolveBooleanAccess({
    planType: accessPlanType,
    limits,
    features,
    premiumPatterns: [/colaborad/i, /equipe/i],
    defaultFree: false,
  });

  const canAccessEditorial = resolveBooleanAccess({
    planType: accessPlanType,
    limits,
    features,
    premiumPatterns: [/editorial/i, /publ/i],
    defaultFree: false,
  });

  const canAccessFeaturedPlacement = resolveBooleanAccess({
    planType: accessPlanType,
    limits,
    features,
    premiumPatterns: [/destaque/i, /featured/i],
    defaultFree: false,
  });

  const hasPrioritySupport = resolveBooleanAccess({
    planType: accessPlanType,
    limits,
    features,
    premiumPatterns: [/suporte priorit[áa]rio/i, /priority support/i],
    freePatterns: [/suporte/i],
    defaultFree: false,
  });

  return {
    subscription,
    plan,
    requestedPlan,
    planType,
    productLimit,
    maxImagesPerProduct: readNumericLimit(limits, "max_images_per_product"),
    canManageManualProducts: true,
    canManageOrders: true,
    canUseCoupons: true,
    canAccessIntelligence: true,
    canAccessAcademy: true,
    canAccessSupport: true,
    canSellViaWhatsapp: true,
    canManageInventory: true,
    canAccessCampaigns,
    canManageCollaborators,
    canAccessEditorial,
    canAccessFeaturedPlacement,
    canAccessPartnerDirectory: planIncludesPartnerDirectory,
    canAccessDistributorCatalog: planIncludesDistributorCatalog,
    hasPrioritySupport,
    isLegacyCotistaLinked,
    paidFeaturesLockedUntilPayment,
    overdueFeaturesLocked,
    overdueInGracePeriod,
    overdueGraceEndsAt,
    hasOnboardingPremiumAccess,
    onboardingPremiumEndsAt,
  };
}
