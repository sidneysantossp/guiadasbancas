import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST - Aplicar markup em massa a todos os produtos do distribuidor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      distribuidor_id, 
      tipo_calculo,
      markup_percentual, 
      markup_fixo,
      margem_percentual,
      margem_divisor 
    } = body;

    if (!distribuidor_id) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[Markup Bulk] Aplicando markup em massa:', { distribuidor_id, tipo_calculo });

    // 1. Primeiro, salvar a configuração global do distribuidor
    const { error: updateError } = await supabaseAdmin
      .from('distribuidores')
      .update({
        markup_global_percentual: markup_percentual || 0,
        markup_global_fixo: markup_fixo || 0,
        margem_percentual: margem_percentual || 0,
        margem_divisor: margem_divisor || 1,
        tipo_calculo: tipo_calculo || 'markup',
      })
      .eq('id', distribuidor_id);

    if (updateError) {
      console.error('[Markup Bulk] Erro ao atualizar distribuidor:', updateError);
      throw updateError;
    }

    // 2. Buscar todos os produtos do distribuidor (sem limite, incluindo inativos)
    // Supabase tem limite padrão de 1000, então precisamos buscar em lotes
    let allProdutos: any[] = [];
    let from = 0;
    const FETCH_SIZE = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data: produtos, error: prodError } = await supabaseAdmin
        .from('products')
        .select('id, price')
        .eq('distribuidor_id', distribuidor_id)
        .range(from, from + FETCH_SIZE - 1);

      if (prodError) {
        console.error('[Markup Bulk] Erro ao buscar produtos:', prodError);
        throw prodError;
      }

      if (produtos && produtos.length > 0) {
        allProdutos = allProdutos.concat(produtos);
        from += FETCH_SIZE;
        hasMore = produtos.length === FETCH_SIZE;
      } else {
        hasMore = false;
      }
    }

    const produtos = allProdutos;

    if (!produtos || produtos.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: 'Nenhum produto encontrado para este distribuidor'
      });
    }

    // 3. Calcular o markup efetivo baseado no tipo de cálculo
    let effectivePercentual = 0;
    let effectiveFixo = 0;

    if (tipo_calculo === 'margem') {
      // Converter margem para percentual equivalente
      // Margem: Preço Final = Preço Base / Divisor
      // Markup equivalente: (1 / Divisor - 1) * 100
      const divisor = margem_divisor || 1;
      if (divisor > 0 && divisor < 1) {
        effectivePercentual = ((1 / divisor) - 1) * 100;
      }
    } else {
      effectivePercentual = markup_percentual || 0;
      effectiveFixo = markup_fixo || 0;
    }

    // 4. Criar/atualizar registros de markup para cada produto
    const markupRecords = produtos.map(produto => ({
      distribuidor_id,
      product_id: produto.id,
      markup_percentual: effectivePercentual,
      markup_fixo: effectiveFixo,
    }));

    // Upsert em lotes de 100
    const BATCH_SIZE = 100;
    let totalUpdated = 0;

    for (let i = 0; i < markupRecords.length; i += BATCH_SIZE) {
      const batch = markupRecords.slice(i, i + BATCH_SIZE);
      
      const { error: upsertError } = await supabaseAdmin
        .from('distribuidor_markup_produtos')
        .upsert(batch, {
          onConflict: 'distribuidor_id,product_id',
        });

      if (upsertError) {
        console.error('[Markup Bulk] Erro ao inserir lote:', upsertError);
        // Continuar com os próximos lotes mesmo se um falhar
      } else {
        totalUpdated += batch.length;
      }
    }

    console.log(`[Markup Bulk] ${totalUpdated} produtos atualizados com markup`);

    return NextResponse.json({
      success: true,
      updated: totalUpdated,
      total: produtos.length,
    });
  } catch (error: any) {
    console.error('[Markup Bulk] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remover todos os markups individuais de produtos
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('distribuidor_id');

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[Markup Bulk] Removendo todos os markups de produtos:', distribuidorId);

    // Contar quantos serão removidos
    const { count } = await supabaseAdmin
      .from('distribuidor_markup_produtos')
      .select('id', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    // Remover todos os markups de produtos do distribuidor
    const { error } = await supabaseAdmin
      .from('distribuidor_markup_produtos')
      .delete()
      .eq('distribuidor_id', distribuidorId);

    if (error) {
      console.error('[Markup Bulk] Erro ao remover markups:', error);
      throw error;
    }

    console.log(`[Markup Bulk] ${count} markups removidos`);

    return NextResponse.json({
      success: true,
      deleted: count || 0,
    });
  } catch (error: any) {
    console.error('[Markup Bulk] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
