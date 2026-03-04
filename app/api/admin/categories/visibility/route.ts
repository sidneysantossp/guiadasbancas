import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeCategoryName(value: string): string {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, link, order, active, visible, jornaleiro_status, jornaleiro_bancas, mercos_id, parent_category_id, ultima_sincronizacao')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
    }

    const response = NextResponse.json({ success: true, data: data || [] });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (e) {
    console.error('Exception fetching categories:', e);
    return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, visible, jornaleiroStatus, jornaleiroBancas } = body;

    console.log('[API Visibility PATCH] Recebido:', { id, visible, jornaleiroStatus, jornaleiroBancas });

    if (!id) {
      console.error('[API Visibility PATCH] Dados inválidos:', { id, visible });
      return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof visible === 'boolean') {
      updatePayload.visible = visible;
    }

    if (jornaleiroStatus) {
      updatePayload.jornaleiro_status = jornaleiroStatus;
    }

    if (jornaleiroBancas !== undefined) {
      updatePayload.jornaleiro_bancas = Array.isArray(jornaleiroBancas) ? jornaleiroBancas : [];
    }

    if (Object.keys(updatePayload).length === 1) {
      return NextResponse.json({ success: false, error: "Nenhum campo para atualizar" }, { status: 400 });
    }

    // Buscar categoria base para aplicar atualização em lote
    const { data: baseCategory, error: baseError } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('id', id)
      .single();

    if (baseError || !baseCategory) {
      console.error('[API Visibility PATCH] Categoria não encontrada:', baseError);
      return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 404 });
    }

    let idsToUpdate: string[] = [id];
    const normalizedBaseName = normalizeCategoryName(baseCategory.name || '');

    if (normalizedBaseName) {
      const { data: allCategories, error: allError } = await supabaseAdmin
        .from('categories')
        .select('id, name');

      if (allError) {
        console.warn('[API Visibility PATCH] Erro ao buscar categorias para update em lote:', allError);
      } else if (Array.isArray(allCategories)) {
        const groupedIds = allCategories
          .filter((category) => normalizeCategoryName(category.name || '') === normalizedBaseName)
          .map((category) => category.id)
          .filter(Boolean);

        if (groupedIds.length > 0) {
          idsToUpdate = Array.from(new Set(groupedIds));
        }
      }
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updatePayload)
      .in('id', idsToUpdate)
      .select('id, name, visible, jornaleiro_status, jornaleiro_bancas');

    if (error) {
      console.error('[API Visibility PATCH] Erro Supabase:', error);
      return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
    }

    const primaryRow = Array.isArray(data)
      ? data.find((row) => row.id === id) || data[0]
      : null;

    console.log('[API Visibility PATCH] Sucesso:', {
      categoria: primaryRow?.name,
      ids_atualizados: idsToUpdate.length,
    });

    // Invalidar cache da home page e da API de categorias
    try {
      revalidatePath('/', 'page');
      revalidatePath('/buscar', 'page');
      revalidatePath('/categorias', 'page');
      revalidatePath('/api/categories', 'page');
      console.log('[API Visibility PATCH] Cache invalidado para / e /api/categories');
    } catch (e) {
      console.warn('[API Visibility PATCH] Erro ao invalidar cache:', e);
    }

    const response = NextResponse.json({
      success: true,
      data: primaryRow,
      updated_ids: idsToUpdate,
      updated_count: idsToUpdate.length,
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e) {
    console.error('[API Visibility PATCH] Exception:', e);
    return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
  }
}
