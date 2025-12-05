import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';
import { MercosError, MercosProduto, MercosThrottleError } from '@/types/distribuidor';

// Aumentar timeout para 5 minutos (máximo permitido pelo Vercel Pro)
export const maxDuration = 300;

// Configurações da sincronização
const SYNC_CONFIG = {
  BATCH_SIZE: 100, // Número de produtos por requisição à API Mercos
  MAX_BATCHES_PER_RUN: 20, // Máximo de lotes por execução (evita timeouts)
  DELAY_BETWEEN_BATCHES: 500, // 0.5s entre lotes para evitar rate limiting
  TIMEOUT_SAFETY_MARGIN: 10, // Parar 10s antes do timeout
  MAX_EXECUTION_TIME: 290, // 4.83 minutos (290s) em segundos (deixando margem para finalização)
};

// Categoria fallback para produtos sem categoria
const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

// Interface para o estado da sincronização
interface SyncState {
  totalProcessed: number;
  lastProcessedId: number | null;
  lastProcessedDate: string | null;
  hasMore: boolean;
  errors: string[];
  startTime: number;
  batchesProcessed: number;
  lastRunAt: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  distribuidorId: string;
}

// Interface para armazenar o estado no banco de dados
interface SyncStatusRecord {
  id: string;
  distribuidor_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  last_processed_id: number | null;
  last_processed_date: string | null;
  total_processed: number;
  errors: string[];
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
}

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

// Salva o estado da sincronização no banco de dados
async function saveSyncStatus(
  supabase: any,
  state: SyncState
): Promise<void> {
  const now = new Date().toISOString();
  const statusData = {
    distribuidor_id: state.distribuidorId,
    status: state.status,
    last_processed_id: state.lastProcessedId,
    last_processed_date: state.lastProcessedDate,
    total_processed: state.totalProcessed,
    errors: state.errors,
    last_run_at: state.status === 'in_progress' ? now : state.lastRunAt,
    updated_at: now,
  };

  // Tenta atualizar o status existente
  const { error: updateError } = await supabase
    .from('sync_status')
    .upsert({
      id: `sync_${state.distribuidorId}`,
      ...statusData,
      created_at: now,
    }, {
      onConflict: 'id',
    });

  if (updateError) {
    console.error('[SYNC] Erro ao salvar status da sincronização:', updateError);
    throw new Error('Falha ao salvar status da sincronização');
  }
}

// Obtém o estado da última sincronização
async function getLastSyncStatus(
  supabase: any,
  distribuidorId: string
): Promise<SyncState | null> {
  const { data, error } = await supabase
    .from('sync_status')
    .select('*')
    .eq('distribuidor_id', distribuidorId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    totalProcessed: data.total_processed || 0,
    lastProcessedId: data.last_processed_id,
    lastProcessedDate: data.last_processed_date,
    hasMore: data.status !== 'completed',
    errors: Array.isArray(data.errors) ? data.errors : [],
    startTime: Date.now(),
    batchesProcessed: 0,
    lastRunAt: data.last_run_at,
    status: data.status || 'pending',
    distribuidorId: data.distribuidor_id,
  };
}

