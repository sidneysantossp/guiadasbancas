import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

/**
 * Endpoint para debug da sincronização
 * Testa a criação de um único produto para identificar problemas
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[SYNC-DEBUG] Iniciando debug da sincronização');
  
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
        error: `Falha ao conectar com API Mercos: ${connectionTest.error}`,
      }, { status: 400 });
    }

    // Buscar apenas 1 produto para teste
    console.log('[SYNC-DEBUG] Buscando 1 produto de teste...');
    const produtos = await mercosApi.getBatchProdutos({ limit: 1 });
    
    if (produtos.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum produto retornado pela API Mercos',
      });
    }

    const produtoTeste = produtos[0];
    console.log('[SYNC-DEBUG] Produto de teste:', {
      id: produtoTeste.id,
      nome: produtoTeste.nome,
      preco: produtoTeste.preco_tabela,
      ativo: produtoTeste.ativo,
      excluido: produtoTeste.excluido,
    });

    // Verificar se a categoria fallback existe
    const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';
    const { data: categoria, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', CATEGORIA_SEM_CATEGORIA_ID)
      .single();

    if (catError || !categoria) {
      console.log('[SYNC-DEBUG] Categoria fallback não encontrada, criando...');
      const { error: createCatError } = await supabase
        .from('categories')
        .insert([{
          id: CATEGORIA_SEM_CATEGORIA_ID,
          name: 'Sem Categoria',
          link: '/categorias/sem-categoria',
          active: true,
          order: 998
        }]);
      
      if (createCatError) {
        return NextResponse.json({
          success: false,
          error: `Erro ao criar categoria fallback: ${createCatError.message}`,
          details: createCatError,
        }, { status: 500 });
      }
    }

    // Verificar se o produto já existe
    console.log('[SYNC-DEBUG] Verificando se produto já existe...');
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('mercos_id', produtoTeste.id)
      .eq('distribuidor_id', distribuidorId)
      .maybeSingle();

    const isNew = !existing;
    console.log(`[SYNC-DEBUG] Produto ${isNew ? 'NÃO' : 'JÁ'} existe no banco`);

    // Preparar dados do produto
    const produtoData = {
      name: produtoTeste.nome,
      description: produtoTeste.observacoes || '',
      price: produtoTeste.preco_tabela,
      stock_qty: produtoTeste.saldo_estoque || 0,
      images: [],
      banca_id: null,
      distribuidor_id: distribuidorId,
      mercos_id: produtoTeste.id,
      category_id: CATEGORIA_SEM_CATEGORIA_ID,
      origem: 'mercos',
      sincronizado_em: new Date().toISOString(),
      track_stock: true,
      sob_encomenda: false,
      pre_venda: false,
      pronta_entrega: true,
      ativo: produtoTeste.ativo && !produtoTeste.excluido,
      active: produtoTeste.ativo && !produtoTeste.excluido, // Campo usado pela API de stats
      updated_at: new Date().toISOString(),
    };

    let novoProduto;

    if (existing) {
      // Atualizar produto existente
      console.log('[SYNC-DEBUG] Atualizando produto existente...');
      const { data, error: updateError } = await supabase
        .from('products')
        .update(produtoData)
        .eq('id', existing.id)
        .select();

      if (updateError) {
        console.error('[SYNC-DEBUG] Erro ao atualizar produto:', updateError);
        return NextResponse.json({
          success: false,
          error: 'Erro ao atualizar produto de teste',
          errorDetails: {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code,
          },
          produtoData,
        }, { status: 500 });
      }
      novoProduto = data;
    } else {
      // Inserir novo produto
      console.log('[SYNC-DEBUG] Inserindo novo produto...');
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([produtoData])
        .select();

      if (insertError) {
        console.error('[SYNC-DEBUG] Erro ao inserir produto:', insertError);
        return NextResponse.json({
          success: false,
          error: 'Erro ao inserir produto de teste',
          errorDetails: {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          },
          produtoData,
        }, { status: 500 });
      }
      novoProduto = data;
    }

    // Verificar se o produto foi realmente inserido
    const { count: totalProdutos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    return NextResponse.json({
      success: true,
      message: isNew 
        ? 'Produto de teste inserido com sucesso!' 
        : 'Produto de teste atualizado com sucesso!',
      produto: novoProduto,
      totalProdutos,
      produtoData,
      acao: isNew ? 'inserido' : 'atualizado',
    });

  } catch (error: any) {
    console.error('[SYNC-DEBUG] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
