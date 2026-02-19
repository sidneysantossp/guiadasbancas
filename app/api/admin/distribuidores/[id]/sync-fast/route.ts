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

    // PASSO 2: Buscar TODOS os mercos_ids que já existem (UMA ÚNICA QUERY)
    console.log('[SYNC-FAST] Buscando produtos já sincronizados...');
    const { data: existingProducts } = await supabase
      .from('products')
      .select('mercos_id')
      .eq('distribuidor_id', distribuidorId)
      .not('mercos_id', 'is', null);

    const existingMercosIds = new Set(
      existingProducts?.map(p => p.mercos_id) || []
    );
    const maxExistingMercosId = existingProducts && existingProducts.length
      ? Math.max(...existingProducts.map(p => p.mercos_id as number))
      : 0;

    console.log(`[SYNC-FAST] ${existingMercosIds.size} produtos já sincronizados`);

    // PASSO 3: Buscar TODOS os produtos da Mercos em lotes grandes por ultima_alteracao
    let totalProcessed = 0;
    let produtosNovos = 0;
    let produtosIgnorados = 0;
    let cursorDate: string | null = null; // null = buscar desde o início, sem filtro de data
    let lastId: number | null = null; // paginação secundária dentro do mesmo timestamp
    let lastBatchTimestamp: string | null = null;
    const BATCH_SIZE = 200; // Máximo permitido pela API Mercos
    const INSERT_BATCH_SIZE = 200; // Lotes de inserção no Supabase
    const MAX_EXECUTION_TIME = 270; // 4.5 minutos
    const MAX_PRODUTOS_PROCESSAR = 500000; // Limite de segurança alto para catálogos grandes
    
    let toInsertBuffer: any[] = [];
    // Deixar de usar critério de interrupção por iterações sem novos para não encerrar antes do fim
    let hadTimeout = false;
    let hadError = false;
    let endedBecauseNoMore = false;
    // usando MercosAPI com tratamento de 429 e backoff
    const bumpIsoSecond = (iso: string) => {
      try {
        const d = new Date(iso);
        if (!isNaN(d.getTime())) {
          const nd = new Date(d.getTime() + 1000);
          return nd.toISOString();
        }
      } catch {}
      return iso;
    };
    let lastSeenKey: string | null = null;
    let repeatCount = 0;
    let pageMode: 'timestamp' | 'id' = 'id' as 'timestamp' | 'id'; // Mudar para 'id' para buscar todos os produtos
    let noProgressIters = 0;

    console.log('[SYNC-FAST] Iniciando processamento...');

    while (true) {
      // Verificar timeout
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds >= MAX_EXECUTION_TIME) {
        console.log('[SYNC-FAST] ⚠️ Timeout alcançado, finalizando...');
        hadTimeout = true;
        
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
        const fetchResult = pageMode === 'timestamp'
          ? await mercosApi.getBatchProdutosByAlteracao({
              alteradoApos: cursorDate,
              afterId: lastId,
              limit: BATCH_SIZE,
              orderDirection: 'asc',
            })
          : { produtos: await mercosApi.getBatchProdutos({
                limit: BATCH_SIZE,
                afterId: lastId,
                orderBy: 'id',
                orderDirection: 'asc',
              }), limited: true };

        const produtos = fetchResult.produtos;
        const limited = fetchResult.limited;

        if (produtos.length === 0) {
          console.log('[SYNC-FAST] ✅ API não retornou mais produtos');
          endedBecauseNoMore = true;
          break;
        }

        // Log do range de IDs recebidos
        const primeiroId = produtos[0]?.id;
        const ultimoId = produtos[produtos.length - 1]?.id;
        console.log(`[SYNC-FAST] Recebidos ${produtos.length} produtos (ID ${primeiroId} → ${ultimoId})`);

        // Determinar novos (Set em memória) e fazer fallback checando no DB se necessário
        let novos = produtos.filter((p: any) => !existingMercosIds.has(p.id));
        if (novos.length === 0) {
          const mercosIds = produtos.map((p: any) => p.id);
          const { data: existentesRows } = await supabase
            .from('products')
            .select('mercos_id')
            .eq('distribuidor_id', distribuidorId)
            .in('mercos_id', mercosIds);
          const existingInBatch = new Set((existentesRows || []).map((r: any) => r.mercos_id));
          novos = produtos.filter((p: any) => !existingInBatch.has(p.id));
        }

        produtosIgnorados += (produtos.length - novos.length);
        totalProcessed += produtos.length;

        console.log(`[SYNC-FAST] ${novos.length} novos | ${produtos.length - novos.length} já existem`);

        // Não vamos mais parar por iterações sem novos; seguimos até a API terminar as páginas

        // Adicionar ao buffer
        novos.forEach((produto: any, idx: number) => {
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
            images: produto.imagens || [],
            banca_id: null,
            distribuidor_id: distribuidorId,
            mercos_id: produto.id,
            codigo_mercos: produto.codigo || null,
            category_id: categoryId,
            origem: 'mercos',
            sincronizado_em: new Date().toISOString(),
            track_stock: true,
            sob_encomenda: false,
            pre_venda: false,
            pronta_entrega: true,
            ativo: produto.ativo || false,
            excluido: produto.excluido || false,
            active: !produto.excluido && (produto.saldo_estoque || 0) > 0,
            updated_at: new Date().toISOString(),
          });

          // Adicionar ao Set para não inserir duplicado nesta execução
          existingMercosIds.add(produto.id);
        });

        // Inserir quando buffer atingir tamanho ideal
        if (toInsertBuffer.length >= INSERT_BATCH_SIZE) {
          const batchToInsert = toInsertBuffer.splice(0, INSERT_BATCH_SIZE);
          await insertBatch(supabase, batchToInsert);
          produtosNovos += batchToInsert.length;
          console.log(`[SYNC-FAST] ✅ ${produtosNovos} produtos inseridos até agora`);
        }

        if (produtos.length > 0) {
          const last = produtos[produtos.length - 1] as any;
          if (pageMode === 'timestamp') {
            const lastTs = last?.ultima_alteracao || null;
            const currentKey = `${lastTs || ''}#${last?.id || 0}`;
            if (currentKey === lastSeenKey) {
              repeatCount++;
              if (lastTs) {
                cursorDate = bumpIsoSecond(lastTs);
                lastId = null;
              }
            } else {
              repeatCount = 0;
              if (lastTs && lastTs === cursorDate) {
                lastId = last.id || null;
              } else if (lastTs) {
                cursorDate = lastTs;
                lastId = null;
              }
            }
            lastSeenKey = currentKey;
            lastBatchTimestamp = lastTs;
          } else {
            lastId = last?.id || lastId;
          }
        }

        if ((pageMode === 'timestamp' && !limited) || (pageMode === 'id' && produtos.length < BATCH_SIZE)) {
          endedBecauseNoMore = true;
          break;
        }

        if (novos.length === 0) {
          noProgressIters++;
          if (noProgressIters >= 3) {
            pageMode = 'id';
            lastId = lastId || 0;
          }
        } else {
          noProgressIters = 0;
        }

      } catch (error: any) {
        console.error(`[SYNC-FAST] Erro no lote:`, error);
        hadError = true;
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

    const advanceTimestamp = !hadTimeout && !hadError && endedBecauseNoMore;
    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: advanceTimestamp ? new Date().toISOString() : (distribuidor.ultima_sincronizacao || null),
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

// Função auxiliar para inserir em batch (sem upsert para evitar constraint issues)
async function insertBatch(supabase: any, products: any[]) {
  if (products.length === 0) return;
  
  // Tentar inserir todos de uma vez
  const { error } = await supabase
    .from('products')
    .insert(products);
  
  if (error) {
    // Se falhar por duplicata, inserir um por um ignorando erros de duplicata
    if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
      console.log('[SYNC-FAST] ⚠️ Duplicatas detectadas, inserindo individualmente...');
      let inserted = 0;
      
      for (const product of products) {
        const { error: singleError } = await supabase
          .from('products')
          .insert([product]);
        
        if (singleError) {
          if (singleError.code === '23505' || singleError.message?.includes('duplicate') || singleError.message?.includes('unique')) {
            // Ignorar duplicatas silenciosamente
            continue;
          } else {
            console.error('[SYNC-FAST] ❌ Erro ao inserir produto individual:', singleError.message);
          }
        } else {
          inserted++;
        }
      }
      
      console.log(`[SYNC-FAST] ✅ ${inserted}/${products.length} produtos inseridos (${products.length - inserted} duplicatas ignoradas)`);
    } else {
      console.error('[SYNC-FAST] ❌ Erro ao inserir batch:', error.message);
      throw error;
    }
  }
}
