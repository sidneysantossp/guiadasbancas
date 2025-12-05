import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');

    if (!distribuidorId) {
      // Listar todos os distribuidores
      const { data: distribuidores, error } = await supabaseAdmin
        .from('distribuidores')
        .select('id, nome, total_produtos');
      
      return NextResponse.json({
        success: true,
        distribuidores,
        error: error?.message
      });
    }

    console.log('[Debug Stats] Analisando distribuidor:', distribuidorId);

    // 1. Buscar info do distribuidor
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    // 2. Contar TODOS os produtos (sem filtro)
    const { count: totalSemFiltro, error: errTotal } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    // 3. Contar produtos com active = true (APENAS deste distribuidor)
    const { count: ativosTrue, error: errAtivos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    // 3b. Contar TODOS os produtos com active = true (sem filtro de distribuidor)
    const { count: todosAtivosPlataforma } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    // 3c. Buscar alguns produtos ativos para ver seus distribuidor_ids
    const { data: amostraAtivos } = await supabaseAdmin
      .from('products')
      .select('id, name, active, distribuidor_id')
      .eq('active', true)
      .limit(20);

    // 4. Contar produtos com active = false
    const { count: ativosFalse } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', false);

    // 5. Contar produtos com active IS NULL
    const { count: ativosNull } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .is('active', null);

    // 6. Buscar amostra de produtos para ver valores do campo active
    const { data: amostra } = await supabaseAdmin
      .from('products')
      .select('id, name, active, distribuidor_id')
      .eq('distribuidor_id', distribuidorId)
      .limit(10);

    // 7. Verificar se há produtos duplicados (mesmo mercos_id)
    const { data: duplicados } = await supabaseAdmin
      .from('products')
      .select('mercos_id')
      .eq('distribuidor_id', distribuidorId)
      .not('mercos_id', 'is', null);

    const mercos_ids = duplicados?.map(p => p.mercos_id) || [];
    const uniqueMercosIds = [...new Set(mercos_ids)];
    const hasDuplicates = mercos_ids.length !== uniqueMercosIds.length;

    // 8. Verificar produtos com distribuidor_id diferente mas mesmo mercos_id
    const { data: outrosDistribuidores } = await supabaseAdmin
      .from('products')
      .select('id, name, distribuidor_id, mercos_id, active')
      .neq('distribuidor_id', distribuidorId)
      .eq('active', true)
      .limit(5);

    // Agrupar amostra de ativos por distribuidor_id
    const distribuidorCounts: Record<string, number> = {};
    amostraAtivos?.forEach(p => {
      const did = p.distribuidor_id || 'null';
      distribuidorCounts[did] = (distribuidorCounts[did] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      distribuidor: {
        id: distribuidor?.id,
        nome: distribuidor?.nome,
        total_produtos_campo: distribuidor?.total_produtos,
      },
      contagens: {
        totalSemFiltro: totalSemFiltro || 0,
        ativosTrue: ativosTrue || 0,
        ativosFalse: ativosFalse || 0,
        ativosNull: ativosNull || 0,
        soma: (ativosTrue || 0) + (ativosFalse || 0) + (ativosNull || 0),
        todosAtivosPlataforma: todosAtivosPlataforma || 0,
      },
      analise: {
        inconsistente: (ativosTrue || 0) > (totalSemFiltro || 0),
        hasDuplicateMercosIds: hasDuplicates,
        totalMercosIds: mercos_ids.length,
        uniqueMercosIds: uniqueMercosIds.length,
        distribuidorCountsAmostra: distribuidorCounts,
      },
      amostraProdutos: amostra,
      amostraAtivosGeral: amostraAtivos,
      produtosOutrosDistribuidores: outrosDistribuidores,
      erros: {
        total: errTotal?.message,
        ativos: errAtivos?.message,
      }
    });
  } catch (error: any) {
    console.error('[Debug Stats] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
