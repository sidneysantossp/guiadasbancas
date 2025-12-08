import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '6');
    const bancaId = searchParams.get('banca_id');

    if (!search || search.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = search.toLowerCase();
    const supabase = supabaseAdmin;

    const results = [];

    // 1. Buscar produtos
    let productsQuery = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        banca_id,
        category_id,
        categories!category_id(name),
        bancas!banca_id(name)
      `)
      .eq('active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(limit);

    if (bancaId) {
      productsQuery = productsQuery.eq('banca_id', bancaId);
    }

    const { data: products, error: productsError } = await productsQuery;

    if (productsError) {
      console.error('Erro na busca de produtos:', productsError);
    } else if (products) {
      products.forEach((p: any) => {
        results.push({
          type: 'product',
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          price: p.price,
          category: p.categories?.name || 'Produto',
          banca_name: p.bancas?.name || 'Banca',
          banca_id: p.banca_id
        });
      });
    }

    // 2. Buscar bancas (apenas se não estiver filtrando por uma banca específica)
    if (!bancaId) {
      const { data: bancas, error: bancasError } = await supabase
        .from('bancas')
        .select('id, name, cover_image, address, rating')
        .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
        .limit(limit);

      if (bancasError) {
        console.error('Erro na busca de bancas:', bancasError);
      } else if (bancas) {
        bancas.forEach((b: any) => {
          results.push({
            type: 'banca',
            id: b.id,
            name: b.name,
            image: b.cover_image,
            price: null,
            category: 'Banca',
            banca_name: b.name,
            banca_id: b.id,
            address: b.address
          });
        });
      }
    }

    // Embaralhar ou ordenar resultados (priorizar bancas se o termo bater exato com o nome?)
    // Por enquanto, vamos intercalar ou apenas limitar o total
    // Vamos ordenar por "relevância" simples: nome começa com o termo vem antes
    results.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(searchTerm);
      const bStarts = b.name.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    // Limitar total de resultados
    const finalResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      results: finalResults
    });

  } catch (error: any) {
    console.error('Erro geral na busca:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
