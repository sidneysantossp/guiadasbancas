import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar produto por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    const [bancaResponse, distribuidorResponse, categoryResponse, distribuidorCategoryResponse] = await Promise.all([
      data.banca_id
        ? supabaseAdmin
            .from('bancas')
            .select('id, user_id, name, address, whatsapp, active, approved')
            .eq('id', data.banca_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      data.distribuidor_id
        ? supabaseAdmin
            .from('distribuidores')
            .select('id, nome, ativo, ultima_sincronizacao')
            .eq('id', data.distribuidor_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      data.category_id
        ? supabaseAdmin
            .from('categories')
            .select('id, name')
            .eq('id', data.category_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
      data.category_id
        ? supabaseAdmin
            .from('distribuidor_categories')
            .select('id, nome')
            .eq('id', data.category_id)
            .single()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const relatedCategoryName =
      categoryResponse.data?.name ||
      distribuidorCategoryResponse.data?.nome ||
      null;

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        category_name: relatedCategoryName,
        banca: bancaResponse.data || null,
        distribuidor: distribuidorResponse.data || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
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
