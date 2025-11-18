import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache de 60 segundos

/**
 * API PÚBLICA para produtos (Home Page)
 * Sem autenticação, apenas produtos ativos visíveis
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const distribuidor = searchParams.get("distribuidor") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 100); // Máximo 100
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Query otimizada - apenas produtos ativos
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        category_id,
        banca_id,
        distribuidor_id,
        created_at,
        rating_avg,
        reviews_count
      `)
      .eq('active', true);

    // Filtro de categoria
    if (category) {
      query = query.eq('category_id', category);
    }

    // Filtro de distribuidor
    if (distribuidor) {
      query = query.eq('distribuidor_id', distribuidor);
    }

    // Ordenação
    query = query.order(sort, { ascending: order === 'asc' });
    
    // Limite
    query = query.limit(limit);

    const { data: products, error } = await query;

    if (error) {
      console.error('[API Public Products] Erro:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar produtos', items: [] },
        { status: 500 }
      );
    }

    // Formatar produtos para o formato esperado
    const items = (products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price || 0,
      price_original: p.price_original || null,
      discount_percent: p.discount_percent || null,
      images: Array.isArray(p.images) ? p.images : [],
      image: Array.isArray(p.images) && p.images.length > 0 
        ? p.images[0] 
        : 'https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem',
      category_id: p.category_id,
      banca_id: p.banca_id,
      distribuidor_id: p.distribuidor_id,
      rating_avg: p.rating_avg || null,
      reviews_count: p.reviews_count || null
    }));

    return NextResponse.json({
      success: true,
      data: items, // Formato esperado pelo TrendingProducts
      items, // Mantém compatibilidade
      total: items.length
    });

  } catch (error) {
    console.error('[API Public Products] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno', items: [] },
      { status: 500 }
    );
  }
}
