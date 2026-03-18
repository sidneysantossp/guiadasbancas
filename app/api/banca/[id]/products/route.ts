import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";

// Sem cache para garantir dados atualizados
export const revalidate = 0;
export const dynamic = 'force-dynamic';

const CATEGORIA_DISTRIBUIDORES_NOME = 'Diversos';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';

// Select OTIMIZADO - apenas campos necessários para exibição
const PRODUCT_FIELDS_MINIMAL = `
  id,
  name,
  price,
  price_original,
  discount_percent,
  images,
  stock_qty,
  category_id,
  distribuidor_id,
  pronta_entrega,
  sob_encomenda,
  pre_venda,
  codigo_mercos
`;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get('limit') || '10000'); // Limite alto para buscar todos os produtos
    const fastMode = searchParams.get('fast') === 'true'; // Modo rápido sem markup/customizações

    // 1. Buscar dados da banca (para saber se é cotista)
    const { data: banca, error: bancaError } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id, active')
      .eq('id', bancaId)
      .single();

    if (bancaError || !banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const isCotista = (banca?.is_cotista === true || !!banca?.cotista_id);

    // 2. Buscar produtos sem OR em string para evitar inconsistências entre ambientes
    const fetchProducts = async (
      kind: 'own' | 'distributor',
      limit: number
    ): Promise<{ rows: any[]; count: number }> => {
      const baseQuery = () => {
        let q = supabase
          .from('products')
          .select(PRODUCT_FIELDS_MINIMAL, { count: 'estimated' })
          .eq('active', true);

        if (kind === 'own') {
          q = q.eq('banca_id', bancaId);
        } else {
          q = q.not('distribuidor_id', 'is', null);
        }
        return q;
      };

      if (limit <= 1000) {
        const { data, count, error } = await baseQuery()
          .order('name', { ascending: true })
          .limit(limit);
        if (error) throw error;
        return { rows: data || [], count: count || (data || []).length };
      }

      const BATCH_SIZE = 1000;
      const rows: any[] = [];
      let total = 0;
      let offset = 0;
      let hasMore = true;

      while (hasMore && rows.length < limit) {
        const batchLimit = Math.min(BATCH_SIZE, limit - rows.length);
        const { data: batch, count, error } = await baseQuery()
          .order('name', { ascending: true })
          .range(offset, offset + batchLimit - 1);

        if (error) throw error;
        if (count && total === 0) total = count;

        const list = batch || [];
        rows.push(...list);
        offset += list.length;
        hasMore = list.length === batchLimit;
      }

      return { rows, count: total || rows.length };
    };

    // Regra pública atual: toda banca ativa exibe produtos próprios + produtos de distribuidores
    // (o frontend controla visibilidade final por status/customização)
    const [ownProductsResult, distributorProductsResult] = await Promise.all([
      fetchProducts('own', requestedLimit),
      fetchProducts('distributor', requestedLimit),
    ]);

    const dedupMap = new Map<string, any>();
    for (const p of ownProductsResult.rows) dedupMap.set(p.id, p);
    for (const p of distributorProductsResult.rows) {
      if (!dedupMap.has(p.id)) dedupMap.set(p.id, p);
    }

    const produtosCombinados = Array.from(dedupMap.values())
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'))
      .slice(0, requestedLimit);

    // 3. Produtos combinados para processamento de markup/customização
    let produtos: any[] = [];
    let totalCount = 0;
    produtos = produtosCombinados;
    totalCount = (ownProductsResult.count || 0) + (distributorProductsResult.count || 0);

    // 4. Modo rápido: retornar produtos sem processamento adicional
    if (fastMode) {
      const fastProducts = produtos.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images?.slice(0, 1) || [],
        stock_qty: p.stock_qty,
        category_name: p.category_id || CATEGORIA_DISTRIBUIDORES_NOME,
        pronta_entrega: p.pronta_entrega ?? false,
        sob_encomenda: p.sob_encomenda ?? false,
        pre_venda: p.pre_venda ?? false,
        status: 'available',
        is_distribuidor: !!p.distribuidor_id,
        codigo_mercos: p.codigo_mercos,
      }));

      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        total: totalCount || produtos.length,
        limit: requestedLimit,
        products: fastProducts,
        fast_mode: true,
      });
    }

    // 5. Modo completo: buscar customizações e markup
    const produtosCarregados = produtos || [];

    // Coletar category_ids dos produtos de distribuidores para buscar nomes
    const distribuidorCategoryIds = [...new Set(
      produtosCarregados
        .filter(p => p.distribuidor_id && p.category_id)
        .map(p => p.category_id)
    )];
    const bancaCategoryIds = [...new Set(
      produtosCarregados
        .filter(p => !p.distribuidor_id && p.category_id)
        .map(p => p.category_id)
    )];

    // Buscar markups por distribuidor (não por product_id para evitar limite de query)
    const [{ customMap, calculateDistributorPrice }, distribuidorCategoriesResult, bancaCategoriesResult] = await Promise.all([
      loadDistributorPricingContext<{
        product_id: string;
        enabled?: boolean | null;
        custom_price?: number | null;
        custom_description?: string | null;
        custom_status?: string | null;
        custom_pronta_entrega?: boolean | null;
        custom_sob_encomenda?: boolean | null;
        custom_pre_venda?: boolean | null;
        custom_stock_enabled?: boolean | null;
        custom_stock_qty?: number | null;
      }>({
        products: produtosCarregados,
        customFields: 'product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty',
        customBancaId: bancaId,
        includeAllBancaCustomizationsWhenLarge: true,
      }),
      // Categorias de distribuidores (para produtos de distribuidores)
      distribuidorCategoryIds.length > 0 ? supabase.from('distribuidor_categories').select('id, nome').in('id', distribuidorCategoryIds) : { data: [] },
      // Categorias padrão da plataforma (para produtos próprios da banca)
      bancaCategoryIds.length > 0 ? supabase.from('categories').select('id, name').in('id', bancaCategoryIds) : { data: [] },
    ]);

    // Mapa de categorias de distribuidores (id -> nome)
    const distribuidorCategoryMap = new Map((distribuidorCategoriesResult.data || []).map((c: any) => [c.id, c.nome]));
    // Mapa de categorias padrão da plataforma (id -> nome)
    const bancaCategoryMap = new Map((bancaCategoriesResult.data || []).map((c: any) => [c.id, c.name]));

    // 4. Processar e Mapear
    const mappedProducts = produtosCarregados.map(produto => {
      const custom = customMap.get(produto.id);
      
      // Se tem customização e está desabilitado, pular (mas filter vem depois)
      if (custom && custom.enabled === false) return null;

      // Lógica de estoque e status
      const effectiveStock = custom?.custom_stock_enabled 
          ? (custom?.custom_stock_qty ?? 0)
          : produto.stock_qty;
        
      // Se customizado para usar estoque próprio e acabou, filtrar?
      // A lógica original filtrava. Vamos manter.
      if (custom?.custom_stock_enabled && (effectiveStock <= 0)) {
          // return null; // Ou mostrar como esgotado? O original filtrava na linha 205
          // Vamos manter consistência: se custom_stock_enabled e qty<=0, oculta ou mostra esgotado?
          // O original retornava false na filter.
          // Mas produtos esgotados normalmente aparecem. Vamos deixar passar e o frontend decide (status unavailable)
      }

      const customStatus = custom?.custom_status || 'available';
      
      // Determinar nome da categoria:
      // 1. Se produto de banca, usar join com categories
      // 2. Se produto de distribuidor, buscar em distribuidor_categories
      let categoryName: string | undefined;
      if (produto.distribuidor_id && produto.category_id) {
        categoryName = distribuidorCategoryMap.get(produto.category_id);
      } else if (!produto.distribuidor_id && produto.category_id) {
        categoryName = bancaCategoryMap.get(produto.category_id);
      }
      if (!categoryName) {
        categoryName = produto.distribuidor_id ? CATEGORIA_DISTRIBUIDORES_NOME : 'Geral';
      }
      
      let images = produto.images || [];
      
      // DEBUG: Log para produtos específicos
      if (produto.codigo_mercos === '1054835') {
        console.log('[DEBUG] Produto 1054835:', {
          id: produto.id,
          images_raw: produto.images,
          images_is_array: Array.isArray(produto.images),
          images_length: Array.isArray(produto.images) ? produto.images.length : 0
        });
      }
      
      if (!Array.isArray(images) || images.length === 0) {
        images = [DEFAULT_PRODUCT_IMAGE];
      }

      // Calcular preço: prioridade é custom_price do jornaleiro, depois markup do distribuidor
      let precoFinal = produto.price;
      if (custom?.custom_price != null) {
        // Jornaleiro definiu preço customizado - usar esse
        precoFinal = custom.custom_price;
      } else if (produto.distribuidor_id) {
        // Aplicar markup do distribuidor (prioridade: produto > categoria > global)
        precoFinal = calculateDistributorPrice(produto);
      }

      // Retornar apenas campos necessários para o frontend (otimizado)
      return {
        id: produto.id,
        name: produto.name,
        price: precoFinal,
        images: images.slice(0, 1), // Apenas primeira imagem para listagem
        stock_qty: effectiveStock,
        category_name: categoryName,
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega ?? false,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda ?? false,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda ?? false,
        status: customStatus,
        is_distribuidor: !!produto.distribuidor_id,
        codigo_mercos: produto.codigo_mercos,
      };
    }).filter(Boolean); // Remove nulos (desabilitados)

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: isCotista,
      total: totalCount || produtos.length,
      limit: requestedLimit,
      products: mappedProducts,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });


  } catch (error: any) {
    console.error('Erro ao buscar produtos da banca:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
// Force rebuild Sat Nov 15 18:02:32 -03 2025
