import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// Timeout máximo: 5 minutos
export const maxDuration = 300;

const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

/**
 * Sincronização DIRETA - processa o máximo de produtos possível em uma única execução
 * Usa UPSERT para evitar duplicatas
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  console.log(`[SYNC-DIRECT] ===== INICIANDO SINCRONIZAÇÃO DIRETA =====`);
  
  try {
    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
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

    console.log(`[SYNC-DIRECT] Distribuidor: ${distribuidor.nome}`);

    // Garantir categoria fallback
    const { data: categoria } = await supabase
      .from('categories')
      .select('id')
      .eq('id', CATEGORIA_SEM_CATEGORIA_ID)
      .maybeSingle();

    if (!categoria) {
      console.log('[SYNC-DIRECT] Criando categoria fallback...');
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
    console.log('[SYNC-DIRECT] Testando conexão com Mercos...');
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar: ${connectionTest.error}`,
      }, { status: 400 });
    }

    console.log('[SYNC-DIRECT] ✅ Conexão com Mercos OK');

    let totalProcessed = 0;
    let produtosNovos = 0;
    let produtosAtualizados = 0;
    let erros: string[] = [];
    
    // Buscar último ID processado (se houver sincronização anterior em andamento)
    let lastId: number | null = distribuidor.ultimo_produto_id || null;
    
    const BATCH_SIZE = 200; // Aumentado para 200 produtos por lote
    const MAX_EXECUTION_TIME = 270; // 4.5 minutos

    if (lastId) {
      console.log(`[SYNC-DIRECT] Continuando sincronização do produto ID ${lastId}...`);
    } else {
      console.log('[SYNC-DIRECT] Iniciando nova sincronização...');
    }

    // Processar produtos em lotes
    while (true) {
      // Verificar timeout
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds >= MAX_EXECUTION_TIME) {
        console.log('[SYNC-DIRECT] ⚠️ Timeout alcançado, parando...');
        erros.push(`⚠️ Timeout: Processados ${totalProcessed} produtos. Execute novamente para continuar.`);
        break;
      }

      try {
        console.log(`[SYNC-DIRECT] Buscando lote após ID ${lastId || 'início'}...`);
        
        // Buscar produtos da API Mercos
        const produtos = await mercosApi.getBatchProdutos({
          limit: BATCH_SIZE,
          afterId: lastId,
        });

        console.log(`[SYNC-DIRECT] Recebidos ${produtos.length} produtos`);

        if (produtos.length === 0) {
          console.log('[SYNC-DIRECT] ✅ Não há mais produtos para processar');
          break;
        }

        // Buscar IDs existentes no banco em batch (muito mais rápido que um por um)
        const mercosIds = produtos.map(p => p.id);
        const { data: existingProducts } = await supabase
          .from('products')
          .select('id, mercos_id')
          .eq('distribuidor_id', distribuidorId)
          .in('mercos_id', mercosIds);

        // Criar map de produtos existentes
        const existingMap = new Map();
        if (existingProducts) {
          existingProducts.forEach(p => {
            existingMap.set(p.mercos_id, p.id);
          });
        }

        // Separar em produtos para atualizar e inserir
        const toInsert: any[] = [];
        const toUpdate: any[] = [];

        produtos.forEach(produto => {
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

          const existingId = existingMap.get(produto.id);
          if (existingId) {
            toUpdate.push({ ...productData, id: existingId });
          } else {
            toInsert.push(productData);
          }
        });

        // Processar inserções em batch
        if (toInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('products')
            .insert(toInsert);

          if (insertError) {
            console.error(`[SYNC-DIRECT] ❌ Erro ao inserir ${toInsert.length} produtos:`, insertError.message);
            erros.push(`Erro ao inserir lote: ${insertError.message}`);
          } else {
            produtosNovos += toInsert.length;
            console.log(`[SYNC-DIRECT] ✅ ${toInsert.length} produtos inseridos`);
          }
        }

        // Processar atualizações em batch usando upsert com ID
        if (toUpdate.length > 0) {
          const { error: updateError } = await supabase
            .from('products')
            .upsert(toUpdate);

          if (updateError) {
            console.error(`[SYNC-DIRECT] ❌ Erro ao atualizar ${toUpdate.length} produtos:`, updateError.message);
            erros.push(`Erro ao atualizar lote: ${updateError.message}`);
          } else {
            produtosAtualizados += toUpdate.length;
            console.log(`[SYNC-DIRECT] ✅ ${toUpdate.length} produtos atualizados`);
          }
        }

        totalProcessed += produtos.length;
        console.log(`[SYNC-DIRECT] Progresso total: ${totalProcessed} produtos`);

        // Atualizar último ID processado
        if (produtos.length > 0) {
          lastId = produtos[produtos.length - 1].id;
        }

        // Se recebeu menos produtos que o batch size, chegou ao fim
        if (produtos.length < BATCH_SIZE) {
          console.log('[SYNC-DIRECT] ✅ Último lote processado');
          break;
        }
      } catch (error: any) {
        console.error(`[SYNC-DIRECT] Erro no lote:`, error);
        erros.push(`Erro no lote: ${error.message}`);
        break;
      }
    }

    // Atualizar contador no distribuidor
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const updateData: any = {
      ultima_sincronizacao: new Date().toISOString(),
      total_produtos: totalProdutos || 0,
    };

    // Se ainda há mais produtos para processar, salvar o ID para continuar
    // Senão, limpar o ID (sincronização completa)
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const isComplete = totalProcessed > 0 && elapsedSeconds < MAX_EXECUTION_TIME;
    
    if (isComplete) {
      updateData.ultimo_produto_id = null; // Completou, limpar
    } else {
      updateData.ultimo_produto_id = lastId; // Salvar para continuar
    }

    await supabase
      .from('distribuidores')
      .update(updateData)
      .eq('id', distribuidorId);

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SYNC-DIRECT] ===== FINALIZADO EM ${elapsedTime}s =====`);
    console.log(`[SYNC-DIRECT] Total: ${totalProcessed} | Novos: ${produtosNovos} | Atualizados: ${produtosAtualizados}`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_atualizados: produtosAtualizados,
        produtos_total: totalProcessed,
        total_no_banco: totalProdutos || 0,
        erros,
        ultima_sincronizacao: new Date().toISOString(),
        tempo_execucao: `${elapsedTime}s`,
      },
    });

  } catch (error: any) {
    console.error('[SYNC-DIRECT] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
