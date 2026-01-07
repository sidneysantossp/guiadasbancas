import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Listar todos os distribuidores
    const { data: distribuidores, error: errDist } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, email, ativo');

    if (errDist) {
      return NextResponse.json({ error: errDist.message }, { status: 500 });
    }

    const result: any[] = [];

    for (const d of distribuidores || []) {
      // Contar produtos deste distribuidor
      const { count: totalProdutos } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', d.id);

      const { count: produtosAtivos } = await supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', d.id)
        .eq('active', true);

      result.push({
        id: d.id,
        nome: d.nome,
        email: d.email || 'N/A',
        ativo: d.ativo,
        totalProdutos: totalProdutos || 0,
        produtosAtivos: produtosAtivos || 0,
      });
    }

    // 2. Contar bancas
    const { count: bancasCotistas } = await supabaseAdmin
      .from('bancas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)
      .or('is_cotista.eq.true,cotista_id.not.is.null');

    const { count: todasBancas } = await supabaseAdmin
      .from('bancas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    return NextResponse.json({
      distribuidores: result,
      bancas: {
        totalAtivas: todasBancas || 0,
        cotistas: bancasCotistas || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