// Processa um lote de produtos
async function processBatch(
  supabase: any,
  mercosApi: MercosAPI,
  state: SyncState,
  batchSize: number
): Promise<SyncState> {
  const batchStartTime = Date.now();
  const { distribuidorId, lastProcessedId, lastProcessedDate } = state;
  
  console.log(`[BATCH] Processando lote a partir do ID ${lastProcessedId || 'início'}`);

  try {
    // Buscar um lote de produtos do Mercos
    const produtos = await mercosApi.getBatchProdutos({
      limit: batchSize,
      afterId: lastProcessedId,
      alteradoApos: lastProcessedDate || undefined
    });

    console.log(`[BATCH] Recebidos ${produtos.length} produtos para processar`);

    // Se não há produtos, terminamos
    if (produtos.length === 0) {
      console.log('[BATCH] Nenhum produto retornado, sincronização concluída');
      return {
        ...state,
        hasMore: false,
        status: 'completed',
        lastRunAt: new Date().toISOString(),
      };
    }

    // Processar cada produto do lote
    const batchResults = await Promise.allSettled(
      produtos.map(produto => 
        processSingleProduct(supabase, produto, distribuidorId)
      )
    );

    // Contar sucessos e falhas
    const results = batchResults.map(result => 
      result.status === 'fulfilled' 
        ? { success: true, id: result.value.id }
        : { success: false, error: result.reason }
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    // Coletar erros
    const errors = results
      .filter((r): r is { success: false; error: Error } => !r.success)
      .map(r => `Erro ao processar produto: ${r.error.message}`);

    // Encontrar o último ID processado com sucesso
    const lastProcessed = results
      .filter((r): r is { success: true; id: number } => r.success)
      .reduce((max, curr) => (curr.id > (max?.id || 0) ? curr : max), { id: 0 });

    // Encontrar a última data de alteração
    const lastProduct = produtos.find(p => p.id === lastProcessed?.id);
    const lastProcessedDateNew = lastProduct?.ultima_alteracao || lastProcessedDate;

    console.log(`[BATCH] Lote processado: ${successful} sucessos, ${failed} falhas`);

    return {
      ...state,
      totalProcessed: state.totalProcessed + successful,
      lastProcessedId: lastProcessed?.id || state.lastProcessedId,
      lastProcessedDate: lastProcessedDateNew,
      hasMore: produtos.length >= batchSize,
      batchesProcessed: state.batchesProcessed + 1,
      lastRunAt: new Date().toISOString(),
      errors: [...state.errors, ...errors],
    };

  } catch (error: any) {
    console.error('[BATCH] Erro ao processar lote:', error);
    return {
      ...state,
      errors: [...state.errors, `Erro no lote: ${error.message}`],
      status: 'failed',
      lastRunAt: new Date().toISOString(),
    };
  }
}

// Processa um único produto
async function processSingleProduct(
  supabase: any,
  produto: MercosProduto,
  distribuidorId: string
): Promise<{ id: number }> {
  try {
    console.log(`[PROCESS-PRODUCT] Processando produto ${produto.id} - ${produto.nome}`);
    
    // Verificar se o produto já existe
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, name, price, stock_qty, ativo')
      .eq('mercos_id', produto.id)
      .eq('distribuidor_id', distribuidorId)
      .maybeSingle();

    if (fetchError) {
      console.error(`[PROCESS-PRODUCT] Erro ao buscar produto ${produto.id}:`, fetchError);
      throw fetchError;
    }

    const isAtivo = produto.ativo && !produto.excluido;
    const productData = {
      name: produto.nome,
      description: produto.observacoes || '',
      price: produto.preco_tabela,
      stock_qty: produto.saldo_estoque || 0,
      images: [],
      banca_id: null,
      distribuidor_id: distribuidorId,
      mercos_id: produto.id,
      category_id: CATEGORIA_SEM_CATEGORIA_ID,
      origem: 'mercos',
      sincronizado_em: new Date().toISOString(),
      track_stock: true,
      sob_encomenda: false,
      pre_venda: false,
      pronta_entrega: true,
      ativo: isAtivo,
      active: isAtivo, // Campo usado pela API de stats
      updated_at: new Date().toISOString(),
    };

    if (existingProduct) {
      console.log(`[PROCESS-PRODUCT] Produto ${produto.id} já existe no banco (ID: ${existingProduct.id})`);
      
      // Verificar se houve alterações
      const hasChanges = 
        existingProduct.name !== productData.name ||
        existingProduct.price !== productData.price ||
        existingProduct.stock_qty !== productData.stock_qty ||
        existingProduct.ativo !== productData.ativo;

      if (hasChanges) {
        console.log(`[PROCESS-PRODUCT] Atualizando produto ${produto.id} (${produto.nome})`);
        console.log('Alterações:', {
          name: { de: existingProduct.name, para: productData.name },
          price: { de: existingProduct.price, para: productData.price },
          stock_qty: { de: existingProduct.stock_qty, para: productData.stock_qty },
          ativo: { de: existingProduct.ativo, para: productData.ativo }
        });

        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', existingProduct.id);

        if (updateError) {
          console.error(`[PROCESS-PRODUCT] Erro ao atualizar produto ${produto.id}:`, updateError);
          throw updateError;
        }
        console.log(`[PROCESS-PRODUCT] Produto ${produto.id} atualizado com sucesso`);
      } else {
        console.log(`[PROCESS-PRODUCT] Nenhuma alteração detectada para o produto ${produto.id}`);
      }
    } else {
      console.log(`[PROCESS-PRODUCT] Inserindo novo produto ${produto.id} (${produto.nome})`);
      
      const { data: newProduct, error: insertError } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
        }])
        .select('id')
        .single();

      if (insertError) {
        console.error(`[PROCESS-PRODUCT] Erro ao inserir produto ${produto.id}:`, insertError);
        throw insertError;
      }
      
      console.log(`[PROCESS-PRODUCT] Produto ${produto.id} inserido com sucesso (ID: ${newProduct.id})`);
    }

    return { id: produto.id };
  } catch (error) {
    console.error(`[PROCESS-PRODUCT] Erro ao processar produto ${produto.id}:`, error);
    throw error;
  }
}

