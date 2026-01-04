import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';

// GET /api/bancas/:id/produtos-completo
// Retorna produtos próprios + produtos de distribuidor habilitados
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const bancaId = params.id;

    const { data: banca, error: bancaError } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id, active')
      .eq('id', bancaId)
      .single();

    if (bancaError) {
      console.error('[API] Erro ao buscar banca:', bancaError);
      return NextResponse.json(
        { success: false, error: bancaError.message },
        { status: 500 }
      );
    }

    const isActiveCotista = (banca?.is_cotista === true || !!banca?.cotista_id);
    if (!isActiveCotista) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        stats: {
          proprios: 0,
          distribuidores: 0,
        },
      });
    }

    // 1. Buscar produtos próprios da banca
    const { data: produtosProprios, error: propriosError } = await supabase
      .from('products')
      .select('*')
      .eq('banca_id', bancaId)
      .eq('active', true)
      .is('distribuidor_id', null);

    // 2. Buscar produtos de distribuidor habilitados para esta banca
    // Primeiro buscar os IDs dos produtos habilitados
    const { data: produtosHabilitados } = await supabase
      .from('banca_produtos_distribuidor')
      .select('product_id, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda')
      .eq('banca_id', bancaId)
      .eq('enabled', true);

    let produtosDistribuidor: any[] = [];

    if (produtosHabilitados && produtosHabilitados.length > 0) {
      const productIds = produtosHabilitados.map(p => p.product_id);

      // Buscar dados completos dos produtos
      const { data: produtosBase } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('active', true);

      // Combinar dados base com customizações
      produtosDistribuidor = (produtosBase || []).map(produto => {
        const custom = produtosHabilitados.find(c => c.product_id === produto.id);
        
        return {
          ...produto,
          // Aplicar customizações
          price: custom?.custom_price || produto.price,
          description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
          status: custom?.custom_status || 'available',
          pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
          sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
          pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
          // Adicionar à categoria de distribuidores
          category_id: CATEGORIA_DISTRIBUIDORES_ID,
          // Flag para identificar origem
          is_distribuidor: true,
        };
      });
    }

    // 4. Combinar todos os produtos
    const todosProdutos = [
      ...(produtosProprios || []).map(p => ({ ...p, is_distribuidor: false })),
      ...produtosDistribuidor,
    ];

    return NextResponse.json({
      success: true,
      data: todosProdutos,
      total: todosProdutos.length,
      stats: {
        proprios: produtosProprios?.length || 0,
        distribuidores: produtosDistribuidor.length,
      },
    });
  } catch (error: any) {
    console.error('[API] Erro ao buscar produtos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
