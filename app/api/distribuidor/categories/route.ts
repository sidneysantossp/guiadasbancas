import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar categorias do distribuidor (com contagem de produtos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get("id");

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar todas as categorias
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, link, order, active, visible')
      .order('name', { ascending: true });

    if (catError) {
      console.error('[Categorias] Erro ao buscar categorias:', catError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar categorias' },
        { status: 500 }
      );
    }

    // Buscar contagem de produtos por categoria do distribuidor
    const { data: products, error: prodError } = await supabaseAdmin
      .from('products')
      .select('category_id, active')
      .eq('distribuidor_id', distribuidorId);

    if (prodError) {
      console.error('[Categorias] Erro ao buscar produtos:', prodError);
    }

    // Criar mapa de contagem
    const countMap = new Map<string, { total: number; active: number }>();
    (products || []).forEach((p: any) => {
      if (p.category_id) {
        const current = countMap.get(p.category_id) || { total: 0, active: 0 };
        current.total++;
        if (p.active) current.active++;
        countMap.set(p.category_id, current);
      }
    });

    // Combinar categorias com contagem
    const categoriasComContagem = (categories || []).map((cat: any) => {
      const counts = countMap.get(cat.id) || { total: 0, active: 0 };
      return {
        ...cat,
        product_count: counts.total,
        active_product_count: counts.active,
        inactive_product_count: counts.total - counts.active,
      };
    });

    // Ordenar por quantidade de produtos (mais produtos primeiro)
    categoriasComContagem.sort((a: any, b: any) => b.product_count - a.product_count);

    // Estatísticas gerais
    const stats = {
      total_categories: categories?.length || 0,
      categories_with_products: categoriasComContagem.filter((c: any) => c.product_count > 0).length,
      total_products: products?.length || 0,
      active_products: products?.filter((p: any) => p.active).length || 0,
    };

    return NextResponse.json({
      success: true,
      data: categoriasComContagem,
      stats,
    });
  } catch (error: any) {
    console.error('[Categorias] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
