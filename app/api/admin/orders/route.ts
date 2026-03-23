import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

type OrderRecord = {
  id: string;
  banca_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  total: number | null;
  subtotal: number | null;
  shipping_fee: number | null;
  status: string | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type BancaRecord = {
  id: string;
  user_id: string | null;
  name: string | null;
  active: boolean | null;
  approved: boolean | null;
};

type UserRecord = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  blocked: boolean | null;
};

export const dynamic = "force-dynamic";

function normalizeStatuses(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const status = (searchParams.get("status") || "").trim();
    const bancaId = (searchParams.get("bancaId") || "").trim();
    const userId = (searchParams.get("userId") || "").trim();
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(100, Number.parseInt(searchParams.get("pageSize") || "20", 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let customerEmailFilter: string | null = null;
    if (userId) {
      const { data: profileById, error: profileByIdError } = await supabaseAdmin
        .from("user_profiles")
        .select("id, email")
        .eq("id", userId)
        .single();

      if (profileByIdError) throw profileByIdError;
      customerEmailFilter = profileById?.email || null;
      if (!customerEmailFilter) {
        return NextResponse.json({
          success: true,
          data: [],
          pagination: { total: 0, page, pageSize, pages: 0 },
        });
      }
    }

    let query = supabaseAdmin
      .from("orders")
      .select(
        "id, banca_id, customer_name, customer_phone, customer_email, total, subtotal, shipping_fee, status, payment_method, notes, created_at, updated_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    const statuses = normalizeStatuses(status);
    if (statuses.length === 1) {
      query = query.eq("status", statuses[0]);
    } else if (statuses.length > 1) {
      query = query.in("status", statuses);
    }

    if (bancaId) {
      query = query.eq("banca_id", bancaId);
    }

    if (customerEmailFilter) {
      query = query.eq("customer_email", customerEmailFilter);
    }

    if (q) {
      query = query.or(
        `id.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%,customer_email.ilike.%${q}%`
      );
    }

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    const orders = ((data || []) as OrderRecord[]).filter(Boolean);
    const bancaIds = Array.from(new Set(orders.map((item) => item.banca_id).filter(Boolean))) as string[];
    const customerEmails = Array.from(new Set(orders.map((item) => item.customer_email).filter(Boolean))) as string[];

    const [bancasResponse, usersResponse] = await Promise.all([
      bancaIds.length
        ? supabaseAdmin.from("bancas").select("id, user_id, name, active, approved").in("id", bancaIds)
        : Promise.resolve({ data: [], error: null }),
      customerEmails.length
        ? supabaseAdmin.from("user_profiles").select("id, full_name, email, role, blocked").in("email", customerEmails)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (bancasResponse.error) throw bancasResponse.error;
    if (usersResponse.error) throw usersResponse.error;

    const bancas = new Map(
      (((bancasResponse.data || []) as BancaRecord[]).filter(Boolean) || []).map((item) => [item.id, item])
    );
    const users = new Map(
      (((usersResponse.data || []) as UserRecord[]).filter(Boolean) || []).map((item) => [item.email || "", item])
    );

    const rows = orders.map((order) => {
      const banca = order.banca_id ? bancas.get(order.banca_id) || null : null;
      const user = order.customer_email ? users.get(order.customer_email) || null : null;

      return {
        id: order.id,
        status: order.status || "novo",
        total: Number(order.total || 0),
        subtotal: Number(order.subtotal || 0),
        shipping_fee: Number(order.shipping_fee || 0),
        payment_method: order.payment_method || "—",
        customer: {
          id: user?.id || null,
          name: user?.full_name || order.customer_name || "Cliente",
          email: user?.email || order.customer_email || null,
          phone: order.customer_phone || null,
          role: user?.role || "cliente",
          blocked: user?.blocked === true,
        },
        banca: banca
          ? {
              id: banca.id,
              user_id: banca.user_id,
              name: banca.name || "Banca",
              active: banca.active !== false,
              approved: banca.approved === true,
            }
          : null,
        created_at: order.created_at,
        updated_at: order.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total: count || 0,
        page,
        pageSize,
        pages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error: any) {
    console.error("[API/ADMIN/ORDERS] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const session = await auth();
    const adminUser = session?.user as
      | {
          id?: string;
          name?: string | null;
          email?: string | null;
        }
      | undefined;

    const body = await request.json();
    const { id, status, notes, estimated_delivery, items } = body || {};

    if (!id) {
      return NextResponse.json({ success: false, error: "ID do pedido é obrigatório" }, { status: 400 });
    }

    const { data: currentOrder, error: currentError } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("id", id)
      .single();

    if (currentError || !currentOrder) {
      return NextResponse.json({ success: false, error: "Pedido não encontrado" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (estimated_delivery !== undefined) updateData.estimated_delivery = estimated_delivery;
    if (Array.isArray(items)) updateData.items = items;

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select("id, status, updated_at")
      .single();

    if (updateError) {
      throw updateError;
    }

    if (status && status !== currentOrder.status) {
      await supabaseAdmin.from("order_history").insert({
        order_id: id,
        action: "status_changed_by_admin",
        old_value: currentOrder.status,
        new_value: status,
        user_id: adminUser?.id || null,
        user_name: adminUser?.name || adminUser?.email || "Administrador",
        user_role: "admin",
        details: "Status alterado pelo painel administrativo",
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/ORDERS][PATCH] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
