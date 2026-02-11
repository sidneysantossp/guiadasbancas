import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { autoCategorizeProduto, getCategoriesStats } from '@/lib/auto-categorize';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * GET - Visualizar preview da categorização automática
 * POST - Aplicar categorização automática
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const distribuidorId = searchParams.get('distribuidor_id');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Buscar produtos de distribuidores
    let query = supabaseAdmin
      .from('products')
      .select('id, name, category_id')
      .not('distribuidor_id', 'is', null)
      .eq('active', true);

    if (distribuidorId) {
      query = query.eq('distribuidor_id', distribuidorId);
    }

    const { data: products, error } = await query.limit(limit);

    if (error) {
      throw error;
    }

    // Carregar mapa de categorias para resolver nomes (FK foi removida)
    const catIds = [...new Set((products || []).map(p => p.category_id).filter(Boolean))];
    const catNameMap = new Map<string, string>();
    if (catIds.length > 0) {
      const [{ data: dc }, { data: bc }] = await Promise.all([
        supabaseAdmin.from('distribuidor_categories').select('id, nome').in('id', catIds),
        supabaseAdmin.from('categories').select('id, name').in('id', catIds),
      ]);
      for (const c of dc || []) catNameMap.set(c.id, c.nome);
      for (const c of bc || []) catNameMap.set(c.id, c.name);
    }

    // Aplicar categorização automática (preview)
    const categorized = products?.map(p => {
      const currentCat = p.category_id ? (catNameMap.get(p.category_id) || null) : null;
      return {
        id: p.id,
        name: p.name,
        current_category: currentCat,
        suggested_category: autoCategorizeProduto(p.name),
        will_change: autoCategorizeProduto(p.name) !== currentCat
      };
    }) || [];

    // Estatísticas
    const stats = getCategoriesStats(products || []);
    const willChange = categorized.filter(p => p.will_change).length;

    return NextResponse.json({
      success: true,
      preview: categorized,
      stats: {
        total: products?.length || 0,
        will_change: willChange,
        categories: stats
      }
    });

  } catch (error: any) {
    console.error('[AUTO-CATEGORIZE] Erro no GET:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { distribuidor_id, dry_run = false } = await req.json();

    console.log('[AUTO-CATEGORIZE] Iniciando categorização automática...');
    console.log(`[AUTO-CATEGORIZE] Dry run: ${dry_run}`);

    // Buscar todas as categorias existentes
    const { data: allCategories } = await supabaseAdmin
      .from('categories')
      .select('id, name');

    const categoryMap = new Map(
      (allCategories || []).map(c => [c.name.toLowerCase(), c.id])
    );

    // Buscar produtos de distribuidores
    let query = supabaseAdmin
      .from('products')
      .select('id, name, category_id')
      .not('distribuidor_id', 'is', null)
      .eq('active', true);

    if (distribuidor_id) {
      query = query.eq('distribuidor_id', distribuidor_id);
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    console.log(`[AUTO-CATEGORIZE] ${products?.length || 0} produtos encontrados`);

    const updates: Array<{ id: string; category_id: string | null }> = [];
    const stats = {
      total: products?.length || 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      by_category: {} as Record<string, number>
    };

    // Processar cada produto
    for (const product of products || []) {
      const suggestedCategory = autoCategorizeProduto(product.name);
      
      if (!suggestedCategory) {
        stats.skipped++;
        continue;
      }

      // Buscar ID da categoria sugerida
      const categoryId = categoryMap.get(suggestedCategory.toLowerCase());

      if (!categoryId) {
        console.warn(`[AUTO-CATEGORIZE] Categoria não encontrada: ${suggestedCategory}`);
        stats.skipped++;
        continue;
      }

      // Verificar se precisa atualizar
      if (product.category_id === categoryId) {
        stats.skipped++;
        continue;
      }

      updates.push({
        id: product.id,
        category_id: categoryId
      });

      stats.by_category[suggestedCategory] = (stats.by_category[suggestedCategory] || 0) + 1;
    }

    console.log(`[AUTO-CATEGORIZE] ${updates.length} produtos para atualizar`);

    // Aplicar atualizações (se não for dry run)
    if (!dry_run && updates.length > 0) {
      // Atualizar em lotes de 100
      const BATCH_SIZE = 100;
      
      for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        
        for (const update of batch) {
          const { error: updateError } = await supabaseAdmin
            .from('products')
            .update({ category_id: update.category_id })
            .eq('id', update.id);

          if (updateError) {
            console.error(`[AUTO-CATEGORIZE] Erro ao atualizar ${update.id}:`, updateError);
            stats.errors++;
          } else {
            stats.updated++;
          }
        }
      }
    } else if (dry_run) {
      stats.updated = updates.length;
    }

    return NextResponse.json({
      success: true,
      dry_run,
      message: dry_run 
        ? `Preview: ${updates.length} produtos seriam atualizados`
        : `${stats.updated} produtos atualizados com sucesso`,
      stats
    });

  } catch (error: any) {
    console.error('[AUTO-CATEGORIZE] Erro no POST:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
