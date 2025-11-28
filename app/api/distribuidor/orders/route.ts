import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '50');

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

    const productIds = produtosDistribuidor?.map(p => p.id) || [];

    if (productIds.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    // Buscar todos os pedidos
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, bancas(name)')
      .order('created_at', { ascending: false })
      .limit(limit * 2); // Buscar mais para filtrar

    if (error) {
      throw error;
    }

    // Filtrar pedidos que contêm produtos deste distribuidor
    const filteredOrders = (orders || []).filter((order: any) => {
      const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      return orderItems?.some((item: any) => 
        productIds.includes(item.id) || productIds.includes(item.product_id)
      );
    }).slice(0, limit);

    // Formatar pedidos
    const formattedOrders = filteredOrders.map((order: any) => ({
      id: order.id,
      banca_id: order.banca_id,
      banca_name: order.bancas?.name || 'Banca',
      customer: order.customer_name || order.customer,
      total: order.total,
      status: order.status,
      created_at: formatDate(order.created_at),
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    }));

    return NextResponse.json({
      success: true,
      items: formattedOrders,
    });
  } catch (error: any) {
    console.error('Erro ao buscar pedidos do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR');
}
