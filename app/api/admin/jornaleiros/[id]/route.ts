import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

type ManagedJornaleiroProfile = {
  id: string;
  role: string | null;
  full_name: string | null;
  email: string | null;
  banca_id: string | null;
};

function isManagedJornaleiroRole(role?: string | null) {
  const normalized = (role || "").toLowerCase();
  return normalized === "jornaleiro" || normalized === "seller";
}

function isAuthUserNotFound(error: { message?: string | null; status?: number | null } | null | undefined) {
  const message = String(error?.message || "").toLowerCase();
  return error?.status === 404 || message.includes("user not found") || message.includes("not found");
}

async function loadManagedJornaleiroOrThrow(id: string): Promise<ManagedJornaleiroProfile> {
  const { data: profile, error } = await supabaseAdmin
    .from("user_profiles")
    .select("id, role, full_name, email, banca_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao carregar jornaleiro");
  }

  if (!profile || !isManagedJornaleiroRole(profile.role)) {
    const notFoundError = new Error("Jornaleiro não encontrado");
    (notFoundError as Error & { status?: number }).status = 404;
    throw notFoundError;
  }

  return profile as ManagedJornaleiroProfile;
}

async function detachJornaleiroFromBancas(userId: string) {
  const now = new Date().toISOString();

  const [profileResponse, ownedBancasResponse, membershipsResponse] = await Promise.all([
    supabaseAdmin.from("user_profiles").select("id, banca_id").eq("id", userId).maybeSingle(),
    supabaseAdmin.from("bancas").select("id").eq("user_id", userId),
    supabaseAdmin.from("banca_members").select("banca_id").eq("user_id", userId),
  ]);

  if (profileResponse.error) {
    throw new Error(profileResponse.error.message || "Erro ao carregar vínculo atual do jornaleiro");
  }

  if (ownedBancasResponse.error) {
    throw new Error(ownedBancasResponse.error.message || "Erro ao listar bancas próprias do jornaleiro");
  }

  if (membershipsResponse.error) {
    throw new Error(membershipsResponse.error.message || "Erro ao listar vínculos operacionais do jornaleiro");
  }

  const primaryBancaId = profileResponse.data?.banca_id || null;
  const ownedBancaIds = ((ownedBancasResponse.data || []) as Array<{ id: string }>).map((item) => item.id).filter(Boolean);
  const membershipBancaIds = Array.from(
    new Set(
      ((membershipsResponse.data || []) as Array<{ banca_id: string | null }>)
        .map((item) => item.banca_id)
        .filter((value): value is string => Boolean(value))
    )
  );

  if (primaryBancaId) {
    const { error: clearProfileError } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: null, updated_at: now })
      .eq("id", userId);

    if (clearProfileError) {
      throw new Error(clearProfileError.message || "Erro ao limpar banca ativa do jornaleiro");
    }
  }

  if (membershipBancaIds.length > 0) {
    const { error: membershipDeleteError } = await supabaseAdmin
      .from("banca_members")
      .delete()
      .eq("user_id", userId);

    if (membershipDeleteError) {
      throw new Error(membershipDeleteError.message || "Erro ao remover vínculos operacionais da banca");
    }
  }

  if (ownedBancaIds.length > 0) {
    const { error: ownedBancasUpdateError } = await supabaseAdmin
      .from("bancas")
      .update({
        user_id: null,
        active: false,
        updated_at: now,
      })
      .in("id", ownedBancaIds);

    if (ownedBancasUpdateError) {
      throw new Error(ownedBancasUpdateError.message || "Erro ao desvincular bancas próprias do jornaleiro");
    }
  }

  const pendingBancaDeleteResponse = await supabaseAdmin
    .from("jornaleiro_pending_banca")
    .delete()
    .eq("user_id", userId);

  if (pendingBancaDeleteResponse.error && pendingBancaDeleteResponse.error.code !== "42P01") {
    console.warn(
      "[API/ADMIN/JORNALEIROS/:id] Falha ao limpar onboarding pendente:",
      pendingBancaDeleteResponse.error.message
    );
  }

  return {
    primaryBancaCleared: Boolean(primaryBancaId),
    membershipsRemoved: membershipBancaIds.length,
    ownedBancasDetached: ownedBancaIds.length,
  };
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
            .select("id, customer_name, customer_email, total, status, payment_method, created_at")
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
      customer_name: string | null;
      customer_email: string | null;
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));

    if (body?.action !== "unlink_banca") {
      return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 });
    }

    const profile = await loadManagedJornaleiroOrThrow(id);
    const detachResult = await detachJornaleiroFromBancas(id);

    return NextResponse.json({
      success: true,
      message:
        detachResult.primaryBancaCleared ||
        detachResult.membershipsRemoved > 0 ||
        detachResult.ownedBancasDetached > 0
          ? `Vínculo removido. ${detachResult.ownedBancasDetached} banca(s) própria(s) ficaram sem responsável e foram pausadas.`
          : "Esta conta já estava sem vínculo com banca.",
      data: {
        jornaleiro: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
        },
        ...detachResult,
      },
    });
  } catch (error: any) {
    const status = error?.status && Number.isInteger(error.status) ? Number(error.status) : 500;
    console.error("[API/ADMIN/JORNALEIROS/:id][PATCH] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao desvincular jornaleiro da banca" },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const profile = await loadManagedJornaleiroOrThrow(id);
    const detachResult = await detachJornaleiroFromBancas(id);

    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authDeleteError && !isAuthUserNotFound(authDeleteError)) {
      throw new Error(authDeleteError.message || "Erro ao excluir usuário de autenticação");
    }

    if (authDeleteError && isAuthUserNotFound(authDeleteError)) {
      const { error: profileDeleteError } = await supabaseAdmin.from("user_profiles").delete().eq("id", id);
      if (profileDeleteError) {
        throw new Error(profileDeleteError.message || "Erro ao excluir perfil órfão do jornaleiro");
      }
    }

    return NextResponse.json({
      success: true,
      message: `Conta excluída com sucesso. ${detachResult.ownedBancasDetached} banca(s) própria(s) foram pausadas e ficaram sem responsável.`,
      data: {
        jornaleiro: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
        },
        ...detachResult,
      },
    });
  } catch (error: any) {
    const status = error?.status && Number.isInteger(error.status) ? Number(error.status) : 500;
    console.error("[API/ADMIN/JORNALEIROS/:id][DELETE] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao excluir conta do jornaleiro" },
      { status }
    );
  }
}
