import { NextRequest, NextResponse } from "next/server";
import { downgradeBancaToFreePlan } from "@/lib/banca-subscription";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriptionPlanRow = {
  id: string;
  type?: string | null;
  price?: number | null;
};

type SubscriptionRow = {
  id: string;
  banca_id: string;
  status: string;
  current_period_end: string | null;
  trial_ends_at: string | null;
  created_at: string | null;
  plan: SubscriptionPlanRow | SubscriptionPlanRow[] | null;
};

function normalizePlan(plan: SubscriptionRow["plan"]): SubscriptionPlanRow | null {
  if (Array.isArray(plan)) {
    return plan[0] || null;
  }

  return plan || null;
}

function isPaidPlan(plan: SubscriptionPlanRow | null): boolean {
  return Boolean(plan) && String(plan?.type || "free").toLowerCase() !== "free" && Number(plan?.price || 0) > 0;
}

function isExpiredTrial(subscription: SubscriptionRow, now: Date): boolean {
  if (String(subscription.status || "").toLowerCase() !== "trial") {
    return false;
  }

  if (!isPaidPlan(normalizePlan(subscription.plan))) {
    return false;
  }

  const expiresAt = subscription.trial_ends_at || subscription.current_period_end;
  if (!expiresAt) {
    return false;
  }

  const expiresAtDate = new Date(expiresAt);
  return !Number.isNaN(expiresAtDate.getTime()) && expiresAtDate <= now;
}

function hasValidCronAuth(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isProduction = process.env.NODE_ENV === "production";
  const secretFromQuery =
    searchParams.get("cron_secret") ||
    searchParams.get("secret") ||
    searchParams.get("token");

  if (isProduction && !cronSecret) {
    return false;
  }

  return cronSecret ? authHeader === `Bearer ${cronSecret}` || secretFromQuery === cronSecret : true;
}

async function loadCurrentSubscription(bancaId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(`
      id,
      banca_id,
      status,
      current_period_end,
      trial_ends_at,
      created_at,
      plan:plans(id, type, price)
    `)
    .eq("banca_id", bancaId)
    .in("status", ["active", "trial", "pending", "overdue"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as SubscriptionRow | null) || null;
}

export async function POST(request: NextRequest) {
  if (!hasValidCronAuth(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const asOfParam = searchParams.get("as_of");
    const now = asOfParam ? new Date(asOfParam) : new Date();

    if (Number.isNaN(now.getTime())) {
      return NextResponse.json(
        { success: false, error: "Parâmetro as_of inválido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select(`
        id,
        banca_id,
        status,
        current_period_end,
        trial_ends_at,
        created_at,
        plan:plans(id, type, price)
      `)
      .eq("status", "trial")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      throw new Error(error.message);
    }

    const candidates = ((data || []) as SubscriptionRow[]).filter((subscription) =>
      isExpiredTrial(subscription, now)
    );
    const bancaIds = Array.from(new Set(candidates.map((subscription) => subscription.banca_id)));
    const downgraded: string[] = [];
    const skipped: Array<{ banca_id: string; reason: string }> = [];
    const errors: Array<{ banca_id: string; error: string }> = [];

    for (const bancaId of bancaIds) {
      try {
        const currentSubscription = await loadCurrentSubscription(bancaId);

        if (!currentSubscription || !isExpiredTrial(currentSubscription, now)) {
          skipped.push({ banca_id: bancaId, reason: "assinatura_atual_nao_expirada" });
          continue;
        }

        await downgradeBancaToFreePlan(bancaId, {
          cancelReason: "Trial Premium expirado automaticamente. Banca retornou ao plano Free.",
          cancelledAt: now.toISOString(),
        });

        downgraded.push(bancaId);
      } catch (error: any) {
        errors.push({ banca_id: bancaId, error: error?.message || "Erro desconhecido" });
      }
    }

    return NextResponse.json(
      {
        success: errors.length === 0,
        executed_at: new Date().toISOString(),
        as_of: now.toISOString(),
        summary: {
          candidates: candidates.length,
          bancas_considered: bancaIds.length,
          downgraded: downgraded.length,
          skipped: skipped.length,
          errors: errors.length,
        },
        downgraded,
        skipped,
        errors,
      },
      { status: errors.length > 0 ? 207 : 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro inesperado no downgrade de assinaturas" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
