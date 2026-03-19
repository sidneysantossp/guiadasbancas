import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublishedDistributorCatalogBancas, isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { supabaseAdmin } from "@/lib/supabase";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import {
  calculateDistance,
  interleaveItemsByGroup,
  resolvePublicCatalogCategoryFilters,
  sortItemsByDistance,
} from "@/lib/modules/products/public-catalog";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Sem cache - garantir dados frescos
export const fetchCache = 'force-no-store';

const API_VERSION = '2026-02-10-v3';

/**
 * API PÚBLICA para produtos (Home Page)
 * Sem autenticação, apenas produtos ativos visíveis
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Debug: retornar versão se solicitado
    if (searchParams.get("_version") === "1") {
      return NextResponse.json({ version: API_VERSION });
    }
    
    const category = searchParams.get("category") || "";
    const categoryName = searchParams.get("categoryName") || ""; // Busca por nome da categoria (slug)
    const distribuidor = searchParams.get("distribuidor") || "";
    const bancaId = searchParams.get("banca_id") || ""; // Opcional: resolve preço customizado para uma banca específica
    const subSlug = searchParams.get("sub") || ""; // Subcategoria específica do mega menu
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 500); // Máximo 500 (categorias podem ter muitos produtos)
    const sort = searchParams.get("sort") || "name"; // Mudado de created_at para name (alfabético)
    const order = searchParams.get("order") || "asc"; // Mudado de desc para asc
    const userLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat") as string) : null;
    const userLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng") as string) : null;
    const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

    const {
      categoryId,
      categoryIds,
      nameSearchTerms,
      categoryNameById,
      includeDistribuidor,
    } = await resolvePublicCatalogCategoryFilters({
      category,
      categoryName,
      subSlug,
    });

    // Query - apenas produtos ativos
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        category_id,
        banca_id,
        distribuidor_id,
        created_at,
        rating_avg,
        reviews_count,
        codigo_mercos,
        pronta_entrega,
        sob_encomenda,
        pre_venda
      `)
      .eq('active', true);
    
    // Se não for busca por categoria, excluir produtos de distribuidor
    if (!includeDistribuidor) {
      query = query.is('distribuidor_id', null);
    }

    // Filtro combinado: category_id OR nome do produto
    // Usa OR para cobrir produtos COM e SEM category_id preenchido
    if (categoryIds.length > 0 || categoryId || nameSearchTerms.length > 0) {
      const orParts: string[] = [];
      
      // Filtrar por category_id (quando preenchido nos produtos)
      if (categoryIds.length > 0) {
        orParts.push(`category_id.in.(${categoryIds.join(',')})`);
      }
      if (categoryId) {
        orParts.push(`category_id.eq.${categoryId}`);
      }
      
      // Filtrar por nome do produto (cobre produtos sem category_id)
      for (const term of nameSearchTerms) {
        orParts.push(`name.ilike.%${term}%`);
      }
      
      if (orParts.length > 0) {
        query = query.or(orParts.join(','));
        console.log(`[API Public] OR filter: ${orParts.length} parts`);
      }
    }

    // Filtro de distribuidor
    if (distribuidor) {
      query = query.eq('distribuidor_id', distribuidor);
    }

    // Ordenação
    query = query.order(sort, { ascending: order === 'asc' });
    
    // Buscar uma janela maior para conseguir intercalar por banca próxima
    const fetchLimit = hasUserLocation
      ? Math.min(Math.max(limit * 5, limit), 240)
      : Math.min(Math.max(limit * 3, limit), 180);
    query = query.limit(fetchLimit);

    const { data: products, error } = await query;

    console.log(`[API Public] Query retornou ${products?.length || 0} produtos brutos (categoryIds: ${categoryIds.length}, categoryId: ${categoryId || 'none'}, nameSearchTerms: ${nameSearchTerms.length}, includeDistribuidor: ${includeDistribuidor})`);

    if (error) {
      console.error('[API Public Products] Erro:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar produtos', items: [] },
        { status: 500 }
      );
    }

    const bancaIds = Array.from(new Set((products || []).map((p: any) => p.banca_id).filter(Boolean)));
    const bancaMap = new Map<string, any>();
    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id, name, active, approved, lat, lng')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    const partnerCatalogBancas = (await getPublishedDistributorCatalogBancas())
      .filter((b: any) => b?.id && b.lat != null && b.lng != null);
    const sortedPartnerCatalogBancas = sortItemsByDistance({
      items: partnerCatalogBancas,
      userLat,
      userLng,
      randomizeWhenNoLocation: true,
    });

    // Se buscando por categoria, incluir produtos de distribuidores.
    // Para produtos próprios, só entram bancas publicadas no marketplace.
    const filteredProducts = (products || []).filter((p: any) => {
      if (p.distribuidor_id && includeDistribuidor) return true;
      return isPublishedMarketplaceBanca(bancaMap.get(p.banca_id));
    });

    const candidateBancaIds = bancaId
      ? [bancaId]
      : Array.from(new Set([
          ...bancaIds,
          ...sortedPartnerCatalogBancas.slice(0, 40).map((b: any) => b.id).filter(Boolean),
        ]));

    const { customMap, calculateDistributorPrice } = await loadDistributorPricingContext<{
      product_id: string;
      banca_id: string;
      enabled: boolean | null;
      custom_price: number | null;
    }>({
      products: filteredProducts,
      customFields: 'product_id, banca_id, enabled, custom_price',
      customBancaIds: candidateBancaIds,
      buildCustomizationKey: (customization) => `${customization.banca_id}:${customization.product_id}`,
    });

    let bancaRotationIndex = 0;

    // Formatar produtos e resolver banca por proximidade (quando aplicável)
    const formatted = filteredProducts.map((p: any) => {
      let bancaData = p?.banca_id ? bancaMap.get(p.banca_id) : null;

      // Produtos de distribuidor: distribuir entre bancas com acesso ao catálogo parceiro
      // (na Home queremos variedade por proximidade, exceto quando banca_id é forçada na query)
      if (p.distribuidor_id && !bancaId && sortedPartnerCatalogBancas.length > 0) {
        bancaData = sortedPartnerCatalogBancas[bancaRotationIndex % sortedPartnerCatalogBancas.length];
        bancaRotationIndex++;
      }

      if (bancaData && !isPublishedMarketplaceBanca(bancaData)) {
        return null;
      }

      const resolvedBancaId = bancaId || bancaData?.id || p.banca_id || null;

      let finalPrice = Number(p.price || 0);
      if (p.distribuidor_id) {
        finalPrice = calculateDistributorPrice(p);
        const custom = resolvedBancaId ? customMap.get(`${resolvedBancaId}:${p.id}`) : null;
        if (custom?.enabled === false) {
          return null;
        }
        if (typeof custom?.custom_price === 'number') {
          finalPrice = Number(custom.custom_price);
        }
      }
      finalPrice = Math.round(finalPrice * 100) / 100;

      const bancaLat = bancaData?.lat != null ? Number(bancaData.lat) : null;
      const bancaLng = bancaData?.lng != null ? Number(bancaData.lng) : null;
      let distance: number | null = typeof bancaData?.distance === 'number' ? bancaData.distance : null;
      if (distance == null && hasUserLocation && Number.isFinite(bancaLat) && Number.isFinite(bancaLng)) {
        distance = calculateDistance(userLat as number, userLng as number, bancaLat as number, bancaLng as number);
      }

      return {
        id: p.id,
        name: p.name,
        price: finalPrice,
        price_original: p.price_original || null,
        discount_percent: p.discount_percent || null,
        images: Array.isArray(p.images) ? p.images : [],
        image: Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : 'https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem',
        category_id: p.category_id,
        category_name: p.category_id ? (categoryNameById.get(p.category_id) || null) : null,
        banca_id: resolvedBancaId,
        distribuidor_id: p.distribuidor_id,
        rating_avg: p.rating_avg || null,
        reviews_count: p.reviews_count || null,
        codigo_mercos: p.codigo_mercos || null,
        pronta_entrega: p.pronta_entrega || false,
        sob_encomenda: p.sob_encomenda || false,
        pre_venda: p.pre_venda || false,
        banca_name: bancaData?.name || bancaMap.get(p.banca_id)?.name || null,
        distance,
      };
    }).filter(Boolean) as any[];

    const interleaved = interleaveItemsByGroup({
      items: formatted,
      getGroupKey: (item) => item?.banca_id || 'sem-banca',
      getDistance: (item) => (typeof item?.distance === 'number' ? item.distance : null),
    });

    const deduplicated: any[] = [];
    const seenProductIds = new Set<string>();
    for (const item of interleaved) {
      if (seenProductIds.has(item.id)) continue;
      seenProductIds.add(item.id);
      deduplicated.push(item);
    }

    const items = deduplicated.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: items,
      items,
      total: items.length
    });

  } catch (error) {
    console.error('[API Public Products] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno', items: [] },
      { status: 500 }
    );
  }
}
