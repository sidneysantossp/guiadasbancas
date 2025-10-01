import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// DELETE - Excluir produto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ success: false, error: "Erro ao excluir produto" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Produto excluído com sucesso" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// PUT - Atualizar produto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Erro ao atualizar produto" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
