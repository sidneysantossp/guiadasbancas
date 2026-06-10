import { supabaseAdmin } from "@/lib/supabase";

const PREMIUM_LAUNCH_PRICE_KEY = "premium_launch_price";
const PREMIUM_LAUNCH_SLOTS_KEY = "premium_launch_slots";
const PREMIUM_LAUNCH_CLAIMS_KEY = "premium_launch_claimed_bancas_v1";
const PAID_PLAN_TRIAL_DAYS_KEY = "subscription_trial_days_paid";
const PAID_PLAN_TRIAL_CLAIMS_KEY = "paid_plan_trial_claimed_bancas_v1";
const SUBSCRIPTION_BINDINGS_KEY = "asaas_subscription_bindings_v1";
const SUBSCRIPTION_PRICING_OVERRIDES_KEY = "banca_subscription_pricing_overrides_v1";

const DEFAULT_PREMIUM_LAUNCH_PRICE = 97;
const DEFAULT_PREMIUM_LAUNCH_SLOTS = 100;
const DEFAULT_PAID_PLAN_TRIAL_DAYS = 30;

type SubscriptionBinding = {
  localSubscriptionId: string;
  bancaId: string;
  planId: string;
  asaasSubscriptionId: string;
  asaasCustomerId?: string | null;
  effectivePrice: number;
  billingType: string;
  status?: string | null;
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

function shouldUseLegacySettings(error: any): boolean {
  const code = String(error?.code || "");
  const message = String(error?.message || "");
  return (
    code === "42P01" ||
    code === "PGRST205" ||
    /relation .* does not exist/i.test(message) ||
    /Could not find the table/i.test(message)
  );
}

function normalizeBindingRow(row: any): SubscriptionBinding {
  return {
    localSubscriptionId: row.subscription_id,
    bancaId: row.banca_id,
    planId: row.plan_id,
    asaasSubscriptionId: row.provider_subscription_id,
    asaasCustomerId: row.provider_customer_id || null,
    effectivePrice: Number(row.effective_price || 0),
    billingType: row.billing_type || "",
    status: row.status || null,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function normalizePricingRow(row: any): BancaPricingOverride {
  return {
    bancaId: row.banca_id,
    planId: row.plan_id,
    effectivePrice: Number(row.effective_price || 0),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    promoApplied: row.promo_applied === true,
    promotionLabel: row.promotion_label || null,
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

async function findBindingFromLocalSubscription(filters: {
  bancaId?: string;
  asaasSubscriptionId?: string;
}): Promise<SubscriptionBinding | null> {
  let query = supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      plan_id,
      status,
      asaas_subscription_id,
      asaas_customer_id,
      created_at,
      plan:plans(price)
    `)
    .not("asaas_subscription_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (filters.bancaId) {
    query = query.eq("banca_id", filters.bancaId).in("status", ["active", "trial", "pending", "overdue"]);
  }

  if (filters.asaasSubscriptionId) {
    query = query.eq("asaas_subscription_id", filters.asaasSubscriptionId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.asaas_subscription_id) {
    return null;
  }

  const plan = Array.isArray((data as any).plan) ? (data as any).plan[0] : (data as any).plan;

  return {
    localSubscriptionId: data.id,
    bancaId: data.banca_id,
    planId: data.plan_id,
    asaasSubscriptionId: data.asaas_subscription_id,
    asaasCustomerId: data.asaas_customer_id || null,
    effectivePrice: Number(plan?.price || 0),
    billingType: "",
    status: data.status || null,
    createdAt: data.created_at || new Date().toISOString(),
  };
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
  const { data, error } = await supabaseAdmin
    .from("premium_launch_offer_claims")
    .select("banca_id")
    .order("claimed_at", { ascending: true });

  if (!error) {
    const tableClaims = ((data || []) as Array<{ banca_id?: string | null }>)
      .map((item) => item.banca_id)
      .filter(Boolean) as string[];
    const raw = await readSetting(PREMIUM_LAUNCH_CLAIMS_KEY);
    const legacyClaims = safeParseJson<string[]>(raw, []);
    return Array.from(new Set([...tableClaims, ...(Array.isArray(legacyClaims) ? legacyClaims.filter(Boolean) : [])]));
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const raw = await readSetting(PREMIUM_LAUNCH_CLAIMS_KEY);
  const parsed = safeParseJson<string[]>(raw, []);
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

async function writePremiumLaunchClaims(bancaIds: string[]): Promise<void> {
  const uniqueBancaIds = Array.from(new Set(bancaIds.filter(Boolean)));
  const { error: deleteError } = await supabaseAdmin
    .from("premium_launch_offer_claims")
    .delete()
    .not("banca_id", "in", `(${uniqueBancaIds.join(",") || "00000000-0000-0000-0000-000000000000"})`);

  if (!deleteError || shouldUseLegacySettings(deleteError)) {
    if (!deleteError && uniqueBancaIds.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("premium_launch_offer_claims")
        .upsert(
          uniqueBancaIds.map((bancaId) => ({
            banca_id: bancaId,
            metadata: { source: "subscription-billing" },
          })),
          { onConflict: "banca_id" }
        );

      if (upsertError && !shouldUseLegacySettings(upsertError)) {
        throw new Error(upsertError.message);
      }
    }
  } else {
    throw new Error(deleteError.message);
  }

  await writeSetting(
    PREMIUM_LAUNCH_CLAIMS_KEY,
    JSON.stringify(uniqueBancaIds),
    "Lista de bancas que garantiram a oferta de lançamento do Premium"
  );
}

async function readPaidPlanTrialClaims(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("subscription_trial_claims")
    .select("banca_id")
    .eq("claim_key", "paid_plan_trial");

  if (!error) {
    const tableClaims = ((data || []) as Array<{ banca_id?: string | null }>)
      .map((item) => item.banca_id)
      .filter(Boolean) as string[];
    const raw = await readSetting(PAID_PLAN_TRIAL_CLAIMS_KEY);
    const legacyClaims = safeParseJson<string[]>(raw, []);
    return Array.from(new Set([...tableClaims, ...(Array.isArray(legacyClaims) ? legacyClaims.filter(Boolean) : [])]));
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const raw = await readSetting(PAID_PLAN_TRIAL_CLAIMS_KEY);
  const parsed = safeParseJson<string[]>(raw, []);
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

async function writePaidPlanTrialClaims(bancaIds: string[]): Promise<void> {
  const uniqueBancaIds = Array.from(new Set(bancaIds.filter(Boolean)));
  const { error: deleteError } = await supabaseAdmin
    .from("subscription_trial_claims")
    .delete()
    .eq("claim_key", "paid_plan_trial")
    .not("banca_id", "in", `(${uniqueBancaIds.join(",") || "00000000-0000-0000-0000-000000000000"})`);

  if (!deleteError || shouldUseLegacySettings(deleteError)) {
    if (!deleteError && uniqueBancaIds.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("subscription_trial_claims")
        .upsert(
          uniqueBancaIds.map((bancaId) => ({
            banca_id: bancaId,
            claim_key: "paid_plan_trial",
            metadata: { source: "subscription-billing" },
          })),
          { onConflict: "banca_id,claim_key" }
        );

      if (upsertError && !shouldUseLegacySettings(upsertError)) {
        throw new Error(upsertError.message);
      }
    }
  } else {
    throw new Error(deleteError.message);
  }

  await writeSetting(
    PAID_PLAN_TRIAL_CLAIMS_KEY,
    JSON.stringify(uniqueBancaIds),
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
  if (raw == null || String(raw).trim() === "") {
    return DEFAULT_PAID_PLAN_TRIAL_DAYS;
  }

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

  const { error } = await supabaseAdmin
    .from("premium_launch_offer_claims")
    .insert({
      banca_id: bancaId,
      metadata: { source: "subscription-checkout" },
    });

  if (error) {
    if (error.code === "23505") {
      return { claimedNow: false, alreadyClaimed: true };
    }

    if (!shouldUseLegacySettings(error)) {
      throw new Error(error.message);
    }

    claims.push(bancaId);
    await writePremiumLaunchClaims(claims);
  } else {
    await writeSetting(
      PREMIUM_LAUNCH_CLAIMS_KEY,
      JSON.stringify(Array.from(new Set([...claims, bancaId]))),
      "Lista de bancas que garantiram a oferta de lançamento do Premium"
    );
  }

  return { claimedNow: true, alreadyClaimed: false };
}

export async function releasePremiumLaunchOffer(bancaId: string): Promise<void> {
  const claims = await readPremiumLaunchClaims();
  if (!claims.includes(bancaId)) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("premium_launch_offer_claims")
    .delete()
    .eq("banca_id", bancaId);

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  await writePremiumLaunchClaims(claims.filter((claimedId) => claimedId !== bancaId));
}

export async function hasBancaUsedPaidPlanTrial(bancaId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("subscription_trial_claims")
    .select("id")
    .eq("banca_id", bancaId)
    .eq("claim_key", "paid_plan_trial")
    .maybeSingle();

  if (!error) {
    if (data) {
      return true;
    }

    const legacyClaims = await readPaidPlanTrialClaims();
    return legacyClaims.includes(bancaId);
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const legacyClaims = await readPaidPlanTrialClaims();
  return legacyClaims.includes(bancaId);
}

export async function claimPaidPlanTrial(bancaId: string): Promise<{ claimedNow: boolean; alreadyClaimed: boolean }> {
  const claims = await readPaidPlanTrialClaims();

  if (claims.includes(bancaId)) {
    return { claimedNow: false, alreadyClaimed: true };
  }

  const { error } = await supabaseAdmin
    .from("subscription_trial_claims")
    .insert({
      banca_id: bancaId,
      claim_key: "paid_plan_trial",
      metadata: { source: "subscription-checkout" },
    });

  if (error) {
    if (error.code === "23505") {
      return { claimedNow: false, alreadyClaimed: true };
    }

    if (!shouldUseLegacySettings(error)) {
      throw new Error(error.message);
    }

    claims.push(bancaId);
    await writePaidPlanTrialClaims(claims);
  } else {
    await writeSetting(
      PAID_PLAN_TRIAL_CLAIMS_KEY,
      JSON.stringify(Array.from(new Set([...claims, bancaId]))),
      "Lista de bancas que já utilizaram o período de degustação dos planos pagos"
    );
  }

  return { claimedNow: true, alreadyClaimed: false };
}

export async function releasePaidPlanTrial(bancaId: string): Promise<void> {
  const claims = await readPaidPlanTrialClaims();
  if (!claims.includes(bancaId)) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("subscription_trial_claims")
    .delete()
    .eq("banca_id", bancaId)
    .eq("claim_key", "paid_plan_trial");

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  await writePaidPlanTrialClaims(claims.filter((claimedId) => claimedId !== bancaId));
}

export async function getBancaPricingOverride(bancaId: string): Promise<BancaPricingOverride | null> {
  const { data, error } = await supabaseAdmin
    .from("banca_subscription_pricing_contracts")
    .select("banca_id, plan_id, effective_price, original_price, promo_applied, promotion_label, created_at, updated_at")
    .eq("banca_id", bancaId)
    .maybeSingle();

  if (!error) {
    if (data) {
      return normalizePricingRow(data);
    }

    const legacyOverrides = await readPricingOverrides();
    return legacyOverrides[bancaId] || null;
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const overrides = await readPricingOverrides();
  return overrides[bancaId] || null;
}

export async function saveBancaPricingOverride(override: BancaPricingOverride): Promise<void> {
  const { error } = await supabaseAdmin
    .from("banca_subscription_pricing_contracts")
    .upsert(
      {
        banca_id: override.bancaId,
        plan_id: override.planId,
        effective_price: override.effectivePrice,
        original_price: override.originalPrice,
        promo_applied: override.promoApplied,
        promotion_label: override.promotionLabel,
        metadata: { source: "subscription-checkout" },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "banca_id" }
    );

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const overrides = await readPricingOverrides();
  overrides[override.bancaId] = override;
  await writePricingOverrides(overrides);
}

export async function clearBancaPricingOverride(bancaId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("banca_subscription_pricing_contracts")
    .delete()
    .eq("banca_id", bancaId);

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const overrides = await readPricingOverrides();
  if (!overrides[bancaId]) return;
  delete overrides[bancaId];
  await writePricingOverrides(overrides);
}

export async function saveSubscriptionBinding(binding: SubscriptionBinding): Promise<void> {
  const { error } = await supabaseAdmin
    .from("subscription_provider_bindings")
    .upsert(
      {
        subscription_id: binding.localSubscriptionId,
        banca_id: binding.bancaId,
        plan_id: binding.planId,
        provider: "asaas",
        provider_subscription_id: binding.asaasSubscriptionId,
        provider_customer_id: binding.asaasCustomerId || null,
        billing_type: binding.billingType,
        status: binding.status || "active",
        effective_price: binding.effectivePrice,
        metadata: { source: "subscription-checkout" },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider,banca_id" }
    );

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

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
  const { error } = await supabaseAdmin
    .from("subscription_provider_bindings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("provider", "asaas")
    .eq("provider_subscription_id", asaasSubscriptionId);

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const bindings = await readBindings();
  if (!bindings[asaasSubscriptionId]) return;
  delete bindings[asaasSubscriptionId];
  await writeBindings(bindings);
}

export async function removeSubscriptionBindingByBancaId(bancaId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("subscription_provider_bindings")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("provider", "asaas")
    .eq("banca_id", bancaId);

  if (error && !shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

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
  const { data, error } = await supabaseAdmin
    .from("subscription_provider_bindings")
    .select("subscription_id, banca_id, plan_id, provider_subscription_id, provider_customer_id, billing_type, status, effective_price, created_at")
    .eq("provider", "asaas")
    .eq("provider_subscription_id", asaasSubscriptionId)
    .maybeSingle();

  if (!error) {
    if (data) {
      return normalizeBindingRow(data);
    }

    const legacyBindings = await readBindings();
    return legacyBindings[asaasSubscriptionId] || await findBindingFromLocalSubscription({ asaasSubscriptionId });
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const bindings = await readBindings();
  return bindings[asaasSubscriptionId] || await findBindingFromLocalSubscription({ asaasSubscriptionId });
}

export async function findSubscriptionBindingByBancaId(bancaId: string): Promise<SubscriptionBinding | null> {
  const { data, error } = await supabaseAdmin
    .from("subscription_provider_bindings")
    .select("subscription_id, banca_id, plan_id, provider_subscription_id, provider_customer_id, billing_type, status, effective_price, created_at")
    .eq("provider", "asaas")
    .eq("banca_id", bancaId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!error) {
    if (!data || String(data.status || "").toLowerCase() === "cancelled") {
      const legacyBindings = await readBindings();
      return Object.values(legacyBindings).find((binding) => binding.bancaId === bancaId) ||
        await findBindingFromLocalSubscription({ bancaId });
    }

    return normalizeBindingRow(data);
  }

  if (!shouldUseLegacySettings(error)) {
    throw new Error(error.message);
  }

  const bindings = await readBindings();
  return Object.values(bindings).find((binding) => binding.bancaId === bancaId) ||
    await findBindingFromLocalSubscription({ bancaId });
}
