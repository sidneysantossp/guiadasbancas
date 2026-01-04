import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60;

/**
 * API otimizada para FeaturedBancas - retorna apenas as bancas em destaque
 * Limita a 20 resultados, ordenados por: featured DESC, rating DESC, name ASC
 * 
 * Performance: ~50-100ms vs ~500-1000ms da API que busca todas as bancas
 */
export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ data: [] });
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(parseInt(limitParam || "20", 10), 30); // Max 30

    // Buscar apenas campos necessários, ordenar por featured e rating
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, lat, lng, cover_image, profile_image, rating, featured, active, whatsapp')
      .eq('active', true)
      .order('featured', { ascending: false, nullsFirst: false })
      .order('rating', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[API/bancas/featured] Erro:', error);
      return NextResponse.json({ data: [] });
    }

    // Transformar para o formato esperado pelo FeaturedBancas
    const list = (data || []).map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || '',
      profile_image: banca.profile_image || '',
      rating: banca.rating ?? 4.7,
      featured: banca.featured === true,
      active: true,
      order: 0,
    }));

    return NextResponse.json({ 
      data: list,
      meta: { total: list.length, limit }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (e: any) {
    console.error('[API/bancas/featured] Exception:', e);
    return NextResponse.json({ error: e?.message || "Erro ao listar bancas" }, { status: 500 });
  }
}
