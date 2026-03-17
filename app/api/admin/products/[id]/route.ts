import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadAdminProductDetail } from "@/lib/modules/products/service";

export const dynamic = 'force-dynamic';

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const data = await loadAdminProductDetail(params.id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// DELETE - Excluir produto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('[DELETE PRODUCT] ID:', params.id);
    
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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
