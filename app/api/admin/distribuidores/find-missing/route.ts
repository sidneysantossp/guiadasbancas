import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * API para encontrar produtos que estão na Mercos mas não no banco
 */
export async function GET() {
  try {
    console.log('[FIND-MISSING] Iniciando busca...');
    
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

    // Buscar TODOS os produtos ATIVOS da Mercos
    console.log('[FIND-MISSING] Buscando produtos da Mercos...');
    const produtosMercos: any[] = [];
    
    for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize: 500, alteradoApos: null })) {
      const ativos = lote.filter(p => p.ativo && !p.excluido);
      produtosMercos.push(...ativos);
      console.log(`[FIND-MISSING] Lote: ${lote.length} produtos, ${ativos.length} ativos`);
    }

    console.log(`[FIND-MISSING] Total Mercos ATIVOS: ${produtosMercos.length}`);

    // Buscar todos os produtos do banco
    console.log('[FIND-MISSING] Buscando produtos do banco...');
    const { data: produtosBanco } = await supabaseAdmin
      .from('products')
      .select('id, mercos_id, name, active')
      .eq('distribuidor_id', distribuidor.id);

    const produtosBancoAtivos = (produtosBanco || []).filter(p => p.active);
    console.log(`[FIND-MISSING] Total Banco ATIVOS: ${produtosBancoAtivos.length}`);

    // Criar mapa de produtos do banco
    const bancoMap = new Map(produtosBancoAtivos.map(p => [p.mercos_id, p]));

    // Encontrar produtos que estão na Mercos mas não no banco
    const faltando = produtosMercos.filter(p => !bancoMap.has(p.id));

    console.log(`[FIND-MISSING] Produtos faltando: ${faltando.length}`);

    // Encontrar produtos que estão no banco mas não na Mercos (inativos que deveriam ser removidos)
    const mercosMap = new Map(produtosMercos.map(p => [p.id, p]));
    const sobrando = produtosBancoAtivos.filter(p => !mercosMap.has(p.mercos_id));

    console.log(`[FIND-MISSING] Produtos sobrando no banco: ${sobrando.length}`);

    return NextResponse.json({
      success: true,
      resumo: {
        mercos_ativos: produtosMercos.length,
        banco_ativos: produtosBancoAtivos.length,
        diferenca: produtosMercos.length - produtosBancoAtivos.length,
        faltando_no_banco: faltando.length,
        sobrando_no_banco: sobrando.length,
      },
      produtos_faltando: faltando.map(p => ({
        mercos_id: p.id,
        nome: p.nome,
        ativo: p.ativo,
        excluido: p.excluido,
        preco: p.preco,
        estoque: p.estoque,
      })),
      produtos_sobrando: sobrando.map(p => ({
        id: p.id,
        mercos_id: p.mercos_id,
        nome: p.name,
        ativo: p.active,
      })),
    });

  } catch (error: any) {
    console.error('[FIND-MISSING] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
