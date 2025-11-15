import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_PRODUCT_IMAGE = 'https://cdn1.staticpanvel.com.br/produtos/15/produto-sem-imagem.jpg';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Verificar se a banca é cotista
    const { data: banca } = await supabase
      .from('bancas')
      .select('is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    const isCotista = banca?.is_cotista === true && !!banca?.cotista_id;

    // 1. Buscar produtos próprios da banca com desconto (ofertas reais)
    const { data: produtosProprios } = await supabase
      .from('products')
      .select('*, categories!category_id(name)')
      .eq('banca_id', bancaId)
      .is('distribuidor_id', null)
      .eq('active', true)
      .or('discount_percent.gt.0,price_original.gt.price')
      .limit(6);

    // 2. Se for cotista, buscar produtos de distribuidores com desconto
    let produtosDistribuidor: any[] = [];
    
    if (isCotista) {
      // Buscar produtos de distribuidores com desconto
      const { data: produtosComDesconto } = await supabase
        .from('products')
        .select('*, categories!category_id(name)')
        .not('distribuidor_id', 'is', null)
        .eq('active', true)
        .or('discount_percent.gt.0,price_original.gt.price')
        .limit(6);

      // Buscar customizações da banca para esses produtos
      const productIds = (produtosComDesconto || []).map(p => p.id);
      const { data: customizacoes } = await supabase
        .from('banca_produtos_distribuidor')
        .select('product_id, enabled, custom_price, custom_stock_enabled, custom_stock_qty')
        .eq('banca_id', bancaId)
        .in('product_id', productIds);

      const customMap = new Map((customizacoes || []).map(c => [c.product_id, c]));

      // Buscar nomes dos distribuidores
      const distribuidorIds = [...new Set((produtosComDesconto || []).map(p => p.distribuidor_id).filter(Boolean))];
      const { data: distribuidores } = await supabase
        .from('distribuidores')
        .select('id, nome')
        .in('id', distribuidorIds);
      
      const distribuidorMap = new Map((distribuidores || []).map(d => [d.id, d.nome]));

      produtosDistribuidor = (produtosComDesconto || [])
        .map(produto => {
          const custom = customMap.get(produto.id);
          
          // Se tem customização e está desabilitado, não mostrar
          if (custom && custom.enabled === false) return null;
          
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

          // Calcular desconto
          const price = custom?.custom_price || produto.price;
          const priceOriginal = produto.price_original || produto.price;
          const discountPercent = produto.discount_percent || 
            (priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0);

          return {
            ...produtoLimpo,
            images,
            category_name: categories?.name,
            price,
            price_original: priceOriginal,
            discount_percent: discountPercent,
            stock_qty: effectiveStock,
            is_distribuidor: true,
            distribuidor_nome: distribuidorMap.get(produto.distribuidor_id) || '',
            codigo_mercos: produto.codigo_mercos || '',
          };
        })
        .filter(p => p !== null && p.stock_qty > 0); // Apenas com estoque
    }

    // 3. Combinar e formatar produtos
    const todosProdutos = [
      ...(produtosProprios || []).map(p => {
        let images = p.images || [];
        if (!Array.isArray(images) || images.length === 0) {
          images = [DEFAULT_PRODUCT_IMAGE];
        }
        const { categories, ...produtoLimpo } = p;
        
        // Calcular desconto
        const price = p.price;
        const priceOriginal = p.price_original || p.price;
        const discountPercent = p.discount_percent || 
          (priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0);
        
        return {
          ...produtoLimpo,
          images,
          category_name: categories?.name,
          price,
          price_original: priceOriginal,
          discount_percent: discountPercent,
          is_distribuidor: false,
          codigo_mercos: p.codigo_mercos || '',
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
