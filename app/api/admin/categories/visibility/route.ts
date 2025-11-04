import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, link, order, active, visible, jornaleiro_status, jornaleiro_bancas')
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

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[API Visibility PATCH] Erro Supabase:', error);
      return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
    }

    console.log('[API Visibility PATCH] Sucesso:', data?.[0]);
    const response = NextResponse.json({ success: true, data: data?.[0] });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (e) {
    console.error('[API Visibility PATCH] Exception:', e);
    return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
  }
}
