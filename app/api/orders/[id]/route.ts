import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  canActorAccessOrder,
  formatOrderRecord,
  readOrderActor,
  resolveOrderActorBancaId,
  resolveOrderActorCustomerEmail,
} from "@/lib/modules/orders/service";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();
    const actor = readOrderActor(session);
    const { searchParams } = new URL(req.url);
    const scope = (searchParams.get("scope") || "").toLowerCase();

    if (!actor) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const requestedCustomerScope = scope === "customer";
    const effectiveActor = requestedCustomerScope
      ? { ...actor, role: "cliente" as const }
      : actor;
    const effectiveCustomerEmail = requestedCustomerScope
      ? await resolveOrderActorCustomerEmail(effectiveActor)
      : null;
    if (requestedCustomerScope) {
      effectiveActor.email = effectiveCustomerEmail;
    }

    console.log('[API/ORDERS/[ID]/GET] Buscando pedido:', id);
    
    // Buscar pedido do Supabase com JOIN da banca
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        bancas:banca_id (
          id,
          name,
          address,
          whatsapp
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('[API/ORDERS/[ID]/GET] Erro Supabase:', error);
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const actorBancaId = await resolveOrderActorBancaId(effectiveActor);
    if (!canActorAccessOrder({ actor: effectiveActor, order, actorBancaId })) {
      return NextResponse.json(
        { ok: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const formattedOrder = formatOrderRecord(order);

    console.log('[API/ORDERS/[ID]/GET] Pedido encontrado:', formattedOrder.order_number);

    return NextResponse.json(
      { ok: true, data: formattedOrder },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e: any) {
    console.error('[API/ORDERS/[ID]/GET] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao buscar pedido" }, 
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();
    const actor = readOrderActor(session);

    if (!actor) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    console.log('[API/ORDERS/[ID]/DELETE] Excluindo pedido:', id);
    
    // Verificar se o pedido existe
    const { data: existingOrder, error: checkError } = await supabaseAdmin
      .from('orders')
      .select('id, customer_email, banca_id')
      .eq('id', id)
      .single();
    
    if (checkError || !existingOrder) {
      console.error('[API/ORDERS/[ID]/DELETE] Pedido não encontrado');
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" }, 
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const actorBancaId = await resolveOrderActorBancaId(actor);
    const canDelete =
      actor.role === "admin" ||
      (actor.role === "jornaleiro" && canActorAccessOrder({ actor, order: existingOrder, actorBancaId }));

    if (!canDelete) {
      return NextResponse.json(
        { ok: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    // Excluir histórico do pedido primeiro (se existir)
    await supabaseAdmin
      .from('order_history')
      .delete()
      .eq('order_id', id);
    
    // Excluir o pedido
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('[API/ORDERS/[ID]/DELETE] Erro ao excluir:', deleteError);
      return NextResponse.json(
        { ok: false, error: "Erro ao excluir pedido" }, 
        { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    console.log('[API/ORDERS/[ID]/DELETE] Pedido excluído com sucesso');
    
    return NextResponse.json(
      {
        ok: true,
        message: "Pedido excluído com sucesso",
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e: any) {
    console.error('[API/ORDERS/[ID]/DELETE] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao excluir pedido" }, 
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
