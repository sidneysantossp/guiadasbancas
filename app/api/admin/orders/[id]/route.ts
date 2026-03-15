import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

type OrderRecord = {
  id: string;
  user_id: string | null;
  banca_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;
  items: any[] | null;
  subtotal: number | null;
  shipping_fee: number | null;
  total: number | null;
  status: string | null;
  payment_method: string | null;
  notes: string | null;
  estimated_delivery: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, user_id, banca_id, customer_name, customer_phone, customer_email, customer_address, items, subtotal, shipping_fee, total, status, payment_method, notes, estimated_delivery, created_at, updated_at"
      )
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ success: false, error: "Pedido não encontrado" }, { status: 404 });
    }

    const [bancaResponse, userResponse, historyResponse] = await Promise.all([
      order.banca_id
        ? supabaseAdmin
            .from("bancas")
            .select("id, user_id, name, address, whatsapp, active, approved")
            .eq("id", order.banca_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      order.user_id
        ? supabaseAdmin
            .from("user_profiles")
            .select("id, full_name, email, role, phone, blocked")
            .eq("id", order.user_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      supabaseAdmin
        .from("order_history")
        .select("id, action, old_value, new_value, user_id, user_name, user_role, details, created_at")
        .eq("order_id", id)
        .order("created_at", { ascending: false }),
    ]);

    if (bancaResponse.error) throw bancaResponse.error;
    if (userResponse.error) throw userResponse.error;
    if (historyResponse.error) throw historyResponse.error;

    return NextResponse.json({
      success: true,
      data: {
        ...(order as OrderRecord),
        banca: bancaResponse.data
          ? {
              id: bancaResponse.data.id,
              user_id: bancaResponse.data.user_id,
              name: bancaResponse.data.name,
              address: bancaResponse.data.address,
              whatsapp: bancaResponse.data.whatsapp,
              active: bancaResponse.data.active !== false,
              approved: bancaResponse.data.approved === true,
            }
          : null,
        customer: userResponse.data
          ? {
              id: userResponse.data.id,
              full_name: userResponse.data.full_name,
              email: userResponse.data.email,
              role: userResponse.data.role,
              phone: userResponse.data.phone,
              blocked: userResponse.data.blocked === true,
            }
          : null,
        history: historyResponse.data || [],
      },
    });
  } catch (error: any) {
    console.error("[API/ADMIN/ORDERS/:id] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar pedido" },
      { status: 500 }
    );
  }
}
