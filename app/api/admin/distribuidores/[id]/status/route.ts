import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * API para verificar status de sincronização de um distribuidor
 * GET /api/admin/distribuidores/[id]/status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Contar produtos sincronizados
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id)
      .eq('origem', 'mercos');

    // Verificar produtos sincronizados nas últimas 24h
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    const { count: produtosRecentes } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id)
      .eq('origem', 'mercos')
      .gte('sincronizado_em', ontem.toISOString());

    // Calcular tempo desde última sincronização
    let tempoUltimaSincronizacao = null;
    if (distribuidor.ultima_sincronizacao) {
      const agora = new Date();
      const ultimaSync = new Date(distribuidor.ultima_sincronizacao);
      const diffMs = agora.getTime() - ultimaSync.getTime();
      const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHoras > 0) {
        tempoUltimaSincronizacao = `${diffHoras}h ${diffMinutos}m atrás`;
      } else {
        tempoUltimaSincronizacao = `${diffMinutos}m atrás`;
      }
    }

    // Determinar status
    let status = 'ok';
    let statusMessage = 'Sincronização em dia';
    
    if (!distribuidor.ultima_sincronizacao) {
      status = 'warning';
      statusMessage = 'Nunca sincronizado';
    } else {
      const agora = new Date();
      const ultimaSync = new Date(distribuidor.ultima_sincronizacao);
      const diffHoras = (agora.getTime() - ultimaSync.getTime()) / (1000 * 60 * 60);
      
      if (diffHoras > 24) {
        status = 'error';
        statusMessage = 'Sincronização atrasada (>24h)';
      } else if (diffHoras > 6) {
        status = 'warning';
        statusMessage = 'Sincronização pode estar atrasada (>6h)';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        distribuidor: {
          id: distribuidor.id,
          nome: distribuidor.nome,
          ativo: distribuidor.ativo,
          ultima_sincronizacao: distribuidor.ultima_sincronizacao,
          tempo_ultima_sincronizacao: tempoUltimaSincronizacao,
        },
        estatisticas: {
          total_produtos: totalProdutos || 0,
          produtos_recentes_24h: produtosRecentes || 0,
        },
        status: {
          codigo: status,
          mensagem: statusMessage,
        },
      },
    });
  } catch (error: any) {
    console.error('[STATUS] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
