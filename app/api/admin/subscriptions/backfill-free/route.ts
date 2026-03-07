import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data: freePlan, error: freePlanError } = await supabaseAdmin
      .from("plans")
      .select("id, name, type, price")
      .eq("is_active", true)
      .or("type.eq.free,price.eq.0")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (freePlanError) {
      throw freePlanError;
    }

    if (!freePlan?.id) {
      return NextResponse.json(
        { success: false, error: "Nenhum plano Free ativo foi encontrado para o backfill." },
        { status: 400 }
      );
    }

    const [{ data: bancas, error: bancasError }, { data: currentSubscriptions, error: subscriptionsError }] =
      await Promise.all([
        supabaseAdmin.from("bancas").select("id"),
        supabaseAdmin
          .from("subscriptions")
          .select("banca_id")
          .in("status", ["active", "trial", "pending", "overdue"]),
      ]);

    if (bancasError) {
      throw bancasError;
    }

    if (subscriptionsError) {
      throw subscriptionsError;
    }

    const bancaIds = (bancas || []).map((item) => item.id).filter(Boolean);
    const bancaIdsWithCurrentPlan = new Set(
      (currentSubscriptions || []).map((item) => item.banca_id).filter(Boolean)
    );

    const bancasWithoutCurrentPlan = bancaIds.filter((bancaId) => !bancaIdsWithCurrentPlan.has(bancaId));

    for (const bancaId of bancasWithoutCurrentPlan) {
      await ensureBancaHasOnboardingPlan(bancaId, { preferredPlanId: freePlan.id });
    }

    return NextResponse.json({
      success: true,
      data: {
        free_plan_id: freePlan.id,
        total_bancas: bancaIds.length,
        already_with_current_plan: bancaIds.length - bancasWithoutCurrentPlan.length,
        added_to_free: bancasWithoutCurrentPlan.length,
      },
      message: `${bancasWithoutCurrentPlan.length} banca(s) adicionada(s) ao plano Free.`,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/SUBSCRIPTIONS/BACKFILL-FREE] Erro:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao aplicar o plano Free nas bancas existentes." },
      { status: 500 }
    );
  }
}
