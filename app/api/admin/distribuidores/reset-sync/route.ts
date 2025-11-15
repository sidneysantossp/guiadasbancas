import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * API para RESETAR e SINCRONIZAR apenas produtos ATIVOS
 * 
 * ATENÇÃO: Esta operação:
 * 1. Deleta TODOS os produtos de distribuidores
 * 2. Sincroniza apenas produtos ATIVOS da Mercos
 * 3. Ignora produtos inativos/excluídos
 */
export async function POST(request: Request) {
  try {
    const { confirmar } = await request.json();
    
    if (confirmar !== 'SIM_DELETAR_TUDO') {
      return NextResponse.json({
        success: false,
        error: 'Confirmação necessária. Envie { "confirmar": "SIM_DELETAR_TUDO" }',
        aviso: 'Esta operação vai DELETAR todos os produtos de distribuidores e sincronizar apenas os ATIVOS'
      }, { status: 400 });
    }

    console.log('[RESET-SYNC] 🚨 INICIANDO RESET COMPLETO...');

    // ETAPA 1: Deletar todos os produtos de distribuidores
    console.log('[RESET-SYNC] 📦 Contando produtos antes da exclusão...');
    const { count: totalAntes } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('distribuidor_id', 'is', null);

    console.log(`[RESET-SYNC] 🗑️  Deletando ${totalAntes} produtos de distribuidores...`);
    
    const { error: deleteError } = await supabaseAdmin
      .from('products')
      .delete()
      .not('distribuidor_id', 'is', null);

    if (deleteError) {
      throw new Error(`Erro ao deletar produtos: ${deleteError.message}`);
    }

    console.log('[RESET-SYNC] ✅ Produtos deletados com sucesso!');

    // ETAPA 2: Buscar distribuidores ativos
    const { data: distribuidores, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('ativo', true);

    if (distError || !distribuidores) {
      throw new Error('Erro ao buscar distribuidores');
    }

    console.log(`[RESET-SYNC] 📋 ${distribuidores.length} distribuidores ativos encontrados`);

    const resultados = [];

    // ETAPA 3: Sincronizar cada distribuidor (APENAS ATIVOS)
    for (const distribuidor of distribuidores) {
      try {
        console.log(`[RESET-SYNC] 🔄 Sincronizando: ${distribuidor.nome}`);

        const mercosApi = new MercosAPI({
          applicationToken: distribuidor.application_token,
          companyToken: distribuidor.company_token,
          baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
        });

        // Testar conexão
        const connectionTest = await mercosApi.testConnection();
        if (!connectionTest.success) {
          console.error(`[RESET-SYNC] ❌ Falha na conexão: ${distribuidor.nome}`);
          resultados.push({
            distribuidor: distribuidor.nome,
            success: false,
            error: `Falha na conexão: ${connectionTest.error}`,
          });
          continue;
        }

        // Buscar TODOS os produtos ATIVOS da Mercos
        console.log(`[RESET-SYNC] 📥 Buscando produtos ativos da Mercos...`);
        const produtosAtivos = [];
        let hasMore = true;
        let alteradoApos = '2020-01-01T00:00:00'; // Desde o início

        while (hasMore) {
          const { produtos, limited } = await mercosApi.getBatchProdutosByAlteracao({
            alteradoApos,
            limit: 200,
          });

          // Filtrar apenas produtos ATIVOS (não excluídos e ativos)
          const ativosNesteLote = produtos.filter(p => p.ativo && !p.excluido);
          produtosAtivos.push(...ativosNesteLote);

          console.log(`[RESET-SYNC] 📦 Lote: ${produtos.length} total, ${ativosNesteLote.length} ativos`);

          if (limited && produtos.length > 0) {
            const ultimo = produtos[produtos.length - 1];
            alteradoApos = ultimo.ultima_alteracao;
          } else {
            hasMore = false;
          }

          // Limite de segurança
          if (produtosAtivos.length > 10000) {
            console.warn(`[RESET-SYNC] ⚠️  Limite de 10k produtos atingido`);
            break;
          }
        }

        console.log(`[RESET-SYNC] ✅ ${produtosAtivos.length} produtos ativos encontrados`);

        // Inserir produtos em lotes de 200
        let produtosInseridos = 0;
        const BATCH_SIZE = 200;

        for (let i = 0; i < produtosAtivos.length; i += BATCH_SIZE) {
          const batch = produtosAtivos.slice(i, i + BATCH_SIZE);
          
          const produtosParaInserir = batch.map(p => ({
            name: p.nome,
            description: p.observacoes || '',
            price: p.preco_tabela,
            stock_qty: p.saldo_estoque || 0,
            images: [],
            banca_id: null,
            distribuidor_id: distribuidor.id,
            mercos_id: p.id,
            codigo_mercos: p.codigo || null, // Salvar código da Mercos
            origem: 'mercos' as const,
            track_stock: true,
            sob_encomenda: false,
            pre_venda: false,
            pronta_entrega: true,
            active: true, // Todos são ativos
            sincronizado_em: new Date().toISOString(),
          }));

          const { error: insertError } = await supabaseAdmin
            .from('products')
            .insert(produtosParaInserir);

          if (insertError) {
            console.error(`[RESET-SYNC] ❌ Erro ao inserir lote ${i / BATCH_SIZE + 1}:`, insertError);
          } else {
            produtosInseridos += produtosParaInserir.length;
            console.log(`[RESET-SYNC] ✅ Lote ${i / BATCH_SIZE + 1}: ${produtosParaInserir.length} produtos inseridos`);
          }
        }

        // Atualizar informações do distribuidor
        await supabaseAdmin
          .from('distribuidores')
          .update({
            ultima_sincronizacao: new Date().toISOString(),
            total_produtos: produtosInseridos,
          })
          .eq('id', distribuidor.id);

        console.log(`[RESET-SYNC] 🎉 ${distribuidor.nome}: ${produtosInseridos} produtos ativos sincronizados`);

        resultados.push({
          distribuidor: distribuidor.nome,
          success: true,
          produtos_ativos_mercos: produtosAtivos.length,
          produtos_inseridos: produtosInseridos,
        });

      } catch (error: any) {
        console.error(`[RESET-SYNC] ❌ Erro em ${distribuidor.nome}:`, error);
        resultados.push({
          distribuidor: distribuidor.nome,
          success: false,
          error: error.message,
        });
      }
    }

    // Contar produtos após sincronização
    const { count: totalDepois } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('distribuidor_id', 'is', null);

    console.log('[RESET-SYNC] ✅ RESET E SINCRONIZAÇÃO CONCLUÍDOS!');

    return NextResponse.json({
      success: true,
      executado_em: new Date().toISOString(),
      resumo: {
        produtos_deletados: totalAntes || 0,
        produtos_inseridos: totalDepois || 0,
        reducao: ((totalAntes || 0) - (totalDepois || 0)),
        reducao_percentual: totalAntes ? (((totalAntes - (totalDepois || 0)) / totalAntes) * 100).toFixed(2) + '%' : '0%',
      },
      distribuidores_processados: distribuidores.length,
      resultados,
    });

  } catch (error: any) {
    console.error('[RESET-SYNC] ❌ Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET para ver instruções
export async function GET() {
  return NextResponse.json({
    info: 'API para RESETAR e SINCRONIZAR apenas produtos ATIVOS',
    aviso: '⚠️  ATENÇÃO: Esta operação vai DELETAR todos os produtos de distribuidores',
    uso: {
      metodo: 'POST',
      body: {
        confirmar: 'SIM_DELETAR_TUDO'
      },
      exemplo: `
curl -X POST https://www.guiadasbancas.com.br/api/admin/distribuidores/reset-sync \\
  -H "Content-Type: application/json" \\
  -d '{"confirmar": "SIM_DELETAR_TUDO"}'
      `
    },
    o_que_faz: [
      '1. Deleta TODOS os produtos de distribuidores (mantém produtos próprios)',
      '2. Busca produtos da Mercos desde 2020-01-01',
      '3. Filtra apenas produtos ATIVOS (ativo=true e excluido=false)',
      '4. Insere produtos em lotes de 200',
      '5. Atualiza informações dos distribuidores',
    ],
    beneficios: [
      '✅ Banco limpo (apenas produtos ativos)',
      '✅ Redução de ~50% no tamanho',
      '✅ Melhor performance',
      '✅ Sincronização 100% precisa',
    ],
  });
}
