import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sort = searchParams.get('sort') || 'name';
    const activeOnly = searchParams.get('active') !== 'false';

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    // Construir query
    let query = supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .eq('distribuidor_id', distribuidorId);

    if (activeOnly) {
      query = query.eq('active', true);
    }

    // Ordenação
    if (sort === 'vendas') {
      query = query.order('created_at', { ascending: false }); // Por enquanto ordenar por data
    } else if (sort === 'price') {
      query = query.order('price', { ascending: true });
    } else {
      query = query.order('name', { ascending: true });
    }

    query = query.limit(limit);

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    // Formatar produtos
    const formattedProducts = (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      category: product.categories?.name || 'Sem categoria',
      active: product.active,
      stock_qty: product.stock_qty,
      track_stock: product.track_stock,
      vendas: product.vendas || 0, // Campo mock por enquanto
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
    });
  } catch (error: any) {
    console.error('Erro ao buscar produtos do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, distribuidorId, updates } = body;

    if (!productId || !distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'IDs obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o produto pertence ao distribuidor
    const { data: product, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('distribuidor_id', distribuidorId)
      .single();

    if (checkError || !product) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado ou não pertence a este distribuidor' },
        { status: 403 }
      );
    }

    // Atualizar produto
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
