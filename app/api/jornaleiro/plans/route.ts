import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";
import {
  hasBancaUsedPaidPlanTrial,
  readPaidPlanTrialDays,
  resolvePlanPricing,
} from "@/lib/subscription-billing";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("id, name, slug, description, type, price, billing_cycle, features, limits, is_active, is_default, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const { data: banca } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    const [paidPlanTrialDays, paidPlanTrialAlreadyUsed] = banca?.id
      ? await Promise.all([
          readPaidPlanTrialDays(),
          hasBancaUsedPaidPlanTrial(banca.id),
        ])
      : [0, true];

    const plansWithPricing = await Promise.all(
      (data || []).map(async (plan) => {
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
              ? paidPlanTrialDays
              : 0,
          trial_available:
            Number(plan.price || 0) > 0 &&
            (plan.type || "").toLowerCase() !== "free" &&
            paidPlanTrialDays > 0 &&
            !paidPlanTrialAlreadyUsed,
        };
      })
    );

    return NextResponse.json({ success: true, data: plansWithPricing });
  } catch (error: any) {
    console.error("[API/JORNALEIRO/PLANS] Erro ao listar planos:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao listar planos" },
      { status: 500 }
    );
  }
}
