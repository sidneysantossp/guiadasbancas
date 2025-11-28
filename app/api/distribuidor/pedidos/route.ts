import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

// GET - Buscar pedidos que contêm produtos do distribuidor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const distribuidorId = searchParams.get("id");
    const status = searchParams.get("status") || "";
    const q = (searchParams.get("q") || "").toLowerCase();
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const page = parseInt(searchParams.get("page") || "1");

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar IDs dos produtos do distribuidor
    const { data: produtosDistribuidor } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('distribuidor_id', distribuidorId);

    const productIds = (produtosDistribuidor || []).map(p => p.id);

    if (productIds.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        total: 0,
        page: 1,
        pages: 0,
      });
    }

    // Buscar todos os pedidos
    let query = supabaseAdmin
      .from('orders')
      .select('*, bancas:banca_id ( id, name, address, whatsapp )', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    // Buscar pedidos
    const { data: allOrders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('[Pedidos Distribuidor] Erro:', ordersError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar pedidos' },
        { status: 500 }
      );
    }

    // Filtrar pedidos que contêm produtos do distribuidor
    const pedidosDoDistribuidor = (allOrders || []).filter((order: any) => {
      const items = order.items || [];
      return items.some((item: OrderItem) => productIds.includes(item.product_id));
    }).map((order: any) => {
      // Filtrar apenas os itens do distribuidor
      const items = order.items || [];
      const itensDoDistribuidor = items.filter((item: OrderItem) => 
        productIds.includes(item.product_id)
      );
      
      // Calcular subtotal apenas dos itens do distribuidor
      const subtotalDistribuidor = itensDoDistribuidor.reduce(
        (acc: number, item: OrderItem) => acc + (item.total_price || 0), 
        0
      );

      return {
        ...order,
        banca_name: order.bancas?.name || 'Banca',
        banca_whatsapp: order.bancas?.whatsapp || '',
        items_distribuidor: itensDoDistribuidor,
        total_itens_distribuidor: itensDoDistribuidor.length,
        subtotal_distribuidor: subtotalDistribuidor,
        total_itens_pedido: items.length,
      };
    });

    // Aplicar busca textual
    let filtered = pedidosDoDistribuidor;
    if (q) {
      filtered = pedidosDoDistribuidor.filter((order: any) => {
        const searchFields = [
          order.id,
          order.customer_name,
          order.customer_phone,
          order.banca_name,
          ...(order.items_distribuidor || []).map((i: any) => i.product_name),
        ].join(' ').toLowerCase();
        return searchFields.includes(q);
      });
    }

    // Paginação
    const total = filtered.length;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    // Estatísticas
    const stats = {
      total_pedidos: filtered.length,
      pedidos_novos: filtered.filter((o: any) => o.status === 'novo').length,
      pedidos_confirmados: filtered.filter((o: any) => o.status === 'confirmado').length,
      pedidos_em_preparo: filtered.filter((o: any) => o.status === 'em_preparo').length,
      pedidos_entregues: filtered.filter((o: any) => o.status === 'entregue').length,
      valor_total: filtered.reduce((acc: number, o: any) => acc + (o.subtotal_distribuidor || 0), 0),
    };

    return NextResponse.json({
      success: true,
      items: paginatedItems,
      total,
      page,
      pages,
      stats,
    });
  } catch (error: any) {
    console.error('[Pedidos Distribuidor] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
