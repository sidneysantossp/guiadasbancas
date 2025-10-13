import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// Aumentar timeout para 60 segundos (máximo no Vercel Hobby)
export const maxDuration = 60;

// Configurações de sincronização
const SYNC_CONFIG = {
  MAX_PRODUTOS_POR_LOTE: 50, // Processar no máximo 50 produtos por vez
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
    const forceComplete = body.force === true;
    console.log(`[SYNC] Modo: ${forceComplete ? 'COMPLETO' : 'INCREMENTAL'}`);

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
    const ultimaSincronizacao = forceComplete ? undefined : (distribuidor.ultima_sincronizacao || undefined);

    console.log(`[SYNC] Distribuidor: ${distribuidor.nome}`);
    console.log(`[SYNC] Última sincronização: ${ultimaSincronizacao || 'nunca'}`);

    // Buscar produtos da API Mercos
    console.log(`[SYNC] Iniciando busca na API Mercos...`);
    const produtosMercos = await mercosApi.getAllProdutos(ultimaSincronizacao);
    
    console.log(`[SYNC] Produtos recebidos da API Mercos: ${produtosMercos.length}`);

    // Controle de tempo e lotes
    const startTime = Date.now();
    const produtosParaProcessar = produtosMercos.slice(0, SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE);
    
    if (produtosMercos.length > SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE) {
      console.log(`[SYNC] ⚠️ Limitando processamento a ${SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE} produtos (total: ${produtosMercos.length})`);
      console.log(`[SYNC] 💡 Execute novamente para processar os próximos ${produtosMercos.length - SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE} produtos`);
    }

    let produtosNovos = 0;
    let produtosAtualizados = 0;
    const erros: string[] = [];

    // Processar cada produto com controle de tempo
    console.log(`[SYNC] Processando ${produtosParaProcessar.length} produtos...`);
    let processados = 0;
    
    for (const produtoMercos of produtosParaProcessar) {
      // Verificar se ainda temos tempo
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime > SYNC_CONFIG.MAX_EXECUTION_TIME) {
        console.log(`[SYNC] ⏰ Timeout preventivo atingido (${elapsedTime}ms). Parando processamento.`);
        console.log(`[SYNC] 📊 Processados: ${processados}/${produtosParaProcessar.length}`);
        break;
      }
      try {
        processados++;
        
        // Log de progresso a cada 10 produtos
        if (processados % 10 === 0) {
          console.log(`[SYNC] Progresso: ${processados}/${produtosParaProcessar.length} produtos`);
        }
        
        // Verificar se produto já existe
        const { data: produtoExistente } = await supabase
          .from('products')
          .select('id')
          .eq('mercos_id', produtoMercos.id)
          .eq('distribuidor_id', params.id)
          .single();

        // Dados base do produto (sempre do distribuidor)
        // As customizações do jornaleiro ficam em banca_produtos_distribuidor
        const produtoData = {
          name: produtoMercos.nome,
          description: produtoMercos.observacoes || '',
          price: produtoMercos.preco_tabela,
          stock_qty: produtoMercos.saldo_estoque || 0,
          images: [], // Array vazio - Mercos não fornece URLs de imagens
          banca_id: null, // Produtos de distribuidor não têm banca específica
          distribuidor_id: params.id,
          mercos_id: produtoMercos.id,
          category_id: CATEGORIA_SEM_CATEGORIA_ID, // Categoria fallback para produtos sem categoria
          origem: 'mercos' as const,
          sincronizado_em: new Date().toISOString(),
          track_stock: true,
          sob_encomenda: false,
          pre_venda: false,
          pronta_entrega: true,
        };

        if (produtoExistente) {
          // Atualizar produto existente (mantém dados base do distribuidor)
          // As customizações do jornaleiro em banca_produtos_distribuidor são preservadas
          const { error } = await supabase
            .from('products')
            .update(produtoData)
            .eq('id', produtoExistente.id);

          if (error) {
            console.error(`[SYNC] Erro ao atualizar produto ID ${produtoMercos.id}:`, error.message);
            erros.push(`Erro ao atualizar produto ${produtoMercos.nome}: ${error.message}`);
          } else {
            produtosAtualizados++;
          }
        } else {
          // Criar novo produto
          const { data: novoProduto, error } = await supabase
            .from('products')
            .insert([produtoData])
            .select();

          if (error) {
            console.error(`[SYNC] Erro ao criar produto ID ${produtoMercos.id}:`, error.message);
            erros.push(`Erro ao criar produto ${produtoMercos.nome}: ${error.message}`);
          } else {
            produtosNovos++;
          }
        }
      } catch (error: any) {
        erros.push(`Erro ao processar produto ${produtoMercos.nome}: ${error.message}`);
      }
    }

    // Adicionar aviso se produtos foram limitados
    if (produtosMercos.length > SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE) {
      erros.push(`⚠️ Foram recebidos ${produtosMercos.length} produtos, mas apenas ${SYNC_CONFIG.MAX_PRODUTOS_POR_LOTE} foram processados nesta sincronização. Execute novamente para processar o restante.`);
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
        produtos_total: produtosParaProcessar.length,
        produtos_recebidos: produtosMercos.length,
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
