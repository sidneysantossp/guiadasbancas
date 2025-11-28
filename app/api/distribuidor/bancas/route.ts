import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar bancas que possuem produtos do distribuidor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const distribuidorId = searchParams.get("id");
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
          bancas_cotistas: 0,
          total_pedidos: 0,
          valor_total: 0,
        }
      });
    }

    // Buscar bancas cotistas (têm acesso ao catálogo)
    const { data: bancasCotistas } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp, cover_image, avatar, active, created_at, lat, lng, is_cotista, cotista_id')
      .eq('is_cotista', true)
      .not('cotista_id', 'is', null);

    // Buscar bancas que têm customizações de produtos do distribuidor
    const { data: bancasComCustomizacoes } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('banca_id, product_id, enabled, custom_price')
      .in('product_id', productIds);

    // Buscar pedidos com produtos do distribuidor
    const { data: pedidos } = await supabaseAdmin
      .from('orders')
      .select('banca_id, items, status, created_at');

    // Identificar bancas com pedidos contendo produtos do distribuidor
    const bancasComPedidos = new Set<string>();
    const pedidosPorBanca: Record<string, any[]> = {};
    
    (pedidos || []).forEach((pedido: any) => {
      const items = pedido.items || [];
      const itensDistribuidor = items.filter((item: any) => productIds.includes(item.product_id));
      if (itensDistribuidor.length > 0) {
        bancasComPedidos.add(pedido.banca_id);
        if (!pedidosPorBanca[pedido.banca_id]) {
          pedidosPorBanca[pedido.banca_id] = [];
        }
        pedidosPorBanca[pedido.banca_id].push(pedido);
      }
    });

    // Coletar IDs únicos de bancas relacionadas
    const bancaIdsRelacionadas = new Set<string>();
    
    // Adicionar cotistas
    (bancasCotistas || []).forEach(b => bancaIdsRelacionadas.add(b.id));
    
    // Adicionar bancas com customizações
    (bancasComCustomizacoes || []).forEach(b => bancaIdsRelacionadas.add(b.banca_id));
    
    // Adicionar bancas com pedidos
    bancasComPedidos.forEach(id => bancaIdsRelacionadas.add(id));

    if (bancaIdsRelacionadas.size === 0) {
      return NextResponse.json({
        success: true,
        items: [],
        stats: {
          total_bancas: 0,
          bancas_cotistas: 0,
          total_pedidos: 0,
          valor_total: 0,
        }
      });
    }

    // Buscar dados completos das bancas relacionadas
    const { data: bancas } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp, cover_image, avatar, active, created_at, lat, lng, is_cotista, cotista_id')
      .in('id', Array.from(bancaIdsRelacionadas))
      .order('name');

    // Combinar dados
    const bancasComStats = (bancas || []).map((banca: any) => {
      // Produtos do distribuidor customizados nesta banca
      const produtosBanca = (bancasComCustomizacoes || []).filter(b => b.banca_id === banca.id);
      const produtosAtivos = produtosBanca.filter(p => p.enabled);
      
      // Pedidos desta banca com produtos do distribuidor
      const pedidosBanca = pedidosPorBanca[banca.id] || [];
      
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

      const isCotista = banca.is_cotista === true && !!banca.cotista_id;

      return {
        id: banca.id,
        name: banca.name,
        address: banca.address,
        whatsapp: banca.whatsapp,
        cover_image: banca.cover_image,
        avatar: banca.avatar,
        active: banca.active,
        created_at: banca.created_at,
        lat: banca.lat,
        lng: banca.lng,
        is_cotista: isCotista,
        // Estatísticas
        tem_produtos_distribuidor: true, // Todas as bancas retornadas têm relação
        produtos_distribuidor: produtosBanca.length,
        produtos_ativos: produtosAtivos.length,
        total_pedidos: pedidosBanca.length,
        pedidos_pendentes: pedidosBanca.filter((p: any) => ['novo', 'confirmado'].includes(p.status)).length,
        valor_total: valorTotalPedidos,
        ultimo_pedido_status: ultimoPedido?.status || null,
        ultimo_pedido_data: ultimoPedido?.created_at || null,
      };
    });

    // Aplicar busca textual
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

    // Ordenar: cotistas primeiro, depois por valor total, depois por nome
    filtered.sort((a: any, b: any) => {
      if (a.is_cotista && !b.is_cotista) return -1;
      if (!a.is_cotista && b.is_cotista) return 1;
      if (b.valor_total !== a.valor_total) return b.valor_total - a.valor_total;
      return a.name.localeCompare(b.name);
    });

    // Estatísticas gerais
    const stats = {
      total_bancas: filtered.length,
      bancas_cotistas: filtered.filter((b: any) => b.is_cotista).length,
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
