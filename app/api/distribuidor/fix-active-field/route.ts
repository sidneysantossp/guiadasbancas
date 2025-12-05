import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Corrige o campo 'active' baseado no campo 'ativo' para todos os produtos de um distribuidor.
 * Isso resolve a inconsistência onde produtos têm 'ativo = true' mas 'active' está NULL.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[FIX-ACTIVE] Iniciando correção para distribuidor:', distribuidorId);

    // 1. Contar produtos com inconsistência (ativo = true mas active != true)
    const { count: inconsistentesAtivoTrue } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', true)
      .neq('active', true);

    // 2. Contar produtos com ativo = false mas active != false
    const { count: inconsistentesAtivoFalse } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', false)
      .neq('active', false);

    // 3. Contar produtos com active = null
    const { count: activeNull } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .is('active', null);

    console.log('[FIX-ACTIVE] Inconsistências encontradas:', {
      ativoTrueActiveNot: inconsistentesAtivoTrue,
      ativoFalseActiveNot: inconsistentesAtivoFalse,
      activeNull,
    });

    // 4. Atualizar produtos onde ativo = true para active = true
    const { error: updateTrueError, count: updatedTrue } = await supabaseAdmin
      .from('products')
      .update({ active: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', true)
      .neq('active', true);

    if (updateTrueError) {
      console.error('[FIX-ACTIVE] Erro ao atualizar active=true:', updateTrueError);
    }

    // 5. Atualizar produtos onde ativo = false para active = false
    const { error: updateFalseError, count: updatedFalse } = await supabaseAdmin
      .from('products')
      .update({ active: false })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', false)
      .neq('active', false);

    if (updateFalseError) {
      console.error('[FIX-ACTIVE] Erro ao atualizar active=false:', updateFalseError);
    }

    // 6. Para produtos onde active é null, copiar o valor de ativo
    const { error: updateNullError } = await supabaseAdmin
      .from('products')
      .update({ active: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', true)
      .is('active', null);

    const { error: updateNullFalseError } = await supabaseAdmin
      .from('products')
      .update({ active: false })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', false)
      .is('active', null);

    // 7. Verificar resultado final
    const { count: totalFinal } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const { count: ativosFinal } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    const { count: inativosFinal } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', false);

    const { count: nullFinal } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .is('active', null);

    console.log('[FIX-ACTIVE] Resultado final:', {
      total: totalFinal,
      ativos: ativosFinal,
      inativos: inativosFinal,
      null: nullFinal,
    });

    return NextResponse.json({
      success: true,
      antes: {
        inconsistentesAtivoTrue,
        inconsistentesAtivoFalse,
        activeNull,
      },
      depois: {
        total: totalFinal,
        ativos: ativosFinal,
        inativos: inativosFinal,
        null: nullFinal,
        soma: (ativosFinal || 0) + (inativosFinal || 0) + (nullFinal || 0),
        consistente: (ativosFinal || 0) <= (totalFinal || 0),
      },
      erros: {
        updateTrue: updateTrueError?.message,
        updateFalse: updateFalseError?.message,
        updateNull: updateNullError?.message,
        updateNullFalse: updateNullFalseError?.message,
      },
    });
  } catch (error: any) {
    console.error('[FIX-ACTIVE] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar estado atual
    const { count: total } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const { count: ativoTrue } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('ativo', true);

    const { count: activeTrue } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    const { count: activeNull } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .is('active', null);

    const { count: activeFalse } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', false);

    return NextResponse.json({
      success: true,
      distribuidorId,
      contagens: {
        total,
        ativoTrue,
        activeTrue,
        activeFalse,
        activeNull,
        inconsistente: activeTrue !== ativoTrue || (activeTrue || 0) > (total || 0),
      },
      problema: (activeTrue || 0) > (total || 0) 
        ? `ERRO: ${activeTrue} ativos > ${total} total. Provavelmente active está contando produtos de outros distribuidores ou há dados corrompidos.`
        : activeTrue !== ativoTrue
          ? `AVISO: ativo(${ativoTrue}) != active(${activeTrue}). Execute POST para corrigir.`
          : 'OK: Campos ativo e active estão sincronizados.',
    });
  } catch (error: any) {
    console.error('[FIX-ACTIVE] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
