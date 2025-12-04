import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Sem cache para garantir dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const CATEGORIA_DISTRIBUIDORES_NOME = 'Diversos';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';

// Distribuidores que devem aparecer para TODAS as bancas (cotistas ou não)
const DISTRIBUIDORES_PUBLICOS = [
  '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
  '1511df09-1f4a-4e68-9f8c-05cd06be6269'  // Brancaleone
];

// Select com join de categorias
const PRODUCT_FIELDS = `*, categories!category_id(name)`;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // 1. Buscar dados da banca (para saber se é cotista)
    const { data: banca } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    const isCotista = banca?.is_cotista === true && !!banca?.cotista_id;

    // 2. Construir query UNIFICADA de produtos
    // Cotista: vê produtos da banca (banca_id) E todos de distribuidores (distribuidor_id != null)
    // Não-cotista: vê produtos da banca E distribuidores públicos
    
    let query = supabase
      .from('products')
      .select(PRODUCT_FIELDS, { count: 'estimated' })
      .eq('active', true);

    if (isCotista) {
       // Cotista vê produtos da banca + todos de distribuidores
       // Usar not.is.null para verificar distribuidor_id não nulo
       query = query.or(`banca_id.eq.${bancaId},distribuidor_id.not.is.null`);
    } else {
       // Não-cotista vê produtos da banca + distribuidores públicos
       query = query.or(`banca_id.eq.${bancaId},distribuidor_id.in.(${DISTRIBUIDORES_PUBLICOS.join(',')})`);
    }

    // Ordenação e Paginação
    // Priorizar produtos da banca? Se quiser misturar, order by name.
    // Vamos ordenar por nome para consistência
    query = query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data: produtos, count, error } = await query;

    if (error) {
      throw error;
    }

    // 3. Buscar customizações e nomes de distribuidores APENAS para os produtos carregados
    const produtosCarregados = produtos || [];
    const distribuidorIds = [...new Set(produtosCarregados.map(p => p.distribuidor_id).filter(Boolean))];
    const productIds = produtosCarregados.map(p => p.id);

    // Coletar category_ids dos produtos de distribuidores para buscar nomes
    const distribuidorCategoryIds = [...new Set(
      produtosCarregados
        .filter(p => p.distribuidor_id && p.category_id)
        .map(p => p.category_id)
    )];

    const [distribuidoresResult, customizacoesResult, distribuidorCategoriesResult] = await Promise.all([
      // Dados dos distribuidores incluindo markup
      distribuidorIds.length > 0 ? supabase.from('distribuidores').select('id, nome, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor').in('id', distribuidorIds) : { data: [] },
      // Customizações para esses produtos
      productIds.length > 0 ? supabase.from('banca_produtos_distribuidor').select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty').eq('banca_id', bancaId).in('product_id', productIds) : { data: [] },
      // Categorias de distribuidores (para produtos de distribuidores)
      distribuidorCategoryIds.length > 0 ? supabase.from('distribuidor_categories').select('id, nome').in('id', distribuidorCategoryIds) : { data: [] }
    ]);

    // Mapa de distribuidores com dados de markup
    const distribuidorMap = new Map((distribuidoresResult.data || []).map((d: any) => [d.id, d]));
    const customMap = new Map((customizacoesResult.data || []).map((c: any) => [c.product_id, c]));
    // Mapa de categorias de distribuidores (id -> nome)
    const distribuidorCategoryMap = new Map((distribuidorCategoriesResult.data || []).map((c: any) => [c.id, c.nome]));

    // Função para calcular preço com markup do distribuidor
    function calcularPrecoComMarkup(precoBase: number, distribuidor: any): number {
      if (!distribuidor) return precoBase;
      
      const tipoCalculo = distribuidor.tipo_calculo || 'markup';
      
      if (tipoCalculo === 'margem') {
        // Margem sobre Venda (Divisor): Preço Final = Preço Base / Divisor
        const divisor = distribuidor.margem_divisor || 1;
        if (divisor <= 0) return precoBase;
        return precoBase / divisor;
      } else {
        // Markup Simples (Adição): Preço Final = Preço Base × (1 + %) + Fixo
        const percentual = distribuidor.markup_global_percentual || 0;
        const fixo = distribuidor.markup_global_fixo || 0;
        return precoBase * (1 + percentual / 100) + fixo;
      }
    }

    // 4. Processar e Mapear
    const mappedProducts = produtosCarregados.map(produto => {
      const custom = customMap.get(produto.id);
      
      // Se tem customização e está desabilitado, pular (mas filter vem depois)
      if (custom && custom.enabled === false) return null;

      // Lógica de estoque e status
      const effectiveStock = custom?.custom_stock_enabled 
          ? (custom?.custom_stock_qty ?? 0)
          : produto.stock_qty;
        
      // Se customizado para usar estoque próprio e acabou, filtrar?
      // A lógica original filtrava. Vamos manter.
      if (custom?.custom_stock_enabled && (effectiveStock <= 0)) {
          // return null; // Ou mostrar como esgotado? O original filtrava na linha 205
          // Vamos manter consistência: se custom_stock_enabled e qty<=0, oculta ou mostra esgotado?
          // O original retornava false na filter.
          // Mas produtos esgotados normalmente aparecem. Vamos deixar passar e o frontend decide (status unavailable)
      }

      const customStatus = custom?.custom_status || 'available';
      const distribuidor = distribuidorMap.get(produto.distribuidor_id);
      const distribuidorNome = distribuidor?.nome || '';
      
      // Determinar nome da categoria:
      // 1. Se produto de banca, usar join com categories
      // 2. Se produto de distribuidor, buscar em distribuidor_categories
      let categoryName = produto.categories?.name;
      if (!categoryName && produto.distribuidor_id && produto.category_id) {
        categoryName = distribuidorCategoryMap.get(produto.category_id);
      }
      if (!categoryName) {
        categoryName = produto.distribuidor_id ? CATEGORIA_DISTRIBUIDORES_NOME : 'Geral';
      }
      
      let images = produto.images || [];
      if (!Array.isArray(images) || images.length === 0) {
        images = [DEFAULT_PRODUCT_IMAGE];
      }

      const { categories, ...produtoLimpo } = produto;

      // Calcular preço: prioridade é custom_price do jornaleiro, depois markup do distribuidor
      let precoFinal = produto.price;
      if (custom?.custom_price) {
        // Jornaleiro definiu preço customizado - usar esse
        precoFinal = custom.custom_price;
      } else if (produto.distribuidor_id && distribuidor) {
        // Aplicar markup do distribuidor
        precoFinal = calcularPrecoComMarkup(produto.price, distribuidor);
      }

      return {
        ...produtoLimpo,
        images,
        category_name: categoryName,
        distribuidor_nome: distribuidorNome,
        price: precoFinal,
        stock_qty: effectiveStock,
        description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
        status: customStatus,
        is_distribuidor: !!produto.distribuidor_id,
        active: true
      };
    }).filter(Boolean); // Remove nulos (desabilitados)

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: isCotista,
      total: count || 0,
      page,
      limit,
      has_more: (offset + limit) < (count || 0),
      products: mappedProducts,
    });


  } catch (error: any) {
    console.error('Erro ao buscar produtos da banca:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
// Force rebuild Sat Nov 15 18:02:32 -03 2025
