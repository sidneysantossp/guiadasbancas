import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * Cron job para sincronizar produtos de todos os distribuidores ativos
 * 
 * VERCEL HOBBY PLAN: Limitado a 1x por hora (0 *\/1 * * *)
 * VERCEL PRO PLAN: Permite a cada 1 minuto (* * * * *)
 * 
 * Para sincronização a cada 1 minuto no plano gratuito:
 * Use serviço externo como cron-job.org (GRATUITO):
 * - URL: POST https://www.guiadasbancas.com.br/api/cron/sync-mercos
 * - Schedule: * * * * * (a cada 1 minuto)
 * - Header: Authorization: Bearer SEU_CRON_SECRET
 * 
 * Veja CRON_SETUP.md para instruções completas
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

    // Parâmetro para forçar sincronização completa (ignorar última sincronização)
    const { searchParams } = new URL(request.url);
    const forceFullSync = searchParams.get('full') === 'true';

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
        // Forçar sincronização completa se:
        // 1. forceFullSync=true (parâmetro manual)
        // 2. Nunca sincronizou antes
        // 3. Última sincronização foi há mais de 24 horas (para pegar produtos desabilitados)
        const agora = new Date();
        const ultimaSinc = distribuidor.ultima_sincronizacao ? new Date(distribuidor.ultima_sincronizacao) : null;
        const horasDesdeUltimaSinc = ultimaSinc ? (agora.getTime() - ultimaSinc.getTime()) / (1000 * 60 * 60) : 999;
        const deveSerCompleta = forceFullSync || !ultimaSinc || horasDesdeUltimaSinc >= 24;
        
        const ultimaSincronizacao = deveSerCompleta ? null : distribuidor.ultima_sincronizacao;
        const startTime = Date.now();
        const MAX_EXECUTION_TIME = 270 * 1000; // 4.5 min
        const INSERT_BATCH_SIZE = 200;
        const UPDATE_CONCURRENCY = 10;
        let produtosNovos = 0;
        let produtosAtualizados = 0;
        let processados = 0;
        let recebidos = 0;
        let atingiuLimiteTempo = false;

        console.log(`[CRON] ${deveSerCompleta ? 'SINCRONIZAÇÃO COMPLETA' : 'Sincronização incremental'} desde: ${ultimaSincronizacao || '2020-01-01'}`);

        // Buscar mapa de categorias do distribuidor (mercos_id -> uuid)
        const { data: distCategories } = await supabase
          .from('distribuidor_categories')
          .select('id, mercos_id')
          .eq('distribuidor_id', distribuidor.id);
        
        const categoryMap = new Map<number, string>();
        for (const cat of distCategories || []) {
          if (cat.mercos_id) {
            categoryMap.set(cat.mercos_id, cat.id);
          }
        }
        console.log(`[CRON] ✓ ${categoryMap.size} categorias mapeadas para ${distribuidor.nome}`);

        for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize: 200, alteradoApos: ultimaSincronizacao })) {
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
            
            // Verificar se o produto está ativo
            const isAtivo = produtoMercos.ativo && !produtoMercos.excluido;
            const existingId = existentes.get(produtoMercos.id);
            
            // Se o produto está INATIVO e existe no banco, deletar
            if (!isAtivo && existingId) {
              await supabase.from('products').delete().eq('id', existingId);
              console.log(`[CRON] 🗑️  Produto inativo deletado: ${produtoMercos.nome}`);
              continue;
            }
            
            // Se o produto está INATIVO e não existe no banco, ignorar
            if (!isAtivo) {
              continue;
            }
            
            // Produto ATIVO - processar normalmente
            // Mapear categoria: usar mapa do distribuidor ou null (sem categoria)
            const mercosCatId = produtoMercos.categoria_id;
            const mappedCategoryId = mercosCatId ? categoryMap.get(mercosCatId) : null;
            
            const produtoData = {
              name: produtoMercos.nome,
              description: produtoMercos.observacoes || '',
              price: produtoMercos.preco_tabela,
              stock_qty: produtoMercos.saldo_estoque || 0,
              images: [],
              banca_id: null,
              distribuidor_id: distribuidor.id,
              mercos_id: produtoMercos.id,
              codigo_mercos: produtoMercos.codigo || null,
              category_id: mappedCategoryId || null, // Categoria mapeada do distribuidor
              origem: 'mercos' as const,
              track_stock: true,
              sob_encomenda: false,
              pre_venda: false,
              pronta_entrega: true,
              active: true,
              sincronizado_em: new Date().toISOString(),
            };

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
