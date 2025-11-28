import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    // Buscar pedidos do distribuidor (via produtos)
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
      // Buscar pedidos que contêm produtos deste distribuidor
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, total, created_at, items');

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

    // Buscar bancas que têm produtos deste distribuidor ativos
    const { data: bancasComProdutos } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('banca_id')
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', true);

    const uniqueBancas = new Set(bancasComProdutos?.map(b => b.banca_id) || []);

    return NextResponse.json({
      success: true,
      data: {
        totalProdutos: totalProdutos || 0,
        produtosAtivos: produtosAtivos || 0,
        totalPedidosHoje,
        totalPedidos,
        totalBancas: uniqueBancas.size,
        faturamentoMes,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar stats do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
