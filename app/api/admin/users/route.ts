import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

type UserProfileRow = {
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

type OrderRow = {
  id: string;
  banca_id: string | null;
  customer_email: string | null;
  total: number | null;
  status: string | null;
  created_at: string | null;
};

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();
    const roleFilter = (searchParams.get("role") || "").trim().toLowerCase();

    const [profilesResponse, bancasResponse, ordersResponse] = await Promise.all([
      supabaseAdmin
        .from("user_profiles")
        .select(
          "id, full_name, email, phone, role, active, blocked, blocked_reason, blocked_at, banca_id, created_at, updated_at"
        )
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("bancas").select("id, name, active, approved"),
      supabaseAdmin.from("orders").select("id, customer_email, banca_id, total, status, created_at"),
    ]);

    if (profilesResponse.error) throw profilesResponse.error;
    if (bancasResponse.error) throw bancasResponse.error;
    if (ordersResponse.error) throw ordersResponse.error;

    const profiles = ((profilesResponse.data || []) as UserProfileRow[])
      .filter(Boolean)
      .filter((profile) => (profile.role || "").toLowerCase() !== "admin");

    const bancas = new Map(
      (((bancasResponse.data || []) as BancaRow[]).filter(Boolean) || []).map((item) => [item.id, item])
    );

    const orderStatsByUser = new Map<
      string,
      { totalOrders: number; totalSpent: number; openOrders: number; lastOrderAt: string | null }
    >();

    for (const order of ((ordersResponse.data || []) as OrderRow[])) {
      if (!order.customer_email) continue;
      const current = orderStatsByUser.get(order.customer_email) || {
        totalOrders: 0,
        totalSpent: 0,
        openOrders: 0,
        lastOrderAt: null,
      };
      current.totalOrders += 1;
      current.totalSpent += Number(order.total || 0);
      if (!["entregue", "cancelado"].includes((order.status || "").toLowerCase())) {
        current.openOrders += 1;
      }
      if (!current.lastOrderAt || (order.created_at && order.created_at > current.lastOrderAt)) {
        current.lastOrderAt = order.created_at || current.lastOrderAt;
      }
      orderStatsByUser.set(order.customer_email, current);
    }

    const rows = profiles
      .map((profile) => {
        const banca = profile.banca_id ? bancas.get(profile.banca_id) || null : null;
        const orderStats = profile.email ? orderStatsByUser.get(profile.email) || null : null;
        const role = (profile.role || "cliente").toLowerCase();

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          role,
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
          orders: {
            total: orderStats?.totalOrders || 0,
            total_spent: orderStats?.totalSpent || 0,
            open: orderStats?.openOrders || 0,
            last_order_at: orderStats?.lastOrderAt || null,
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

        const matchesRole = !roleFilter || row.role === roleFilter;

        return Boolean(matchesQuery && matchesRole);
      });

    const summary = {
      total: rows.length,
      blocked: rows.filter((row) => row.blocked).length,
      clientes: rows.filter((row) => !["jornaleiro", "seller"].includes(row.role)).length,
      jornaleiros: rows.filter((row) => ["jornaleiro", "seller"].includes(row.role)).length,
      withBanca: rows.filter((row) => row.banca).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      data: rows,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/USERS] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao listar usuarios" },
      { status: 500 }
    );
  }
}
