import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

// PATCH /api/jornaleiro/catalogo-distribuidor/:productId
// Atualiza customizações de um produto do catálogo distribuidor
export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    // Obter sessão do NextAuth
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;

    // Buscar banca do jornaleiro (pela tabela bancas, não user_profiles)
    const { data: banca } = await supabase
      .from('bancas')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    const bancaId = banca.id;
    const body = await req.json();

    // Validar que o produto existe e é de distribuidor
    const { data: produto } = await supabase
      .from('products')
      .select('id, distribuidor_id')
      .eq('id', params.productId)
      .single();

    if (!produto || !produto.distribuidor_id) {
      return NextResponse.json(
        { success: false, error: 'Produto não encontrado ou não é de distribuidor' },
        { status: 404 }
      );
    }

    // Verificar se já existe customização
    const { data: existing } = await supabase
      .from('banca_produtos_distribuidor')
      .select('id')
      .eq('banca_id', bancaId)
      .eq('product_id', params.productId)
      .single();

    const updateData: any = {};

    // Apenas campos permitidos para customização
    if (body.custom_price !== undefined) updateData.custom_price = body.custom_price;
    if (body.custom_description !== undefined) updateData.custom_description = body.custom_description;
    if (body.custom_status !== undefined) updateData.custom_status = body.custom_status;
    if (body.custom_pronta_entrega !== undefined) updateData.custom_pronta_entrega = body.custom_pronta_entrega;
    if (body.custom_sob_encomenda !== undefined) updateData.custom_sob_encomenda = body.custom_sob_encomenda;
    if (body.custom_pre_venda !== undefined) updateData.custom_pre_venda = body.custom_pre_venda;
    if (body.custom_stock_enabled !== undefined) updateData.custom_stock_enabled = body.custom_stock_enabled;
    if (body.custom_stock_qty !== undefined) updateData.custom_stock_qty = body.custom_stock_qty;
    if (body.custom_featured !== undefined) updateData.custom_featured = body.custom_featured;

    if (existing) {
      // Atualizar customização existente
      const { error } = await supabase
        .from('banca_produtos_distribuidor')
        .update(updateData)
        .eq('id', existing.id);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
    } else {
      // Criar nova customização
      const { error } = await supabase
        .from('banca_produtos_distribuidor')
        .insert([{
          banca_id: bancaId,
          product_id: params.productId,
          ...updateData,
        }]);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Customização atualizada com sucesso',
    });
  } catch (error: any) {
    console.error('[API] Erro ao atualizar customização:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
