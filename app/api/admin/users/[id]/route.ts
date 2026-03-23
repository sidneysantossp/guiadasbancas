import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select(
        "id, full_name, email, phone, role, active, blocked, blocked_reason, blocked_at, banca_id, created_at, updated_at"
      )
      .eq("id", id)
      .single();

    if (profileError || !profile || (profile.role || "").toLowerCase() === "admin") {
      return NextResponse.json({ success: false, error: "Usuário não encontrado" }, { status: 404 });
    }

    const bancaId = profile.banca_id || null;
    const [bancaResponse, ordersResponse, subscriptionResponse] = await Promise.all([
      bancaId
        ? supabaseAdmin
            .from("bancas")
            .select("id, user_id, name, address, whatsapp, active, approved, featured")
            .eq("id", bancaId)
            .single()
        : Promise.resolve({ data: null, error: null }),
      supabaseAdmin
        .from("orders")
        .select("id, banca_id, customer_name, total, status, payment_method, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(10),
      bancaId
        ? supabaseAdmin
            .from("subscriptions")
            .select(
              `
                id,
                banca_id,
                status,
                current_period_start,
                current_period_end,
                plan:plans (
                  id,
                  name,
                  type,
                  price,
                  billing_cycle
                )
              `
            )
            .eq("banca_id", bancaId)
            .order("created_at", { ascending: false })
            .limit(1)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (bancaResponse.error) throw bancaResponse.error;
    if (ordersResponse.error) throw ordersResponse.error;
    if (subscriptionResponse.error) throw subscriptionResponse.error;

    const orders = (ordersResponse.data || []) as Array<{
      id: string;
      banca_id: string | null;
      customer_name: string | null;
      total: number | null;
      status: string | null;
      payment_method: string | null;
      created_at: string | null;
    }>;

    const subscription = normalizeRelation((subscriptionResponse.data as any[])?.[0] || null);

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role,
          active: profile.active !== false,
          blocked: profile.blocked === true,
          blocked_reason: profile.blocked_reason,
          blocked_at: profile.blocked_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
        banca: bancaResponse.data
          ? {
              id: bancaResponse.data.id,
              user_id: bancaResponse.data.user_id,
              name: bancaResponse.data.name,
              address: bancaResponse.data.address,
              whatsapp: bancaResponse.data.whatsapp,
              active: bancaResponse.data.active !== false,
              approved: bancaResponse.data.approved === true,
              featured: bancaResponse.data.featured === true,
            }
          : null,
        subscription: subscription
          ? {
              ...subscription,
              contracted_price: null,
              plan: normalizeRelation(subscription.plan),
            }
          : null,
        metrics: {
          total_orders: orders.length,
          total_spent: orders.reduce((sum, item) => sum + Number(item.total || 0), 0),
          open_orders: orders.filter((item) =>
            !["entregue", "cancelado"].includes((item.status || "").toLowerCase())
          ).length,
        },
        recent_orders: orders,
      },
    });
  } catch (error: any) {
    console.error("[API/ADMIN/USERS/:id] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar usuário" },
      { status: 500 }
    );
  }
}
