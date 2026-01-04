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

    // OTIMIZAÇÃO: Busca otimizada com uma única query para produtos
    const fetchLimit = Math.min(Math.max(limit * 2, limit), 20);

    const productOr = (searchVariants.length ? searchVariants : terms)
      .flatMap((t) => ([`name.ilike.%${t}%`, `codigo_mercos.ilike.%${t}%`]))
      .join(',');

    // Query única com JOIN para produtos
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        banca_id,
        category_id,
        categories(name),
        bancas(name, lat, lng, is_cotista, cotista_id, active)
      `)
      .eq('active', true)
      .or(productOr)
      .limit(fetchLimit);

    if (productsError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Search API] Erro na busca de produtos:', productsError);
      }
      return NextResponse.json({ success: false, error: 'Erro na busca' }, { status: 500 });
    }

    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);

    // Processar produtos
    if (productsData) {
      for (const p of productsData) {
        if (!isActiveCotistaBanca(p.bancas)) {
          continue;
        }
        let distance: number | undefined;
        if (userLat && userLng && p.bancas?.lat && p.bancas?.lng) {
          distance = calculateDistance(userLat, userLng, parseFloat(p.bancas.lat), parseFloat(p.bancas.lng));
        }

        results.push({
          type: 'product',
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          price: p.price,
          category: p.categories?.name || 'Produto',
          banca_name: p.bancas?.name || 'Banca',
          banca_id: p.banca_id,
          distance,
          banca_lat: p.bancas?.lat ? parseFloat(p.bancas.lat) : undefined,
          banca_lng: p.bancas?.lng ? parseFloat(p.bancas.lng) : undefined
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

    // Ordenação e deduplicação
    results.sort((a, b) => {
      // Produtos primeiro, depois bancas
      if (a.type !== b.type) {
        return a.type === 'product' ? -1 : 1;
      }

      // Ordenar alfabeticamente por nome
      const nameCmp = a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      // Desempate por distância (se disponível)
      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

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
    });

  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro geral na busca:', error);
    }
    return NextResponse.json({ success: false, error: 'Erro interno na busca' }, { status: 500 });
  }
}
