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

    if (profileError || !profile || !["jornaleiro", "seller"].includes((profile.role || "").toLowerCase())) {
      return NextResponse.json({ success: false, error: "Jornaleiro não encontrado" }, { status: 404 });
    }

    const bancaId = profile.banca_id || null;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [bancaResponse, subscriptionResponse, ordersResponse, productsResponse] = await Promise.all([
      bancaId
        ? supabaseAdmin
            .from("bancas")
            .select(
              "id, user_id, name, address, cep, whatsapp, active, approved, featured, cover_image, profile_image, description, tpu_url"
            )
            .eq("id", bancaId)
            .single()
        : Promise.resolve({ data: null, error: null }),
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
                created_at,
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
      bancaId
        ? supabaseAdmin
            .from("orders")
            .select("id, user_id, customer_name, total, status, payment_method, created_at")
            .eq("banca_id", bancaId)
            .order("created_at", { ascending: false })
            .limit(8)
        : Promise.resolve({ data: [], error: null }),
      bancaId
        ? supabaseAdmin
            .from("products")
            .select("id, name, price, active, featured, category_id, created_at")
            .eq("banca_id", bancaId)
            .order("created_at", { ascending: false })
            .limit(8)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (bancaResponse.error) throw bancaResponse.error;
    if (subscriptionResponse.error) throw subscriptionResponse.error;
    if (ordersResponse.error) throw ordersResponse.error;
    if (productsResponse.error) throw productsResponse.error;

    const currentSubscription = normalizeRelation((subscriptionResponse.data as any[])?.[0] || null);

    const paymentsResponse =
      currentSubscription?.id
        ? await supabaseAdmin
            .from("payments")
            .select("id, amount, status, due_date, paid_at, created_at")
            .eq("subscription_id", currentSubscription.id)
            .order("created_at", { ascending: false })
            .limit(5)
        : { data: [], error: null };

    if (paymentsResponse.error) throw paymentsResponse.error;

    const orders30dResponse =
      bancaId
        ? await supabaseAdmin
            .from("orders")
            .select("id, total, status, created_at")
            .eq("banca_id", bancaId)
            .gte("created_at", thirtyDaysAgo.toISOString())
        : { data: [], error: null };

    if (orders30dResponse.error) throw orders30dResponse.error;

    const products = (productsResponse.data || []) as Array<{
      id: string;
      name: string | null;
      price: number | null;
      active: boolean | null;
      featured: boolean | null;
      category_id: string | null;
      created_at: string | null;
    }>;
    const recentOrders = (ordersResponse.data || []) as Array<{
      id: string;
      user_id: string | null;
      customer_name: string | null;
      total: number | null;
      status: string | null;
      payment_method: string | null;
      created_at: string | null;
    }>;
    const orders30d = (orders30dResponse.data || []) as Array<{
      id: string;
      total: number | null;
      status: string | null;
      created_at: string | null;
    }>;

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
              cep: bancaResponse.data.cep,
              whatsapp: bancaResponse.data.whatsapp,
              active: bancaResponse.data.active !== false,
              approved: bancaResponse.data.approved === true,
              featured: bancaResponse.data.featured === true,
              cover_image: bancaResponse.data.cover_image,
              profile_image: bancaResponse.data.profile_image,
              description: bancaResponse.data.description,
              tpu_url: bancaResponse.data.tpu_url,
            }
          : null,
        subscription: currentSubscription
          ? {
              ...currentSubscription,
              contracted_price: null,
              plan: normalizeRelation(currentSubscription.plan),
              payments: paymentsResponse.data || [],
            }
          : null,
        metrics: {
          orders_30d: orders30d.length,
          open_orders_30d: orders30d.filter((item) =>
            !["entregue", "cancelado"].includes((item.status || "").toLowerCase())
          ).length,
          revenue_30d: orders30d.reduce((sum, item) => sum + Number(item.total || 0), 0),
          total_products: products.length,
          active_products: products.filter((item) => item.active !== false).length,
          featured_products: products.filter((item) => item.featured === true).length,
        },
        recent_orders: recentOrders,
        recent_products: products,
      },
    });
  } catch (error: any) {
    console.error("[API/ADMIN/JORNALEIROS/:id] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar jornaleiro" },
      { status: 500 }
    );
  }
}
