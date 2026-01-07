import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const debug = searchParams.get('debug') === 'true';

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[Stats] Buscando estatísticas para distribuidor:', distribuidorId);

    // Usar COUNT direto para evitar limite de 1000 registros do Supabase
    const [
      { count: totalProdutos },
      { count: produtosAtivos },
      { count: produtosInativos },
    ] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', distribuidorId),
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', distribuidorId)
        .eq('active', true),
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', distribuidorId)
        .eq('active', false),
    ]);

    const produtosNull = (totalProdutos || 0) - (produtosAtivos || 0) - (produtosInativos || 0);

    // Log detalhado para debug
    console.log('[Stats] Contagens (COUNT):', {
      distribuidorId,
      totalProdutos,
      produtosAtivos,
      produtosInativos,
      produtosNull,
    });

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

    // Contar apenas bancas COTISTAS ativas (que realmente vendem produtos de distribuidores)
    const { count: totalBancasCotistas } = await supabaseAdmin
      .from('bancas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .or('is_cotista.eq.true,cotista_id.not.is.null');

    console.log(`[Stats] Distribuidor ${distribuidor?.nome}: ${produtosAtivos}/${totalProdutos} produtos, ${totalBancasCotistas} bancas ativas`);

    // Se houver inconsistência (ativos > total), usar a soma real como total
    const totalReal = (produtosAtivos || 0) + (produtosInativos || 0) + (produtosNull || 0);
    const totalFinal = totalReal > (totalProdutos || 0) ? totalReal : (totalProdutos || 0);

    // Se debug=true, retornar dados detalhados
    if (debug) {
      return NextResponse.json({
        success: true,
        debug: true,
        contagens: {
          totalProdutos: totalProdutos || 0,
          produtosAtivos: produtosAtivos || 0,
          produtosInativos: produtosInativos || 0,
          produtosNull: produtosNull || 0,
          soma: totalReal,
          totalFinal,
          inconsistente: (produtosAtivos || 0) > (totalProdutos || 0),
        },
        distribuidor: {
          nome: distribuidor?.nome,
          total_produtos_campo: distribuidor?.total_produtos,
        },
        data: {
          totalProdutos: totalFinal,
          produtosAtivos: produtosAtivos || 0,
          totalPedidosHoje,
          totalPedidos,
          totalBancas: totalBancasCotistas || 0,
          faturamentoMes,
          ultimaSincronizacao: distribuidor?.ultima_sincronizacao || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProdutos: totalFinal,
        produtosAtivos: produtosAtivos || 0,
        totalPedidosHoje,
        totalPedidos,
        totalBancas: totalBancasCotistas || 0,
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
