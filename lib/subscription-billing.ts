import { supabaseAdmin } from "@/lib/supabase";

const PREMIUM_LAUNCH_PRICE_KEY = "premium_launch_price";
const PREMIUM_LAUNCH_SLOTS_KEY = "premium_launch_slots";
const PREMIUM_LAUNCH_CLAIMS_KEY = "premium_launch_claimed_bancas_v1";
const PAID_PLAN_TRIAL_DAYS_KEY = "subscription_trial_days_paid";
const PAID_PLAN_TRIAL_CLAIMS_KEY = "paid_plan_trial_claimed_bancas_v1";
const SUBSCRIPTION_BINDINGS_KEY = "asaas_subscription_bindings_v1";
const SUBSCRIPTION_PRICING_OVERRIDES_KEY = "banca_subscription_pricing_overrides_v1";

const DEFAULT_PREMIUM_LAUNCH_PRICE = 99.9;
const DEFAULT_PREMIUM_LAUNCH_SLOTS = 100;
const DEFAULT_PAID_PLAN_TRIAL_DAYS = 0;

type SubscriptionBinding = {
  localSubscriptionId: string;
  bancaId: string;
  planId: string;
  asaasSubscriptionId: string;
  effectivePrice: number;
  billingType: string;
  createdAt: string;
};

type SubscriptionBindingsMap = Record<string, SubscriptionBinding>;

export type BancaPricingOverride = {
  bancaId: string;
  planId: string;
  effectivePrice: number;
  originalPrice: number | null;
  promoApplied: boolean;
  promotionLabel: string | null;
  updatedAt: string;
};

type PricingOverridesMap = Record<string, BancaPricingOverride>;

export type PlanPricingResolution = {
  effectivePrice: number;
  originalPrice: number | null;
  promoApplied: boolean;
  promotionLabel: string | null;
  remainingLaunchSlots: number;
  launchOfferAvailable: boolean;
};

function safeParseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function readSetting(key: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.value ?? null;
}

