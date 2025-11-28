import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar bancas que compram produtos do distribuidor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const distribuidorId = searchParams.get("id");
    const status = searchParams.get("status") || "";
    const q = (searchParams.get("q") || "").toLowerCase();

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
        stats: {
          total_bancas: 0,
          bancas_ativas: 0,
          total_pedidos: 0,
          valor_total: 0,
        }
      });
    }

    // Buscar bancas que têm produtos do distribuidor
    const { data: bancasComProdutos } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('banca_id, product_id, enabled, custom_price')
      .in('product_id', productIds);

    // IDs únicos de bancas
    const bancaIds = Array.from(new Set((bancasComProdutos || []).map(b => b.banca_id)));

    if (bancaIds.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        stats: {
          total_bancas: 0,
          bancas_ativas: 0,
          total_pedidos: 0,
          valor_total: 0,
        }
      });
    }

    // Buscar dados das bancas
    const { data: bancas } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp, cover_image, avatar, active, created_at')
      .in('id', bancaIds);

    // Buscar pedidos para estatísticas
    const { data: pedidos } = await supabaseAdmin
      .from('orders')
      .select('banca_id, items, status, created_at')
      .in('banca_id', bancaIds);

    // Combinar dados
    const bancasComStats = (bancas || []).map((banca: any) => {
      // Produtos do distribuidor nesta banca
      const produtosBanca = (bancasComProdutos || []).filter(b => b.banca_id === banca.id);
      const produtosAtivos = produtosBanca.filter(p => p.enabled);
      
      // Pedidos desta banca
      const pedidosBanca = (pedidos || []).filter(p => p.banca_id === banca.id);
      
      // Calcular valor dos pedidos com produtos do distribuidor
      let valorTotalPedidos = 0;
      pedidosBanca.forEach((pedido: any) => {
        const items = pedido.items || [];
        const itensDistribuidor = items.filter((item: any) => productIds.includes(item.product_id));
        valorTotalPedidos += itensDistribuidor.reduce((acc: number, item: any) => acc + (item.total_price || 0), 0);
      });

      // Status do pedido mais recente
      const ultimoPedido = pedidosBanca.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      return {
        id: banca.id,
        name: banca.name,
        address: banca.address,
        whatsapp: banca.whatsapp,
        cover_image: banca.cover_image,
        avatar: banca.avatar,
        active: banca.active,
        created_at: banca.created_at,
        // Estatísticas
        produtos_distribuidor: produtosBanca.length,
        produtos_ativos: produtosAtivos.length,
        total_pedidos: pedidosBanca.length,
        pedidos_pendentes: pedidosBanca.filter((p: any) => ['novo', 'confirmado'].includes(p.status)).length,
        valor_total: valorTotalPedidos,
        ultimo_pedido_status: ultimoPedido?.status || null,
        ultimo_pedido_data: ultimoPedido?.created_at || null,
      };
    });

    // Aplicar filtros
    let filtered = bancasComStats;
    if (q) {
      filtered = bancasComStats.filter((banca: any) => {
        const searchFields = [
          banca.name,
          banca.address,
          banca.whatsapp,
        ].join(' ').toLowerCase();
        return searchFields.includes(q);
      });
    }

    if (status) {
      if (status === 'ativas') {
        filtered = filtered.filter((b: any) => b.active);
      } else if (status === 'inativas') {
        filtered = filtered.filter((b: any) => !b.active);
      } else if (status === 'com_pedidos') {
        filtered = filtered.filter((b: any) => b.total_pedidos > 0);
      } else if (status === 'sem_pedidos') {
        filtered = filtered.filter((b: any) => b.total_pedidos === 0);
      }
    }

    // Ordenar por valor total (decrescente)
    filtered.sort((a: any, b: any) => b.valor_total - a.valor_total);

    // Estatísticas gerais
    const stats = {
      total_bancas: filtered.length,
      bancas_ativas: filtered.filter((b: any) => b.active).length,
      total_pedidos: filtered.reduce((acc: number, b: any) => acc + b.total_pedidos, 0),
      valor_total: filtered.reduce((acc: number, b: any) => acc + b.valor_total, 0),
    };

    return NextResponse.json({
      success: true,
      items: filtered,
      stats,
    });
  } catch (error: any) {
    console.error('[Bancas Distribuidor] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
