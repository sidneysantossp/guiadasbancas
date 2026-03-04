import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/**
 * Public API: featured products (curated sections)
 * GET /api/featured-products?section=<key>&limit=8
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const section = (searchParams.get('section') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const bancaId = (searchParams.get('banca_id') || '').trim();

    if (!section) {
      return NextResponse.json({ success: false, error: 'section param required', data: [] }, { status: 400 });
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
      return NextResponse.json({ success: false, error: 'Erro ao buscar vitrine', data: [] }, { status: 500 });
    }

    const ids = (feats || []).map(f => f.product_id).filter(Boolean);
    if (!ids.length) {
      return NextResponse.json({ success: true, data: [], total: 0 });
    }

    // 2) Fetch products by ids (only active products)
    const { data: prods, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, name, images, price, price_original, discount_percent, rating_avg, reviews_count, banca_id, distribuidor_id, category_id, description, active, codigo_mercos, stock_qty, track_stock, pronta_entrega, sob_encomenda, pre_venda')
      .in('id', ids)
      .eq('active', true);

    if (prodErr) {
      console.error('[featured-products] read products error', prodErr);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos', data: [] }, { status: 500 });
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
      bancaId && productIds.length > 0
        ? supabaseAdmin
            .from('banca_produtos_distribuidor')
            .select('product_id, enabled, custom_price')
            .eq('banca_id', bancaId)
            .in('product_id', productIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const distMap = new Map((distRes.data || []).map((d: any) => [d.id, d]));
    const markupProdMap = new Map((markupProdRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.product_id}`, m]));
    const markupCatMap = new Map((markupCatRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, m]));
    const customMap = new Map((customRes.data || []).map((c: any) => [c.product_id, c]));

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
        if (p.distribuidor_id && bancaId) {
          const custom = customMap.get(p.id);
          if (custom?.enabled === false) return null;
        }

        const custom = p.distribuidor_id && bancaId ? customMap.get(p.id) : null;
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
        banca_id: p.banca_id ?? null,
        banca_name: bancaMap.get(p.banca_id)?.name || null,
        banca: bancaMap.get(p.banca_id)
          ? {
              id: bancaMap.get(p.banca_id)?.id || null,
              name: bancaMap.get(p.banca_id)?.name || null,
              avatar: bancaMap.get(p.banca_id)?.cover_image || null,
              phone: bancaMap.get(p.banca_id)?.whatsapp || null,
              lat: bancaMap.get(p.banca_id)?.lat ?? null,
              lng: bancaMap.get(p.banca_id)?.lng ?? null,
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

    return NextResponse.json({ success: true, data: items, total: items.length });
  } catch (e) {
    console.error('[featured-products] GET error', e);
    return NextResponse.json({ success: false, error: 'Erro interno', data: [] }, { status: 500 });
  }
}
