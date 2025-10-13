import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

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

    const results = [];

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

        // Buscar produtos desde última sincronização
        const ultimaSincronizacao = distribuidor.ultima_sincronizacao || undefined;
        const produtosMercos = await mercosApi.getAllProdutos(ultimaSincronizacao);
        console.log(`[CRON] Produtos recebidos (${distribuidor.nome}):`, produtosMercos.length);

        // Limitar processamento no CRON para evitar timeout
        const MAX_PRODUTOS_CRON = 30; // Menor limite para CRON
        const produtosParaProcessar = produtosMercos.slice(0, MAX_PRODUTOS_CRON);
        
        if (produtosMercos.length > MAX_PRODUTOS_CRON) {
          console.log(`[CRON] ⚠️ Limitando a ${MAX_PRODUTOS_CRON} produtos (total: ${produtosMercos.length})`);
        }

        let produtosNovos = 0;
        let produtosAtualizados = 0;

        // Processar produtos (limitado)
        for (const produtoMercos of produtosParaProcessar) {
          try {
            const { data: produtoExistente } = await supabase
              .from('products')
              .select('id')
              .eq('mercos_id', produtoMercos.id)
              .eq('distribuidor_id', distribuidor.id)
              .single();

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
            } as const;

            if (produtoExistente) {
              const { error } = await supabase
                .from('products')
                .update(produtoData)
                .eq('id', produtoExistente.id);
              if (error) {
                console.error(`[CRON] Erro ao atualizar ${produtoMercos.nome}:`, error);
              } else {
                produtosAtualizados++;
                console.log(`[CRON] ✓ Atualizado: ${produtoMercos.nome}`);
              }
            } else {
              const { error } = await supabase.from('products').insert([produtoData]);
              if (error) {
                console.error(`[CRON] Erro ao criar ${produtoMercos.nome}:`, error);
              } else {
                produtosNovos++;
                console.log(`[CRON] ✓ Criado: ${produtoMercos.nome}`);
              }
            }
          } catch (error) {
            console.error(`[CRON] Erro ao processar produto ${produtoMercos.nome}:`, error);
          }
        }

        // Atualizar última sincronização
        await supabase
          .from('distribuidores')
          .update({
            ultima_sincronizacao: new Date().toISOString(),
            total_produtos: produtosNovos + produtosAtualizados,
          })
          .eq('id', distribuidor.id);

        console.log(
          `[CRON] ✓ ${distribuidor.nome}: ${produtosNovos} novos, ${produtosAtualizados} atualizados`
        );

        results.push({
          distribuidor: distribuidor.nome,
          success: true,
          produtos_novos: produtosNovos,
          produtos_atualizados: produtosAtualizados,
          total: produtosMercos.length,
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
