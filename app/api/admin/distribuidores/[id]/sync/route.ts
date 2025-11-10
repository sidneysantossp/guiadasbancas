import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// Aumentar timeout para 5 minutos (máximo no Vercel Pro)
export const maxDuration = 300;

// Configurações de sincronização
const SYNC_CONFIG = {
  TIMEOUT_SAFETY_MARGIN: 10, // Parar 10s antes do timeout
  MAX_EXECUTION_TIME: 50 * 1000, // 50 segundos em ms
};

// Categoria fallback para produtos sem categoria
const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

// Função para garantir que a categoria fallback existe
async function ensureFallbackCategory(supabase: any) {
  const { data: categoria } = await supabase
    .from('categories')
    .select('id')
    .eq('id', CATEGORIA_SEM_CATEGORIA_ID)
    .single();

  if (!categoria) {
    console.log('[SYNC] Criando categoria fallback...');
    const { error } = await supabase
      .from('categories')
      .insert([{
        id: CATEGORIA_SEM_CATEGORIA_ID,
        name: 'Sem Categoria',
        link: '/categorias/sem-categoria',
        active: true,
        order: 998
      }]);
    
    if (error) {
      console.error('[SYNC] Erro ao criar categoria fallback:', error);
      throw new Error('Falha ao criar categoria fallback');
    }
    console.log('[SYNC] ✅ Categoria fallback criada');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[SYNC] ===== INICIANDO SINCRONIZAÇÃO (distribuidor: ${params.id}) =====`);
  try {
    const supabase = supabaseAdmin;
    
    // Garantir que a categoria fallback existe
    await ensureFallbackCategory(supabase);
    
    // Verificar se é sincronização completa (force)
    const body = await request.json().catch(() => ({}));
    const forceComplete = body?.force === true;
    const startTimestamp = typeof body?.startTimestamp === 'string' && body.startTimestamp.trim() !== ''
      ? body.startTimestamp.trim()
      : undefined;

    console.log(`[SYNC] Modo: ${forceComplete ? 'COMPLETO' : 'INCREMENTAL'}`);
    if (startTimestamp) {
      console.log(`[SYNC] Timestamp inicial informado manualmente: ${startTimestamp}`);
    }

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Inicializar API Mercos
    console.log(`[SYNC] Inicializando cliente Mercos API...`);
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Testar conexão
    console.log(`[SYNC] Testando conexão com Mercos...`);
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      console.error('[SYNC] ❌ Erro de conexão Mercos:', connectionTest.error);
      return NextResponse.json(
        { 
          success: false, 
          error: `Falha ao conectar com API Mercos: ${connectionTest.error || 'Verifique os tokens.'}` 
        },
        { status: 400 }
      );
    }
    console.log(`[SYNC] ✓ Conexão com Mercos OK`);

    // Buscar última sincronização (ou ignorar se force)
    const ultimaSincronizacaoBase = forceComplete ? undefined : (distribuidor.ultima_sincronizacao || undefined);
    const syncInitialTimestamp = startTimestamp ?? ultimaSincronizacaoBase;

    console.log(`[SYNC] Distribuidor: ${distribuidor.nome}`);
    console.log(`[SYNC] Última sincronização registrada: ${ultimaSincronizacaoBase || 'nunca'}`);
    console.log(`[SYNC] Timestamp utilizado nesta execução: ${syncInitialTimestamp || 'padrão (2020-01-01T00:00:00)'}`);

    // Buscar produtos da API Mercos por lotes (streaming) e processar respeitando o tempo máximo
    console.log(`[SYNC] Iniciando busca na API Mercos (streaming por lotes)...`);

    const startTime = Date.now();
    let produtosNovos = 0;
    let produtosAtualizados = 0;
    const erros: string[] = [];
    let atingiuLimiteTempo = false;
    let processados = 0;
    let recebidos = 0;

    const batchSize = 200;

    for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize, alteradoApos: syncInitialTimestamp || null })) {
      recebidos += lote.length;
      console.log(`[SYNC] Lote recebido com ${lote.length} produtos (total recebidos: ${recebidos})`);

      for (const produtoMercos of lote) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > SYNC_CONFIG.MAX_EXECUTION_TIME) {
          console.log(`[SYNC] ⏰ Timeout preventivo atingido (${elapsedTime}ms). Parando processamento.`);
          console.log(`[SYNC] 📊 Processados: ${processados} (de ${recebidos} recebidos nesta execução)`);
          atingiuLimiteTempo = true;
          break;
        }

        try {
          processados++;

          if (processados % 10 === 0) {
            console.log(`[SYNC] Progresso: ${processados} processados (de ${recebidos} recebidos)`);
          }

          const { data: produtoExistente } = await supabase
            .from('products')
            .select('id')
            .eq('mercos_id', produtoMercos.id)
            .eq('distribuidor_id', params.id)
            .single();

          const produtoData = {
            name: produtoMercos.nome,
            description: produtoMercos.observacoes || '',
            price: produtoMercos.preco_tabela,
            stock_qty: produtoMercos.saldo_estoque || 0,
            images: [],
            banca_id: null,
            distribuidor_id: params.id,
            mercos_id: produtoMercos.id,
            category_id: CATEGORIA_SEM_CATEGORIA_ID,
            origem: 'mercos' as const,
            sincronizado_em: new Date().toISOString(),
            track_stock: true,
            sob_encomenda: false,
            pre_venda: false,
            pronta_entrega: true,
            ativo: produtoMercos.ativo && !produtoMercos.excluido,
          };

          if (produtoExistente) {
            const { error } = await supabase
              .from('products')
              .update(produtoData)
              .eq('id', produtoExistente.id);

            if (error) {
              console.error(`[SYNC] ❌ Erro ao atualizar produto ID ${produtoMercos.id}:`, {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                produtoNome: produtoMercos.nome
              });
              erros.push(`Erro ao atualizar produto ${produtoMercos.nome}: ${error.message} (${error.code || 'N/A'})`);
            } else {
              produtosAtualizados++;
              if (processados % 100 === 0) {
                console.log(`[SYNC] ✓ Atualizado produto ${produtoMercos.id} - ${produtoMercos.nome}`);
              }
            }
          } else {
            const { error } = await supabase
              .from('products')
              .insert([produtoData]);

            if (error) {
              console.error(`[SYNC] ❌ Erro ao criar produto ID ${produtoMercos.id}:`, {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
                produtoNome: produtoMercos.nome,
                produtoData: JSON.stringify(produtoData, null, 2)
              });
              erros.push(`Erro ao criar produto ${produtoMercos.nome}: ${error.message} (${error.code || 'N/A'})`);
            } else {
              produtosNovos++;
              if (processados % 100 === 0) {
                console.log(`[SYNC] ✓ Criado produto ${produtoMercos.id} - ${produtoMercos.nome}`);
              }
            }
          }
        } catch (error: any) {
          console.error(`[SYNC] ❌ Exceção ao processar produto ${produtoMercos.id}:`, error);
          erros.push(`Exceção ao processar produto ${produtoMercos.nome}: ${error.message}`);
        }
      }

      if (atingiuLimiteTempo) break;
    }

    // Adicionar aviso se houve interrupção por limite de tempo
    if (atingiuLimiteTempo) {
      erros.push(
        `⚠️ Tempo esgotado nesta execução. Produtos processados: ${processados}. ` +
        `Continue executando até concluir todos os produtos alterados.`
      );
    }

    // Contar total de produtos do distribuidor
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);

    // Atualizar última sincronização do distribuidor
    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: new Date().toISOString(),
        total_produtos: totalProdutos || 0,
      })
      .eq('id', params.id);

    console.log(`[SYNC] ✅ Sincronização concluída: ${produtosNovos} novos, ${produtosAtualizados} atualizados`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_atualizados: produtosAtualizados,
        produtos_total: processados,
        produtos_recebidos: recebidos,
        erros,
        ultima_sincronizacao: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Erro na sincronização:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
