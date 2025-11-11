import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * Cron job para sincronizar produtos de todos os distribuidores ativos
 * Configurar no Vercel Cron: *//* /15 * * * * (a cada 15 minutos)
 * 
 * Ou usar serviço externo como cron-job.org:
 * POST https://seudominio.com/api/cron/sync-mercos
 * Header: Authorization: Bearer SEU_CRON_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autorização (opcional, mas recomendado)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;

    // Buscar todos os distribuidores ativos
    const { data: distribuidores, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('ativo', true);

    if (distError || !distribuidores) {
      console.error('Erro ao buscar distribuidores:', distError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar distribuidores' },
        { status: 500 }
      );
    }

    const results: any[] = [];

    // Sincronizar cada distribuidor
    for (const distribuidor of distribuidores) {
      try {
        console.log(`[CRON] Sincronizando: ${distribuidor.nome}`);

        const mercosApi = new MercosAPI({
          applicationToken: distribuidor.application_token,
          companyToken: distribuidor.company_token,
          baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
        });

        // Testar conexão
        const connectionTest = await mercosApi.testConnection();
        if (!connectionTest.success) {
          console.error(`[CRON] Falha na conexão: ${distribuidor.nome}`, connectionTest.error);
          results.push({
            distribuidor: distribuidor.nome,
            success: false,
            error: `Falha na conexão: ${connectionTest.error}`,
          });
          continue;
        }

        // Buscar produtos desde última sincronização, processando por lotes com limite de tempo
        const ultimaSincronizacao = distribuidor.ultima_sincronizacao || undefined;
        const startTime = Date.now();
        const MAX_EXECUTION_TIME = 270 * 1000; // 4.5 min
        const INSERT_BATCH_SIZE = 200;
        const UPDATE_CONCURRENCY = 10;
        let produtosNovos = 0;
        let produtosAtualizados = 0;
        let processados = 0;
        let recebidos = 0;
        let atingiuLimiteTempo = false;

        for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize: 200, alteradoApos: ultimaSincronizacao || null })) {
          recebidos += lote.length;
          if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }

          // Buscar mapa de existentes em uma consulta
          const mercosIds = lote.map(p => p.id);
          const { data: existentesRows } = await supabase
            .from('products')
            .select('id, mercos_id')
            .eq('distribuidor_id', distribuidor.id)
            .in('mercos_id', mercosIds);
          const existentes = new Map<number, string>((existentesRows || []).map(r => [r.mercos_id as number, r.id as string]));

          const novosPayload: any[] = [];
          const updatesPayload: { id: string; data: any; mercosId: number; nome: string }[] = [];

          for (const produtoMercos of lote) {
            if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
            processados++;
            const produtoData = {
              name: produtoMercos.nome,
              description: produtoMercos.observacoes || '',
              price: produtoMercos.preco_tabela,
              stock_qty: produtoMercos.saldo_estoque || 0,
              images: [],
              banca_id: null,
              distribuidor_id: distribuidor.id,
              mercos_id: produtoMercos.id,
              origem: 'mercos' as const,
              track_stock: true,
              sob_encomenda: false,
              pre_venda: false,
              pronta_entrega: true,
              active: produtoMercos.ativo && !produtoMercos.excluido,
              sincronizado_em: new Date().toISOString(),
            };

            const existingId = existentes.get(produtoMercos.id);
            if (existingId) {
              updatesPayload.push({ id: existingId, data: produtoData, mercosId: produtoMercos.id, nome: produtoMercos.nome });
            } else {
              novosPayload.push(produtoData);
            }
          }

          // Inserir novos
          for (let i = 0; i < novosPayload.length; i += INSERT_BATCH_SIZE) {
            if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
            const batch = novosPayload.slice(i, i + INSERT_BATCH_SIZE);
            const { error } = await supabase.from('products').insert(batch);
            if (error) {
              console.error('[CRON] ❌ Erro ao inserir batch:', error);
            } else {
              produtosNovos += batch.length;
            }
          }

          // Atualizar existentes com concorrência limitada
          for (let i = 0; i < updatesPayload.length; i += UPDATE_CONCURRENCY) {
            if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
            const slice = updatesPayload.slice(i, i + UPDATE_CONCURRENCY);
            await Promise.allSettled(
              slice.map(async (u) => {
                const { error } = await supabase.from('products').update(u.data).eq('id', u.id);
                if (error) {
                  console.error(`[CRON] ❌ Erro ao atualizar produto ID ${u.mercosId}:`, error);
                } else {
                  produtosAtualizados++;
                }
              })
            );
          }

          if (atingiuLimiteTempo) break;
        }

        // Contar total no banco
        const { count: totalProdutos } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('distribuidor_id', distribuidor.id);

        // Atualizar última sincronização apenas se concluído sem timeout
        const novaUltimaSync = !atingiuLimiteTempo ? new Date().toISOString() : (distribuidor.ultima_sincronizacao || null);
        await supabase
          .from('distribuidores')
          .update({
            ultima_sincronizacao: novaUltimaSync,
            total_produtos: totalProdutos || 0,
          })
          .eq('id', distribuidor.id);

        console.log(
          `[CRON] ✓ ${distribuidor.nome}: ${produtosNovos} novos, ${produtosAtualizados} atualizados (recebidos=${recebidos}, processados=${processados})`
        );

        results.push({
          distribuidor: distribuidor.nome,
          success: true,
          produtos_novos: produtosNovos,
          produtos_atualizados: produtosAtualizados,
          total_no_banco: totalProdutos || 0,
          parcial: atingiuLimiteTempo,
        });
      } catch (error: any) {
        console.error(`[CRON] Erro em ${distribuidor.nome}:`, error);
        results.push({
          distribuidor: distribuidor.nome,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      executado_em: new Date().toISOString(),
      distribuidores_processados: distribuidores.length,
      resultados: results,
    });
  } catch (error: any) {
    console.error('[CRON] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Permitir GET para testes manuais (remover em produção)
export async function GET(request: NextRequest) {
  return POST(request);
}
