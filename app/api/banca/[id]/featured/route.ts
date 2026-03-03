import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';
const DISTRIBUIDOR_CATEGORY_FALLBACK = 'Diversos';
const BANCA_CATEGORY_FALLBACK = 'Geral';

const FEATURED_PRODUCT_FIELDS = `
  id,
  name,
  price,
  price_original,
  discount_percent,
  images,
  stock_qty,
  category_id,
  distribuidor_id,
  track_stock,
  pronta_entrega,
  sob_encomenda,
  pre_venda,
  rating_avg,
  reviews_count,
  codigo_mercos
`;

function calcularPrecoComMarkup(precoBase: number, distribuidor: any): number {
  if (!distribuidor) return precoBase;
  const tipoCalculo = distribuidor.tipo_calculo || 'markup';
  if (tipoCalculo === 'margem') {
    const divisor = distribuidor.margem_divisor || 1;
    if (divisor <= 0 || divisor >= 1) return precoBase;
    return precoBase / divisor;
  }
  const percentual = distribuidor.markup_global_percentual || 0;
  const fixo = distribuidor.markup_global_fixo || 0;
  return precoBase * (1 + percentual / 100) + fixo;
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // Verificar se a banca é cotista
    const { data: banca, error: bancaError } = await supabase
      .from('bancas')
      .select('is_cotista, cotista_id, active')
      .eq('id', bancaId)
      .single();

    if (bancaError || !banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const isCotista = (banca?.is_cotista === true || !!banca?.cotista_id);

    // 1. Buscar produtos próprios da banca marcados como destaque
    const { data: produtosProprios, error: produtosPropriosError } = await supabase
      .from('products')
      .select(FEATURED_PRODUCT_FIELDS)
      .eq('banca_id', bancaId)
      .is('distribuidor_id', null)
      .eq('featured', true)
      .eq('active', true);

    if (produtosPropriosError) {
      throw produtosPropriosError;
    }

    const ownCategoryIds = [...new Set(
      (produtosProprios || [])
        .map((p: any) => p.category_id)
        .filter(Boolean)
    )];

    const { data: ownCategories, error: ownCategoriesError } = ownCategoryIds.length > 0
      ? await supabase.from('categories').select('id, name').in('id', ownCategoryIds)
      : { data: [], error: null };

    if (ownCategoriesError) {
      throw ownCategoriesError;
    }

    const ownCategoryMap = new Map((ownCategories || []).map((c: any) => [c.id, c.name]));

    // 2. Se for cotista, buscar produtos de distribuidores marcados como destaque
    let produtosDistribuidor: any[] = [];
    
    if (isCotista) {
      // Buscar customizações com custom_featured = true
      const { data: customizacoesFeatured, error: customizacoesError } = await supabase
        .from('banca_produtos_distribuidor')
        .select('product_id, enabled, custom_price, custom_stock_enabled, custom_stock_qty')
        .eq('banca_id', bancaId)
        .eq('enabled', true)
        .eq('custom_featured', true);

      if (customizacoesError) {
        throw customizacoesError;
      }

      if (customizacoesFeatured && customizacoesFeatured.length > 0) {
        const productIds = customizacoesFeatured.map(c => c.product_id);
        
        // Buscar os produtos
        const { data: produtos, error: produtosDistError } = await supabase
          .from('products')
          .select(FEATURED_PRODUCT_FIELDS)
          .in('id', productIds)
          .eq('active', true);

        if (produtosDistError) {
          throw produtosDistError;
        }

        const customMap = new Map(customizacoesFeatured.map(c => [c.product_id, c]));

        // Buscar dados dos distribuidores incluindo markup
        const distribuidorIds = [...new Set((produtos || []).map(p => p.distribuidor_id).filter(Boolean))];
        
        // Coletar category_ids dos produtos de distribuidores para buscar nomes
        const distribuidorCategoryIds = [...new Set(
          (produtos || [])
            .filter(p => p.distribuidor_id && p.category_id)
            .map(p => p.category_id)
        )];
        
        const [distribuidoresRes, distribuidorCategoriesRes] = await Promise.all([
          distribuidorIds.length > 0
            ? supabase.from('distribuidores').select('id, nome, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor').in('id', distribuidorIds)
            : Promise.resolve({ data: [], error: null } as any),
          distribuidorCategoryIds.length > 0
            ? supabase.from('distribuidor_categories').select('id, nome').in('id', distribuidorCategoryIds)
            : Promise.resolve({ data: [], error: null } as any)
        ]);

        if (distribuidoresRes.error) {
          throw distribuidoresRes.error;
        }
        if (distribuidorCategoriesRes.error) {
          throw distribuidorCategoriesRes.error;
        }

        const distribuidorMap = new Map((distribuidoresRes.data || []).map(d => [d.id, d]));
        const distribuidorCategoryMap = new Map((distribuidorCategoriesRes.data || []).map((c: any) => [c.id, c.nome]));

        produtosDistribuidor = (produtos || [])
          .map(produto => {
            const custom = customMap.get(produto.id);
            const distribuidor = distribuidorMap.get(produto.distribuidor_id);
            
            // Calcular estoque efetivo
            const effectiveStock = custom?.custom_stock_enabled 
              ? (custom?.custom_stock_qty ?? 0)
              : produto.stock_qty;

            // Garantir imagem
            let images = produto.images || [];
            if (!Array.isArray(images) || images.length === 0) {
              images = [DEFAULT_PRODUCT_IMAGE];
            }

            // Determinar nome da categoria (buscar em distribuidor_categories se não houver em categories)
            let categoryName: string | undefined;
            if (produto.category_id) {
              categoryName = distribuidorCategoryMap.get(produto.category_id);
            }
            if (!categoryName) {
              categoryName = DISTRIBUIDOR_CATEGORY_FALLBACK;
            }

            // Calcular preço: prioridade é custom_price do jornaleiro, depois markup do distribuidor
            let price = produto.price;
            if (custom?.custom_price) {
              price = custom.custom_price;
            } else if (distribuidor) {
              price = calcularPrecoComMarkup(produto.price, distribuidor);
            }
            const priceOriginal = produto.price_original || produto.price;
            const discountPercent = produto.discount_percent || 
              (priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0);

            return {
              ...produto,
              images,
              category_name: categoryName,
              price,
              price_original: priceOriginal,
              discount_percent: discountPercent,
              stock_qty: effectiveStock,
              is_distribuidor: true,
              codigo_mercos: produto.codigo_mercos || '',
            };
          })
          .filter(p => p.stock_qty > 0); // Apenas com estoque
      }
    }

    // 3. Combinar e formatar produtos
    const todosProdutos = [
      ...(produtosProprios || []).map(p => {
        let images = p.images || [];
        if (!Array.isArray(images) || images.length === 0) {
          images = [DEFAULT_PRODUCT_IMAGE];
        }
        
        // Calcular desconto
        const price = p.price;
        const priceOriginal = p.price_original || p.price;
        const discountPercent = p.discount_percent || 
          (priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0);

        const categoryName = p.category_id
          ? ownCategoryMap.get(p.category_id) || BANCA_CATEGORY_FALLBACK
          : BANCA_CATEGORY_FALLBACK;
        
        return {
          ...p,
          images,
          category_name: categoryName,
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
