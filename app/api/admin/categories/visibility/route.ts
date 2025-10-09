import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, link, order, active, visible')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (e) {
    console.error('Exception fetching categories:', e);
    return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, visible } = body;

    if (!id || typeof visible !== 'boolean') {
      return NextResponse.json({ success: false, error: "ID e visible são obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ visible, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating category visibility:', error);
      return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (e) {
    console.error('Exception updating category visibility:', e);
    return NextResponse.json({ success: false, error: "Erro ao atualizar visibilidade" }, { status: 500 });
  }
}
