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
    const sort = searchParams.get("sort") || "name"; // Mudado de created_at para name (alfabético)
    const order = searchParams.get("order") || "asc"; // Mudado de desc para asc

    // Query otimizada - apenas produtos ativos
    // IMPORTANTE: Produtos de distribuidor (distribuidor_id != null) NÃO devem aparecer na listagem pública
    // Eles só aparecem no perfil de bancas COTISTAS
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
        reviews_count,
        codigo_mercos,
        pronta_entrega,
        sob_encomenda,
        pre_venda
      `)
      .eq('active', true)
      .is('distribuidor_id', null); // Excluir produtos de distribuidor da listagem pública

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

    const bancaIds = Array.from(new Set((products || []).map((p: any) => p.banca_id).filter(Boolean)));
    const bancaMap = new Map<string, any>();
    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id, name, is_cotista, cotista_id, active')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
    const filteredProducts = (products || []).filter((p: any) => isActiveCotistaBanca(bancaMap.get(p.banca_id)));

    // Formatar produtos para o formato esperado
    const items = filteredProducts.map((p: any) => ({
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
      reviews_count: p.reviews_count || null,
      codigo_mercos: p.codigo_mercos || null,
      pronta_entrega: p.pronta_entrega || false,
      sob_encomenda: p.sob_encomenda || false,
      pre_venda: p.pre_venda || false,
      banca_name: bancaMap.get(p.banca_id)?.name || null
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
