import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

function slugifyCategoryName(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeCategoryName(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildCategoryLink(name: string, existingLink?: string | null): string {
  if (typeof existingLink === 'string') {
    const normalized = existingLink.trim();
    if (normalized.startsWith('/categorias')) return normalized;
    if (normalized.startsWith('/categoria/')) {
      return normalized.replace('/categoria/', '/categorias/');
    }
    if (normalized.startsWith('/')) return normalized;
  }
  const slug = slugifyCategoryName(name) || 'categoria';
  return `/categorias/${slug}`;
}

/**
 * POST /api/admin/categories/sync-global
 * Sincroniza categorias de distribuidor_categories para categories (cache global)
 * 
 * Estratégia:
 * 1. Busca todas as categorias únicas de distribuidor_categories
 * 2. Agrupa por mercos_id (mesmo ID = mesma categoria)
 * 3. Atualiza ou cria em categories
 * 4. Mantém campos de UI (visible, order, jornaleiro_status)
 */
export async function POST(request: NextRequest) {
  try {
    // Buscar todas as categorias ativas de todos os distribuidores
    const { data: distCategorias, error: fetchError } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('mercos_id, nome, categoria_pai_id, distribuidor_id')
      .eq('ativo', true)
      .order('mercos_id');

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar categorias dos distribuidores',
        details: fetchError.message
      }, { status: 500 });
    }

    if (!distCategorias || distCategorias.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhuma categoria encontrada em distribuidor_categories'
      }, { status: 404 });
    }

    // Agrupar por mercos_id (categorias únicas)
    const categoriasUnicas = new Map<number, {
      mercos_id: number;
      nome: string;
      categoria_pai_mercos_id: number | null;
      distribuidores_count: number;
    }>();

    for (const cat of distCategorias) {
      if (cat.mercos_id === null || cat.mercos_id === undefined) continue;
      const catNome = (cat.nome || '').toString().trim() || `Categoria ${cat.mercos_id}`;

      const existing = categoriasUnicas.get(cat.mercos_id);
      if (existing) {
        existing.distribuidores_count++;
      } else {
        categoriasUnicas.set(cat.mercos_id, {
          mercos_id: cat.mercos_id,
          nome: catNome,
          categoria_pai_mercos_id: cat.categoria_pai_id,
          distribuidores_count: 1
        });
      }
    }

    // Buscar categorias existentes em categories
    const { data: existingCategories } = await supabaseAdmin
      .from('categories')
      .select('id, mercos_id, name, image, link, visible, order, active, jornaleiro_status, jornaleiro_bancas, parent_category_id');

    const existingByMercosId = new Map<number, any>();
    const existingByNormalizedName = new Map<string, any[]>();

    for (const existingCategory of existingCategories || []) {
      if (existingCategory.mercos_id === null || existingCategory.mercos_id === undefined) continue;
      existingByMercosId.set(existingCategory.mercos_id, existingCategory);
    }

    for (const existingCategory of existingCategories || []) {
      const normalizedName = normalizeCategoryName(existingCategory.name || '');
      if (!normalizedName) continue;
      if (!existingByNormalizedName.has(normalizedName)) {
        existingByNormalizedName.set(normalizedName, []);
      }
      existingByNormalizedName.get(normalizedName)!.push(existingCategory);
    }

    // Preparar upserts
    const categoriasParaUpsert: any[] = [];
    const hierarquiaMap = new Map<number, string>(); // mercos_id -> category.id (UUID)
    const nowIso = new Date().toISOString();

    // Primeiro passo: criar/atualizar categorias sem hierarquia
    for (const [mercos_id, catData] of categoriasUnicas) {
      const existing = existingByMercosId.get(mercos_id);
      const sameNameEntries = existingByNormalizedName.get(normalizeCategoryName(catData.nome)) || [];
      const sameNameWithImage = sameNameEntries.find((entry) => typeof entry?.image === 'string' && entry.image.trim().length > 0);
      const sameNameWithLink = sameNameEntries.find((entry) => typeof entry?.link === 'string' && entry.link.trim().length > 0);
      const sameNameWithSpecificStatus = sameNameEntries.find(
        (entry) => typeof entry?.jornaleiro_status === 'string' && entry.jornaleiro_status !== 'all'
      );
      const sameNameWithBancas = sameNameEntries.find(
        (entry) => Array.isArray(entry?.jornaleiro_bancas) && entry.jornaleiro_bancas.length > 0
      );
      const minOrderFromName = sameNameEntries
        .map((entry) => entry?.order)
        .filter((order): order is number => typeof order === 'number')
        .sort((a, b) => a - b)[0];
      const hasHiddenEntry = sameNameEntries.some((entry) => entry?.visible === false);

      const categoryId = existing?.id || crypto.randomUUID();
      const categoryLink = buildCategoryLink(catData.nome, existing?.link || sameNameWithLink?.link);

      // Sempre enviar campos NOT NULL para evitar erro no upsert
      categoriasParaUpsert.push({
        id: categoryId,
        mercos_id,
        name: catData.nome,
        image: existing?.image || sameNameWithImage?.image || '',
        link: categoryLink,
        visible: existing?.visible ?? (!hasHiddenEntry),
        order: typeof existing?.order === 'number' ? existing.order : (typeof minOrderFromName === 'number' ? minOrderFromName : 999),
        active: true,
        jornaleiro_status: existing?.jornaleiro_status ?? sameNameWithSpecificStatus?.jornaleiro_status ?? 'all',
        jornaleiro_bancas: existing?.jornaleiro_bancas ?? sameNameWithBancas?.jornaleiro_bancas ?? [],
        ultima_sincronizacao: nowIso,
        updated_at: nowIso,
        ...(existing ? {} : { created_at: nowIso })
      });
      hierarquiaMap.set(mercos_id, categoryId);
    }

    // Upsert categorias
    if (categoriasParaUpsert.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from('categories')
        .upsert(categoriasParaUpsert, { onConflict: 'id' });

      if (upsertError) {
        return NextResponse.json({
          success: false,
          error: 'Erro ao salvar categorias globais',
          details: upsertError.message
        }, { status: 500 });
      }
    }

    const mercosIdsAtivos = Array.from(categoriasUnicas.keys());

    // Limpar hierarquia existente das categorias Mercos antes de recalcular
    if (mercosIdsAtivos.length > 0) {
      const { error: clearHierarchyError } = await supabaseAdmin
        .from('categories')
        .update({ parent_category_id: null })
        .in('mercos_id', mercosIdsAtivos);

      if (clearHierarchyError) {
        console.error('Erro ao limpar hierarquia existente:', clearHierarchyError);
      }
    }

    // Segundo passo: atualizar hierarquia (parent_category_id)
    const hierarquiaUpdates: any[] = [];

    for (const [mercos_id, catData] of categoriasUnicas) {
      if (catData.categoria_pai_mercos_id) {
        const categoryId = hierarquiaMap.get(mercos_id);
        const parentId = hierarquiaMap.get(catData.categoria_pai_mercos_id);

        if (categoryId && parentId) {
          hierarquiaUpdates.push({
            id: categoryId,
            parent_category_id: parentId
          });
        }
      }
    }

    // Atualizar hierarquia
    if (hierarquiaUpdates.length > 0) {
      for (const update of hierarquiaUpdates) {
        const { error: hierarchyError } = await supabaseAdmin
          .from('categories')
          .update({ parent_category_id: update.parent_category_id })
          .eq('id', update.id);

        if (hierarchyError) {
          console.error(`Erro ao atualizar hierarquia da categoria ${update.id}:`, hierarchyError);
        }
      }
    }

    // Marcar categorias que não existem mais em nenhum distribuidor como inativas
    let deactivateError: any = null;
    if (mercosIdsAtivos.length > 0) {
      const deactivateResult = await supabaseAdmin
        .from('categories')
        .update({ active: false, updated_at: nowIso })
        .not('mercos_id', 'is', null)
        .not('mercos_id', 'in', `(${mercosIdsAtivos.join(',')})`);
      deactivateError = deactivateResult.error;
    } else {
      const deactivateResult = await supabaseAdmin
        .from('categories')
        .update({ active: false, updated_at: nowIso })
        .not('mercos_id', 'is', null);
      deactivateError = deactivateResult.error;
    }

    if (deactivateError) {
      console.error('Erro ao desativar categorias obsoletas:', deactivateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Sincronização global concluída com sucesso',
      categorias_processadas: categoriasUnicas.size,
      categorias_novas: categoriasParaUpsert.filter((c) => !existingByMercosId.has(c.mercos_id)).length,
      categorias_atualizadas: categoriasParaUpsert.filter((c) => existingByMercosId.has(c.mercos_id)).length,
      hierarquia_atualizada: hierarquiaUpdates.length,
      timestamp: nowIso
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Erro na sincronização global',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/admin/categories/sync-global
 * Retorna estatísticas sobre a sincronização global
 */
export async function GET(request: NextRequest) {
  try {
    // Categorias em categories com mercos_id
    const { data: categoriesData, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, mercos_id, name, active, visible, ultima_sincronizacao, parent_category_id')
      .not('mercos_id', 'is', null);

    if (catError) {
      return NextResponse.json({
        success: false,
        error: catError.message
      }, { status: 500 });
    }

    // Categorias em distribuidor_categories
    const { data: distCatData, error: distError } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('mercos_id, ativo')
      .eq('ativo', true);

    if (distError) {
      return NextResponse.json({
        success: false,
        error: distError.message
      }, { status: 500 });
    }

    const mercosIdsEmDist = new Set((distCatData || []).map(c => c.mercos_id));
    const mercosIdsEmCategories = new Set((categoriesData || []).map(c => c.mercos_id));

    const categoriasComHierarquia = (categoriesData || []).filter(c => c.parent_category_id).length;
    const ultimaSincronizacao = (categoriesData || [])
      .map(c => c.ultima_sincronizacao)
      .filter(Boolean)
      .sort()
      .reverse()[0];

    return NextResponse.json({
      success: true,
      estatisticas: {
        total_categories_com_mercos: categoriesData?.length || 0,
        categorias_ativas: (categoriesData || []).filter(c => c.active).length,
        categorias_visiveis: (categoriesData || []).filter(c => c.visible).length,
        categorias_com_hierarquia: categoriasComHierarquia,
        total_distribuidor_categories: distCatData?.length || 0,
        categorias_unicas_em_dist: mercosIdsEmDist.size,
        categorias_faltando_sync: mercosIdsEmDist.size - mercosIdsEmCategories.size,
        ultima_sincronizacao: ultimaSincronizacao
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
