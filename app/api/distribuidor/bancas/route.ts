import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar todas as bancas ativas do sistema
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

    // Buscar todas as bancas ATIVAS do sistema
    const { data: bancas, error: bancasError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp, cover_image, avatar, active, created_at, lat, lng')
      .eq('active', true)
      .order('name');

    if (bancasError) {
      console.error('[Bancas Distribuidor] Erro ao buscar bancas:', bancasError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar bancas' },
        { status: 500 }
      );
    }

    // Buscar IDs dos produtos do distribuidor para estatísticas
    const { data: produtosDistribuidor } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('distribuidor_id', distribuidorId);

    const productIds = (produtosDistribuidor || []).map(p => p.id);

    // Buscar bancas que têm produtos do distribuidor
    let bancasComProdutos: any[] = [];
    if (productIds.length > 0) {
      const { data } = await supabaseAdmin
        .from('banca_produtos_distribuidor')
        .select('banca_id, product_id, enabled, custom_price')
        .in('product_id', productIds);
      bancasComProdutos = data || [];
    }

    // Buscar pedidos para estatísticas
    const bancaIds = (bancas || []).map(b => b.id);
    let pedidos: any[] = [];
    if (bancaIds.length > 0) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('banca_id, items, status, created_at')
        .in('banca_id', bancaIds);
      pedidos = data || [];
    }

    // Combinar dados
    const bancasComStats = (bancas || []).map((banca: any) => {
      // Produtos do distribuidor nesta banca
      const produtosBanca = bancasComProdutos.filter(b => b.banca_id === banca.id);
      const produtosAtivos = produtosBanca.filter(p => p.enabled);
      
      // Pedidos desta banca
      const pedidosBanca = pedidos.filter(p => p.banca_id === banca.id);
      
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

      // Verificar se a banca tem produtos do distribuidor
      const temProdutosDistribuidor = produtosBanca.length > 0;

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
        // Estatísticas
        tem_produtos_distribuidor: temProdutosDistribuidor,
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

    // Ordenar: primeiro as que têm produtos do distribuidor, depois por nome
    filtered.sort((a: any, b: any) => {
      if (a.tem_produtos_distribuidor && !b.tem_produtos_distribuidor) return -1;
      if (!a.tem_produtos_distribuidor && b.tem_produtos_distribuidor) return 1;
      return a.name.localeCompare(b.name);
    });

    // Estatísticas gerais
    const stats = {
      total_bancas: filtered.length,
      bancas_com_produtos: filtered.filter((b: any) => b.tem_produtos_distribuidor).length,
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
