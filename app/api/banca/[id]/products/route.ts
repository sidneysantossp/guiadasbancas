import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Sem cache para garantir dados atualizados
export const revalidate = 0;
export const dynamic = 'force-dynamic';

const CATEGORIA_DISTRIBUIDORES_NOME = 'Diversos';
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/400x600/e5e7eb/6b7280.png';

// Select OTIMIZADO - apenas campos necessários para exibição
const PRODUCT_FIELDS_MINIMAL = `
  id,
  name,
  price,
  images,
  stock_qty,
  category_id,
  distribuidor_id,
  pronta_entrega,
  sob_encomenda,
  pre_venda,
  codigo_mercos,
  categories!category_id(name)
`;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get('limit') || '10000'); // Limite alto para buscar todos os produtos
    const fastMode = searchParams.get('fast') === 'true'; // Modo rápido sem markup/customizações

    // 1. Buscar dados da banca (para saber se é cotista)
    const { data: banca } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    const isCotista = banca?.is_cotista === true && !!banca?.cotista_id;

    // 2. Construir filtro base com campos otimizados
    const buildBaseQuery = () => {
      let q = supabase
        .from('products')
        .select(PRODUCT_FIELDS_MINIMAL, { count: 'estimated' })
        .eq('active', true);

      if (isCotista) {
        // Cotistas veem produtos próprios + todos de distribuidores
        q = q.or(`banca_id.eq.${bancaId},distribuidor_id.not.is.null`);
      } else {
        // Não-cotistas veem APENAS produtos próprios da banca
        q = q.eq('banca_id', bancaId);
      }
      return q;
    };

    // 3. Buscar produtos - otimizado para requests pequenos
    let produtos: any[] = [];
    let totalCount = 0;

    if (requestedLimit <= 1000) {
      // Query única para requests pequenos (mais rápido)
      const { data, count, error } = await buildBaseQuery()
        .order('name', { ascending: true })
        .limit(requestedLimit);

      if (error) throw error;
      produtos = data || [];
      totalCount = count || produtos.length;
    } else {
      // Buscar em lotes para requests grandes
      const BATCH_SIZE = 1000;
      let hasMore = true;
      let currentOffset = 0;

      while (hasMore && produtos.length < requestedLimit) {
        const batchLimit = Math.min(BATCH_SIZE, requestedLimit - produtos.length);
        
        const { data: batch, count, error } = await buildBaseQuery()
          .order('name', { ascending: true })
          .range(currentOffset, currentOffset + batchLimit - 1);

        if (error) throw error;
        if (count && totalCount === 0) totalCount = count;

        if (batch && batch.length > 0) {
          produtos.push(...batch);
          currentOffset += batch.length;
          hasMore = batch.length === batchLimit;
        } else {
          hasMore = false;
        }
      }
    }

    // 4. Modo rápido: retornar produtos sem processamento adicional
    if (fastMode) {
      const fastProducts = produtos.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images?.slice(0, 1) || [],
        stock_qty: p.stock_qty,
        category_name: p.categories?.name || CATEGORIA_DISTRIBUIDORES_NOME,
        pronta_entrega: p.pronta_entrega ?? false,
        sob_encomenda: p.sob_encomenda ?? false,
        pre_venda: p.pre_venda ?? false,
        status: 'available',
        is_distribuidor: !!p.distribuidor_id,
        codigo_mercos: p.codigo_mercos,
      }));

      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        total: totalCount || produtos.length,
        limit: requestedLimit,
        products: fastProducts,
        fast_mode: true,
      });
    }

    // 5. Modo completo: buscar customizações e markup
    const produtosCarregados = produtos || [];
    const distribuidorIds = [...new Set(produtosCarregados.map(p => p.distribuidor_id).filter(Boolean))];
    const productIds = produtosCarregados.map(p => p.id);

    // Coletar category_ids dos produtos de distribuidores para buscar nomes
    const distribuidorCategoryIds = [...new Set(
      produtosCarregados
        .filter(p => p.distribuidor_id && p.category_id)
        .map(p => p.category_id)
    )];

    // Buscar markups por distribuidor (não por product_id para evitar limite de query)
    const [distribuidoresResult, customizacoesResult, distribuidorCategoriesResult, markupProdutosResult, markupCategoriasResult] = await Promise.all([
      // Dados dos distribuidores incluindo markup
      distribuidorIds.length > 0 ? supabase.from('distribuidores').select('id, nome, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor').in('id', distribuidorIds) : { data: [] },
      // Customizações para esses produtos (buscar em lotes se necessário)
      productIds.length > 0 && productIds.length <= 500 
        ? supabase.from('banca_produtos_distribuidor').select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty').eq('banca_id', bancaId).in('product_id', productIds) 
        : supabase.from('banca_produtos_distribuidor').select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty').eq('banca_id', bancaId),
      // Categorias de distribuidores (para produtos de distribuidores)
      distribuidorCategoryIds.length > 0 ? supabase.from('distribuidor_categories').select('id, nome').in('id', distribuidorCategoryIds) : { data: [] },
      // Markup por produto do distribuidor - buscar por distribuidor_id (menos registros)
      distribuidorIds.length > 0 ? supabase.from('distribuidor_markup_produtos').select('product_id, markup_percentual, markup_fixo, distribuidor_id').in('distribuidor_id', distribuidorIds) : { data: [] },
      // Markup por categoria do distribuidor
      distribuidorIds.length > 0 ? supabase.from('distribuidor_markup_categorias').select('distribuidor_id, category_id, markup_percentual, markup_fixo').in('distribuidor_id', distribuidorIds) : { data: [] }
    ]);

    // Mapa de distribuidores com dados de markup
    const distribuidorMap = new Map((distribuidoresResult.data || []).map((d: any) => [d.id, d]));
    const customMap = new Map((customizacoesResult.data || []).map((c: any) => [c.product_id, c]));
    // Mapa de categorias de distribuidores (id -> nome)
    const distribuidorCategoryMap = new Map((distribuidorCategoriesResult.data || []).map((c: any) => [c.id, c.nome]));
    // Mapa de markup por produto (product_id -> {percentual, fixo})
    const markupProdutoMap = new Map((markupProdutosResult.data || []).map((m: any) => [m.product_id, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));
    // Mapa de markup por categoria (distribuidor_id:category_id -> {percentual, fixo})
    const markupCategoriaMap = new Map((markupCategoriasResult.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, { percentual: m.markup_percentual || 0, fixo: m.markup_fixo || 0 }]));

    // Função para calcular preço com markup do distribuidor
    // Prioridade: Produto > Categoria > Global
    function calcularPrecoComMarkup(precoBase: number, produtoId: string, distribuidorId: string, categoryId: string, distribuidor: any): number {
      if (!distribuidor) return precoBase;
      
      // 1. Verificar markup específico do produto (maior prioridade)
      const markupProd = markupProdutoMap.get(produtoId);
      if (markupProd && (markupProd.percentual > 0 || markupProd.fixo > 0)) {
        return precoBase * (1 + markupProd.percentual / 100) + markupProd.fixo;
      }

      // 2. Verificar markup da categoria
      const markupCat = markupCategoriaMap.get(`${distribuidorId}:${categoryId}`);
      if (markupCat && (markupCat.percentual > 0 || markupCat.fixo > 0)) {
        return precoBase * (1 + markupCat.percentual / 100) + markupCat.fixo;
      }

      // 3. Usar configuração global do distribuidor
      const tipoCalculo = distribuidor.tipo_calculo || 'markup';
      
      if (tipoCalculo === 'margem') {
        // Margem sobre Venda (Divisor): Preço Final = Preço Base / Divisor
        const divisor = distribuidor.margem_divisor || 1;
        if (divisor <= 0 || divisor >= 1) return precoBase;
        return precoBase / divisor;
      } else {
        // Markup Simples (Adição): Preço Final = Preço Base × (1 + %) + Fixo
        const percentual = distribuidor.markup_global_percentual || 0;
        const fixo = distribuidor.markup_global_fixo || 0;
        if (percentual > 0 || fixo > 0) {
          return precoBase * (1 + percentual / 100) + fixo;
        }
      }

      // 4. Sem configuração, retornar preço base
      return precoBase;
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
        // Aplicar markup do distribuidor (prioridade: produto > categoria > global)
        precoFinal = calcularPrecoComMarkup(
          produto.price,
          produto.id,
          produto.distribuidor_id,
          produto.category_id,
          distribuidor
        );
      }

      // Retornar apenas campos necessários para o frontend (otimizado)
      return {
        id: produto.id,
        name: produto.name,
        price: precoFinal,
        images: images.slice(0, 1), // Apenas primeira imagem para listagem
        stock_qty: effectiveStock,
        category_name: categoryName,
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega ?? false,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda ?? false,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda ?? false,
        status: customStatus,
        is_distribuidor: !!produto.distribuidor_id,
        codigo_mercos: produto.codigo_mercos,
      };
    }).filter(Boolean); // Remove nulos (desabilitados)

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: isCotista,
      total: totalCount || produtos.length,
      limit: requestedLimit,
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
