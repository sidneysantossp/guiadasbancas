import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { canPreviewMarketplaceBanca, isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { resolveCanonicalBancaRowById } from "@/lib/banca-canonical";
import { supabaseAdmin } from "@/lib/supabase";
import { getEffectiveDistributorStock, isDistributorProductOutOfStock, loadDistributorPricingContext } from "@/lib/modules/products/service";
import { listPublicWholesaleProductsForBanca } from "@/lib/modules/atacado/service";

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

function canShowMarketplaceCatalog(
  banca: { active?: boolean | null; approved?: boolean | null } | null | undefined,
  canPreview: boolean
) {
  return Boolean(canPreview || banca?.active !== false);
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get('limit') || '10000'); // Limite alto para buscar todos os produtos
    const requestedOffset = Math.max(0, parseInt(searchParams.get('offset') || '0'));
    const fastMode = searchParams.get('fast') === 'true'; // Modo rápido sem markup/customizações
    const fetchWindow = requestedOffset + requestedLimit;

    // 1. Buscar dados da banca pública (com resolução canônica para bancas duplicadas)
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);
    const banca = await resolveCanonicalBancaRowById<{
      id: string;
      user_id: string | null;
      active: boolean | null;
      approved: boolean | null;
      is_cotista: boolean | null;
      cotista_id: string | null;
    }>(bancaId);

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const effectiveBancaId = banca.id;

    const partnerLinked = banca.is_cotista === true || Boolean(banca.cotista_id);
    const canPreview = canPreviewMarketplaceBanca({
      bancaId: banca.id,
      bancaUserId: banca.user_id,
      viewerUserId: claims?.id,
      viewerBancaId: claims?.bancaId,
      viewerRole: claims?.role,
    });

    const canShowCatalog = canShowMarketplaceCatalog(banca, canPreview);

    if (!canShowCatalog) {
      return NextResponse.json({
        success: true,
        banca_id: effectiveBancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        total: 0,
        limit: requestedLimit,
        products: [],
      });
    }

    // 2. Buscar produtos sem OR em string para evitar inconsistências entre ambientes
    const fetchProducts = async (
      kind: 'own' | 'distributor',
      limit: number
    ): Promise<{ rows: any[]; count: number }> => {
      const baseQuery = () => {
        let q = supabase
          .from('products')
          .select(PRODUCT_FIELDS_MINIMAL, { count: 'exact' })
          .eq('active', true);

        if (kind === 'own') {
          q = q.eq('banca_id', effectiveBancaId).is('distribuidor_id', null);
        } else {
          q = q
            .not('distribuidor_id', 'is', null)
            .or('stock_qty.is.null,stock_qty.gt.0');
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

    const [ownProductsResult, distributorProductsResult, fornecedorProducts] = await Promise.all([
      fetchProducts('own', fetchWindow),
      fetchProducts('distributor', fetchWindow),
      listPublicWholesaleProductsForBanca(effectiveBancaId, fetchWindow),
    ]);

    const ownProductsForExposure = ownProductsResult.rows;
    const ownProductsVisibleCount = ownProductsResult.count || ownProductsResult.rows.length;

    const dedupMap = new Map<string, any>();
    for (const p of ownProductsForExposure) dedupMap.set(p.id, p);
    for (const p of distributorProductsResult.rows) {
      if (isDistributorProductOutOfStock(p)) continue;
      if (!dedupMap.has(p.id)) dedupMap.set(p.id, p);
    }
    for (const product of fornecedorProducts) {
      const id = `fornecedor:${product.id}`;
      if (dedupMap.has(id)) continue;

      const images = product.images.length > 0
        ? product.images
        : product.image_url
          ? [product.image_url]
          : [];

      dedupMap.set(id, {
        id,
        source_id: product.id,
        source: 'fornecedor',
        is_fornecedor: true,
        name: product.name,
        price: product.price,
        price_hidden: product.price_hidden,
        has_custom_price: product.has_custom_price,
        price_original: product.compare_at_price,
        images,
        stock_qty: product.available_quantity,
        category_id: product.category_id,
        category_name: product.category_name || 'Fornecedor Guia',
        distribuidor_id: null,
        pronta_entrega: product.availability_status === 'in_stock',
        sob_encomenda: product.availability_status === 'on_demand',
        pre_venda: product.availability_status === 'quote',
        codigo_mercos: product.sku || product.supplier_reference || '',
      });
    }

    const produtosCombinados = Array.from(dedupMap.values())
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'))
      .slice(requestedOffset, requestedOffset + requestedLimit);

    // 3. Produtos combinados para processamento de markup/customização
    let produtos: any[] = [];
    let totalCount = 0;
    produtos = produtosCombinados;
    totalCount = ownProductsVisibleCount + (distributorProductsResult.count || 0) + fornecedorProducts.length;

    // 4. Modo rápido: retornar produtos sem processamento adicional
    if (fastMode) {
      const fastProducts = produtos.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        price_hidden: p.price_hidden === true,
        has_custom_price: p.has_custom_price === true,
        images: p.images?.slice(0, 1) || [],
        stock_qty: p.stock_qty,
        category_name: p.category_id || CATEGORIA_DISTRIBUIDORES_NOME,
        pronta_entrega: p.pronta_entrega ?? false,
        sob_encomenda: p.sob_encomenda ?? false,
        pre_venda: p.pre_venda ?? false,
        status: 'available',
        is_distribuidor: !!p.distribuidor_id,
        is_fornecedor: p.is_fornecedor === true,
        source: p.source || (p.is_fornecedor ? 'fornecedor' : undefined),
        source_id: p.source_id,
        codigo_mercos: p.codigo_mercos,
      }));

      return NextResponse.json({
        success: true,
        banca_id: effectiveBancaId,
        total: totalCount || produtos.length,
        limit: requestedLimit,
        offset: requestedOffset,
        products: fastProducts,
        fast_mode: true,
      });
    }

    // 5. Modo completo: buscar customizações e markup
    const produtosCarregados = produtos || [];
    const produtosParaPrecificacao = produtosCarregados.filter((produto) => produto.is_fornecedor !== true);

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
        products: produtosParaPrecificacao,
        customFields: 'product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty',
        customBancaId: effectiveBancaId,
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

      if (produto.distribuidor_id) {
        const distributorEffectiveStock = getEffectiveDistributorStock(produto, custom);
        if (distributorEffectiveStock != null && distributorEffectiveStock <= 0) {
          return null;
        }
      }
        
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
        categoryName = produto.is_fornecedor ? 'Fornecedor Guia' : produto.distribuidor_id ? CATEGORIA_DISTRIBUIDORES_NOME : 'Geral';
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
        price_hidden: produto.price_hidden === true,
        has_custom_price: produto.has_custom_price === true || custom?.custom_price != null,
        images: images.slice(0, 1), // Apenas primeira imagem para listagem
        stock_qty: effectiveStock,
        category_name: categoryName,
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega ?? false,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda ?? false,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda ?? false,
        status: customStatus,
        is_distribuidor: !!produto.distribuidor_id,
        is_fornecedor: produto.is_fornecedor === true,
        source: produto.source || (produto.is_fornecedor ? 'fornecedor' : undefined),
        source_id: produto.source_id,
        codigo_mercos: produto.codigo_mercos,
      };
    }).filter(Boolean); // Remove nulos (desabilitados)

    return NextResponse.json({
      success: true,
      banca_id: effectiveBancaId,
      is_cotista: partnerLinked,
      partner_linked: partnerLinked,
      can_access_distributor_catalog: true,
      partner_catalog_access: true,
      total: totalCount || produtos.length,
      limit: requestedLimit,
      offset: requestedOffset,
      products: mappedProducts,
      preview_mode: canPreview && !isPublishedMarketplaceBanca(banca),
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
