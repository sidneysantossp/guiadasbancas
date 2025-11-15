import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * API para estatísticas de sincronização
 */
export async function GET() {
  try {
    // Buscar todos os distribuidores
    const { data: distribuidores, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, ativo, ultima_sincronizacao, total_produtos')
      .order('nome');

    if (distError) throw distError;

    const stats = [];

    for (const dist of distribuidores || []) {
      // Contar produtos ativos
      const { count: produtosAtivos } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', dist.id)
        .eq('active', true);

      // Contar produtos inativos
      const { count: produtosInativos } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', dist.id)
        .eq('active', false);

      // Calcular tempo desde última sync
      const ultimaSync = dist.ultima_sincronizacao 
        ? new Date(dist.ultima_sincronizacao)
        : null;
      
      const agora = new Date();
      const minutosDesdeSync = ultimaSync 
        ? Math.floor((agora.getTime() - ultimaSync.getTime()) / 1000 / 60)
        : null;

      // Status
      let status = 'ok';
      if (!dist.ativo) {
        status = 'inativo';
      } else if (!ultimaSync) {
        status = 'nunca_sincronizado';
      } else if (minutosDesdeSync && minutosDesdeSync > 60) {
        status = 'atrasado';
      } else if (minutosDesdeSync && minutosDesdeSync > 30) {
        status = 'warning';
      }

      stats.push({
        id: dist.id,
        nome: dist.nome,
        ativo: dist.ativo,
        ultima_sincronizacao: dist.ultima_sincronizacao,
        minutos_desde_sync: minutosDesdeSync,
        total_produtos: dist.total_produtos || 0,
        produtos_ativos: produtosAtivos || 0,
        produtos_inativos: produtosInativos || 0,
        status,
      });
    }

    // Totais gerais
    const totais = stats.reduce((acc, s) => ({
      total_produtos: acc.total_produtos + s.total_produtos,
      produtos_ativos: acc.produtos_ativos + s.produtos_ativos,
      produtos_inativos: acc.produtos_inativos + s.produtos_inativos,
    }), { total_produtos: 0, produtos_ativos: 0, produtos_inativos: 0 });

    return NextResponse.json({
      success: true,
      atualizado_em: new Date().toISOString(),
      distribuidores: stats,
      totais,
    });

  } catch (error: any) {
    console.error('[SYNC-STATS] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
