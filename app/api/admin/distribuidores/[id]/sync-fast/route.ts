import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// Timeout máximo: 5 minutos
export const maxDuration = 300;

const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

/**
 * SINCRONIZAÇÃO ULTRA RÁPIDA - Estratégia otimizada
 * 1. Busca TODOS os mercos_ids existentes de uma vez
 * 2. Processa produtos da API em grandes lotes
 * 3. Insere apenas os que não existem (sem UPDATE)
 * 4. Máxima velocidade, mínimas queries
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  console.log(`[SYNC-FAST] ===== SINCRONIZAÇÃO ULTRA RÁPIDA INICIADA =====`);
  
  try {
    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
    // Buscar distribuidor
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

    console.log(`[SYNC-FAST] Distribuidor: ${distribuidor.nome}`);

    // Garantir categoria fallback
    const { data: categoria } = await supabase
      .from('categories')
      .select('id')
      .eq('id', CATEGORIA_SEM_CATEGORIA_ID)
      .maybeSingle();

    if (!categoria) {
      console.log('[SYNC-FAST] Criando categoria fallback...');
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
    console.log('[SYNC-FAST] Testando conexão...');
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar: ${connectionTest.error}`,
      }, { status: 400 });
    }

    console.log('[SYNC-FAST] ✅ Conexão OK');

    // PASSO 1: Sincronizar categorias da Mercos
    console.log('[SYNC-FAST] 📂 Sincronizando categorias...');
    try {
      console.log('[SYNC-FAST] Chamando mercosApi.getAllCategorias()...');
      const categorias = await mercosApi.getAllCategorias();
      console.log(`[SYNC-FAST] ✅ ${categorias.length} categorias encontradas na Mercos`);
      
      if (categorias.length > 0) {
        console.log(`[SYNC-FAST] Exemplo de categoria:`, categorias[0]);
      }
      
      // Inserir/atualizar categorias no banco
      let inseridas = 0;
      for (const cat of categorias) {
        if (cat.excluido) {
          console.log(`[SYNC-FAST] ⏭️  Pulando categoria excluída: ${cat.nome}`);
          continue;
        }
        
        const { error: upsertError } = await supabase
          .from('distribuidor_categories')
          .upsert({
            distribuidor_id: distribuidorId,
            mercos_id: cat.id,
            nome: cat.nome,
            categoria_pai_id: cat.categoria_pai_id,
            ativo: !cat.excluido,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'distribuidor_id,mercos_id',
          });
        
        if (upsertError) {
          console.error(`[SYNC-FAST] ❌ Erro ao inserir categoria "${cat.nome}":`, upsertError);
        } else {
          inseridas++;
        }
      }
      
      console.log(`[SYNC-FAST] ✅ ${inseridas} categorias sincronizadas no banco`);
    } catch (error: any) {
      console.error('[SYNC-FAST] ❌ ERRO CRÍTICO ao sincronizar categorias:', {
        message: error?.message,
        stack: error?.stack,
        error: error
      });
      // Continua mesmo se falhar - usará categoria fallback
    }

    // PASSO 2: Criar mapeamento de categorias Mercos -> Supabase
    const { data: categoriasDb } = await supabase
      .from('distribuidor_categories')
      .select('id, mercos_id')
      .eq('distribuidor_id', distribuidorId);
    
    const categoriasMap = new Map<number, string>();
    if (categoriasDb) {
      categoriasDb.forEach(cat => {
        categoriasMap.set(cat.mercos_id, cat.id);
      });
    }
    console.log(`[SYNC-FAST] ${categoriasMap.size} categorias mapeadas`);

    // PASSO 3: Buscar TODOS os mercos_ids que já existem (UMA ÚNICA QUERY)
    console.log('[SYNC-FAST] Buscando produtos já sincronizados...');
    const { data: existingProducts } = await supabase
      .from('products')
      .select('mercos_id')
      .eq('distribuidor_id', distribuidorId)
      .not('mercos_id', 'is', null);

    const existingMercosIds = new Set(
      existingProducts?.map(p => p.mercos_id) || []
    );

    console.log(`[SYNC-FAST] ${existingMercosIds.size} produtos já sincronizados`);

    // PASSO 2: Buscar TODOS os produtos da Mercos em lotes grandes
    let totalProcessed = 0;
    let produtosNovos = 0;
    let produtosIgnorados = 0;
    let lastId: number | null = null;
    const BATCH_SIZE = 200; // Máximo permitido pela API Mercos
    const INSERT_BATCH_SIZE = 200; // Lotes de inserção no Supabase
    const MAX_EXECUTION_TIME = 270; // 4.5 minutos
    const MAX_ITERATIONS_WITHOUT_NEW = 5; // Parar após 5 iterações sem produtos novos
    const MAX_PRODUTOS_PROCESSAR = 10000; // Limite de segurança
    
    let toInsertBuffer: any[] = [];
    let iterationsWithoutNew = 0;

    console.log('[SYNC-FAST] Iniciando processamento...');

    while (true) {
      // Verificar timeout
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds >= MAX_EXECUTION_TIME) {
        console.log('[SYNC-FAST] ⚠️ Timeout alcançado, finalizando...');
        
        // Inserir produtos restantes no buffer
        if (toInsertBuffer.length > 0) {
          await insertBatch(supabase, toInsertBuffer);
          produtosNovos += toInsertBuffer.length;
          toInsertBuffer = [];
        }
        
        break;
      }

      // Verificar limite de segurança
      if (totalProcessed >= MAX_PRODUTOS_PROCESSAR) {
        console.log(`[SYNC-FAST] 🛑 Limite de segurança atingido: ${MAX_PRODUTOS_PROCESSAR} produtos processados`);
        break;
      }

      try {
        // Buscar lote de produtos da Mercos
        console.log(`[SYNC-FAST] Buscando lote afterId=${lastId || 'início'}...`);
        const produtos = await mercosApi.getBatchProdutos({
          limit: BATCH_SIZE,
          afterId: lastId,
        });

        if (produtos.length === 0) {
          console.log('[SYNC-FAST] ✅ API não retornou mais produtos');
          break;
        }

        // Log do range de IDs recebidos
        const primeiroId = produtos[0]?.id;
        const ultimoId = produtos[produtos.length - 1]?.id;
        console.log(`[SYNC-FAST] Recebidos ${produtos.length} produtos (ID ${primeiroId} → ${ultimoId})`);

        // Filtrar apenas produtos que NÃO existem
        const novos = produtos.filter(p => !existingMercosIds.has(p.id));
        
        produtosIgnorados += (produtos.length - novos.length);
        totalProcessed += produtos.length;

        console.log(`[SYNC-FAST] ${novos.length} novos | ${produtos.length - novos.length} já existem`);

        // Se não encontrou nenhum produto novo neste lote, incrementar contador
        if (novos.length === 0) {
          iterationsWithoutNew++;
          console.log(`[SYNC-FAST] ⚠️ Iteração ${iterationsWithoutNew} sem produtos novos`);
          
          // Se atingiu o limite de iterações sem produtos novos, parar
          if (iterationsWithoutNew >= MAX_ITERATIONS_WITHOUT_NEW) {
            console.log(`[SYNC-FAST] 🛑 Parando: ${MAX_ITERATIONS_WITHOUT_NEW} iterações consecutivas sem produtos novos`);
            break;
          }
        } else {
          // Reset do contador se encontrou produtos novos
          iterationsWithoutNew = 0;
        }

        // Adicionar ao buffer
        novos.forEach((produto, idx) => {
          // Buscar categoria correta do produto
          let categoryId = CATEGORIA_SEM_CATEGORIA_ID;
          if (produto.categoria_id && categoriasMap.has(produto.categoria_id)) {
            categoryId = categoriasMap.get(produto.categoria_id)!;
            
            // Log apenas dos primeiros 3 produtos para não poluir
            if (idx < 3) {
              console.log(`[SYNC-FAST] Produto "${produto.nome}" - Mercos categoria_id: ${produto.categoria_id} → UUID: ${categoryId}`);
            }
          } else {
            if (idx < 3) {
              console.log(`[SYNC-FAST] ⚠️ Produto "${produto.nome}" - categoria_id da Mercos: ${produto.categoria_id} (não encontrado no mapa)`);
            }
          }
          
          toInsertBuffer.push({
            name: produto.nome,
            description: produto.observacoes || '',
            price: produto.preco_tabela,
            stock_qty: produto.saldo_estoque || 0,
            images: [],
            banca_id: null,
            distribuidor_id: distribuidorId,
            mercos_id: produto.id,
            category_id: categoryId,
            origem: 'mercos',
            sincronizado_em: new Date().toISOString(),
            track_stock: true,
            sob_encomenda: false,
            pre_venda: false,
            pronta_entrega: true,
            ativo: produto.ativo && !produto.excluido,
            updated_at: new Date().toISOString(),
          });

          // Adicionar ao Set para não inserir duplicado
          existingMercosIds.add(produto.id);
        });

        // Inserir quando buffer atingir tamanho ideal
        if (toInsertBuffer.length >= INSERT_BATCH_SIZE) {
          const batchToInsert = toInsertBuffer.splice(0, INSERT_BATCH_SIZE);
          await insertBatch(supabase, batchToInsert);
          produtosNovos += batchToInsert.length;
          console.log(`[SYNC-FAST] ✅ ${produtosNovos} produtos inseridos até agora`);
        }

        // Atualizar último ID
        if (produtos.length > 0) {
          lastId = produtos[produtos.length - 1].id;
        }

        // Se recebeu menos que o esperado, chegou ao fim
        if (produtos.length < BATCH_SIZE) {
          console.log('[SYNC-FAST] ✅ Última página processada');
          break;
        }

      } catch (error: any) {
        console.error(`[SYNC-FAST] Erro no lote:`, error);
        break;
      }
    }

    // Inserir produtos restantes no buffer
    if (toInsertBuffer.length > 0) {
      console.log(`[SYNC-FAST] Inserindo ${toInsertBuffer.length} produtos restantes...`);
      await insertBatch(supabase, toInsertBuffer);
      produtosNovos += toInsertBuffer.length;
    }

    // Atualizar contador final
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: new Date().toISOString(),
        total_produtos: totalProdutos || 0,
      })
      .eq('id', distribuidorId);

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SYNC-FAST] ===== CONCLUÍDO EM ${elapsedTime}s =====`);
    console.log(`[SYNC-FAST] Novos: ${produtosNovos} | Ignorados: ${produtosIgnorados} | Total: ${totalProdutos}`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_ignorados: produtosIgnorados,
        produtos_total: totalProcessed,
        total_no_banco: totalProdutos || 0,
        tempo_execucao: `${elapsedTime}s`,
      },
    });

  } catch (error: any) {
    console.error('[SYNC-FAST] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

// Função auxiliar para inserir em batch
async function insertBatch(supabase: any, products: any[]) {
  if (products.length === 0) return;
  
  const { error } = await supabase
    .from('products')
    .insert(products);
  
  if (error) {
    console.error('[SYNC-FAST] ❌ Erro ao inserir batch:', error.message);
    throw error;
  }
}
