import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Fuse, { IFuseOptions } from 'fuse.js';
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import {
  calculateDistance,
  interleaveItemsByGroup,
  sortItemsByDistance,
} from "@/lib/modules/products/public-catalog";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

function normalizeSearchTerm(value: string) {
  return String(value || "")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

// Gera variações tolerantes a acentos (ex.: agua -> água)
function buildSearchVariants(value: string): string[] {
  const normalized = normalizeSearchTerm(value);
  const base = String(value || "").trim().toLowerCase();
  const variants = new Set<string>();
  if (base) variants.add(base);
  if (normalized) variants.add(normalized);

  const vowels = ['a', 'e', 'i', 'o', 'u'] as const;
  const acuteMap: Record<typeof vowels[number], string> = {
    a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú'
  };
  for (const v of vowels) {
    const idx = normalized.indexOf(v);
    if (idx !== -1) {
      variants.add(normalized.slice(0, idx) + acuteMap[v] + normalized.slice(idx + 1));
      break;
    }
  }

  return Array.from(variants).filter((v) => v.length >= 2).slice(0, 4);
}

// Configuração do Fuse.js para busca fuzzy tolerante a erros de digitação
// Ex: "amisterdan" encontra "amsterdam", "sedex" encontra "seda"
const FUSE_OPTIONS: IFuseOptions<any> = {
  threshold: 0.4, // 0 = match exato, 1 = qualquer coisa. 0.4 = boa tolerância para erros
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'codigo_mercos', weight: 0.3 },
  ],
};

