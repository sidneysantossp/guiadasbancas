import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadPrimaryOwnedBanca } from "@/lib/modules/jornaleiro/access";
import { ensureDefaultPremiumPlan } from "@/lib/banca-subscription";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import {
  hasBancaUsedPaidPlanTrial,
  readPaidPlanTrialDays,
  resolvePlanPricing,
} from "@/lib/subscription-billing";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    await ensureDefaultPremiumPlan();

    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("id, name, slug, description, type, price, billing_cycle, features, limits, is_active, is_default, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const { data: banca, error: bancaError } = await loadPrimaryOwnedBanca<{
      id: string;
      is_cotista: boolean | null;
      cotista_id: string | null;
      created_at: string | null;
    }>({
      userId: user.id,
      select: "id, is_cotista, cotista_id, created_at",
    });

    if (bancaError) {
      console.error("[API/JORNALEIRO/PLANS] Erro ao buscar banca:", bancaError);
    }

    const [paidPlanTrialDays, paidPlanTrialAlreadyUsed, entitlements] = banca?.id
      ? await Promise.all([
          readPaidPlanTrialDays(),
          hasBancaUsedPaidPlanTrial(banca.id),
          resolveBancaPlanEntitlements({
            id: banca.id,
            is_cotista: banca.is_cotista,
            cotista_id: banca.cotista_id,
            created_at: banca.created_at,
          }),
        ])
      : [0, true, null];
    const canReceivePaidTrial = !entitlements?.onboardingPremiumEndsAt;

    const preferredPlans = (data || []).filter((plan) => {
      const normalizedType = String(plan.type || "").toLowerCase();
      return normalizedType === "free" || normalizedType === "premium";
    });

    const plansForJourneyman = preferredPlans.length > 0 ? preferredPlans : data || [];

    const plansWithPricing = await Promise.all(
      plansForJourneyman.map(async (plan) => {
        const pricing = banca?.id
          ? await resolvePlanPricing(plan as any, banca.id)
          : {
              effectivePrice: Number(plan.price || 0),
              originalPrice: null,
              promoApplied: false,
              promotionLabel: null,
              remainingLaunchSlots: 0,
              launchOfferAvailable: false,
            };

        return {
          ...plan,
          effective_price: pricing.effectivePrice,
          original_price: pricing.originalPrice,
          promotion_label: pricing.promotionLabel,
          promo_applied: pricing.promoApplied,
          remaining_launch_slots: pricing.remainingLaunchSlots,
          launch_offer_available: pricing.launchOfferAvailable,
          trial_days:
            Number(plan.price || 0) > 0 && (plan.type || "").toLowerCase() !== "free" && !paidPlanTrialAlreadyUsed
              && canReceivePaidTrial
              ? paidPlanTrialDays
              : 0,
          trial_available:
            Number(plan.price || 0) > 0 &&
            (plan.type || "").toLowerCase() !== "free" &&
            paidPlanTrialDays > 0 &&
            canReceivePaidTrial &&
            !paidPlanTrialAlreadyUsed,
        };
      })
    );

    return NextResponse.json(
      { success: true, data: plansWithPricing },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/JORNALEIRO/PLANS] Erro ao listar planos:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao listar planos" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
