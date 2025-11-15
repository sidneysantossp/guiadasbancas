import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * API de Diagnóstico de Sincronização
 * Compara produtos da Mercos com o banco e identifica divergências
 */
export async function GET() {
  try {
    console.log('[DIAGNOSTICO] Iniciando análise...');
    
    // Buscar todos os distribuidores ativos
    const { data: distribuidores, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('ativo', true);

    if (distError || !distribuidores) {
      throw new Error('Erro ao buscar distribuidores');
    }

    const resultados = [];

    for (const distribuidor of distribuidores) {
      try {
        console.log(`[DIAGNOSTICO] Analisando: ${distribuidor.nome}`);

        const mercosApi = new MercosAPI({
          applicationToken: distribuidor.application_token,
          companyToken: distribuidor.company_token,
          baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
        });

        // Testar conexão
        const connectionTest = await mercosApi.testConnection();
        if (!connectionTest.success) {
          resultados.push({
            distribuidor: distribuidor.nome,
            distribuidor_id: distribuidor.id,
            erro: `Falha na conexão: ${connectionTest.error}`,
            status: 'error',
          });
          continue;
        }

        // Buscar TODOS os produtos da Mercos (com paginação)
        console.log(`[DIAGNOSTICO] Buscando produtos da Mercos...`);
        const produtosMercos = [];
        let hasMore = true;
        let alteradoApos = null;

        while (hasMore) {
          const { produtos, limited } = await mercosApi.getBatchProdutosByAlteracao({
            alteradoApos,
            limit: 200,
          });

          produtosMercos.push(...produtos);
          
          if (limited && produtos.length > 0) {
            const ultimo = produtos[produtos.length - 1];
            alteradoApos = ultimo.ultima_alteracao;
          } else {
            hasMore = false;
          }

          // Limite de segurança
          if (produtosMercos.length > 10000) {
            console.warn(`[DIAGNOSTICO] Limite de 10k produtos atingido`);
            break;
          }
        }

        console.log(`[DIAGNOSTICO] Total Mercos: ${produtosMercos.length}`);

        // Buscar produtos no banco
        const { data: produtosBanco, error: bancoError } = await supabaseAdmin
          .from('products')
          .select('id, mercos_id, name, active')
          .eq('distribuidor_id', distribuidor.id);

        if (bancoError) {
          throw bancoError;
        }

        console.log(`[DIAGNOSTICO] Total Banco: ${produtosBanco?.length || 0}`);

        // Criar mapas para comparação
        const mercosMap = new Map(produtosMercos.map(p => [p.id, p]));
        const bancoMap = new Map((produtosBanco || []).map(p => [p.mercos_id, p]));

        // Identificar divergências
        const faltandoNoBanco = produtosMercos.filter(p => !bancoMap.has(p.id));
        const faltandoNaMercos = (produtosBanco || []).filter(p => !mercosMap.has(p.mercos_id));
        const ativos = produtosMercos.filter(p => p.ativo && !p.excluido);
        const inativos = produtosMercos.filter(p => !p.ativo || p.excluido);

        // Produtos com dados diferentes
        const desatualizados = [];
        for (const produtoMercos of produtosMercos) {
          const produtoBanco = bancoMap.get(produtoMercos.id);
          if (produtoBanco) {
            const mudou = (
              produtoMercos.nome !== produtoBanco.name ||
              (produtoMercos.ativo && !produtoMercos.excluido) !== produtoBanco.active
            );
            if (mudou) {
              desatualizados.push({
                mercos_id: produtoMercos.id,
                nome_mercos: produtoMercos.nome,
                nome_banco: produtoBanco.name,
                ativo_mercos: produtoMercos.ativo && !produtoMercos.excluido,
                ativo_banco: produtoBanco.active,
              });
            }
          }
        }

        const resultado = {
          distribuidor: distribuidor.nome,
          distribuidor_id: distribuidor.id,
          status: 'success',
          totais: {
            mercos_total: produtosMercos.length,
            mercos_ativos: ativos.length,
            mercos_inativos: inativos.length,
            banco_total: produtosBanco?.length || 0,
            banco_ativos: (produtosBanco || []).filter(p => p.active).length,
            banco_inativos: (produtosBanco || []).filter(p => !p.active).length,
          },
          divergencias: {
            faltando_no_banco: faltandoNoBanco.length,
            faltando_na_mercos: faltandoNaMercos.length,
            desatualizados: desatualizados.length,
            diferenca_total: produtosMercos.length - (produtosBanco?.length || 0),
          },
          detalhes: {
            faltando_no_banco: faltandoNoBanco.slice(0, 50).map(p => ({
              mercos_id: p.id,
              nome: p.nome,
              ativo: p.ativo && !p.excluido,
              preco: p.preco_tabela,
            })),
            faltando_na_mercos: faltandoNaMercos.slice(0, 50).map(p => ({
              id: p.id,
              mercos_id: p.mercos_id,
              nome: p.name,
            })),
            desatualizados: desatualizados.slice(0, 50),
          },
          recomendacao: faltandoNoBanco.length > 0 || desatualizados.length > 0
            ? 'Executar sincronização completa'
            : 'Sincronização em dia',
        };

        resultados.push(resultado);

        console.log(`[DIAGNOSTICO] ✓ ${distribuidor.nome}: ${faltandoNoBanco.length} faltando, ${desatualizados.length} desatualizados`);

      } catch (error: any) {
        console.error(`[DIAGNOSTICO] Erro em ${distribuidor.nome}:`, error);
        resultados.push({
          distribuidor: distribuidor.nome,
          distribuidor_id: distribuidor.id,
          status: 'error',
          erro: error.message,
        });
      }
    }

    // Calcular totais gerais
    const totaisGerais = resultados.reduce((acc, r: any) => {
      if (r.status === 'success' && r.totais) {
        acc.mercos_total += r.totais.mercos_total;
        acc.banco_total += r.totais.banco_total;
        acc.faltando_no_banco += r.divergencias.faltando_no_banco;
        acc.desatualizados += r.divergencias.desatualizados;
      }
      return acc;
    }, {
      mercos_total: 0,
      banco_total: 0,
      faltando_no_banco: 0,
      desatualizados: 0,
    });

    return NextResponse.json({
      success: true,
      executado_em: new Date().toISOString(),
      distribuidores_analisados: distribuidores.length,
      totais_gerais: totaisGerais,
      precisao_percentual: totaisGerais.mercos_total > 0
        ? ((totaisGerais.banco_total / totaisGerais.mercos_total) * 100).toFixed(2) + '%'
        : '0%',
      resultados,
    });

  } catch (error: any) {
    console.error('[DIAGNOSTICO] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
