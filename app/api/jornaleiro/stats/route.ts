import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { getActiveBancaRowForUser } from '@/lib/jornaleiro-banca';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // Autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar banca do jornaleiro
    const banca = await getActiveBancaRowForUser(userId, 'id, is_cotista, cotista_id');
    
    if (!banca) {
      return NextResponse.json({
        success: true,
        data: {
          produtosProprios: 0,
          produtosDistribuidor: 0,
          produtosAtivos: 0,
          pedidosHoje: 0,
          pedidosPendentes: 0,
          faturamentoHoje: 0,
        }
      });
    }

    const bancaId = banca.id;
    const isCotista = banca.is_cotista === true || !!banca.cotista_id;

    // Usar COUNT direto para evitar limite de 1000 registros do Supabase
    const hoje = new Date();
    const hojeStart = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).toISOString();

    // Executar todas as queries em paralelo
    const [
      produtosPropriosRes,
      produtosDistribuidorRes,
      pedidosHojeRes,
      pedidosPendentesRes,
      faturamentoRes
    ] = await Promise.all([
      // Contar produtos próprios da banca (ativos)
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('banca_id', bancaId)
        .eq('active', true),
      // Contar TODOS os produtos de distribuidores ativos (apenas se cotista)
      isCotista
        ? supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .not('distribuidor_id', 'is', null)
            .eq('active', true)
        : Promise.resolve({ count: 0 }),
      // Pedidos de hoje
      supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('banca_id', bancaId)
        .gte('created_at', hojeStart),
      // Pedidos pendentes (não entregues nem cancelados)
      supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('banca_id', bancaId)
        .not('status', 'in', '("entregue","cancelado")'),
      // Faturamento de hoje (buscar valores)
      supabaseAdmin
        .from('orders')
        .select('total')
        .eq('banca_id', bancaId)
        .gte('created_at', hojeStart)
    ]);

    const produtosProprios = produtosPropriosRes.count || 0;
    const produtosDistribuidor = isCotista ? (produtosDistribuidorRes.count || 0) : 0;
    const pedidosHoje = pedidosHojeRes.count || 0;
    const pedidosPendentes = pedidosPendentesRes.count || 0;
    
    // Calcular faturamento
    const ordensHoje = faturamentoRes.data || [];
    const faturamentoHoje = ordensHoje.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);

    const produtosAtivos = produtosProprios + produtosDistribuidor;

    console.log('[Stats Jornaleiro] Contagens:', {
      bancaId,
      isCotista,
      produtosProprios,
      produtosDistribuidor,
      produtosAtivos,
      pedidosHoje,
      pedidosPendentes,
      faturamentoHoje,
    });

    return NextResponse.json({
      success: true,
      data: {
        produtosProprios,
        produtosDistribuidor,
        produtosAtivos,
        pedidosHoje,
        pedidosPendentes,
        faturamentoHoje,
        isCotista,
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error: any) {
    console.error('[Stats Jornaleiro] Erro:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