async function writeSetting(key: string, value: string, description: string): Promise<void> {
  const { error } = await supabaseAdmin.from("system_settings").upsert(
    {
      key,
      value,
      description,
      is_secret: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function readBindings(): Promise<SubscriptionBindingsMap> {
  const raw = await readSetting(SUBSCRIPTION_BINDINGS_KEY);
  const parsed = safeParseJson<SubscriptionBindingsMap>(raw, {});
  return parsed && typeof parsed === "object" ? parsed : {};
}

async function writeBindings(bindings: SubscriptionBindingsMap): Promise<void> {
  await writeSetting(
    SUBSCRIPTION_BINDINGS_KEY,
    JSON.stringify(bindings),
    "Mapeamento local entre assinaturas do Asaas e subscriptions da plataforma"
  );
}

async function readPricingOverrides(): Promise<PricingOverridesMap> {
  const raw = await readSetting(SUBSCRIPTION_PRICING_OVERRIDES_KEY);
  const parsed = safeParseJson<PricingOverridesMap>(raw, {});
  return parsed && typeof parsed === "object" ? parsed : {};
}

async function writePricingOverrides(overrides: PricingOverridesMap): Promise<void> {
  await writeSetting(
    SUBSCRIPTION_PRICING_OVERRIDES_KEY,
    JSON.stringify(overrides),
    "Preço contratado por banca para assinaturas recorrentes"
  );
}

async function readPremiumLaunchClaims(): Promise<string[]> {
  const raw = await readSetting(PREMIUM_LAUNCH_CLAIMS_KEY);
  const parsed = safeParseJson<string[]>(raw, []);
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

async function writePremiumLaunchClaims(bancaIds: string[]): Promise<void> {
  await writeSetting(
    PREMIUM_LAUNCH_CLAIMS_KEY,
    JSON.stringify(Array.from(new Set(bancaIds))),
    "Lista de bancas que garantiram a oferta de lançamento do Premium"
  );
}

async function readPaidPlanTrialClaims(): Promise<string[]> {
  const raw = await readSetting(PAID_PLAN_TRIAL_CLAIMS_KEY);
  const parsed = safeParseJson<string[]>(raw, []);
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

async function writePaidPlanTrialClaims(bancaIds: string[]): Promise<void> {
  await writeSetting(
    PAID_PLAN_TRIAL_CLAIMS_KEY,
    JSON.stringify(Array.from(new Set(bancaIds))),
    "Lista de bancas que já utilizaram o período de degustação dos planos pagos"
  );
}

async function readPremiumLaunchConfig(): Promise<{ launchPrice: number; launchSlots: number }> {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", [PREMIUM_LAUNCH_PRICE_KEY, PREMIUM_LAUNCH_SLOTS_KEY]);

  if (error) {
    throw new Error(error.message);
  }

  const launchPriceValue = Number(data?.find((item) => item.key === PREMIUM_LAUNCH_PRICE_KEY)?.value);
  const launchSlotsValue = Number(data?.find((item) => item.key === PREMIUM_LAUNCH_SLOTS_KEY)?.value);

  return {
    launchPrice: Number.isFinite(launchPriceValue) && launchPriceValue > 0 ? launchPriceValue : DEFAULT_PREMIUM_LAUNCH_PRICE,
    launchSlots: Number.isFinite(launchSlotsValue) && launchSlotsValue >= 0 ? Math.floor(launchSlotsValue) : DEFAULT_PREMIUM_LAUNCH_SLOTS,
  };
}

export async function readPaidPlanTrialDays(): Promise<number> {
  const raw = await readSetting(PAID_PLAN_TRIAL_DAYS_KEY);
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_PAID_PLAN_TRIAL_DAYS;
  }

  return Math.floor(parsed);
}

export async function resolvePlanPricing(
  plan: { id: string; type?: string | null; price?: number | null; name?: string | null },
  bancaId: string
): Promise<PlanPricingResolution> {
  const basePrice = Number(plan.price || 0);
  if ((plan.type || "").toLowerCase() !== "premium" || basePrice <= 0) {
    return {
      effectivePrice: basePrice,
      originalPrice: null,
      promoApplied: false,
      promotionLabel: null,
      remainingLaunchSlots: 0,
      launchOfferAvailable: false,
    };
  }

  const [{ launchPrice, launchSlots }, claimedBancas] = await Promise.all([
    readPremiumLaunchConfig(),
    readPremiumLaunchClaims(),
  ]);

  const promoPrice = launchPrice > 0 ? Math.min(basePrice, launchPrice) : basePrice;
  const promoActuallyDiscounts = promoPrice < basePrice;
  const bancaAlreadyClaimed = claimedBancas.includes(bancaId);
  const remainingLaunchSlots = Math.max(launchSlots - claimedBancas.length, 0);
  const launchOfferAvailable = promoActuallyDiscounts && (bancaAlreadyClaimed || remainingLaunchSlots > 0);

  return {
    effectivePrice: launchOfferAvailable ? promoPrice : basePrice,
    originalPrice: launchOfferAvailable ? basePrice : null,
    promoApplied: launchOfferAvailable,
    promotionLabel: launchOfferAvailable ? `Oferta de lançamento: R$ ${promoPrice.toFixed(2)} para as ${launchSlots} primeiras bancas` : null,
    remainingLaunchSlots,
    launchOfferAvailable,
  };
}

export async function claimPremiumLaunchOffer(bancaId: string): Promise<{ claimedNow: boolean; alreadyClaimed: boolean }> {
  const [claims, { launchSlots }] = await Promise.all([
    readPremiumLaunchClaims(),
    readPremiumLaunchConfig(),
  ]);

  if (claims.includes(bancaId)) {
    return { claimedNow: false, alreadyClaimed: true };
  }

  if (claims.length >= launchSlots) {
    return { claimedNow: false, alreadyClaimed: false };
  }

  claims.push(bancaId);
  await writePremiumLaunchClaims(claims);
  return { claimedNow: true, alreadyClaimed: false };
}

export async function releasePremiumLaunchOffer(bancaId: string): Promise<void> {
  const claims = await readPremiumLaunchClaims();
  if (!claims.includes(bancaId)) {
    return;
  }

  await writePremiumLaunchClaims(claims.filter((claimedId) => claimedId !== bancaId));
}

export async function hasBancaUsedPaidPlanTrial(bancaId: string): Promise<boolean> {
  const claims = await readPaidPlanTrialClaims();
  return claims.includes(bancaId);
}

export async function claimPaidPlanTrial(bancaId: string): Promise<{ claimedNow: boolean; alreadyClaimed: boolean }> {
  const claims = await readPaidPlanTrialClaims();

  if (claims.includes(bancaId)) {
    return { claimedNow: false, alreadyClaimed: true };
  }

  claims.push(bancaId);
  await writePaidPlanTrialClaims(claims);
  return { claimedNow: true, alreadyClaimed: false };
}

export async function releasePaidPlanTrial(bancaId: string): Promise<void> {
  const claims = await readPaidPlanTrialClaims();
  if (!claims.includes(bancaId)) {
    return;
  }

  await writePaidPlanTrialClaims(claims.filter((claimedId) => claimedId !== bancaId));
}

export async function getBancaPricingOverride(bancaId: string): Promise<BancaPricingOverride | null> {
  const overrides = await readPricingOverrides();
  return overrides[bancaId] || null;
}

export async function saveBancaPricingOverride(override: BancaPricingOverride): Promise<void> {
  const overrides = await readPricingOverrides();
  overrides[override.bancaId] = override;
  await writePricingOverrides(overrides);
}

export async function clearBancaPricingOverride(bancaId: string): Promise<void> {
  const overrides = await readPricingOverrides();
  if (!overrides[bancaId]) return;
  delete overrides[bancaId];
  await writePricingOverrides(overrides);
}

export async function saveSubscriptionBinding(binding: SubscriptionBinding): Promise<void> {
  const bindings = await readBindings();

  for (const [asaasId, currentBinding] of Object.entries(bindings)) {
    if (currentBinding.localSubscriptionId === binding.localSubscriptionId || currentBinding.bancaId === binding.bancaId) {
      delete bindings[asaasId];
    }
  }

  bindings[binding.asaasSubscriptionId] = binding;
  await writeBindings(bindings);
}

export async function removeSubscriptionBindingByAsaasId(asaasSubscriptionId: string): Promise<void> {
  const bindings = await readBindings();
  if (!bindings[asaasSubscriptionId]) return;
  delete bindings[asaasSubscriptionId];
  await writeBindings(bindings);
}

export async function removeSubscriptionBindingByBancaId(bancaId: string): Promise<void> {
  const bindings = await readBindings();
  let changed = false;

  for (const [asaasId, binding] of Object.entries(bindings)) {
    if (binding.bancaId === bancaId) {
      delete bindings[asaasId];
      changed = true;
    }
  }

  if (changed) {
    await writeBindings(bindings);
  }
}

export async function findSubscriptionBindingByAsaasId(asaasSubscriptionId: string): Promise<SubscriptionBinding | null> {
  const bindings = await readBindings();
  return bindings[asaasSubscriptionId] || null;
}

export async function findSubscriptionBindingByBancaId(bancaId: string): Promise<SubscriptionBinding | null> {
  const bindings = await readBindings();
  return Object.values(bindings).find((binding) => binding.bancaId === bancaId) || null;
}
