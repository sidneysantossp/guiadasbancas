import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

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

    // Iniciar transação para processar o lote
    const { data, error } = await supabase.rpc('process_mercos_batch', {
      p_distribuidor_id: distribuidorId,
      p_produtos: JSON.stringify(produtos.map(p => ({
        id: p.id,
        nome: p.nome,
        observacoes: p.observacoes || '',
        preco_tabela: p.preco_tabela,
        saldo_estoque: p.saldo_estoque || 0,
        ultima_alteracao: p.ultima_alteracao || new Date().toISOString(),
      })))
    });

    if (error) throw error;

    // Atualizar estado com os resultados
    const lastProduct = produtos[produtos.length - 1];
    const processedInBatch = produtos.length;
    
    const newState: SyncState = {
      ...state,
      totalProcessed: state.totalProcessed + processedInBatch,
      lastProcessedId: lastProduct.id,
      lastProcessedDate: lastProduct.ultima_alteracao || state.lastProcessedDate,
      hasMore: produtos.length >= batchSize,
      batchesProcessed: state.batchesProcessed + 1,
      lastRunAt: new Date().toISOString(),
    };

    console.log(`[BATCH] Lote processado: ${processedInBatch} produtos (total: ${newState.totalProcessed})`);
    console.log(`[BATCH] Tempo de processamento: ${Date.now() - batchStartTime}ms`);

    return newState;

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

// Cria a função no banco de dados para processar lotes de forma atômica
async function ensureBatchProcessingFunction(supabase: any) {
  const { error } = await supabase.rpc('create_process_mercos_batch_function');
  
  if (error && !error.message.includes('already exists')) {
    console.error('Erro ao criar função de processamento em lote:', error);
    throw new Error('Falha ao configurar processamento em lote');
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
  console.log(`[FULL-SYNC] ===== INICIANDO SINCRONIZAÇÃO =====`);
  
  try {
    const supabase = supabaseAdmin;
    const startTime = Date.now();
    const distribuidorId = params.id;
    
    // Garantir que a categoria fallback existe
    await ensureFallbackCategory(supabase);
    
    // Garantir que a função de processamento em lote existe
    await ensureBatchProcessingFunction(supabase);
    
    // Buscar dados do distribuidor
    console.log(`[FULL-SYNC] Buscando dados do distribuidor ${distribuidorId}...`);
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      console.error(`[FULL-SYNC] Distribuidor não encontrado: ${distribuidorId}`);
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Inicializar API Mercos
    console.log(`[FULL-SYNC] Inicializando cliente Mercos API...`);
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
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
      console.log(`[FULL-SYNC] Reiniciando sincronização anterior (status: ${state.status})`);
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
    console.log(`[FULL-SYNC] Testando conexão com a API Mercos...`);
    console.log(`[FULL-SYNC] Testando conexão com Mercos...`);
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      console.error('[FULL-SYNC] ❌ Erro de conexão Mercos:', connectionTest.error);
      return NextResponse.json(
        { 
          success: false, 
          error: `Falha ao conectar com API Mercos: ${connectionTest.error || 'Verifique os tokens.'}` 
        },
        { status: 400 }
      );
    }
    console.log(`[FULL-SYNC] ✓ Conexão com Mercos OK`);

    // Estado da sincronização já inicializado acima em `state`

    // Processar em lotes até terminar ou atingir o tempo limite
    while (state.hasMore && !isTimeoutReached(state.startTime, SYNC_CONFIG.MAX_EXECUTION_TIME)) {
      console.log(`[FULL-SYNC] Processando lote a partir do ID: ${state.lastProcessedId}, Data: ${state.lastProcessedDate}`);

      const nextState = await processBatch(
        supabase,
        mercosApi,
        state,
        SYNC_CONFIG.BATCH_SIZE
      );

      // Atualizar estado com o retorno do processBatch
      state = nextState;

      console.log(`[FULL-SYNC] Lote processado. Total até agora: ${state.totalProcessed}`);
      
      // Adicionar delay entre lotes para evitar sobrecarga
      if (state.hasMore && !isTimeoutReached(state.startTime, SYNC_CONFIG.MAX_EXECUTION_TIME - 5)) {
        console.log(`[FULL-SYNC] Aguardando ${SYNC_CONFIG.DELAY_BETWEEN_BATCHES}ms antes do próximo lote...`);
        await new Promise(resolve => setTimeout(resolve, SYNC_CONFIG.DELAY_BETWEEN_BATCHES));
      }
    }

    // Verificar se a sincronização foi concluída
    const isComplete = !state.hasMore;
    const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);

    // Atualizar última sincronização do distribuidor
    await supabase
      .from('distribuidores')
      .update({ 
        ultima_sincronizacao: new Date().toISOString(),
        sincronizacao_em_andamento: false,
        ultimo_erro_sincronizacao: isComplete ? null : 'Sincronização parcial devido a timeout'
      })
      .eq('id', params.id);

    // Montar resposta
    const response = {
      success: true,
      complete: isComplete,
      totalProcessed: state.totalProcessed,
      errors: state.errors,
      executionTime: `${elapsedTime}s`,
      nextSyncToken: isComplete ? null : {
        lastId: state.lastProcessedId,
        lastDate: state.lastProcessedDate
      }
    };

    console.log(`[FULL-SYNC] ✅ Sincronização ${isComplete ? 'concluída' : 'parcial'}.`, response);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('[FULL-SYNC] ❌ Erro durante a sincronização:', error);
    
    // Atualizar status de erro no distribuidor
    try {
      await supabaseAdmin
        .from('distribuidores')
        .update({ 
          sincronizacao_em_andamento: false,
          ultimo_erro_sincronizacao: error.message || 'Erro desconhecido durante a sincronização'
        })
        .eq('id', params.id);
    } catch (updateError) {
      console.error('[FULL-SYNC] Erro ao atualizar status de erro do distribuidor:', updateError);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro durante a sincronização',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
