import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * Public API: featured products (curated sections)
 * GET /api/featured-products?section=<key>&limit=8
 */
export async function GET(req: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Surrogate-Control': 'no-store',
  };

  try {
    const { searchParams } = new URL(req.url);
    const section = (searchParams.get('section') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const bancaId = (searchParams.get('banca_id') || '').trim();
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat') || '') : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng') || '') : null;

    if (!section) {
      return NextResponse.json({ success: false, error: 'section param required', data: [] }, { status: 400, headers });
    }

    // 1) Read curated entries
    const { data: feats, error: featsErr } = await supabaseAdmin
      .from('featured_products')
      .select('id, product_id, label, order_index, active')
      .eq('section_key', section)
      .eq('active', true)
      .order('order_index', { ascending: true })
      .limit(limit);

    if (featsErr) {
      console.error('[featured-products] read featured error', featsErr);
      return NextResponse.json({ success: false, error: 'Erro ao buscar vitrine', data: [] }, { status: 500, headers });
    }

    const ids = (feats || []).map(f => f.product_id).filter(Boolean);
    if (!ids.length) {
      return NextResponse.json({ success: true, data: [], total: 0 }, { headers });
    }

    // 2) Fetch products by ids (only active products)
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, name, images, price, price_original, discount_percent, rating_avg, reviews_count, banca_id, distribuidor_id, category_id, description, active, codigo_mercos, stock_qty, track_stock, pronta_entrega, sob_encomenda, pre_venda')
      .in('id', ids)
      .eq('active', true);

    if (prodErr) {
      console.error('[featured-products] read products error', prodErr);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos', data: [] }, { status: 500, headers });
    }

    const bancaIds = Array.from(new Set((prods || []).map((p: any) => p.banca_id).filter(Boolean)));
    const bancaMap = new Map<string, any>();
    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id, name, cover_image, whatsapp, lat, lng, is_cotista, cotista_id, active')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    const distribuidorProducts = (prods || []).filter((p: any) => p.distribuidor_id);
    const distribuidorIds = Array.from(new Set(distribuidorProducts.map((p: any) => p.distribuidor_id)));
    const categoryIds = Array.from(new Set(distribuidorProducts.map((p: any) => p.category_id).filter(Boolean)));
    const productIds = distribuidorProducts.map((p: any) => p.id);
    const cotistaBancasRes = !bancaId && distribuidorIds.length > 0
      ? await supabaseAdmin
          .from('bancas')
          .select('id, name, cover_image, whatsapp, lat, lng, is_cotista, cotista_id, active')
          .eq('active', true)
          .or('is_cotista.eq.true,cotista_id.not.is.null')
          .not('lat', 'is', null)
          .not('lng', 'is', null)
          .limit(50)
      : { data: [], error: null };

    const cotistaBancas = (cotistaBancasRes?.data || []).filter((b: any) => b.lat != null && b.lng != null);
    const sortedCotistaBancas = userLat && userLng
      ? cotistaBancas
          .map((b: any) => ({
            ...b,
            distance: calculateDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng)),
          }))
          .sort((a: any, b: any) => a.distance - b.distance)
      : cotistaBancas.map((b: any) => ({ ...b, distance: null }));
    const candidateBancaIds = Array.from(new Set([
      ...bancaIds,
      ...sortedCotistaBancas.map((b: any) => b.id).filter(Boolean),
    ]));

    const [distRes, markupProdRes, markupCatRes, customRes] = await Promise.all([
      distribuidorIds.length > 0
        ? supabaseAdmin
            .from('distribuidores')
            .select('id, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_divisor')
            .in('id', distribuidorIds)
        : Promise.resolve({ data: [] as any[] }),
      distribuidorIds.length > 0 && productIds.length > 0
        ? supabaseAdmin
            .from('distribuidor_markup_produtos')
            .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
            .in('distribuidor_id', distribuidorIds)
            .in('product_id', productIds)
        : Promise.resolve({ data: [] as any[] }),
      distribuidorIds.length > 0 && categoryIds.length > 0
        ? supabaseAdmin
            .from('distribuidor_markup_categorias')
            .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
            .in('distribuidor_id', distribuidorIds)
            .in('category_id', categoryIds)
        : Promise.resolve({ data: [] as any[] }),
      productIds.length > 0 && (bancaId || candidateBancaIds.length > 0)
        ? supabaseAdmin
            .from('banca_produtos_distribuidor')
            .select('product_id, banca_id, enabled, custom_price')
            .in('banca_id', bancaId ? [bancaId] : candidateBancaIds)
            .in('product_id', productIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const distMap = new Map((distRes.data || []).map((d: any) => [d.id, d]));
    const markupProdMap = new Map((markupProdRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.product_id}`, m]));
    const markupCatMap = new Map((markupCatRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, m]));
    const customMap = new Map((customRes.data || []).map((c: any) => [`${c.banca_id}:${c.product_id}`, c]));
    const bancaUsageMap = new Map<string, number>();

    const calcularPrecoVendaDistribuidor = (product: any): number => {
      const precoBase = Number(product.price || 0);
      const dist = distMap.get(product.distribuidor_id);
      if (!dist) return precoBase;

      const mp = markupProdMap.get(`${product.distribuidor_id}:${product.id}`);
      if (mp && (Number(mp.markup_percentual || 0) > 0 || Number(mp.markup_fixo || 0) > 0)) {
        return Math.round((precoBase * (1 + Number(mp.markup_percentual || 0) / 100) + Number(mp.markup_fixo || 0)) * 100) / 100;
      }
      const mc = markupCatMap.get(`${product.distribuidor_id}:${product.category_id}`);
      if (mc && (Number(mc.markup_percentual || 0) > 0 || Number(mc.markup_fixo || 0) > 0)) {
        return Math.round((precoBase * (1 + Number(mc.markup_percentual || 0) / 100) + Number(mc.markup_fixo || 0)) * 100) / 100;
      }

      if (dist.tipo_calculo === 'margem') {
        const divisor = Number(dist.margem_divisor || 1);
        if (divisor > 0 && divisor < 1) return Math.round((precoBase / divisor) * 100) / 100;
      }

      const perc = Number(dist.markup_global_percentual || 0);
      const fixo = Number(dist.markup_global_fixo || 0);
      if (perc > 0 || fixo > 0) {
        return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
      }
      return precoBase;
    };

    const pickDisplayBancaForDistributorProduct = (product: any) => {
      const fallbackBanca = product?.banca_id ? bancaMap.get(product.banca_id) : null;
      if (bancaId) return fallbackBanca;
      if (sortedCotistaBancas.length === 0) return fallbackBanca;

      const eligible = sortedCotistaBancas.filter((banca: any) => {
        const custom = customMap.get(`${banca.id}:${product.id}`);
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

    const byId: Record<string, any> = Object.fromEntries(
      (prods || [])
        .filter((p: any) => {
          const banca = p?.banca_id ? bancaMap.get(p.banca_id) : null;
          // Permitir produtos sem banca vinculada (catálogo de distribuidor)
          if (!p?.banca_id) return true;
          // Se houver banca, exibir apenas se ativa
          return banca?.active !== false;
        })
        .map(p => [p.id, p])
    );

    // 3) Preserve curated order
    const items = (feats || [])
      .map(f => byId[f.product_id])
      .filter(Boolean)
      .map((p: any) => {
        const resolvedBanca = p.distribuidor_id
          ? pickDisplayBancaForDistributorProduct(p)
          : (p?.banca_id ? bancaMap.get(p.banca_id) : null);
        const resolvedBancaId = resolvedBanca?.id || p.banca_id || null;

        if (p.distribuidor_id && bancaId) {
          const custom = customMap.get(`${resolvedBancaId}:${p.id}`);
          if (custom?.enabled === false) return null;
        }

        const custom = p.distribuidor_id && resolvedBancaId ? customMap.get(`${resolvedBancaId}:${p.id}`) : null;
        const finalPrice = p.distribuidor_id
          ? (custom?.custom_price != null ? Number(custom.custom_price) : calcularPrecoVendaDistribuidor(p))
          : Number(p.price ?? 0);

        return {
        id: p.id,
        name: p.name,
        images: Array.isArray(p.images) ? p.images : [],
        image: Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : 'https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem',
        price: finalPrice,
        price_original: p.price_original ?? null,
        discount_percent: p.discount_percent ?? null,
        rating_avg: p.rating_avg ?? null,
        reviews_count: p.reviews_count ?? null,
        banca_id: resolvedBancaId,
        banca_name: resolvedBanca?.name || null,
        banca: resolvedBanca
          ? {
              id: resolvedBanca?.id || null,
              name: resolvedBanca?.name || null,
              avatar: resolvedBanca?.cover_image || null,
              phone: resolvedBanca?.whatsapp || null,
              lat: resolvedBanca?.lat ?? null,
              lng: resolvedBanca?.lng ?? null,
            }
          : null,
        description: p.description ?? null,
        active: p.active !== false,
        codigo_mercos: p.codigo_mercos ?? null,
        stock_qty: p.stock_qty ?? null,
        track_stock: p.track_stock ?? false,
        pronta_entrega: p.pronta_entrega ?? false,
        sob_encomenda: p.sob_encomenda ?? false,
        pre_venda: p.pre_venda ?? false,
      };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, data: items, total: items.length }, { headers });
  } catch (e) {
    console.error('[featured-products] GET error', e);
    return NextResponse.json({ success: false, error: 'Erro interno', data: [] }, { status: 500, headers });
  }
}

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
