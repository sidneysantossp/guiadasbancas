import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[Stats] Buscando estatísticas para distribuidor:', distribuidorId);

    // Buscar total de produtos do distribuidor
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    // Buscar produtos ativos do distribuidor
    const { count: produtosAtivos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    // Buscar dados do distribuidor (para última sincronização, etc)
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('nome, ultima_sincronizacao, total_produtos')
      .eq('id', distribuidorId)
      .single();

    // Buscar IDs dos produtos do distribuidor para filtrar pedidos
    const { data: produtosDistribuidor } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('distribuidor_id', distribuidorId);

    const productIds = produtosDistribuidor?.map(p => p.id) || [];

    // Total de pedidos contendo produtos deste distribuidor
    let totalPedidos = 0;
    let totalPedidosHoje = 0;
    let faturamentoMes = 0;

    if (productIds.length > 0) {
      // Buscar pedidos recentes (últimos 30 dias para performance)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, total, created_at, items')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (orders) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        orders.forEach((order: any) => {
          const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
          const hasDistributorProduct = orderItems?.some((item: any) => 
            productIds.includes(item.id) || productIds.includes(item.product_id)
          );

          if (hasDistributorProduct) {
            totalPedidos++;
            
            const orderDate = new Date(order.created_at);
            if (orderDate >= today) {
              totalPedidosHoje++;
            }
            if (orderDate >= firstDayOfMonth) {
              faturamentoMes += Number(order.total) || 0;
            }
          }
        });
      }
    }

    // Contar TODAS as bancas ativas da plataforma (todas vendem produtos dos distribuidores)
    const { count: totalBancasAtivas } = await supabaseAdmin
      .from('bancas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    console.log(`[Stats] Distribuidor ${distribuidor?.nome}: ${produtosAtivos}/${totalProdutos} produtos, ${totalBancasAtivas} bancas ativas`);

    return NextResponse.json({
      success: true,
      data: {
        totalProdutos: totalProdutos || 0,
        produtosAtivos: produtosAtivos || 0,
        totalPedidosHoje,
        totalPedidos,
        totalBancas: totalBancasAtivas || 0,
        faturamentoMes,
        ultimaSincronizacao: distribuidor?.ultima_sincronizacao || null,
      },
    });
  } catch (error: any) {
    console.error('[Stats] Erro ao buscar stats do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
