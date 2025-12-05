import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '10000');
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

    // Buscar produtos em lotes para evitar limite do Supabase (1000 por query)
    const BATCH_SIZE = 1000;
    let allProducts: any[] = [];
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      let query = supabaseAdmin
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          stock_qty,
          images,
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

      // Paginação
      query = query.range(offset, offset + BATCH_SIZE - 1);

      const { data: batch, error } = await query;

      if (error) {
        console.error('[API Distribuidor] Erro na query:', error);
        throw error;
      }

      if (batch && batch.length > 0) {
        allProducts.push(...batch);
        console.log(`[API Distribuidor] Lote ${Math.floor(offset / BATCH_SIZE) + 1}: ${batch.length} produtos (total: ${allProducts.length})`);
        
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        } else {
          offset += BATCH_SIZE;
        }
      } else {
        hasMore = false;
      }

      // Limite de segurança para evitar loop infinito
      if (allProducts.length >= limit) {
        hasMore = false;
      }
    }

    const products = allProducts;
    console.log(`[API Distribuidor] Total final: ${products.length} produtos`);

    // Formatar produtos para o frontend
    const formattedProducts = (products || []).map((product: any) => {
      // Determinar a imagem principal
      let imageUrl = null;
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0];
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price || 0,
        image_url: imageUrl,
        images: product.images || [],
        category: product.categories?.name || 'Sem Categoria',
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
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
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
