import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Endpoint para verificar o schema da tabela products
 * e testar se os campos necessários existem
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[VERIFY-SCHEMA] Verificando schema da tabela products');
  
  try {
    const supabase = supabaseAdmin;
    
    // 1. Verificar se o supabaseAdmin está configurado
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'supabaseAdmin não está configurado',
      }, { status: 500 });
    }

    // 2. Verificar informações do schema da tabela products
    const { data: columns, error: schemaError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (schemaError) {
      console.error('[VERIFY-SCHEMA] Erro ao consultar products:', schemaError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao consultar tabela products',
        details: schemaError,
      }, { status: 500 });
    }

    // 3. Verificar se a tabela distribuidores existe
    const { data: distribuidores, error: distError } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .limit(5);

    // 4. Tentar inserir um produto de teste
    const testProduct = {
      name: 'Produto Teste Sincronização',
      description: 'Este é um produto de teste',
      price: 10.00,
      stock_qty: 100,
      images: [],
      banca_id: null,
      distribuidor_id: params.id,
      mercos_id: 999999,
      category_id: 'bbbbbbbb-0000-0000-0000-000000000001',
      origem: 'mercos',
      sincronizado_em: new Date().toISOString(),
      track_stock: true,
      sob_encomenda: false,
      pre_venda: false,
      pronta_entrega: true,
      ativo: true,
      active: true, // Campo usado pela API de stats
    };

    console.log('[VERIFY-SCHEMA] Tentando inserir produto de teste:', testProduct);

    const { data: insertedProduct, error: insertError } = await supabase
      .from('products')
      .insert([testProduct])
      .select();

    if (insertError) {
      console.error('[VERIFY-SCHEMA] Erro ao inserir produto de teste:', insertError);
      
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir produto de teste',
        schemaCheck: {
          tabelaProducts: columns ? 'OK' : 'ERRO',
          tabelaDistribuidores: distError ? 'ERRO' : 'OK',
          totalDistribuidores: distribuidores?.length || 0,
        },
        insertError: {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        },
        productData: testProduct,
      });
    }

    // 5. Remover produto de teste
    if (insertedProduct && insertedProduct.length > 0) {
      await supabase
        .from('products')
        .delete()
        .eq('id', insertedProduct[0].id);
    }

    // 6. Verificar contagem de produtos
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);

    return NextResponse.json({
      success: true,
      message: 'Schema verificado com sucesso!',
      schemaCheck: {
        tabelaProducts: 'OK',
        tabelaDistribuidores: distError ? 'ERRO' : 'OK',
        totalDistribuidores: distribuidores?.length || 0,
        totalProdutos: totalProducts || 0,
      },
      testInsert: 'OK',
      productInserted: insertedProduct?.[0],
    });

  } catch (error: any) {
    console.error('[VERIFY-SCHEMA] Erro geral:', error);
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
