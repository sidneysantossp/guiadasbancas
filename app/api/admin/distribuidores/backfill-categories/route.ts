import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { repairDistribuidorProductCategoryIds } from '@/lib/modules/distribuidor/category-mapping';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const { data: distribuidores } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome')
      .eq('ativo', true);

    if (!distribuidores || distribuidores.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum distribuidor ativo encontrado' });
    }

    const results: any[] = [];

    for (const distribuidor of distribuidores) {
      console.log(`[BACKFILL] Processando distribuidor: ${distribuidor.nome}`);
      const summary = await repairDistribuidorProductCategoryIds(distribuidor.id);
      console.log(
        `[BACKFILL] ${distribuidor.nome}: ${summary.repaired} reparados, ${summary.alreadyCorrect} corretos, ${summary.unresolved} sem mapeamento`
      );

      results.push({
        distribuidor: distribuidor.nome,
        status: 'done',
        analisados: summary.scanned,
        reparados: summary.repaired,
        corretos: summary.alreadyCorrect,
        sem_mapeamento: summary.unresolved,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('[BACKFILL] Erro:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
