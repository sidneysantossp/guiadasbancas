import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// Aumentar timeout para 5 minutos (máximo no Vercel Pro)
export const maxDuration = 300;

// Configurações otimizadas para sincronização completa
const SYNC_CONFIG = {
  BATCH_SIZE: 200, // Buscar 200 produtos por vez do Mercos
  PRODUCTS_PER_ITERATION: 1000, // Processar até 1000 produtos por execução
  TIMEOUT_SAFETY_MARGIN: 30, // Parar 30s antes do timeout
  MAX_EXECUTION_TIME: 270, // 4.5 minutos em segundos
};

const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[SYNC-FULL] ===== INICIANDO SINCRONIZAÇÃO COMPLETA =====`);
  
  try {
    const supabase = supabaseAdmin;
    const startTime = Date.now();
    const distribuidorId = params.id;
    
    // Verificar body para continuar sincronização
    const body = await request.json().catch(() => ({}));
    const startFromId = body?.lastProcessedId || null;
    
    console.log(`[SYNC-FULL] Continuando do ID: ${startFromId || 'início'}`);
    
    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Mapear produtos locais atuais (para identificar quais deixaram de existir/ficaram inativos na Mercos)
    const { data: existingProductsRows } = await supabase
      .from('products')
      .select('id, mercos_id')
      .eq('distribuidor_id', distribuidorId);

    const mercosIdToLocalId = new Map<number, string>();
    const remainingMercosIds = new Set<number>();

    (existingProductsRows || []).forEach((row: any) => {
      if (row.mercos_id != null) {
        const mercosId = Number(row.mercos_id);
        mercosIdToLocalId.set(mercosId, row.id);
        remainingMercosIds.add(mercosId);
      }
    });

    // Garantir categoria fallback
    const { data: categoria } = await supabase
      .from('categories')
      .select('id')
      .eq('id', CATEGORIA_SEM_CATEGORIA_ID)
      .maybeSingle();

    if (!categoria) {
      await supabase.from('categories').insert([{
        id: CATEGORIA_SEM_CATEGORIA_ID,
        name: 'Sem Categoria',
        link: '/categorias/sem-categoria',
        active: true,
        order: 998
      }]);
    }

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Testar conexão
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar: ${connectionTest.error}`,
      }, { status: 400 });
    }

    let totalProcessed = 0;
    let produtosNovos = 0;
    let produtosAtualizados = 0;
    let erros: string[] = [];
    let lastId = startFromId;
    let hasMore = true;

    console.log('[SYNC-FULL] Iniciando busca de produtos...');

    // Processar produtos em lotes
    while (
      hasMore && 
      totalProcessed < SYNC_CONFIG.PRODUCTS_PER_ITERATION &&
      !isTimeoutReached(startTime, SYNC_CONFIG.MAX_EXECUTION_TIME)
    ) {
      try {
        // Buscar lote de produtos
        const produtos = await mercosApi.getBatchProdutos({
          limit: SYNC_CONFIG.BATCH_SIZE,
          afterId: lastId,
        });

        console.log(`[SYNC-FULL] Recebidos ${produtos.length} produtos`);

        if (produtos.length === 0) {
          hasMore = false;
          break;
        }

        // Processar lote em paralelo (mais rápido)
        const batchResults = await Promise.allSettled(
          produtos.map(produto => processProduct(supabase, produto, distribuidorId))
        );

        // Contar resultados
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            if (result.value.isNew) {
              produtosNovos++;
            } else {
              produtosAtualizados++;
            }
            totalProcessed++;
            // Este produto continua existindo/ativo na Mercos
            if (produtos[index]?.id != null) {
              remainingMercosIds.delete(produtos[index].id);
            }
          } else {
            erros.push(`Produto ${produtos[index].nome}: ${result.reason}`);
          }
        });

        // Atualizar último ID processado
        lastId = produtos[produtos.length - 1].id;
        
        console.log(`[SYNC-FULL] Progresso: ${totalProcessed} produtos | Último ID: ${lastId}`);

        // Se recebeu menos que o batch size, chegou ao fim
        if (produtos.length < SYNC_CONFIG.BATCH_SIZE) {
          hasMore = false;
        }

      } catch (error: any) {
        console.error('[SYNC-FULL] Erro ao processar lote:', error);
        erros.push(`Erro no lote: ${error.message}`);
        break;
      }
    }

    const timeoutReached = isTimeoutReached(startTime, SYNC_CONFIG.MAX_EXECUTION_TIME);
    const limitReached = totalProcessed >= SYNC_CONFIG.PRODUCTS_PER_ITERATION;

    // Qualquer produto que permaneceu em remainingMercosIds existe localmente
    // mas não veio na listagem de produtos ativos da Mercos -> marcar como inativo
    if (!timeoutReached && remainingMercosIds.size > 0) {
      const idsToDisable: string[] = [];
      remainingMercosIds.forEach((mercosId) => {
        const localId = mercosIdToLocalId.get(mercosId);
        if (localId) idsToDisable.push(localId);
      });

      if (idsToDisable.length > 0) {
        console.log(`[SYNC-FULL] Marcando ${idsToDisable.length} produtos como inativos (não retornaram da Mercos)`);
        const { error: disableError } = await supabase
          .from('products')
          .update({ active: false })
          .in('id', idsToDisable);

        if (disableError) {
          console.error('[SYNC-FULL] Erro ao marcar produtos como inativos:', disableError);
          erros.push('Erro ao marcar produtos antigos como inativos. Ver logs.');
        }
      }
    }

    // Atualizar contador no distribuidor (apenas produtos ATIVOS)
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: new Date().toISOString(),
        total_produtos: totalProdutos || 0,
      })
      .eq('id', distribuidorId);

    const completed = !hasMore && !timeoutReached && !limitReached;

    if (!completed) {
      erros.push(
        `⚠️ Sincronização parcial: ${totalProcessed} produtos processados. ` +
        `Continue a sincronização para processar os produtos restantes. ` +
        `Próximo ID: ${lastId}`
      );
    }

    console.log(`[SYNC-FULL] ===== FINALIZADO =====`);
    console.log(`[SYNC-FULL] Total: ${totalProcessed} | Novos: ${produtosNovos} | Atualizados: ${produtosAtualizados}`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_atualizados: produtosAtualizados,
        produtos_total: totalProcessed,
        erros,
        ultima_sincronizacao: new Date().toISOString(),
        completed,
        lastProcessedId: lastId,
        hasMore: hasMore || timeoutReached || limitReached,
      },
    });

  } catch (error: any) {
    console.error('[SYNC-FULL] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

async function processProduct(
  supabase: any,
  produto: any,
  distribuidorId: string
): Promise<{ isNew: boolean }> {
  // Primeiro verificar se já existe para determinar se é novo ou atualização
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('mercos_id', produto.id)
    .eq('distribuidor_id', distribuidorId)
    .maybeSingle();

  const isNew = !existing;

  const productData = {
    name: produto.nome,
    description: produto.observacoes || '',
    price: produto.preco_tabela,
    stock_qty: produto.saldo_estoque || 0,
    images: [],
    banca_id: null,
    distribuidor_id: distribuidorId,
    mercos_id: produto.id,
    codigo_mercos: produto.codigo || null,
    category_id: CATEGORIA_SEM_CATEGORIA_ID,
    origem: 'mercos',
    sincronizado_em: new Date().toISOString(),
    track_stock: true,
    sob_encomenda: false,
    pre_venda: false,
    pronta_entrega: true,
    active: produto.ativo && !produto.excluido,
    updated_at: new Date().toISOString(),
  };

  // Usar UPSERT para evitar erros de duplicata
  // O índice único é: (distribuidor_id, mercos_id)
  const { error } = await supabase
    .from('products')
    .upsert(
      {
        ...productData,
        ...(isNew ? { created_at: new Date().toISOString() } : {}),
      },
      {
        onConflict: 'distribuidor_id,mercos_id',
        ignoreDuplicates: false, // Atualizar se existir
      }
    );
  
  if (error) {
    console.error(`[PROCESS-PRODUCT] Erro ao processar produto ${produto.id}:`, error);
    throw error;
  }
  
  return { isNew };
}

function isTimeoutReached(startTime: number, maxSeconds: number): boolean {
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  return elapsedSeconds >= maxSeconds - SYNC_CONFIG.TIMEOUT_SAFETY_MARGIN;
}
