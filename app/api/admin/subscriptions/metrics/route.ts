import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";

type ResolvedPlanType = "free" | "start" | "premium";
type PlanType = ResolvedPlanType | string;

type SubscriptionRecord = {
  id: string;
  banca_id: string | null;
  status: string | null;
  created_at: string | null;
  plan: {
    id: string;
    name: string;
    type: PlanType | null;
    price: number | null;
    billing_cycle: string | null;
  } | null;
};

type BancaRecord = {
  id: string;
  active?: boolean | null;
  approved?: boolean | null;
  created_at?: string | null;
};

type PaymentRecord = {
  id: string;
  subscription_id: string | null;
  amount: number | null;
  status: string | null;
  created_at: string | null;
  paid_at: string | null;
};

type DailyGrowth = {
  date: string;
  free: number;
  start: number;
  premium: number;
  paid: number;
  total: number;
};

export const dynamic = "force-dynamic";

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

function getStartDate(period: string) {
  const startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(startDate.getDate() - 90);
      break;
    case "all":
      return new Date("2020-01-01");
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  return startDate;
}

function normalizePlanType(planType?: string | null): ResolvedPlanType {
  const normalized = (planType || "free").toLowerCase();
  if (normalized === "start" || normalized === "premium" || normalized === "free") {
    return normalized;
  }

  return "free";
}