// Função auxiliar para verificar se o tempo limite foi atingido
function isTimeoutReached(startTime: number, maxSeconds: number): boolean {
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  return elapsedSeconds >= maxSeconds - SYNC_CONFIG.TIMEOUT_SAFETY_MARGIN;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[BATCH-SYNC] ===== INICIANDO SINCRONIZAÇÃO EM LOTES =====`);
  
  try {
    const supabase = supabaseAdmin;
    const startTime = Date.now();
    const distribuidorId = params.id;
    
    // Garantir que a categoria fallback existe
    await ensureFallbackCategory(supabase);
    
    // Buscar dados do distribuidor
    console.log(`[BATCH-SYNC] Buscando dados do distribuidor ${distribuidorId}...`);
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      console.error(`[BATCH-SYNC] Distribuidor não encontrado: ${distribuidorId}`);
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Inicializar API Mercos
    console.log(`[BATCH-SYNC] Inicializando cliente Mercos API...`);
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
      maxRetries: 3,
      retryDelay: 1000,
    });

    // Verificar se já existe uma sincronização em andamento
    let state = await getLastSyncStatus(supabase, distribuidorId) || {
      totalProcessed: 0,
      lastProcessedId: null,
      lastProcessedDate: null,
      hasMore: true,
      errors: [],
      startTime,
      batchesProcessed: 0,
      lastRunAt: null,
      status: 'pending' as const,
      distribuidorId,
    };

    // Se a última execução falhou ou está em andamento, reiniciar
    if (state.status === 'failed' || state.status === 'in_progress') {
      console.log(`[BATCH-SYNC] Reiniciando sincronização anterior (status: ${state.status})`);
      state = {
        ...state,
        status: 'in_progress',
        startTime,
        errors: [],
      };
    } else {
      state.status = 'in_progress';
    }

    // Atualizar status para em andamento
    await saveSyncStatus(supabase, state);

    // Testar conexão com a API Mercos
    console.log(`[BATCH-SYNC] Testando conexão com a API Mercos...`);
    try {
      const connectionTest = await mercosApi.testConnection();
      if (!connectionTest.success) {
        throw new Error(connectionTest.error || 'Falha ao conectar com a API Mercos');
      }
    } catch (error: any) {
      console.error('[BATCH-SYNC] ❌ Erro de conexão Mercos:', error);
      
      // Atualizar status com erro
      await saveSyncStatus(supabase, {
        ...state,
        status: 'failed',
        errors: [...state.errors, `Erro de conexão: ${error.message}`],
        lastRunAt: new Date().toISOString(),
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Falha ao conectar com API Mercos: ${error.message}` 
        },
        { status: 400 }
      );
    }

    console.log(`[BATCH-SYNC] ✓ Conexão com Mercos OK`);

    // Processar lotes até terminar ou atingir o tempo limite
    let batchCount = 0;
    
    while (
      state.hasMore && 
      batchCount < SYNC_CONFIG.MAX_BATCHES_PER_RUN && 
      !isTimeoutReached(startTime, SYNC_CONFIG.MAX_EXECUTION_TIME)
    ) {
      console.log(`[BATCH-SYNC] Processando lote ${batchCount + 1}/${SYNC_CONFIG.MAX_BATCHES_PER_RUN}...`);
      
      // Processar um lote
      state = await processBatch(
        supabase,
        mercosApi,
        state,
        SYNC_CONFIG.BATCH_SIZE
      );
      
      batchCount++;
      
      // Atualizar status após cada lote
      await saveSyncStatus(supabase, state);
      
      // Pequena pausa entre lotes para evitar rate limiting
      if (state.hasMore && batchCount < SYNC_CONFIG.MAX_BATCHES_PER_RUN) {
        await new Promise(resolve => setTimeout(resolve, SYNC_CONFIG.DELAY_BETWEEN_BATCHES));
      }
    }

    // Verificar se terminou ou se precisa continuar
    const completed = !state.hasMore || batchCount >= SYNC_CONFIG.MAX_BATCHES_PER_RUN;
    
    if (completed) {
      state.status = 'completed';
      console.log(`[BATCH-SYNC] ✅ Sincronização concluída! Total de produtos processados: ${state.totalProcessed}`);
    } else {
      console.log(`[BATCH-SYNC] ⏸️  Tempo limite atingido. Sincronização pausada.`);
      console.log(`[BATCH-SYNC] Próximo lote continuará do ID: ${state.lastProcessedId}`);
    }

    // Atualizar status final
    state.lastRunAt = new Date().toISOString();
    await saveSyncStatus(supabase, state);

    // Atualizar dados do distribuidor
    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: new Date().toISOString(),
        total_produtos: state.totalProcessed,
      })
      .eq('id', distribuidorId);

    return NextResponse.json({
      success: true,
      completed,
      totalProcessed: state.totalProcessed,
      lastProcessedId: state.lastProcessedId,
      lastProcessedDate: state.lastProcessedDate,
      hasMore: state.hasMore,
      batchesProcessed: batchCount,
      errors: state.errors,
    });

  } catch (error: any) {
    console.error('[BATCH-SYNC] ❌ Erro na sincronização:', error);
    
    // Tentar salvar o status de erro
    try {
      await saveSyncStatus(supabaseAdmin, {
        totalProcessed: 0,
        lastProcessedId: null,
        lastProcessedDate: null,
        hasMore: false,
        errors: [error.message],
        startTime: Date.now(),
        batchesProcessed: 0,
        lastRunAt: new Date().toISOString(),
        status: 'failed',
        distribuidorId: params.id,
      });
    } catch (saveError) {
      console.error('[BATCH-SYNC] Erro ao salvar status de erro:', saveError);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro desconhecido na sincronização',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
