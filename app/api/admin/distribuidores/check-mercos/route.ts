import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * API para verificar produtos na Mercos e comparar com o banco
 */
export async function GET() {
  try {
    // Buscar Brancaleone
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('nome', 'Brancaleone Publicações')
      .single();

    if (!distribuidor) {
      return NextResponse.json({ error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Buscar últimos 50 produtos da Mercos
    const { produtos } = await mercosApi.getBatchProdutosByAlteracao({
      alteradoApos: null,
      limit: 50,
    });

    // Filtrar apenas ativos
    const ativos = produtos.filter(p => p.ativo && !p.excluido);
    const inativos = produtos.filter(p => !p.ativo || p.excluido);

    // Buscar no banco
    const mercosIds = produtos.map(p => p.id);
    const { data: produtosBanco } = await supabaseAdmin
      .from('products')
      .select('id, mercos_id, name, active')
      .eq('distribuidor_id', distribuidor.id)
      .in('mercos_id', mercosIds);

    const bancoMap = new Map((produtosBanco || []).map(p => [p.mercos_id, p]));

    // Comparar
    const resultado = produtos.map(p => {
      const noBanco = bancoMap.get(p.id);
      return {
        mercos_id: p.id,
        nome: p.nome,
        ativo_mercos: p.ativo && !p.excluido,
        excluido_mercos: p.excluido,
        no_banco: !!noBanco,
        ativo_banco: noBanco?.active || false,
        status: !noBanco 
          ? '❌ FALTANDO NO BANCO'
          : (p.ativo && !p.excluido) !== noBanco.active
          ? '⚠️ STATUS DIFERENTE'
          : '✅ OK',
      };
    });

    // Contar totais
    const { count: totalMercosAtivos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidor.id)
      .eq('active', true);

    return NextResponse.json({
      success: true,
      resumo: {
        ultimos_50_mercos: produtos.length,
        ativos_nos_50: ativos.length,
        inativos_nos_50: inativos.length,
        total_ativos_banco: totalMercosAtivos,
      },
      produtos: resultado,
      faltando: resultado.filter(r => r.status.includes('FALTANDO')),
    });

  } catch (error: any) {
    console.error('[CHECK-MERCOS] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
