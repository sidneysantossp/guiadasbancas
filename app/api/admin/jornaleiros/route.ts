import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

type JornalieroRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  active: boolean | null;
  blocked: boolean | null;
  blocked_reason: string | null;
  blocked_at: string | null;
  banca_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type BancaRow = {
  id: string;
  name: string | null;
  active: boolean | null;
  approved: boolean | null;
};

type SubscriptionRow = {
  id: string;
  banca_id: string | null;
  status: string | null;
  plan: {
    name: string | null;
    type: string | null;
    price: number | null;
  } | null;
};

type OrderRow = {
  id: string;
  banca_id: string | null;
  total: number | null;
  status: string | null;
  created_at: string | null;
};

type ProductRow = {
  id: string;
  banca_id: string | null;
  active: boolean | null;
};

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const status = (searchParams.get("status") || "").trim().toLowerCase();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [profilesResponse, bancasResponse, subscriptionsResponse, ordersResponse, productsResponse] =
      await Promise.all([
        supabaseAdmin
          .from("user_profiles")
          .select(
            "id, full_name, email, phone, role, active, blocked, blocked_reason, blocked_at, banca_id, created_at, updated_at"
          )
          .in("role", ["jornaleiro", "seller"])
          .order("created_at", { ascending: false }),
        supabaseAdmin.from("bancas").select("id, name, active, approved"),
        supabaseAdmin
          .from("subscriptions")
          .select(
            `
            id,
            banca_id,
            status,
            plan:plans (
              name,
              type,
              price
            )
          `
          )
          .order("created_at", { ascending: false }),
        supabaseAdmin
          .from("orders")
          .select("id, banca_id, total, status, created_at")
          .gte("created_at", thirtyDaysAgo.toISOString()),
        supabaseAdmin.from("products").select("id, banca_id, active"),
      ]);

    if (profilesResponse.error) throw profilesResponse.error;
    if (bancasResponse.error) throw bancasResponse.error;
    if (subscriptionsResponse.error) throw subscriptionsResponse.error;
    if (ordersResponse.error) throw ordersResponse.error;
    if (productsResponse.error) throw productsResponse.error;

    const profiles = ((profilesResponse.data || []) as JornalieroRow[]).filter(Boolean);
    const bancas = new Map(
      (((bancasResponse.data || []) as BancaRow[]).filter(Boolean) || []).map((item) => [item.id, item])
    );

    const subscriptionsByBanca = new Map<string, SubscriptionRow>();
    for (const item of ((subscriptionsResponse.data as any[]) || [])) {
      if (!item?.banca_id || subscriptionsByBanca.has(item.banca_id)) continue;
      subscriptionsByBanca.set(item.banca_id, {
        ...item,
        plan: normalizeRelation(item.plan),
      });
    }

    const ordersByBanca = new Map<
      string,
      { total: number; today: number; open: number; revenue30d: number; lastOrderAt: string | null }
    >();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    for (const order of ((ordersResponse.data || []) as OrderRow[])) {
      if (!order.banca_id) continue;
      const current = ordersByBanca.get(order.banca_id) || {
        total: 0,
        today: 0,
        open: 0,
        revenue30d: 0,
        lastOrderAt: null,
      };
      current.total += 1;
      current.revenue30d += Number(order.total || 0);
      if (order.created_at && new Date(order.created_at) >= todayStart) {
        current.today += 1;
      }
      if (!["entregue", "cancelado"].includes((order.status || "").toLowerCase())) {
        current.open += 1;
      }
      if (!current.lastOrderAt || (order.created_at && order.created_at > current.lastOrderAt)) {
        current.lastOrderAt = order.created_at || current.lastOrderAt;
      }
      ordersByBanca.set(order.banca_id, current);
    }

    const productsByBanca = new Map<string, { total: number; active: number }>();
    for (const product of ((productsResponse.data || []) as ProductRow[])) {
      if (!product.banca_id) continue;
      const current = productsByBanca.get(product.banca_id) || { total: 0, active: 0 };
      current.total += 1;
      if (product.active !== false) current.active += 1;
      productsByBanca.set(product.banca_id, current);
    }

    const rows = profiles
      .map((profile) => {
        const banca = profile.banca_id ? bancas.get(profile.banca_id) || null : null;
        const subscription = profile.banca_id ? subscriptionsByBanca.get(profile.banca_id) || null : null;
        const orderStats = profile.banca_id ? ordersByBanca.get(profile.banca_id) || null : null;
        const productStats = profile.banca_id ? productsByBanca.get(profile.banca_id) || null : null;

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          active: profile.active !== false,
          blocked: profile.blocked === true,
          blocked_reason: profile.blocked_reason,
          blocked_at: profile.blocked_at,
          banca: banca
            ? {
                id: banca.id,
                name: banca.name,
                active: banca.active !== false,
                approved: banca.approved === true,
              }
            : null,
          plan: subscription?.plan
            ? {
                name: subscription.plan.name || "Sem plano",
                type: subscription.plan.type || "free",
                price: Number(subscription.plan.price || 0),
                status: subscription.status || "active",
              }
            : null,
          orders: {
            total_30d: orderStats?.total || 0,
            today: orderStats?.today || 0,
            open: orderStats?.open || 0,
            revenue_30d: orderStats?.revenue30d || 0,
            last_order_at: orderStats?.lastOrderAt || null,
          },
          products: {
            total: productStats?.total || 0,
            active: productStats?.active || 0,
          },
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };
      })
      .filter((row) => {
        const matchesQuery =
          !query ||
          row.full_name?.toLowerCase().includes(query) ||
          row.email?.toLowerCase().includes(query) ||
          row.banca?.name?.toLowerCase().includes(query);

        const normalizedStatus = row.blocked
          ? "blocked"
          : row.banca?.approved
            ? "approved"
            : row.banca
              ? "pending"
              : "without_banca";

        const matchesStatus = !status || normalizedStatus === status;
        return Boolean(matchesQuery && matchesStatus);
      });

    const summary = {
      total: rows.length,
      blocked: rows.filter((row) => row.blocked).length,
      withBanca: rows.filter((row) => row.banca).length,
      approvedBancas: rows.filter((row) => row.banca?.approved).length,
      paidPlans: rows.filter((row) => ["start", "premium"].includes((row.plan?.type || "").toLowerCase())).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      data: rows,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/JORNALEIROS] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao listar jornaleiros" },
      { status: 500 }
    );
  }
}
