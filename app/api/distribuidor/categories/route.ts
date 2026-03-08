import { NextRequest, NextResponse } from "next/server";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Buscar categorias do distribuidor (com contagem de produtos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get("id");
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const [{ data: categories, error: catError }, { data: distributorCategories, error: distCatError }] =
      await Promise.all([
        supabaseAdmin
          .from('categories')
          .select('id, name, image, link, order, active, visible, mercos_id, ultima_sincronizacao')
          .order('name', { ascending: true }),
        supabaseAdmin
          .from('distribuidor_categories')
          .select('id, nome, mercos_id, ativo, updated_at')
          .eq('distribuidor_id', distribuidorId)
          .order('nome', { ascending: true }),
      ]);

    if (catError || distCatError) {
      console.error('[Categorias] Erro ao buscar categorias:', catError || distCatError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar categorias' },
        { status: 500 }
      );
    }

    // Buscar contagem de produtos por categoria do distribuidor (em lotes para evitar limite de 1000)
    const BATCH_SIZE = 1000;
    let allProducts: any[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: batch, error: prodError } = await supabaseAdmin
        .from('products')
        .select('category_id, active')
        .eq('distribuidor_id', distribuidorId)
        .range(offset, offset + BATCH_SIZE - 1);

      if (prodError) {
        console.error('[Categorias] Erro ao buscar produtos:', prodError);
        break;
      }

      if (batch && batch.length > 0) {
        allProducts = [...allProducts, ...batch];
        offset += BATCH_SIZE;
        hasMore = batch.length === BATCH_SIZE;
      } else {
        hasMore = false;
      }
    }

    const products = allProducts;
    console.log(`[Categorias] Total de produtos carregados: ${products.length}`);

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

    const combinedCategories = new Map<string, any>();

    for (const category of categories || []) {
      combinedCategories.set(category.id, {
        id: category.id,
        name: category.name,
        image: category.image || null,
        link: category.link || null,
        order: category.order || 0,
        active: category.active !== false,
        visible: category.visible !== false,
        mercos_id: category.mercos_id || null,
        ultima_sincronizacao: category.ultima_sincronizacao || null,
        source: 'global',
      });
    }

    for (const category of distributorCategories || []) {
      combinedCategories.set(category.id, {
        id: category.id,
        name: category.nome,
        image: null,
        link: null,
        order: 999,
        active: category.ativo !== false,
        visible: true,
        mercos_id: category.mercos_id || null,
        ultima_sincronizacao: category.updated_at || null,
        source: 'mercos',
      });
    }

    for (const categoryId of countMap.keys()) {
      if (!combinedCategories.has(categoryId)) {
        combinedCategories.set(categoryId, {
          id: categoryId,
          name: 'Categoria vinculada',
          image: null,
          link: null,
          order: 999,
          active: true,
          visible: true,
          mercos_id: null,
          ultima_sincronizacao: null,
          source: 'unknown',
        });
      }
    }

    const categoriasComContagem = Array.from(combinedCategories.values()).map((cat: any) => {
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
      total_categories: categoriasComContagem.length,
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
