import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const sort = searchParams.get('sort') || 'name';
    const activeOnly = searchParams.get('active') !== 'false';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API Distribuidor] Buscando produtos para distribuidor:', distribuidorId);

    // Verificar se o distribuidor existe
    const { data: distCheck, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome')
      .eq('id', distribuidorId)
      .single();

    console.log('[API Distribuidor] Distribuidor encontrado:', distCheck?.nome || 'NÃO ENCONTRADO', distError?.message || '');

    // Contar produtos antes da query
    const { count: countCheck } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);
    
    console.log('[API Distribuidor] Total de produtos com distribuidor_id =', distribuidorId, ':', countCheck);

    // Construir query - buscar produtos da tabela products onde distribuidor_id = id do distribuidor
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        original_price,
        stock_qty,
        images,
        image_url,
        active,
        track_stock,
        mercos_id,
        codigo_mercos,
        origem,
        sincronizado_em,
        created_at,
        category_id,
        categories(id, name)
      `)
      .eq('distribuidor_id', distribuidorId);

    // Filtrar por status ativo/inativo
    if (activeOnly) {
      query = query.eq('active', true);
    }

    // Busca por texto
    if (search) {
      query = query.or(`name.ilike.%${search}%,codigo_mercos.ilike.%${search}%`);
    }

    // Ordenação
    if (sort === 'vendas') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'stock') {
      query = query.order('stock_qty', { ascending: false });
    } else if (sort === 'recent') {
      query = query.order('sincronizado_em', { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
    }

    query = query.limit(limit);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('[API Distribuidor] Erro na query:', error);
      throw error;
    }

    console.log(`[API Distribuidor] Encontrados ${products?.length || 0} produtos`);

    // Formatar produtos para o frontend
    const formattedProducts = (products || []).map((product: any) => {
      // Determinar a imagem principal
      let imageUrl = product.image_url;
      if (!imageUrl && product.images && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0];
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price || 0,
        original_price: product.original_price,
        image_url: imageUrl,
        images: product.images || [],
        category: product.categories?.name || 'Sem categoria',
        category_id: product.category_id,
        active: product.active ?? true,
        stock_qty: product.stock_qty || 0,
        track_stock: product.track_stock ?? true,
        mercos_id: product.mercos_id,
        codigo_mercos: product.codigo_mercos,
        origem: product.origem,
        sincronizado_em: product.sincronizado_em,
        created_at: product.created_at,
      };
    });

    // Filtrar por categoria (após busca, pois categories é relacionamento)
    let finalProducts = formattedProducts;
    if (category) {
      finalProducts = formattedProducts.filter((p: any) => p.category === category);
    }

    return NextResponse.json({
      success: true,
      data: finalProducts,
      total: finalProducts.length,
      distribuidor_id: distribuidorId,
    });
  } catch (error: any) {
    console.error('[API Distribuidor] Erro ao buscar produtos:', error);
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
