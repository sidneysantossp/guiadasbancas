import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeKeyName(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeSearchTerm(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
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

    console.log(`[Search API] Buscando por: "${searchTerm}"`);

    type SearchResultItem = {
      type: 'product' | 'banca';
      id: string;
      name: string;
      image: string | null;
      price: number | null;
      category: string;
      banca_name: string;
      banca_id: string;
      address?: string;
      distance?: number; // Distância em km
      banca_lat?: number;
      banca_lng?: number;
    };

    const results: SearchResultItem[] = [];

    // Verificar se o termo de busca corresponde a nomes de bancas
    // Se sim, buscar apenas bancas para evitar misturar resultados
    const bancaSearchTerms = (searchVariants.length ? searchVariants : terms);
    const bancaOr = bancaSearchTerms
      .map((t) => `name.ilike.%${t}%`)
      .join(',');

    const { data: bancasCheck, error: bancasCheckError } = await supabase
      .from('bancas')
      .select('name')
      .or(bancaOr)
      .limit(1);

    const isBancaSearch = !bancasCheckError && bancasCheck && bancasCheck.length > 0;

    console.log(`[Search API] Termo "${searchTerm}" ${isBancaSearch ? 'corresponde a banca' : 'não corresponde a banca'}`);

    // 1. Buscar produtos (apenas se não for busca específica de banca)
    let products = null;
    if (!isBancaSearch) {
      // Importante: para ordenar por proximidade, precisamos buscar mais itens antes do sort
      // (senão o limit do banco pode excluir a banca mais próxima)
      const fetchLimit = Math.min(Math.max(limit * 5, limit), 50);

      // Usando Left Join (sem !) para não excluir produtos sem categoria/banca
      let productsQuery = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          distribuidor_id,
          images,
          banca_id,
          category_id,
          categories(name),
          bancas(name, lat, lng)
        `)
        .eq('active', true)
        .limit(fetchLimit);

      // Busca mais precisa: apenas pelo nome/código para evitar falsos positivos (ex: "agua" encontrando "aguardado" na descrição)
      const productOr = (searchVariants.length ? searchVariants : terms)
        .flatMap((t) => ([`name.ilike.%${t}%`, `codigo_mercos.ilike.%${t}%`]))
        .join(',');

      if (productOr) {
        productsQuery = productsQuery.or(productOr);
      }

      if (bancaId) {
        productsQuery = productsQuery.eq('banca_id', bancaId);
      }

      const { data: productsData, error: productsError } = await productsQuery;
      products = productsData;
    } else {
      products = null;
    }

    if (products) {
      // Aplicar markup do distribuidor e preço customizado da banca (se houver)
      const distribuidorIds = Array.from(new Set(products.map((p: any) => p.distribuidor_id).filter(Boolean)));
      const productIds = products.map((p: any) => p.id);
      const bancaIds = Array.from(new Set(products.map((p: any) => p.banca_id).filter(Boolean)));
      const categoryIds = Array.from(new Set(products.map((p: any) => p.category_id).filter(Boolean)));

      const [
        distribuidoresRes,
        markupProdutosRes,
        markupCategoriasRes,
        customizacoesRes
      ] = await Promise.all([
        distribuidorIds.length
          ? supabase.from('distribuidores').select('id, nome, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor').in('id', distribuidorIds)
          : { data: [] },
        distribuidorIds.length
          ? supabase.from('distribuidor_markup_produtos').select('product_id, distribuidor_id, markup_percentual, markup_fixo').in('distribuidor_id', distribuidorIds)
          : { data: [] },
        distribuidorIds.length
          ? supabase.from('distribuidor_markup_categorias').select('distribuidor_id, category_id, markup_percentual, markup_fixo').in('distribuidor_id', distribuidorIds).in('category_id', categoryIds.length ? categoryIds : ['__none__'])
          : { data: [] },
        productIds.length && bancaIds.length
          ? supabase.from('banca_produtos_distribuidor').select('product_id, banca_id, enabled, custom_price').in('product_id', productIds).in('banca_id', bancaIds)
          : { data: [] }
      ]);

      const distribuidorMap = new Map((distribuidoresRes.data || []).map((d: any) => [d.id, d]));
      const markupProdMap = new Map((markupProdutosRes.data || []).map((m: any) => [m.product_id, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));
      const markupCatMap = new Map((markupCategoriasRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));
      const customMap = new Map((customizacoesRes.data || []).map((c: any) => [`${c.banca_id}:${c.product_id}`, c]));

      const calcularPrecoComMarkup = (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => {
        const distribuidor = distribuidorMap.get(distribuidorId);
        if (!distribuidor) return precoBase;

        const markupProd = markupProdMap.get(produtoId);
        if (markupProd && (markupProd.percentual > 0 || markupProd.fixo > 0)) {
          return precoBase * (1 + markupProd.percentual / 100) + markupProd.fixo;
        }

        const markupCat = markupCatMap.get(`${distribuidorId}:${categoryId}`);
        if (markupCat && (markupCat.percentual > 0 || markupCat.fixo > 0)) {
          return precoBase * (1 + markupCat.percentual / 100) + markupCat.fixo;
        }

        const tipoCalculo = distribuidor.tipo_calculo || 'markup';
        if (tipoCalculo === 'margem') {
          const divisor = distribuidor.margem_divisor || 1;
          if (divisor > 0 && divisor < 1) {
            return precoBase / divisor;
          }
        } else {
          const percentual = distribuidor.markup_global_percentual || 0;
          const fixo = distribuidor.markup_global_fixo || 0;
          if (percentual > 0 || fixo > 0) {
            return precoBase * (1 + percentual / 100) + fixo;
          }
        }

        return precoBase;
      };

      products.forEach((p: any) => {
        const custom = customMap.get(`${p.banca_id}:${p.id}`);
        if (custom && custom.enabled === false) {
          return; // Produto desabilitado para essa banca
        }

        const bancaLat = p.bancas?.lat ? parseFloat(p.bancas.lat) : null;
        const bancaLng = p.bancas?.lng ? parseFloat(p.bancas.lng) : null;
        let distance: number | undefined;
        
        if (userLat && userLng && bancaLat && bancaLng) {
          distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
        }

        // Preço final com markup/custom
        let precoFinal = p.price;
        if (p.distribuidor_id) {
          precoFinal = calcularPrecoComMarkup(p.price, p.id, p.distribuidor_id, p.category_id);
        }
        if (custom && typeof custom.custom_price === 'number') {
          precoFinal = custom.custom_price;
        }
        
        results.push({
          type: 'product',
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          price: precoFinal,
          category: p.categories?.name || 'Produto',
          banca_name: p.bancas?.name || 'Banca não identificada',
          banca_id: p.banca_id,
          distance,
          banca_lat: bancaLat ?? undefined,
          banca_lng: bancaLng ?? undefined
        });
      });
    }

    // 2. Buscar bancas (apenas se não estiver filtrando por uma banca específica)
    if (!bancaId) {
      const bancaConditions = bancaSearchTerms
        .flatMap((t) => [`name.ilike.%${t}%`, `address.ilike.%${t}%`])
        .join(',');
      let bancasQuery = supabase
        .from('bancas')
        .select('id, name, cover_image, address, rating, lat, lng')
        .limit(limit);
      if (bancaConditions) {
        bancasQuery = bancasQuery.or(bancaConditions);
      }
      const { data: bancas, error: bancasError } = await bancasQuery;

      if (bancasError) {
        console.error('Erro na busca de bancas:', bancasError);
      } else if (bancas) {
        bancas.forEach((b: any) => {
          const bancaLat = b.lat ? parseFloat(b.lat) : null;
          const bancaLng = b.lng ? parseFloat(b.lng) : null;
          let distance: number | undefined;
          
          if (userLat && userLng && bancaLat && bancaLng) {
            distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
          }
          
          results.push({
            type: 'banca',
            id: b.id,
            name: b.name,
            image: b.cover_image,
            price: null,
            category: 'Banca',
            banca_name: b.name,
            banca_id: b.id,
            address: b.address,
            distance,
            banca_lat: bancaLat ?? undefined,
            banca_lng: bancaLng ?? undefined
          });
        });
      }
    }

    // Ordenação:
    // - Busca de produto: primeiro produtos em ordem alfabética; para nomes iguais, ordenar por distância
    // - Busca de banca: apenas bancas em ordem alfabética; para nomes iguais, ordenar por distância
    results.sort((a, b) => {
      // Prioridade por tipo depende do contexto da busca
      if (!isBancaSearch && a.type !== b.type) {
        // Em busca de produto, mostrar produtos antes de bancas
        if (a.type === 'product') return -1;
        if (b.type === 'product') return 1;
      }

      // Ordenar alfabeticamente por nome (case-insensitive)
      const nameCmp = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      // Desempate: ordenar por proximidade (se ambos têm distância)
      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      // Último fallback: tipo e id para estabilidade
      const typeCmp = a.type.localeCompare(b.type);
      if (typeCmp !== 0) return typeCmp;
      return a.id.localeCompare(b.id);
    });

    // Deduplicar mantendo a prioridade da ordenação:
    // - não permitir mesmo produto repetido na mesma banca
    // - bancas deduplicadas por id
    const seen = new Set<string>();
    const finalResults: SearchResultItem[] = [];
    for (const item of results) {
      const key = item.type === 'product'
        ? `product:${item.banca_id}:${normalizeKeyName(item.name)}`
        : `banca:${item.id}`;

      if (seen.has(key)) continue;
      seen.add(key);
      finalResults.push(item);
      if (finalResults.length >= limit) break;
    }

    return NextResponse.json({
      success: true,
      results: finalResults
    });

  } catch (error: any) {
    console.error('Erro geral na busca:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
