import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const id = context.params.id;
    const { data, error } = await supabaseAdmin
      .from("cotistas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [linkedById, linkedByCode, linkedByDocument] = await Promise.all([
      supabaseAdmin
        .from("bancas")
        .select("id, user_id, name, address, whatsapp, active, approved, created_at, cotista_id, cotista_codigo, cotista_cnpj_cpf")
        .eq("cotista_id", id),
      data.codigo
        ? supabaseAdmin
            .from("bancas")
            .select("id, user_id, name, address, whatsapp, active, approved, created_at, cotista_id, cotista_codigo, cotista_cnpj_cpf")
            .eq("cotista_codigo", data.codigo)
        : Promise.resolve({ data: [], error: null as any }),
      data.cnpj_cpf
        ? supabaseAdmin
            .from("bancas")
            .select("id, user_id, name, address, whatsapp, active, approved, created_at, cotista_id, cotista_codigo, cotista_cnpj_cpf")
            .eq("cotista_cnpj_cpf", data.cnpj_cpf)
        : Promise.resolve({ data: [], error: null as any }),
    ]);

    const bancaMap = new Map<string, any>();
    [...(linkedById.data || []), ...(linkedByCode.data || []), ...(linkedByDocument.data || [])].forEach((banca: any) => {
      bancaMap.set(banca.id, banca);
    });

    const linkedBancas = Array.from(bancaMap.values());
    const bancaIds = linkedBancas.map((banca: any) => banca.id);

    const [subscriptionsResponse, ordersResponse] = await Promise.all([
      bancaIds.length > 0
        ? supabaseAdmin
            .from("subscriptions")
            .select(
              `
                id,
                banca_id,
                status,
                created_at,
                plan:plans (
                  id,
                  name,
                  type,
                  price
                )
              `
            )
            .in("banca_id", bancaIds)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null as any }),
      bancaIds.length > 0
        ? supabaseAdmin
            .from("orders")
            .select("id, banca_id, total, status, created_at")
            .in("banca_id", bancaIds)
            .gte("created_at", thirtyDaysAgo.toISOString())
        : Promise.resolve({ data: [], error: null as any }),
    ]);

    const latestSubscriptionByBanca = new Map<string, any>();
    (subscriptionsResponse.data || []).forEach((subscription: any) => {
      if (!latestSubscriptionByBanca.has(subscription.banca_id)) {
        latestSubscriptionByBanca.set(subscription.banca_id, subscription);
      }
    });

    const revenue30d = (ordersResponse.data || []).reduce((sum: number, order: any) => sum + Number(order.total || 0), 0);
    const orders30d = (ordersResponse.data || []).length;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        metrics: {
          linked_bancas: linkedBancas.length,
          active_bancas: linkedBancas.filter((banca: any) => banca.active !== false).length,
          approved_bancas: linkedBancas.filter((banca: any) => banca.approved === true).length,
          paid_plans: linkedBancas.filter((banca: any) => {
            const subscription = latestSubscriptionByBanca.get(banca.id);
            const plan = Array.isArray(subscription?.plan) ? subscription.plan[0] : subscription?.plan;
            return ["start", "premium"].includes((plan?.type || "").toLowerCase());
          }).length,
          orders_30d: orders30d,
          revenue_30d: revenue30d,
        },
        linked_bancas: linkedBancas.map((banca: any) => {
          const subscription = latestSubscriptionByBanca.get(banca.id);
          const plan = Array.isArray(subscription?.plan) ? subscription.plan[0] : subscription?.plan;

          return {
            id: banca.id,
            user_id: banca.user_id,
            name: banca.name,
            address: banca.address,
            whatsapp: banca.whatsapp,
            active: banca.active !== false,
            approved: banca.approved === true,
            created_at: banca.created_at,
            plan_name: plan?.name || null,
            plan_type: plan?.type || null,
            subscription_status: subscription?.status || null,
          };
        }),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const id = context.params.id;
    const body = await request.json();

    const updateData: any = {};
    const fields = [
      "codigo",
      "razao_social",
      "cnpj_cpf",
      "telefone",
      "telefone_2",
      "endereco_principal",
      "cidade",
      "estado",
      "ativo",
    ];
    for (const f of fields) {
      if (f in body) updateData[f] = body[f];
    }

    const { data, error } = await supabaseAdmin
      .from("cotistas")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const id = context.params.id;
    const { error } = await supabaseAdmin
      .from("cotistas")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}
