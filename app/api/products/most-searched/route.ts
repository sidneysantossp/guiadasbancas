import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

export async function GET(req: NextRequest) {
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
      const variants = buildSearchVariants(search);
      const searchTerms = variants.length ? variants : [normalizeSearchTerm(search)];
      // Busca só em nome/código para evitar falsos positivos (ex.: "agua" casando com "aguardado" na descrição)
      const orParts = searchTerms.flatMap((t) => ([
        `name.ilike.%${t}%`,
        `codigo_mercos.ilike.%${t}%`,
      ]));
      if (orParts.length > 0) {
        query = query.or(orParts.join(','));
      }
    }

    // Importante: para ordenar por proximidade, buscamos mais itens antes do sort
    const fetchLimit = (userLat && userLng) ? Math.min(Math.max((limit || 20) * 5, (limit || 20)), 200) : (limit || 20);
    query = query.limit(fetchLimit);
    
    const { data: items, error } = await query;
    
    if (error) {
      console.error('[SEARCH] Erro ao buscar produtos:', error);
      return NextResponse.json({ ok: false, success: false, error: error.message }, { status: 500 });
    }
    
    const bancaIds = Array.from(
      new Set(
        (items || [])
          .map((p: any) => p?.banca_id)
          .filter((v: any) => typeof v === 'string' && v.length > 0)
      )
    );

    const distribuidorIds = Array.from(
      new Set(
        (items || [])
          .map((p: any) => p?.distribuidor_id)
          .filter((v: any) => typeof v === 'string' && v.length > 0)
      )
    );

    const [bancasRes, distribRes] = await Promise.all([
      bancaIds.length
        ? supabase
            .from('bancas')
            .select('id, name, cover_image, avatar, whatsapp, lat, lng')
            .in('id', bancaIds)
        : Promise.resolve({ data: [], error: null } as any),
      distribuidorIds.length
        ? supabase
            .from('distribuidores')
            .select('id, nome')
            .in('id', distribuidorIds)
        : Promise.resolve({ data: [], error: null } as any),
    ]);

    if (bancasRes?.error) {
      console.error('[SEARCH] Erro ao buscar bancas para produtos:', bancasRes.error);
    }
    if (distribRes?.error) {
      console.error('[SEARCH] Erro ao buscar distribuidores para produtos:', distribRes.error);
    }
    
    const bancaMap = new Map<string, any>((bancasRes?.data || []).map((b: any) => [b.id, b]));
    const distribMap = new Map<string, any>((distribRes?.data || []).map((d: any) => [d.id, d]));

    // Buscar markups e customizações para produtos de distribuidores
    const productIds = (items || []).map((p: any) => p.id);
    const categoryIds = Array.from(new Set((items || []).map((p: any) => p.category_id).filter(Boolean)));

    const [
      markupProdutosRes,
      markupCategoriasRes,
      customizacoesRes
    ] = await Promise.all([
      distribuidorIds.length ? supabase.from('distribuidor_markup_produtos').select('product_id, distribuidor_id, markup_percentual, markup_fixo').in('distribuidor_id', distribuidorIds) : { data: [] },
      distribuidorIds.length ? supabase.from('distribuidor_markup_categorias').select('distribuidor_id, category_id, markup_percentual, markup_fixo').in('distribuidor_id', distribuidorIds).in('category_id', categoryIds.length ? categoryIds : ['__none__']) : { data: [] },
      productIds.length && bancaIds.length ? supabase.from('banca_produtos_distribuidor').select('product_id, banca_id, enabled, custom_price').in('product_id', productIds).in('banca_id', bancaIds) : { data: [] }
    ]);

    const markupProdMap = new Map((markupProdutosRes.data || []).map((m: any) => [m.product_id, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));
    const markupCatMap = new Map((markupCategoriasRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));
    const customMap = new Map((customizacoesRes.data || []).map((c: any) => [`${c.banca_id}:${c.product_id}`, c]));

    const calcularPrecoComMarkup = (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => {
      const distribuidor = distribMap.get(distribuidorId);
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

    // Map reduzido para o front com informações da banca/distribuidor resolvidas via Map
    const data = (items || []).map((p: any) => {
      const bancaData = p?.banca_id ? bancaMap.get(p.banca_id) : null;
      const distribData = p?.distribuidor_id ? distribMap.get(p.distribuidor_id) : null;

      const distributorName = distribData?.nome || '';
      const bancaName = bancaData?.name || distributorName || 'Banca';
      const bancaAvatar = bancaData?.avatar || bancaData?.cover_image || null;
      const bancaPhone = bancaData?.whatsapp || null;

      const bancaLat = bancaData?.lat != null ? parseFloat(bancaData.lat) : null;
      const bancaLng = bancaData?.lng != null ? parseFloat(bancaData.lng) : null;
      let distance: number | null = null;
      if (userLat && userLng && bancaLat != null && bancaLng != null) {
        distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
      }

      // Aplicar markup e customização
      let finalPrice = p.price;
      if (p.distribuidor_id) {
        finalPrice = calcularPrecoComMarkup(p.price, p.id, p.distribuidor_id, p.category_id);
      }
      const custom = customMap.get(`${p.banca_id}:${p.id}`);
      if (custom && custom.enabled === false) {
        return null; // Produto desabilitado para essa banca
      }
      if (custom && typeof custom.custom_price === 'number') {
        finalPrice = custom.custom_price;
      }

      return {
        id: p.id,
        name: p.name,
        price: finalPrice,
        price_original: p.price_original,
        images: p.images || [],
        banca_id: p.banca_id,
        distribuidor_id: p.distribuidor_id,
        distribuidor_nome: distributorName,
        category_id: p.category_id,
        category: '',
        description: p.description || '',
        rating_avg: null,
        reviews_count: 0,
        stock_qty: p.stock_qty ?? null,
        track_stock: p.track_stock ?? false,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        discount_percent: p.discount_percent,
        distance,
        banca: {
          id: p.banca_id || p.distribuidor_id,
          name: bancaName,
          avatar: bancaAvatar,
          phone: bancaPhone,
          lat: bancaLat,
          lng: bancaLng
        }
      };
    }).filter(Boolean);

    // Ordenar:
    // - sempre por nome (alfabético)
    // - para nomes iguais, ordenar por distância (quando houver)
    const sorted = data.slice().sort((a: any, b: any) => {
      const nameA = String(a?.name || '');
      const nameB = String(b?.name || '');
      const nameCmp = nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      return String(a?.id || '').localeCompare(String(b?.id || ''));
    });

    const finalData = sorted.slice(0, limit || 20);
    
    return NextResponse.json({ ok: true, success: true, data: finalData });
  } catch (e: any) {
    return NextResponse.json({ ok: false, success: false, error: e?.message || "Erro ao buscar produtos" }, { status: 500 });
  }
}

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
