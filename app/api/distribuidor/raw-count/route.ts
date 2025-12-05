import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Query RAW para contar produtos - para debug
 */
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

    console.log('[RAW-COUNT] Distribuidor:', distribuidorId);

    // Query 1: Buscar TODOS os produtos e contar manualmente
    const { data: todosProdutos, error: err1 } = await supabaseAdmin
      .from('products')
      .select('id, active, distribuidor_id')
      .eq('distribuidor_id', distribuidorId);

    const totalManual = todosProdutos?.length || 0;
    const ativosManual = todosProdutos?.filter(p => p.active === true).length || 0;
    const inativosManual = todosProdutos?.filter(p => p.active === false).length || 0;
    const nullManual = todosProdutos?.filter(p => p.active === null).length || 0;

    // Query 2: Usar count do Supabase
    const { count: totalSupabase } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const { count: ativosSupabase } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    // Query 3: RPC se existir
    let rpcResult = null;
    try {
      const { data: rpcData } = await supabaseAdmin.rpc('count_products_by_distribuidor', {
        p_distribuidor_id: distribuidorId
      });
      rpcResult = rpcData;
    } catch (e) {
      // RPC não existe, ignorar
    }

    // Verificar se há produtos com distribuidor_id diferente
    const produtosComDistribuidorErrado = todosProdutos?.filter(
      p => p.distribuidor_id !== distribuidorId
    );

    return NextResponse.json({
      success: true,
      distribuidorId,
      contagemManual: {
        total: totalManual,
        ativos: ativosManual,
        inativos: inativosManual,
        null: nullManual,
        soma: ativosManual + inativosManual + nullManual,
      },
      contagemSupabase: {
        total: totalSupabase,
        ativos: ativosSupabase,
      },
      rpcResult,
      produtosComDistribuidorErrado: produtosComDistribuidorErrado?.length || 0,
      erro: err1?.message,
      amostra: todosProdutos?.slice(0, 5),
    });
  } catch (error: any) {
    console.error('[RAW-COUNT] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
