import { NextRequest, NextResponse } from "next/server";
import { cancelSubscription } from "@/lib/asaas";
import {
  downgradeBancaToFreePlan,
  ensureDefaultPremiumPlan,
} from "@/lib/banca-subscription";
import {
  clearBancaPricingOverride,
  findSubscriptionBindingByBancaId,
  removeSubscriptionBindingByBancaId,
} from "@/lib/subscription-billing";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
};

async function loadBanca(id: string) {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id, name, is_cotista, cotista_id, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function cancelProviderSubscription(bancaId: string) {
  const binding = await findSubscriptionBindingByBancaId(bancaId);
  if (!binding?.asaasSubscriptionId) return;

  await cancelSubscription(binding.asaasSubscriptionId);
  await removeSubscriptionBindingByBancaId(bancaId);
}

async function readPlanState(bancaId: string) {
  const { data: subscription, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      status,
      current_period_end,
      plan:plans(id, name, type, price)
    `)
    .eq("banca_id", bancaId)
    .in("status", ["pending", "active", "overdue", "trial"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const plan = Array.isArray(subscription?.plan)
    ? subscription.plan[0] || null
    : subscription?.plan || null;
  const premiumActive =
    Boolean(plan) &&
    String(plan?.type || "").toLowerCase() !== "free" &&
    Number(plan?.price || 0) > 0 &&
    subscription?.status === "active";

  return {
    plan_type: premiumActive ? "premium" : "free",
    plan_name: premiumActive ? plan?.name || "Premium" : "Free",
    premium_active: premiumActive,
    distributor_catalog_enabled: premiumActive,
    subscription_id: subscription?.id || null,
    subscription_status: subscription?.status || null,
    manual_grant:
      premiumActive &&
      subscription?.status === "active" &&
      !subscription?.current_period_end,
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const banca = await loadBanca(id);
    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: await readPlanState(banca.id) },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar plano da banca" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const banca = await loadBanca(id);
    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "").toLowerCase();
    const now = new Date().toISOString();

    if (action === "grant_premium") {
      const premiumPlan = await ensureDefaultPremiumPlan();
      if (!premiumPlan?.id) {
        throw new Error("Plano Premium ativo não encontrado");
      }

      await cancelProviderSubscription(banca.id);
      await clearBancaPricingOverride(banca.id);

      const { data: currentSubscription, error: currentError } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("banca_id", banca.id)
        .in("status", ["pending", "active", "overdue", "trial"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (currentError) throw currentError;

      const payload = {
        plan_id: premiumPlan.id,
        status: "active",
        asaas_subscription_id: null,
        asaas_customer_id: null,
        current_period_start: now,
        current_period_end: null,
        trial_ends_at: null,
        cancelled_at: null,
        cancel_reason: null,
        updated_at: now,
      };

      if (currentSubscription?.id) {
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update(payload)
          .eq("id", currentSubscription.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAdmin.from("subscriptions").insert({
          banca_id: banca.id,
          ...payload,
        });
        if (error) throw error;
      }

      await supabaseAdmin.from("notifications").insert({
        banca_id: banca.id,
        type: "plan_admin_grant",
        title: "Plano Premium ativado",
        message: "O administrador liberou o Plano Premium para esta banca.",
        data: { source: "admin_manual_grant" },
      });
    } else if (action === "revoke_premium") {
      await cancelProviderSubscription(banca.id);
      await removeSubscriptionBindingByBancaId(banca.id);
      await clearBancaPricingOverride(banca.id);
      await downgradeBancaToFreePlan(banca.id, {
        cancelReason: "Plano Premium manual revogado pelo administrador",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Ação de plano inválida" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const refreshedBanca = await loadBanca(id);
    return NextResponse.json(
      {
        success: true,
        data: refreshedBanca ? await readPlanState(refreshedBanca.id) : null,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("[API/ADMIN/BANCAS/PLAN] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao atualizar plano da banca" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
