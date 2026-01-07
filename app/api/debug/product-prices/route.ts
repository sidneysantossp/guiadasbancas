import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    // Buscar produto diretamente do banco
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, price_original, discount_percent, banca_id, distribuidor_id, active')
      .eq('id', productId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Análise dos preços
    const analysis = {
      product_id: product.id,
      product_name: product.name,
      banco: {
        price: product.price,
        price_original: product.price_original,
        discount_percent: product.discount_percent,
      },
      interpretacao: {
        preco_atual: product.price,
        preco_para_riscar: product.price_original,
        tem_desconto: product.price_original && product.price_original > product.price,
        desconto_calculado: product.price_original && product.price_original > product.price 
          ? Math.round((1 - product.price / product.price_original) * 100) 
          : 0,
      },
      frontend_esperado: {
        exibir_preco: product.price,
        exibir_riscado: product.price_original && product.price_original > product.price ? product.price_original : null,
      },
      banca_id: product.banca_id,
      distribuidor_id: product.distribuidor_id,
      active: product.active,
    };

    return NextResponse.json({
      success: true,
      ...analysis
    }, {
      headers: {
        'Cache-Control': 'no-store',
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
