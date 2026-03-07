import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";

type SubscriptionRow = {
  id: string;
  banca_id: string | null;
  plan_id: string | null;
  status: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string | null;
  updated_at: string | null;
  plan: {
    id: string;
    name: string;
    type: string | null;
    price: number | null;
    billing_cycle: string | null;
  } | null;
  banca: {
    id: string;
    name: string | null;
    email: string | null;
    whatsapp: string | null;
    active?: boolean | null;
    approved?: boolean | null;
  } | null;
};

type PaymentRow = {
  id: string;
  subscription_id: string | null;
  amount: number | null;
  status: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string | null;
};

export const dynamic = "force-dynamic";

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select(`
        id,
        banca_id,
        plan_id,
        status,
        current_period_start,
        current_period_end,
        created_at,
        updated_at,
        plan:plans (
          id,
          name,
          type,
          price,
          billing_cycle
        ),
        banca:bancas (
          id,
          name,
          email,
          whatsapp,
          active,
          approved
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const subscriptions = (((data as unknown as any[]) || []).filter(Boolean) as any[]).map((item) => ({
      ...item,
      plan: normalizeRelation(item.plan),
      banca: normalizeRelation(item.banca),
    })) as SubscriptionRow[];
    const subscriptionIds = subscriptions.map((item) => item.id).filter(Boolean);

    let latestPaymentMap = new Map<string, PaymentRow>();

    if (subscriptionIds.length > 0) {
      const { data: payments, error: paymentsError } = await supabaseAdmin
        .from("payments")
        .select("id, subscription_id, amount, status, due_date, paid_at, created_at")
        .in("subscription_id", subscriptionIds)
        .order("created_at", { ascending: false });

      if (paymentsError) {
        throw paymentsError;
      }

      latestPaymentMap = ((payments as PaymentRow[] | null) || []).reduce((acc, payment) => {
        if (!payment.subscription_id || acc.has(payment.subscription_id)) {
          return acc;
        }

        acc.set(payment.subscription_id, payment);
        return acc;
      }, new Map<string, PaymentRow>());
    }

    const rows = subscriptions.map((subscription) => ({
      ...subscription,
      latest_payment: latestPaymentMap.get(subscription.id) || null,
    }));

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/SUBSCRIPTIONS] Erro ao listar assinaturas:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao listar assinaturas" },
      { status: 500 }
    );
  }
}
