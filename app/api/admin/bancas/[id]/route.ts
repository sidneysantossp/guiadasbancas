import { NextRequest, NextResponse } from "next/server";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: banca, error: bancaError } = await supabaseAdmin
      .from("bancas")
      .select(
        "id, user_id, name, address, cep, phone, whatsapp, cover_image, profile_image, active, approved, featured, description, tpu_url, created_at, updated_at, lat, lng, is_cotista, cotista_id"
      )
      .eq("id", id)
      .single();

    if (bancaError || !banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const [ownerResponse, subscriptionResponse, ordersResponse, orders30dResponse, productsResponse, customizationsResponse] =
      await Promise.all([
        banca.user_id
          ? supabaseAdmin
              .from("user_profiles")
              .select("id, full_name, email, phone, role, blocked, blocked_reason")
              .eq("id", banca.user_id)
              .single()
          : Promise.resolve({ data: null, error: null }),
        supabaseAdmin
          .from("subscriptions")
          .select(
            `
              id,
              banca_id,
              status,
              current_period_start,
              current_period_end,
              contracted_price,
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
          .eq("banca_id", banca.id)
          .order("created_at", { ascending: false })
          .limit(1),
        supabaseAdmin
          .from("orders")
          .select("id, user_id, customer_name, total, status, payment_method, created_at")
          .eq("banca_id", banca.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabaseAdmin
          .from("orders")
          .select("id, total, status, created_at")
          .eq("banca_id", banca.id)
          .gte("created_at", thirtyDaysAgo.toISOString()),
        supabaseAdmin
          .from("products")
          .select("id, name, price, active, featured, distribuidor_id, created_at")
          .eq("banca_id", banca.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabaseAdmin
          .from("banca_produtos_distribuidor")
          .select("id, product_id, enabled")
          .eq("banca_id", banca.id),
      ]);

    if (ownerResponse.error) throw ownerResponse.error;
    if (subscriptionResponse.error) throw subscriptionResponse.error;
    if (ordersResponse.error) throw ordersResponse.error;
    if (orders30dResponse.error) throw orders30dResponse.error;
    if (productsResponse.error) throw productsResponse.error;
    if (customizationsResponse.error) throw customizationsResponse.error;

    const subscription = normalizeRelation((subscriptionResponse.data as any[])?.[0] || null);
    const products = (productsResponse.data || []) as Array<{
      id: string;
      name: string | null;
      price: number | null;
      active: boolean | null;
      featured: boolean | null;
      distribuidor_id: string | null;
      created_at: string | null;
    }>;
    const orders30d = (orders30dResponse.data || []) as Array<{
      id: string;
      total: number | null;
      status: string | null;
      created_at: string | null;
    }>;
    const customizations = (customizationsResponse.data || []) as Array<{
      id: string;
      product_id: string | null;
      enabled: boolean | null;
    }>;

    const entitlements = await resolveBancaPlanEntitlements({
      id: banca.id,
      is_cotista: banca.is_cotista,
      cotista_id: banca.cotista_id,
    });

    return NextResponse.json({
      success: true,
      data: {
        banca: {
          id: banca.id,
          user_id: banca.user_id,
          name: banca.name,
          address: banca.address,
          cep: banca.cep,
          phone: banca.phone,
          whatsapp: banca.whatsapp,
          cover_image: banca.cover_image,
          profile_image: banca.profile_image,
          active: banca.active !== false,
          approved: banca.approved === true,
          featured: banca.featured === true,
          description: banca.description,
          tpu_url: banca.tpu_url,
          created_at: banca.created_at,
          updated_at: banca.updated_at,
          lat: banca.lat,
          lng: banca.lng,
        },
        owner: ownerResponse.data
          ? {
              id: ownerResponse.data.id,
              full_name: ownerResponse.data.full_name,
              email: ownerResponse.data.email,
              phone: ownerResponse.data.phone,
              role: ownerResponse.data.role,
              blocked: ownerResponse.data.blocked === true,
              blocked_reason: ownerResponse.data.blocked_reason,
            }
          : null,
        subscription: subscription
          ? {
              ...subscription,
              plan: normalizeRelation(subscription.plan),
            }
          : null,
        entitlements,
        metrics: {
          orders_30d: orders30d.length,
          open_orders_30d: orders30d.filter((item) =>
            !["entregue", "cancelado"].includes((item.status || "").toLowerCase())
          ).length,
          revenue_30d: orders30d.reduce((sum, item) => sum + Number(item.total || 0), 0),
          total_products: products.length,
          active_products: products.filter((item) => item.active !== false).length,
          featured_products: products.filter((item) => item.featured === true).length,
          distributor_customizations: customizations.length,
          disabled_partner_items: customizations.filter((item) => item.enabled === false).length,
        },
        recent_orders: ordersResponse.data || [],
        recent_products: products,
      },
    });
  } catch (error: any) {
    console.error("[API/ADMIN/BANCAS/:id] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar banca" },
      { status: 500 }
    );
  }
}
