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
    console.log('[DELETE PRODUCT] ID:', params.id);
    
    if (!verifyAdminAuth(request)) {
      console.log('[DELETE PRODUCT] Auth failed');
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('[DELETE PRODUCT] Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || "Erro ao excluir produto",
        details: error
      }, { status: 500 });
    }

    console.log('[DELETE PRODUCT] Success, deleted:', data);
    return NextResponse.json({ success: true, message: "Produto excluído com sucesso", deleted: data });
  } catch (error: any) {
    console.error('[DELETE PRODUCT] Exception:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Erro interno",
      details: error.toString()
    }, { status: 500 });
  }
}

// PUT - Atualizar produto
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('[UPDATE PRODUCT] ID:', params.id);
    console.log('[UPDATE PRODUCT] Body:', JSON.stringify(body, null, 2));
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('[UPDATE PRODUCT] Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || "Erro ao atualizar produto",
        details: error 
      }, { status: 500 });
    }

    console.log('[UPDATE PRODUCT] Success');
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[UPDATE PRODUCT] Exception:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Erro interno",
      details: error.toString()
    }, { status: 500 });
  }
}
