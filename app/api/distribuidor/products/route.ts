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
    const productId = searchParams.get('productId');

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

    // Carregar mapa de categorias do distribuidor (category_id pode apontar para distribuidor_categories ou categories)
    const [{ data: distCats }, { data: bancaCats }] = await Promise.all([
      supabaseAdmin.from('distribuidor_categories').select('id, nome').eq('distribuidor_id', distribuidorId),
      supabaseAdmin.from('categories').select('id, name'),
    ]);
    const categoryNameMap = new Map<string, string>();
    for (const c of distCats || []) categoryNameMap.set(c.id, c.nome);
    for (const c of bancaCats || []) categoryNameMap.set(c.id, c.name);

    // Buscar produtos em lotes para evitar limite do Supabase (1000 por query)
    const BATCH_SIZE = 1000;
    let allProducts: any[] = [];
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      let query = supabaseAdmin
        .from('products')
        .select('*')
        .eq('distribuidor_id', distribuidorId);

      if (productId) {
        query = query.eq('id', productId).limit(1);
      }

      // Filtrar por status ativo/inativo
      if (activeOnly) {
        query = query.eq('active', true);
      }

      // Busca por texto (com suporte a acentos)
      if (search) {
        // Mapa de substituições comuns em português
        const accentMap: Record<string, string> = {
          'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú', 'c': 'ç',
          'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a',
          'é': 'e', 'è': 'e', 'ê': 'e',
          'í': 'i', 'ì': 'i', 'î': 'i',
          'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o',
          'ú': 'u', 'ù': 'u', 'û': 'u',
          'ç': 'c',
        };
        
        // Gerar variantes: original, sem acentos, e com acento agudo na primeira vogal
        const variantes = new Set<string>();
        variantes.add(search);
        
        // Versão sem acentos
        const semAcento = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        variantes.add(semAcento);
        
        // Versão com acento agudo na primeira vogal (caso comum: agua -> água)
        const vogais = ['a', 'e', 'i', 'o', 'u'];
        const acentosAgudos: Record<string, string> = { 'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú' };
        
        for (const vogal of vogais) {
          const idx = semAcento.toLowerCase().indexOf(vogal);
          if (idx !== -1) {
            const comAcento = semAcento.substring(0, idx) + acentosAgudos[vogal] + semAcento.substring(idx + 1);
            variantes.add(comAcento);
            break; // Apenas primeira vogal
          }
        }
        
        // Criar condições OR para cada variante
        const conditions = [...variantes]
          .filter(v => v.length >= 2)
          .slice(0, 3) // Limitar a 3 variantes
          .map(s => `name.ilike.%${s}%,codigo_mercos.ilike.%${s}%`)
          .join(',');
        
        query = query.or(conditions);
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

    // Buscar regras de markup do distribuidor
    const [{ data: distConfig }, { data: markupCategorias }, { data: markupProdutos }] = await Promise.all([
      supabaseAdmin
        .from('distribuidores')
        .select('id, markup_global_percentual, markup_global_fixo, margem_divisor, tipo_calculo')
        .eq('id', distribuidorId)
        .single(),
      supabaseAdmin
        .from('distribuidor_markup_categorias')
        .select('category_id, markup_percentual, markup_fixo')
        .eq('distribuidor_id', distribuidorId),
      products.length
        ? supabaseAdmin
            .from('distribuidor_markup_produtos')
            .select('product_id, markup_percentual, markup_fixo')
            .in('product_id', products.map((p: any) => p.id))
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const markupCatMap = new Map<string, { percentual: number; fixo: number }>();
    (markupCategorias || []).forEach((mc: any) => {
      markupCatMap.set(mc.category_id, {
        percentual: mc.markup_percentual || 0,
        fixo: mc.markup_fixo || 0,
      });
    });

    const markupProdMap = new Map<string, { percentual: number; fixo: number }>();
    (markupProdutos || []).forEach((mp: any) => {
      markupProdMap.set(mp.product_id, {
        percentual: mp.markup_percentual || 0,
        fixo: mp.markup_fixo || 0,
      });
    });

    const calcularPrecoComMarkup = (precoBase: number, produtoId: string, categoryId?: string | null) => {
      // Prioridade: Produto > Categoria > Global
      const markupProd = markupProdMap.get(produtoId);
      if (markupProd && (markupProd.percentual > 0 || markupProd.fixo > 0)) {
        return precoBase * (1 + markupProd.percentual / 100) + markupProd.fixo;
      }

      if (categoryId) {
        const markupCat = markupCatMap.get(categoryId);
        if (markupCat && (markupCat.percentual > 0 || markupCat.fixo > 0)) {
          return precoBase * (1 + markupCat.percentual / 100) + markupCat.fixo;
        }
      }

      if (distConfig) {
        const tipoCalculo = distConfig.tipo_calculo || 'markup';
        if (tipoCalculo === 'margem') {
          const divisor = distConfig.margem_divisor || 1;
          if (divisor > 0 && divisor < 1) {
            return precoBase / divisor;
          }
        }
        const globalPerc = distConfig.markup_global_percentual || 0;
        const globalFixo = distConfig.markup_global_fixo || 0;
        if (globalPerc > 0 || globalFixo > 0) {
          return precoBase * (1 + globalPerc / 100) + globalFixo;
        }
      }

      return precoBase;
    };

    // Formatar produtos para o frontend
    const formattedProducts = (products || []).map((product: any) => {
      // Determinar a imagem principal
      let imageUrl = null;
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        imageUrl = product.images[0];
      }

      const precoBase = product.price || 0;
      const precoComMarkup = calcularPrecoComMarkup(precoBase, product.id, product.category_id);
      const hasProductMarkup = markupProdMap.has(product.id);

      // Resolver nome da categoria via mapa (sem FK join)
      const categoryName = product.category_id ? (categoryNameMap.get(product.category_id) || 'Sem Categoria') : 'Sem Categoria';

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: precoBase,
        base_price: precoBase,
        distribuidor_price: precoComMarkup,
        has_product_markup: hasProductMarkup,
        custom_price: product.custom_price ?? null,
        custom_description: product.custom_description ?? '',
        custom_status: product.custom_status || 'disponivel',
        custom_pronta_entrega: product.custom_pronta_entrega ?? product.pronta_entrega ?? false,
        custom_sob_encomenda: product.custom_sob_encomenda ?? product.sob_encomenda ?? false,
        custom_pre_venda: product.custom_pre_venda ?? product.pre_venda ?? false,
        custom_stock_enabled: product.custom_stock_enabled ?? false,
        custom_stock_qty: product.custom_stock_qty ?? null,
        custom_featured: product.custom_featured ?? false,
        image_url: imageUrl,
        images: product.images || [],
        category: categoryName,
        category_id: product.category_id,
        active: product.active ?? true,
        stock_qty: product.stock_qty || 0,
        track_stock: product.track_stock ?? true,
        mercos_id: product.mercos_id,
        codigo_mercos: product.codigo_mercos,
        origem: product.origem,
        pronta_entrega: product.pronta_entrega ?? false,
        sob_encomenda: product.sob_encomenda ?? false,
        pre_venda: product.pre_venda ?? false,
        sincronizado_em: product.sincronizado_em,
        created_at: product.created_at,
      };
    });

    // Filtrar por categoria (após busca, pois categories é relacionamento)
    let finalProducts = formattedProducts;
    if (category) {
      finalProducts = formattedProducts.filter((p: any) => p.category === category);
    }

    if (productId) {
      const single = finalProducts[0];
      if (!single) {
        return NextResponse.json(
          { success: false, error: 'Produto não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: [single],
        product: single,
        distribuidor_id: distribuidorId,
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
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
    const hasCustomPriceKey = !!updates && Object.prototype.hasOwnProperty.call(updates, 'custom_price');
    const customPrice = updates?.custom_price;

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

    const updatesForProduct: Record<string, any> = { ...(updates || {}) };
    delete updatesForProduct.custom_price;

    // Auto-desativar produto quando estoque chega a zero
    if (
      Object.prototype.hasOwnProperty.call(updatesForProduct, 'stock_qty') &&
      Number(updatesForProduct.stock_qty) === 0
    ) {
      updatesForProduct.active = false;
    }

    const updateKeys = Object.keys(updatesForProduct);
    let updatedProductRow: any = null;

    if (updateKeys.length > 0) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('products')
        .update(updatesForProduct)
        .eq('id', productId)
        .eq('distribuidor_id', distribuidorId)
        .select('*')
        .single();

      if (updateError) {
        throw updateError;
      }

      updatedProductRow = updated;
    }

    if (hasCustomPriceKey) {
      if (typeof customPrice === 'number') {
        const { data: produtoBase, error: loadError } = await supabaseAdmin
          .from('products')
          .select('price')
          .eq('id', productId)
          .single();

        if (loadError) {
          throw loadError;
        }

        const precoBase = Number(produtoBase?.price) || 0;
        const markupPercentual = precoBase > 0 ? ((customPrice - precoBase) / precoBase) * 100 : 0;

        const { error: markupError } = await supabaseAdmin
          .from('distribuidor_markup_produtos')
          .upsert(
            {
              distribuidor_id: distribuidorId,
              product_id: productId,
              markup_percentual: markupPercentual,
              markup_fixo: 0,
            },
            {
              onConflict: 'distribuidor_id,product_id',
            }
          );

        if (markupError) {
          throw markupError;
        }
      } else {
        await supabaseAdmin
          .from('distribuidor_markup_produtos')
          .delete()
          .eq('distribuidor_id', distribuidorId)
          .eq('product_id', productId);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        productId,
        distribuidorId,
        updated: updatedProductRow,
        markup_updated: hasCustomPriceKey && typeof customPrice === 'number',
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
