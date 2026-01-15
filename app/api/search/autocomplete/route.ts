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
      category: string;
      banca_name: string;
      banca_id: string;
      address?: string;
      distance?: number; // Distância em km
      banca_lat?: number;
      banca_lng?: number;
    };

    const results: SearchResultItem[] = [];

    // Buscar MAIS produtos para garantir que produtos de bancas próximas sejam incluídos
    // Depois ordenamos por distância e limitamos no final
    const fetchLimit = 100; // Buscar mais para ter variedade de bancas

    const productOr = (searchVariants.length ? searchVariants : terms)
      .flatMap((t) => ([`name.ilike.%${t}%`, `codigo_mercos.ilike.%${t}%`]))
      .join(',');

    // Query única com JOIN para produtos (incluindo distribuidor_id para markup)
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        banca_id,
        category_id,
        distribuidor_id,
        categories(name),
        bancas(name, lat, lng, is_cotista, cotista_id, active)
      `)
      .eq('active', true)
      .or(productOr)
      .limit(fetchLimit);
    
    // Buscar markups completos de distribuidores para aplicar nos preços
    const distribuidorIds = Array.from(new Set(
      (productsData || []).filter((p: any) => p.distribuidor_id).map((p: any) => p.distribuidor_id)
    ));
    const distMap = new Map<string, any>();
    const markupProdutosMap = new Map<string, any>();
    const markupCategoriasMap = new Map<string, any>();
    
    if (distribuidorIds.length > 0) {
      // Buscar configuração completa do distribuidor
      const [distribuidoresRes, markupProdutosRes, markupCategoriasRes] = await Promise.all([
        supabase
          .from('distribuidores')
          .select('id, markup_global_percentual, markup_global_fixo, margem_divisor, tipo_calculo')
          .in('id', distribuidorIds),
        supabase
          .from('distribuidor_markup_produtos')
          .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
          .in('distribuidor_id', distribuidorIds),
        supabase
          .from('distribuidor_markup_categorias')
          .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
          .in('distribuidor_id', distribuidorIds)
      ]);
      
      (distribuidoresRes.data || []).forEach((d: any) => {
        distMap.set(d.id, d);
      });
      
      (markupProdutosRes.data || []).forEach((m: any) => {
        markupProdutosMap.set(`${m.distribuidor_id}:${m.product_id}`, m);
      });
      
      (markupCategoriasRes.data || []).forEach((m: any) => {
        markupCategoriasMap.set(`${m.distribuidor_id}:${m.category_id}`, m);
      });
    }
    
    // Função para calcular preço final com markup completo
    const calcularPrecoFinal = (produto: any): number => {
      const precoBase = produto.price || 0;
      if (!produto.distribuidor_id) return precoBase;
      
      const dist = distMap.get(produto.distribuidor_id);
      if (!dist) return precoBase;
      
      // 1. Prioridade: Markup por Produto
      const markupProduto = markupProdutosMap.get(`${produto.distribuidor_id}:${produto.id}`);
      if (markupProduto) {
        const perc = Number(markupProduto.markup_percentual || 0);
        const fixo = Number(markupProduto.markup_fixo || 0);
        return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
      }
      
      // 2. Prioridade: Markup por Categoria
      if (produto.category_id) {
        const markupCategoria = markupCategoriasMap.get(`${produto.distribuidor_id}:${produto.category_id}`);
        if (markupCategoria) {
          const perc = Number(markupCategoria.markup_percentual || 0);
          const fixo = Number(markupCategoria.markup_fixo || 0);
          return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
        }
      }
      
      // 3. Prioridade: Markup Global (com suporte a margem/divisor)
      const tipoCalculo = dist.tipo_calculo || 'markup';
      if (tipoCalculo === 'margem') {
        const divisor = Number(dist.margem_divisor || 1);
        if (divisor > 0 && divisor < 1) {
          return Math.round((precoBase / divisor) * 100) / 100;
        }
      } else {
        const perc = Number(dist.markup_global_percentual || 0);
        const fixo = Number(dist.markup_global_fixo || 0);
        if (perc > 0 || fixo > 0) {
          return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
        }
      }
      
      return precoBase;
    };

    if (productsError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Search API] Erro na busca de produtos:', productsError);
      }
      return NextResponse.json({ success: false, error: 'Erro na busca' }, { status: 500 });
    }

    // Verificar se banca é cotista E está ativa
    const isActiveCotistaBanca = (b: any) => {
      if (!b) return false;
      const isCotista = b.is_cotista === true || !!b.cotista_id;
      const isActive = b.active !== false; // active pode ser undefined, então só exclui se for explicitamente false
      return isCotista && isActive;
    };

    // Separar produtos normais e produtos de distribuidores
    const produtosNormais: any[] = [];
    const produtosDistribuidor: any[] = [];
    
    if (productsData) {
      for (const p of productsData) {
        if (p.distribuidor_id) {
          produtosDistribuidor.push(p);
        } else {
          const banca = Array.isArray(p.bancas) ? p.bancas[0] : p.bancas;
          if (isActiveCotistaBanca(banca)) {
            produtosNormais.push(p);
          }
        }
      }
    }

    // Para produtos de distribuidores, buscar TODAS as bancas cotistas ativas
    let bancasCotistas: any[] = [];
    let desabilitadosMap = new Map<string, Set<string>>(); // banca_id -> Set<product_id>
    
    if (produtosDistribuidor.length > 0) {
      // Buscar todas as bancas cotistas ativas
      const { data: bancas } = await supabase
        .from('bancas')
        .select('id, name, lat, lng, is_cotista, cotista_id, active')
        .eq('active', true)
        .or('is_cotista.eq.true,cotista_id.not.is.null');
      
      bancasCotistas = bancas || [];
      
      // Buscar quais produtos foram explicitamente desabilitados por cada banca
      const productIds = produtosDistribuidor.map(p => p.id);
      const { data: desabilitados } = await supabase
        .from('banca_produtos_distribuidor')
        .select('banca_id, product_id, enabled')
        .in('product_id', productIds)
        .eq('enabled', false);
      
      // Criar mapa de produtos desabilitados por banca
      (desabilitados || []).forEach((d: any) => {
        if (!desabilitadosMap.has(d.banca_id)) {
          desabilitadosMap.set(d.banca_id, new Set());
        }
        desabilitadosMap.get(d.banca_id)!.add(d.product_id);
      });
    }

    // Processar produtos normais (não distribuidores)
    for (const p of produtosNormais) {
      const banca = Array.isArray(p.bancas) ? p.bancas[0] : p.bancas;
      let distance: number | undefined;
      if (userLat && userLng && banca?.lat && banca?.lng) {
        distance = calculateDistance(userLat, userLng, parseFloat(banca.lat), parseFloat(banca.lng));
      }

      const finalPrice = calcularPrecoFinal(p);
      const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      
      results.push({
        type: 'product',
        id: p.id,
        name: p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : null,
        price: finalPrice,
        category: category?.name || 'Produto',
        banca_name: banca?.name || 'Banca',
        banca_id: p.banca_id,
        distance,
        banca_lat: banca?.lat ? parseFloat(banca.lat) : undefined,
        banca_lng: banca?.lng ? parseFloat(banca.lng) : undefined
      });
    }

    // Processar produtos de distribuidores - criar entrada para CADA banca cotista
    for (const p of produtosDistribuidor) {
      const finalPrice = calcularPrecoFinal(p);
      const category = Array.isArray(p.categories) ? p.categories[0] : p.categories;
      
      for (const banca of bancasCotistas) {
        // Verificar se esta banca desabilitou explicitamente este produto
        const desabilitados = desabilitadosMap.get(banca.id);
        if (desabilitados && desabilitados.has(p.id)) {
          continue;
        }
        
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
          category: category?.name || 'Produto',
          banca_name: banca.name || 'Banca',
          banca_id: banca.id,
          distance,
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

      const { data: bancasData, error: bancasError } = await supabase
        .from('bancas')
        .select('id, name, cover_image, address, lat, lng')
        .or(bancaOr)
        .limit(remainingLimit);

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
            image: b.cover_image,
            price: null,
            category: 'Banca',
            banca_name: b.name,
            banca_id: b.id,
            address: b.address,
            distance,
            banca_lat: b.lat ? parseFloat(b.lat) : undefined,
            banca_lng: b.lng ? parseFloat(b.lng) : undefined
          });
        }
      }
    }

    // Ordenação e deduplicação - PRIORIZAR DISTÂNCIA (bancas mais próximas primeiro)
    results.sort((a, b) => {
      // Produtos primeiro, depois bancas
      if (a.type !== b.type) {
        return a.type === 'product' ? -1 : 1;
      }

      // PRIORIDADE 1: Ordenar por distância (mais próximo primeiro)
      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      // PRIORIDADE 2: Desempate por nome
      const nameCmp = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      return a.id.localeCompare(b.id);
    });

    // Deduplicar resultados
    const seen = new Set<string>();
    const finalResults = results.filter(item => {
      const key = item.type === 'product'
        ? `product:${item.banca_id}:${normalizeKeyName(item.name)}`
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
