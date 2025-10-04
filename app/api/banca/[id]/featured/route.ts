import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const DEFAULT_PRODUCT_IMAGE = 'https://cdn1.staticpanvel.com.br/produtos/15/produto-sem-imagem.jpg';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // 1. Buscar produtos próprios da banca marcados como destaque
    const { data: produtosProprios } = await supabase
      .from('products')
      .select('*, categories!category_id(name)')
      .eq('banca_id', bancaId)
      .is('distribuidor_id', null)
      .eq('featured', true)
      .eq('active', true);

    // 2. Buscar produtos de distribuidores com custom_featured = true
    const { data: customizacoes } = await supabase
      .from('banca_produtos_distribuidor')
      .select('product_id, enabled, custom_price, custom_stock_enabled, custom_stock_qty')
      .eq('banca_id', bancaId)
      .eq('custom_featured', true)
      .eq('enabled', true);

    let produtosDistribuidor: any[] = [];

    if (customizacoes && customizacoes.length > 0) {
      const productIds = customizacoes.map(c => c.product_id);
      
      const { data: produtos } = await supabase
        .from('products')
        .select('*, categories!category_id(name)')
        .in('id', productIds);

      const customMap = new Map(customizacoes.map(c => [c.product_id, c]));

      produtosDistribuidor = (produtos || [])
        .map(produto => {
          const custom = customMap.get(produto.id);
          
          // Calcular estoque efetivo
          const effectiveStock = custom?.custom_stock_enabled 
            ? (custom?.custom_stock_qty ?? 0)
            : produto.stock_qty;

          // Garantir imagem
          let images = produto.images || [];
          if (!Array.isArray(images) || images.length === 0) {
            images = [DEFAULT_PRODUCT_IMAGE];
          }

          const { categories, ...produtoLimpo } = produto;

          return {
            ...produtoLimpo,
            images,
            category_name: categories?.name,
            price: custom?.custom_price || produto.price,
            stock_qty: effectiveStock,
          };
        })
        .filter(p => p.stock_qty > 0); // Apenas com estoque
    }

    // 3. Combinar e formatar produtos
    const todosProdutos = [
      ...(produtosProprios || []).map(p => {
        let images = p.images || [];
        if (!Array.isArray(images) || images.length === 0) {
          images = [DEFAULT_PRODUCT_IMAGE];
        }
        const { categories, ...produtoLimpo } = p;
        return {
          ...produtoLimpo,
          images,
          category_name: categories?.name,
        };
      }),
      ...produtosDistribuidor,
    ].slice(0, 12); // Máximo 12 produtos em destaque

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      total: todosProdutos.length,
      products: todosProdutos
    });

  } catch (error: any) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