export async function GET(req: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Surrogate-Control': 'no-store',
  };

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');

    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    
    const supabase = supabaseAdmin;
    
    // Buscar produtos (sem JOINs) para não depender de FKs no schema
    // Em muitos bancos, category_id/distribuidor_id não possuem FK, o que quebra selects relacionais no Supabase.
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        banca_id,
        distribuidor_id,
        category_id,
        description,
        stock_qty,
        track_stock,
        active,
        codigo_mercos
      `)
      .eq('active', true)
      .order('created_at', { ascending: false }); // Produtos mais recentes primeiro

    // Aplicar filtros no banco se existirem
    if (category) {
      // Filtrar no banco se possível, ou manter memória se complexo
      // Como category_id é string, podemos usar ilike
      query = query.ilike('category_id', `%${category}%`);
    }

    if (search) {
      // BUSCA FLEXÍVEL: Divide o termo em palavras e busca cada uma separadamente
      // Exemplo: "CABO CELULAR" → busca produtos que contenham "CABO" OU "CELULAR"
      // Exemplo: "AMSTER" → busca produtos que contenham "AMSTER" (encontra "AMSTERDAM")
      const normalized = normalizeSearchTerm(search);
      const words = normalized
        .split(/\s+/) // Divide por espaços
        .filter(word => word.length >= 2) // Ignora palavras muito pequenas (ex: "de", "da", "do")
        .slice(0, 5); // Limita a 5 palavras para evitar queries muito complexas
      
      console.log('[SEARCH] Termo original:', search);
      console.log('[SEARCH] Palavras extraídas:', words);
      
      if (words.length > 0) {
        // Para cada palavra, gera variantes com acentos e busca em name OU codigo_mercos
        const allConditions: string[] = [];
        
        for (const word of words) {
          const variants = buildSearchVariants(word);
          const terms = variants.length ? variants : [word];
          
          // Para cada variante da palavra, busca em name OU codigo_mercos
          for (const term of terms) {
            allConditions.push(`name.ilike.%${term}%`);
            allConditions.push(`codigo_mercos.ilike.%${term}%`);
          }
        }
        
        // Aplica filtro: qualquer condição pode ser satisfeita (OR lógico)
        // Isso permite buscar "CABO" e encontrar "CABO DE CELULAR"
        // Ou buscar "AMSTER" e encontrar "AMSTERDAM"
        if (allConditions.length > 0) {
          query = query.or(allConditions.join(','));
          console.log('[SEARCH] Total de condições aplicadas:', allConditions.length);
        }
      }
    }

    // Importante: para ordenar por proximidade, buscamos mais itens antes do sort
    const fetchLimit = (userLat && userLng) ? Math.min(Math.max((limit || 20) * 5, (limit || 20)), 200) : (limit || 20);
    query = query.limit(fetchLimit);
    
    let { data: items, error } = await query;
    
    if (error) {
      console.error('[SEARCH] Erro ao buscar produtos:', error);
      return NextResponse.json({ ok: false, success: false, error: error.message }, { status: 500, headers });
    }
    
    // BUSCA FUZZY: Se SQL não encontrou muitos resultados, aplicar Fuse.js
    // Isso encontra produtos mesmo com erros de digitação (ex: "amisterdan" → "amsterdam")
    if (search && (!items || items.length === 0)) {
      console.log('[SEARCH] Poucos resultados SQL, aplicando busca fuzzy...');
      
      // Buscar mais produtos para aplicar Fuse.js
      const { data: moreProducts } = await supabase
        .from('products')
        .select(`
          id, name, price, price_original, discount_percent, images,
          banca_id, distribuidor_id, category_id, description,
          stock_qty, track_stock, active, codigo_mercos
        `)
        .eq('active', true)
        .limit(1000);
      
      if (moreProducts && moreProducts.length > 0) {
        const fuse = new Fuse(moreProducts, FUSE_OPTIONS);
        const fuzzyResults = fuse.search(search, { limit: fetchLimit });
        const normalizedSearch = normalizeSearchTerm(search);
        const maxScore = normalizedSearch.length >= 6 ? 0.22 : 0.18;
        
        // Combinar resultados: SQL primeiro, depois fuzzy (sem duplicatas)
        const existingIds = new Set((items || []).map((p: any) => p.id));
        const fuzzyProducts = fuzzyResults
          .filter((result: any) => typeof result.score === 'number' && result.score <= maxScore)
          .map(r => r.item)
          .filter((p: any) => !existingIds.has(p.id));
        
        items = [...(items || []), ...fuzzyProducts].slice(0, fetchLimit);
        console.log('[SEARCH] Após fuzzy:', items.length, 'produtos encontrados');
      }
    }
    
    const bancaIds = Array.from(
      new Set(
        (items || [])
          .map((p: any) => p?.banca_id)
          .filter((v: any) => typeof v === 'string' && v.length > 0)
      )
    );

    // Buscar bancas cotistas com localização para associar produtos de distribuidores
    const cotistaBancasRes = await supabase
      .from('bancas')
      .select('id, name, cover_image, whatsapp, lat, lng, is_cotista, cotista_id, active')
      .eq('active', true)
      .or('is_cotista.eq.true,cotista_id.not.is.null')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .limit(50);

    const cotistaBancas = (cotistaBancasRes?.data || []).filter((b: any) => 
      b.lat != null && b.lng != null
    );

    const sortedCotistaBancas = sortItemsByDistance({
      items: cotistaBancas,
      userLat,
      userLng,
    });
    
    const bancaUsageMap = new Map<string, number>();

    const bancasRes = bancaIds.length
      ? await supabase
          .from('bancas')
          .select('id, name, cover_image, whatsapp, lat, lng, is_cotista, cotista_id, active')
          .in('id', bancaIds)
      : ({ data: [], error: null } as any);

    if (bancasRes?.error) {
      console.error('[SEARCH] Erro ao buscar bancas para produtos:', bancasRes.error);
    }
    
    const bancaMap = new Map<string, any>((bancasRes?.data || []).map((b: any) => [b.id, b]));

    // Buscar markups e customizações para produtos de distribuidores
    const categoryIds = Array.from(new Set((items || []).map((p: any) => p.category_id).filter(Boolean)));

    // Buscar nomes das categorias
    const categoriesRes = categoryIds.length
      ? await supabase
          .from('categories')
          .select('id, name')
          .in('id', categoryIds)
      : { data: [], error: null };

    if (categoriesRes?.error) {
      console.error('[SEARCH] Erro ao buscar categorias:', categoriesRes.error);
    }

    const categoryMap = new Map<string, any>((categoriesRes?.data || []).map((c: any) => [c.id, c]));

    const candidateBancaIds = Array.from(new Set([
      ...bancaIds,
      ...sortedCotistaBancas.map((b: any) => b.id).filter(Boolean),
    ]));

    const { customMap, calculateDistributorPrice } = await loadDistributorPricingContext<{
      product_id: string;
      banca_id: string;
      enabled: boolean | null;
      custom_price: number | null;
    }>({
      products: (items || []) as any[],
      customFields: 'product_id, banca_id, enabled, custom_price',
      customBancaIds: candidateBancaIds,
      buildCustomizationKey: (customization) => `${customization.banca_id}:${customization.product_id}`,
    });

    // Map reduzido para o front com informações da banca/distribuidor resolvidas via Map
    // Incluir produtos de TODAS as bancas ativas (não apenas cotistas)
    const isActiveBanca = (b: any) => b?.active !== false;

    const pickDisplayBancaForDistributorProduct = (productId: string, fallbackBanca: any) => {
      if (sortedCotistaBancas.length === 0) return fallbackBanca;

      const eligible = sortedCotistaBancas.filter((banca: any) => {
        const custom = customMap.get(`${banca.id}:${productId}`);
        return custom?.enabled !== false;
      });

      if (eligible.length === 0) return fallbackBanca;

      let bestBanca = eligible[0];
      let bestScore = Number.POSITIVE_INFINITY;

      eligible.forEach((banca: any, index: number) => {
        const usageCount = bancaUsageMap.get(banca.id) || 0;
        const distancePenalty = userLat && userLng ? index : 0;
        const score = distancePenalty + usageCount * 1.75;

        if (score < bestScore) {
          bestScore = score;
          bestBanca = banca;
        }
      });

      bancaUsageMap.set(bestBanca.id, (bancaUsageMap.get(bestBanca.id) || 0) + 1);
      return bestBanca;
    };

    const data = (items || []).map((p: any) => {
      const fallbackBanca = p?.banca_id ? bancaMap.get(p.banca_id) : null;
      let bancaData = fallbackBanca;

      if (p.distribuidor_id) {
        bancaData = pickDisplayBancaForDistributorProduct(p.id, fallbackBanca);
      }
      
      // Permitir produtos sem banca (produtos de distribuidor) ou de bancas ativas
      if (bancaData && !isActiveBanca(bancaData)) {
        return null;
      }
      
      const bancaName = bancaData?.name || 'Banca Local';
      const bancaAvatar = bancaData?.cover_image || null;
      const bancaPhone = bancaData?.whatsapp || null;

      const bancaLat = bancaData?.lat != null ? parseFloat(bancaData.lat) : null;
      const bancaLng = bancaData?.lng != null ? parseFloat(bancaData.lng) : null;
      let distance: number | null = bancaData?.distance || null;
      if (!distance && userLat && userLng && bancaLat != null && bancaLng != null) {
        distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
      }

      // Aplicar markup e customização
      let finalPrice = p.price;
      if (p.distribuidor_id) {
        finalPrice = calculateDistributorPrice(p);
      }
      const targetBancaId = bancaData?.id || p.banca_id;
      const custom = targetBancaId ? customMap.get(`${targetBancaId}:${p.id}`) : null;
      if (custom && custom.enabled === false) {
        return null; // Produto desabilitado para essa banca
      }
      if (custom && typeof custom.custom_price === 'number') {
        finalPrice = custom.custom_price;
      }
      finalPrice = Math.round(Number(finalPrice || 0) * 100) / 100;

      const categoryData = p.category_id ? categoryMap.get(p.category_id) : null;
      const categoryName = categoryData?.name || '';

      return {
        id: p.id,
        name: p.name,
        price: finalPrice,
        price_original: p.price_original,
        images: p.images || [],
        banca_id: bancaData?.id || p.banca_id || null,
        distribuidor_id: p.distribuidor_id,
        category_id: p.category_id,
        category: categoryName,
        description: p.description || '',
        rating_avg: null,
        reviews_count: 0,
        stock_qty: p.stock_qty ?? null,
        track_stock: p.track_stock ?? false,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        discount_percent: p.discount_percent,
        codigo_mercos: p.codigo_mercos || null,
        distance,
        banca: {
          id: bancaData?.id || p.banca_id || null,
          name: bancaName,
          avatar: bancaAvatar,
          phone: bancaPhone,
          lat: bancaLat,
          lng: bancaLng
        }
      };
    }).filter(Boolean);

    const interleaved = interleaveItemsByGroup({
      items: data,
      getGroupKey: (item) => item?.banca?.id || 'sem-banca',
      getDistance: (item) => (typeof item?.distance === 'number' ? item.distance : null),
    });

    // Remover produtos duplicados (mesmo product_id)
    const seenProductIds = new Set<string>();
    const deduplicated = interleaved.filter((p: any) => {
      if (seenProductIds.has(p.id)) {
        return false;
      }
      seenProductIds.add(p.id);
      return true;
    });

    const finalData = deduplicated.slice(0, limit || 20);
    
    return NextResponse.json({ ok: true, success: true, data: finalData }, { headers });
  } catch (e: any) {
    return NextResponse.json({ ok: false, success: false, error: e?.message || "Erro ao buscar produtos" }, { status: 500, headers });
  }
}