function monthlyValue(price?: number | null, billingCycle?: string | null) {
  const base = Number(price || 0);
  if (!Number.isFinite(base) || base <= 0) {
    return 0;
  }

  switch ((billingCycle || "monthly").toLowerCase()) {
    case "quarterly":
      return base / 3;
    case "semiannual":
      return base / 6;
    case "annual":
      return base / 12;
    default:
      return base;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const startDate = getStartDate(period);

    const [
      bancasResponse,
      currentSubscriptionsResponse,
      periodSubscriptionsResponse,
      periodPaymentsResponse,
      latestPaymentsResponse,
    ] = await Promise.all([
      supabaseAdmin.from("bancas").select("id, active, approved, created_at"),
      supabaseAdmin
        .from("subscriptions")
        .select(`
          id,
          banca_id,
          status,
          created_at,
          plan:plans (
            id,
            name,
            type,
            price,
            billing_cycle
          )
        `)
        .in("status", ["active", "trial", "pending", "overdue"])
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("subscriptions")
        .select(`
          id,
          banca_id,
          status,
          created_at,
          plan:plans (
            id,
            name,
            type,
            price,
            billing_cycle
          )
        `)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true }),
      supabaseAdmin
        .from("payments")
        .select("id, subscription_id, amount, status, created_at, paid_at")
        .gte("created_at", startDate.toISOString()),
      supabaseAdmin
        .from("payments")
        .select("id, subscription_id, amount, status, created_at, paid_at")
        .order("created_at", { ascending: false }),
    ]);

    if (bancasResponse.error) throw bancasResponse.error;
    if (currentSubscriptionsResponse.error) throw currentSubscriptionsResponse.error;
    if (periodSubscriptionsResponse.error) throw periodSubscriptionsResponse.error;
    if (periodPaymentsResponse.error) throw periodPaymentsResponse.error;
    if (latestPaymentsResponse.error) throw latestPaymentsResponse.error;

    const bancas = ((bancasResponse.data || []) as BancaRecord[]).filter(Boolean);

    const rawCurrentSubscriptions = ((currentSubscriptionsResponse.data as unknown as any[]) || []).filter(Boolean);
    const currentSubscriptionsByBanca = new Map<string, SubscriptionRecord>();

    for (const item of rawCurrentSubscriptions) {
      if (!item?.banca_id || currentSubscriptionsByBanca.has(item.banca_id)) {
        continue;
      }

      currentSubscriptionsByBanca.set(item.banca_id, {
        ...item,
        plan: normalizeRelation(item.plan),
      });
    }

    const currentSubscriptions = Array.from(currentSubscriptionsByBanca.values());

    const periodSubscriptions = (((periodSubscriptionsResponse.data as unknown as any[]) || []).filter(Boolean) as any[]).map(
      (item) =>
        ({
          ...item,
          plan: normalizeRelation(item.plan),
        }) as SubscriptionRecord
    );

    const periodPayments = ((periodPaymentsResponse.data || []) as PaymentRecord[]).filter(Boolean);
    const latestPayments = ((latestPaymentsResponse.data || []) as PaymentRecord[]).filter(Boolean);

    const latestPaymentBySubscription = latestPayments.reduce((acc, payment) => {
      if (!payment.subscription_id || acc.has(payment.subscription_id)) {
        return acc;
      }

      acc.set(payment.subscription_id, payment);
      return acc;
    }, new Map<string, PaymentRecord>());

    const planCounts = { free: 0, start: 0, premium: 0 };
    const statusCounts = { active: 0, trial: 0, pending: 0, overdue: 0, cancelled: 0, expired: 0 };

    let activePaidCount = 0;
    let pendingPaidCount = 0;
    let overduePaidCount = 0;
    let trialPaidCount = 0;
    let mrrContracted = 0;
    let mrrActive = 0;
    let openRevenue = 0;

    currentSubscriptions.forEach((subscription) => {
      const planType = normalizePlanType(subscription.plan?.type);
      planCounts[planType] += 1;

      const status = (subscription.status || "active").toLowerCase();
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts] += 1;
      }

      const isPaidPlan = planType !== "free" && Number(subscription.plan?.price || 0) > 0;
      const monthlyPlanValue = monthlyValue(subscription.plan?.price, subscription.plan?.billing_cycle);

      if (isPaidPlan) {
        mrrContracted += monthlyPlanValue;
      }

      if (status === "active" && isPaidPlan) {
        activePaidCount += 1;
        mrrActive += monthlyPlanValue;
      }

      if (status === "trial" && isPaidPlan) {
        trialPaidCount += 1;
        mrrActive += monthlyPlanValue;
      }

      if (status === "pending" && isPaidPlan) {
        pendingPaidCount += 1;
      }

      if (status === "overdue" && isPaidPlan) {
        overduePaidCount += 1;
      }

      const latestPayment = latestPaymentBySubscription.get(subscription.id);
      if (
        latestPayment &&
        (latestPayment.status === "pending" || latestPayment.status === "overdue")
      ) {
        openRevenue += Number(latestPayment.amount || 0);
      }
    });

    const paidBancas = planCounts.start + planCounts.premium;
    const totalBancas = bancas.length;
    const activeBancas = bancas.filter((item) => item.active !== false).length;
    const approvedBancas = bancas.filter((item) => item.approved === true).length;
    const freeBancas = planCounts.free;

    const periodReceivedRevenue = periodPayments.reduce((sum, payment) => {
      if (payment.status !== "confirmed" && payment.status !== "received") {
        return sum;
      }

      return sum + Number(payment.amount || 0);
    }, 0);

    const periodGrowthMap = periodSubscriptions.reduce((acc, subscription) => {
      const createdAt = subscription.created_at;
      if (!createdAt) {
        return acc;
      }

      const date = new Date(createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, free: 0, start: 0, premium: 0, paid: 0, total: 0 };
      }

      const planType = normalizePlanType(subscription.plan?.type);
      acc[date][planType] += 1;
      acc[date].total += 1;
      if (planType !== "free") {
        acc[date].paid += 1;
      }

      return acc;
    }, {} as Record<string, DailyGrowth>);

    const growthChart = Object.values(periodGrowthMap).sort((a, b) => a.date.localeCompare(b.date));

    const planDistribution = [
      { name: "Free", key: "free", count: planCounts.free, color: "#22c55e" },
      { name: "Start", key: "start", count: planCounts.start, color: "#3b82f6" },
      { name: "Premium", key: "premium", count: planCounts.premium, color: "#8b5cf6" },
    ].filter((item) => item.count > 0);

    const statusDistribution = [
      { name: "Ativa", key: "active", count: statusCounts.active, color: "#22c55e" },
      { name: "Degustação", key: "trial", count: statusCounts.trial, color: "#3b82f6" },
      { name: "Aguardando", key: "pending", count: statusCounts.pending, color: "#f59e0b" },
      { name: "Em aberto", key: "overdue", count: statusCounts.overdue, color: "#ef4444" },
    ].filter((item) => item.count > 0);

    return NextResponse.json({
      success: true,
      period,
      summary: {
        total_bancas: totalBancas,
        active_bancas: activeBancas,
        approved_bancas: approvedBancas,
        current_subscription_base: currentSubscriptions.length,
        free_bancas: freeBancas,
        start_bancas: planCounts.start,
        premium_bancas: planCounts.premium,
        paid_bancas: paidBancas,
        paid_conversion_rate: totalBancas > 0 ? (paidBancas / totalBancas) * 100 : 0,
        active_paid_bancas: activePaidCount,
        trial_paid_bancas: trialPaidCount,
        pending_paid_bancas: pendingPaidCount,
        overdue_paid_bancas: overduePaidCount,
        mrr_contracted: Number(mrrContracted.toFixed(2)),
        mrr_active: Number(mrrActive.toFixed(2)),
        open_revenue: Number(openRevenue.toFixed(2)),
        period_received_revenue: Number(periodReceivedRevenue.toFixed(2)),
      },
      planDistribution,
      statusDistribution,
      growthChart,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/SUBSCRIPTIONS/METRICS] Erro:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao carregar métricas comerciais" },
      { status: 500 }
    );
  }
}
