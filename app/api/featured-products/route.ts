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
      .select('id, name, images, price, price_original, discount_percent, rating_avg, reviews_count, banca_id, description, active')
      .in('id', ids)
      .eq('active', true);

    if (prodErr) {
      console.error('[featured-products] read products error', prodErr);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos', data: [] }, { status: 500 });
    }

    const byId: Record<string, any> = Object.fromEntries((prods || []).map(p => [p.id, p]));

    // 3) Preserve curated order
    const items = (feats || [])
      .map(f => byId[f.product_id])
      .filter(Boolean)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        images: Array.isArray(p.images) ? p.images : [],
        image: Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : 'https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem',
        price: p.price ?? 0,
        price_original: p.price_original ?? null,
        discount_percent: p.discount_percent ?? null,
        rating_avg: p.rating_avg ?? null,
        reviews_count: p.reviews_count ?? null,
        banca_id: p.banca_id ?? null,
        description: p.description ?? null,
        active: p.active !== false,
      }));

    return NextResponse.json({ success: true, data: items, total: items.length });
  } catch (e) {
    console.error('[featured-products] GET error', e);
    return NextResponse.json({ success: false, error: 'Erro interno', data: [] }, { status: 500 });
  }
}
