import { NextRequest, NextResponse } from "next/server";
import { getPublishedDistributorCatalogBancas, isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { supabaseAdmin } from "@/lib/supabase";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import { calculateDistance } from "@/lib/modules/products/public-catalog";
import Fuse, { IFuseOptions } from 'fuse.js';
import { normalizeForSearch } from "@/lib/fuzzySearch";

export const dynamic = 'force-dynamic';

function normalizeSearchTerm(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function sanitizeForIlike(value: string): string {
  return String(value || '')
    .replace(/[%(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Gera variações para busca tolerante a acentos (ex.: agua -> água)
function buildSearchVariants(value: string): string[] {
  const normalized = normalizeSearchTerm(value);
  const base = String(value || '').trim().toLowerCase();
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
      break; // apenas a primeira vogal já cobre o caso mais comum (agua -> água)
    }
  }

  return Array.from(variants).filter((v) => v.length >= 2).slice(0, 4);
}

// Configuração do Fuse.js para busca fuzzy tolerante a erros de digitação
const FUSE_OPTIONS: IFuseOptions<any> = {
  threshold: 0.4, // 0 = match exato, 1 = match qualquer coisa. 0.4 = tolerância boa para erros
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'codigo_mercos', weight: 0.3 },
  ],
};

const FUSE_BANCA_OPTIONS: IFuseOptions<any> = {
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.8 },
    { name: 'address', weight: 0.2 },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '6');
    const bancaId = searchParams.get('banca_id');

    // Coordenadas do usuário para cálculo de distância
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

    if (!search || search.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const rawTerm = String(search || '').trim().toLowerCase();
    const normalizedTerm = normalizeSearchTerm(search);
    const terms = Array.from(new Set([rawTerm, normalizedTerm])).filter(Boolean);
    const searchTerm = rawTerm;
    const searchVariants = buildSearchVariants(searchTerm);
    const supabase = supabaseAdmin;

    // OTIMIZAÇÃO: Reduzido logging para produção
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Search API] Buscando por: "${searchTerm}"`);
    }

    type SearchResultItem = {
      type: 'product' | 'banca';
      id: string;
      name: string;
      image: string | null;
      price: number | null;
      codigo_mercos?: string | null;
      category: string;
      banca_name: string;
      banca_id: string;
      address?: string;
      distance?: number; // Distância em km
      search_rank?: number; // Relevância textual (menor = melhor)
      banca_lat?: number;
      banca_lng?: number;
    };

    const results: SearchResultItem[] = [];
    const productSearchRank = new Map<string, number>();

    // BUSCA FUZZY: SEMPRE aplicar Fuse.js para tolerância a erros de digitação
    // Ex: "amisterdam" encontra "amsterdam", "amyster" encontra "amsterdam"
    const fetchLimit = 500;

    // Buscar produtos candidatos no banco com pré-filtro textual (evita janela aleatória de 1000 registros)
    const normalizedQuery = normalizeForSearch(searchTerm);
    const tokenTerms = normalizedQuery.split(/\s+/).filter((t) => t.length >= 2);
    const dbQueryTerms = Array.from(
      new Set(
        tokenTerms.flatMap((t) => {
          const variants = [t];
          if (t.length >= 3) variants.push(t.slice(0, 3));
          if (t.length >= 5) variants.push(t.slice(0, 5));
          if (t.length >= 6) {
            for (let i = 0; i <= t.length - 3; i++) {
              variants.push(t.slice(i, i + 3));
            }
          }
          return variants;
        })
      )
    )
      .map(sanitizeForIlike)
      .filter((t) => t.length >= 3)
      .slice(0, 12);

    const productSelect = `
      id,
      name,
      price,
      images,
      banca_id,
      category_id,
      distribuidor_id,
      codigo_mercos,
      bancas(name, lat, lng, active, approved)
    `;

    let productsQuery = supabase
      .from('products')
      .select(productSelect)
      .eq('active', true);

    if (dbQueryTerms.length > 0) {
      const productOr = dbQueryTerms
        .flatMap((t) => [`name.ilike.%${t}%`, `codigo_mercos.ilike.%${t}%`])
        .join(',');
      productsQuery = productsQuery.or(productOr);
    }

    const { data: prefilteredProducts, error: productsError } = await productsQuery.limit(2000);
    let allProducts = prefilteredProducts || [];

    // Fallback: se o pré-filtro não trouxe nada (erro de digitação), faz busca fuzzy ampla
    if (!productsError && allProducts.length === 0) {
      const { data: broadProducts } = await supabase
        .from('products')
        .select(productSelect)
        .eq('active', true)
        .limit(5000);
      allProducts = broadProducts || [];
    }
    
    let productsData: any[] = [];
    
    if (!productsError && allProducts && allProducts.length > 0) {
      const computeExactRank = (product: any): number => {
        const normalizedName = normalizeForSearch(String(product?.name || ''));
        const normalizedCode = normalizeForSearch(String(product?.codigo_mercos || ''));
        const normalizedBlob = `${normalizedName} ${normalizedCode}`.trim();

        if (!normalizedQuery) return Number.POSITIVE_INFINITY;
        if (normalizedName === normalizedQuery || normalizedCode === normalizedQuery) return 0;
        if (normalizedName.startsWith(normalizedQuery)) return 1;
        if (normalizedBlob.split(/\s+/).some((w) => w.startsWith(normalizedQuery))) return 2;
        if (normalizedBlob.includes(normalizedQuery)) return 3;
        if (tokenTerms.length > 1 && tokenTerms.every((t) => normalizedBlob.includes(t))) return 4;
        return Number.POSITIVE_INFINITY;
      };

      const exactMatches = allProducts
        .map((product: any) => ({ product, rank: computeExactRank(product) }))
        .filter((entry: any) => Number.isFinite(entry.rank))
        .sort((a: any, b: any) => {
          if (a.rank !== b.rank) return a.rank - b.rank;
          return String(a.product.name || '').localeCompare(String(b.product.name || ''), 'pt-BR', { sensitivity: 'base' });
        });

      if (exactMatches.length > 0) {
        productsData = exactMatches.slice(0, fetchLimit).map((entry: any, idx: number) => {
          productSearchRank.set(entry.product.id, idx);
          return entry.product;
        });
      } else {
        // Fallback fuzzy apenas quando não há match textual direto
        const fuse = new Fuse(allProducts, FUSE_OPTIONS);
        const fuzzyResults = fuse.search(searchTerm, { limit: fetchLimit * 2 });

        const filteredFuzzy = fuzzyResults.filter((r: any) => {
          const score = typeof r.score === 'number' ? r.score : 1;
          return score <= 0.75;
        });

        const selectedFuzzy = (filteredFuzzy.length > 0 ? filteredFuzzy : fuzzyResults).slice(0, fetchLimit);
        productsData = selectedFuzzy.map((r: any, idx: number) => {
          const score = typeof r.score === 'number' ? r.score : 1;
          const rank = 1000 + Math.round(score * 1000) + idx;
          productSearchRank.set(r.item.id, rank);
          return r.item;
        });
      }
    }
    
    if (productsError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Search API] Erro na busca de produtos:', productsError);
      }
      return NextResponse.json({ success: false, error: 'Erro na busca' }, { status: 500 });
    }

    const isPublicBanca = (b: any) => isPublishedMarketplaceBanca(b);

    // Separar produtos normais e produtos de distribuidores
    const produtosNormais: any[] = [];
    const produtosDistribuidor: any[] = [];
    
    if (productsData) {
      for (const p of productsData) {
        if (p.distribuidor_id) {
          produtosDistribuidor.push(p);
        } else {
          const banca = Array.isArray(p.bancas) ? p.bancas[0] : p.bancas;
          if (isPublicBanca(banca)) {
            produtosNormais.push(p);
          }
        }
      }
    }

    // Para produtos de distribuidores, usar apenas bancas com acesso ao catálogo parceiro
    let bancasComCatalogoParceiro: any[] = [];
    let calculateDistributorPrice = (product: any) => Number(product?.price || 0);
    let customMap = new Map<string, { enabled: boolean | null; custom_price: number | null }>(); // banca_id:product_id -> custom
    
    if (produtosDistribuidor.length > 0) {
      const bancasElegiveis = await getPublishedDistributorCatalogBancas();
      bancasComCatalogoParceiro = bancaId
        ? bancasElegiveis.filter((banca) => banca.id === bancaId)
        : bancasElegiveis;
      
      const productIds = produtosDistribuidor.map((p: any) => p.id);
      const bancaIds = bancasComCatalogoParceiro.map((b: any) => b.id);
      if (productIds.length > 0 && bancaIds.length > 0) {
        const pricingContext = await loadDistributorPricingContext<{
          banca_id: string;
          product_id: string;
          enabled: boolean | null;
          custom_price: number | null;
        }>({
          products: produtosDistribuidor as any[],
          customFields: 'banca_id, product_id, enabled, custom_price',
          customBancaIds: bancaIds,
          buildCustomizationKey: (customization) => `${customization.banca_id}:${customization.product_id}`,
        });

        calculateDistributorPrice = pricingContext.calculateDistributorPrice;
        customMap = pricingContext.customMap;
      }
    }

    // Processar produtos normais (não distribuidores)
    for (const p of produtosNormais) {
      if (bancaId && p.banca_id !== bancaId) continue;

      const banca = Array.isArray(p.bancas) ? p.bancas[0] : p.bancas;
      let distance: number | undefined;
      if (userLat && userLng && banca?.lat && banca?.lng) {
        distance = calculateDistance(userLat, userLng, parseFloat(banca.lat), parseFloat(banca.lng));
      }

      const finalPrice = p.distribuidor_id
        ? calculateDistributorPrice(p)
        : Number(p.price || 0);
      const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      
      results.push({
        type: 'product',
        id: p.id,
        name: p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        price: finalPrice,
        codigo_mercos: p.codigo_mercos ?? null,
        category: category?.name || 'Produto',
        banca_name: banca?.name || 'Banca',
        banca_id: p.banca_id,
        distance,
        search_rank: productSearchRank.get(p.id) ?? 9999,
        banca_lat: banca?.lat ? parseFloat(banca.lat) : undefined,
        banca_lng: banca?.lng ? parseFloat(banca.lng) : undefined
      });
    }

    // Processar produtos de distribuidores - criar entrada para cada banca com acesso ao catálogo parceiro
    for (const p of produtosDistribuidor) {
      const baseSellingPrice = calculateDistributorPrice(p);
      const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      
      for (const banca of bancasComCatalogoParceiro) {
        const custom = customMap.get(`${banca.id}:${p.id}`);

        // Produto explicitamente desabilitado para essa banca
        if (custom?.enabled === false) {
          continue;
        }
        const finalPrice = custom?.custom_price != null
          ? Number(custom.custom_price)
          : baseSellingPrice;
        
        let distance: number | undefined;
        if (userLat && userLng && banca.lat && banca.lng) {
          distance = calculateDistance(userLat, userLng, parseFloat(banca.lat), parseFloat(banca.lng));
        }
        
        results.push({
          type: 'product',
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          price: finalPrice,
          codigo_mercos: p.codigo_mercos ?? null,
          category: category?.name || 'Produto',
          banca_name: banca.name || 'Banca',
          banca_id: banca.id,
          distance,
          search_rank: productSearchRank.get(p.id) ?? 9999,
          banca_lat: banca.lat ? parseFloat(banca.lat) : undefined,
          banca_lng: banca.lng ? parseFloat(banca.lng) : undefined
        });
      }
    }

    // Buscar bancas apenas se necessário
    if (results.length < limit) {
      const remainingLimit = limit - results.length;
      const bancaOr = (searchVariants.length ? searchVariants : terms)
        .map((t) => `name.ilike.%${t}%`)
        .join(',');

      let bancasSearchQuery = supabase
        .from('bancas')
        .select('id, name, cover_image, profile_image, address, lat, lng')
        .eq('active', true)
        .or(bancaOr)
        .limit(remainingLimit);

      if (bancaId) {
        bancasSearchQuery = bancasSearchQuery.eq('id', bancaId);
      }

      const { data: bancasData, error: bancasError } = await bancasSearchQuery;

      if (!bancasError && bancasData) {
        for (const b of bancasData) {
          let distance: number | undefined;
          if (userLat && userLng && b.lat && b.lng) {
            distance = calculateDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng));
          }

          results.push({
            type: 'banca',
            id: b.id,
            name: b.name,
            image: b.cover_image || b.profile_image || null,
            price: null,
            category: 'Banca',
            banca_name: b.name,
            banca_id: b.id,
            address: b.address,
            distance,
            search_rank: 50000,
            banca_lat: b.lat ? parseFloat(b.lat) : undefined,
            banca_lng: b.lng ? parseFloat(b.lng) : undefined
          });
        }
      }
    }

    // Ordenação e deduplicação - priorizar relevância textual, depois distância
    results.sort((a, b) => {
      // Produtos primeiro, depois bancas
      if (a.type !== b.type) {
        return a.type === 'product' ? -1 : 1;
      }

      // PRIORIDADE 1: Relevância textual (match exato acima de fuzzy)
      const ar = typeof a.search_rank === 'number' ? a.search_rank : Number.POSITIVE_INFINITY;
      const br = typeof b.search_rank === 'number' ? b.search_rank : Number.POSITIVE_INFINITY;
      if (ar !== br) return ar - br;

      // PRIORIDADE 2: Distância (mais próximo primeiro)
      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      // PRIORIDADE 3: Desempate por nome
      const nameCmp = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      return a.id.localeCompare(b.id);
    });

    // Deduplicar resultados
    const seen = new Set<string>();
    const finalResults = results.filter(item => {
      const key = item.type === 'product'
        ? `product:${item.id}`
        : `banca:${item.id}`;

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit);

    return NextResponse.json({
      success: true,
      results: finalResults
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro geral na busca:', error);
    }
    return NextResponse.json({ success: false, error: 'Erro interno na busca' }, { status: 500 });
  }
}
