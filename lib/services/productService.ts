// Serviço unificado para operações com produtos
// Centraliza lógica de busca, cálculo de preços e markup

import { supabaseAdmin } from "@/lib/supabase";

export interface ProductFilters {
  q?: string;
  category?: string;
  active?: boolean;
  featured?: boolean;
  limit?: number;
  bancaId?: string;
}

export interface ProductSearchResult {
  id: string;
  name: string;
  price: number;
  images: string[];
  category_id: string;
  category_name?: string;
  banca_id: string;
  banca_name?: string;
  active: boolean;
  cost_price?: number;
  is_distribuidor?: boolean;
}

export class ProductService {
  /**
   * Busca produtos com filtros aplicados
   */
  static async searchProducts(filters: ProductFilters): Promise<ProductSearchResult[]> {
    const {
      q,
      category,
      active,
      featured,
      limit = 50,
      bancaId
    } = filters;

    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        category_id,
        banca_id,
        active,
        featured,
        categories(name),
        bancas(name)
      `)
      .limit(Math.min(limit, 100));

    // Aplicar filtros
    if (q) {
      query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }
    if (category) {
      query = query.eq('category_id', category);
    }
    if (bancaId) {
      query = query.eq('banca_id', bancaId);
    }
    if (active !== undefined) {
      query = query.eq('active', active);
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro na busca de produtos: ${error.message}`);
    }

    return (data || []).map(product => {
      const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
      const banca = Array.isArray(product.bancas) ? product.bancas[0] : product.bancas;
      return {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        images: product.images || [],
        category_id: product.category_id,
        category_name: category?.name,
        banca_id: product.banca_id,
        banca_name: banca?.name,
        active: product.active ?? true,
      };
    });
  }

  /**
   * Calcula preço com markup do distribuidor
   */
  static async calculatePriceWithMarkup(
    basePrice: number,
    productId: string,
    distribuidorId: string,
    categoryId: string
  ): Promise<number> {
    if (!distribuidorId) return basePrice;

    // Buscar configurações do distribuidor
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('tipo_calculo, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor')
      .eq('id', distribuidorId)
      .single();

    if (!distribuidor) return basePrice;

    // 1. Verificar markup específico do produto
    const { data: markupProduto } = await supabaseAdmin
      .from('distribuidor_markup_produtos')
      .select('markup_percentual, markup_fixo')
      .eq('product_id', productId)
      .eq('distribuidor_id', distribuidorId)
      .single();

    if (markupProduto && (markupProduto.markup_percentual > 0 || markupProduto.markup_fixo > 0)) {
      return basePrice * (1 + markupProduto.markup_percentual / 100) + markupProduto.markup_fixo;
    }

    // 2. Verificar markup da categoria
    const { data: markupCategoria } = await supabaseAdmin
      .from('distribuidor_markup_categorias')
      .select('markup_percentual, markup_fixo')
      .eq('distribuidor_id', distribuidorId)
      .eq('category_id', categoryId)
      .single();

    if (markupCategoria && (markupCategoria.markup_percentual > 0 || markupCategoria.markup_fixo > 0)) {
      return basePrice * (1 + markupCategoria.markup_percentual / 100) + markupCategoria.markup_fixo;
    }

    // 3. Aplicar markup global
    const { tipo_calculo, markup_global_percentual, markup_global_fixo, margem_divisor } = distribuidor;

    if (tipo_calculo === 'margem' && margem_divisor > 0 && margem_divisor < 1) {
      return basePrice / margem_divisor;
    }

    if (markup_global_percentual > 0 || markup_global_fixo > 0) {
      return basePrice * (1 + markup_global_percentual / 100) + markup_global_fixo;
    }

    return basePrice;
  }

  /**
   * Busca produtos de distribuidores para cotistas
   */
  static async getDistribuidorProducts(bancaId: string, filters: ProductFilters): Promise<ProductSearchResult[]> {
    // Verificar se banca é cotista
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('is_cotista')
      .eq('id', bancaId)
      .single();

    if (!banca?.is_cotista) {
      return [];
    }

    // Buscar produtos de distribuidores
    const { q, category, limit = 50 } = filters;

    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        category_id,
        distribuidor_id,
        active,
        categories(name),
        distribuidores(id, nome)
      `)
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .limit(Math.min(limit, 100));

    if (q) {
      query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }
    if (category) {
      query = query.eq('category_id', category);
    }

    const { data: produtos, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar produtos de distribuidores: ${error.message}`);
    }

    // Buscar customizações desta banca
    const productIds = produtos?.map(p => p.id) || [];
    const { data: customizacoes } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('product_id, enabled, custom_price')
      .eq('banca_id', bancaId)
      .in('product_id', productIds);

    const customMap = new Map(customizacoes?.map(c => [c.product_id, c]) || []);

    // Aplicar preços e filtros
    const results = [];

    for (const produto of produtos || []) {
      const custom = customMap.get(produto.id);

      // Produto desabilitado para esta banca
      if (custom?.enabled === false) continue;

      const precoFinal = custom?.custom_price ||
        await this.calculatePriceWithMarkup(
          produto.price,
          produto.id,
          produto.distribuidor_id,
          produto.category_id
        );

      results.push({
        id: produto.id,
        name: produto.name,
        price: precoFinal,
        cost_price: produto.price,
        images: produto.images || [],
        category_id: produto.category_id,
        category_name: produto.categories?.name,
        banca_id: bancaId,
        banca_name: 'Distribuidor',
        active: produto.active,
        is_distribuidor: true,
      });
    }

    return results;
  }

  /**
   * Combina produtos próprios e de distribuidores
   */
  static async getCombinedProducts(bancaId: string, filters: ProductFilters): Promise<ProductSearchResult[]> {
    const [proprios, distribuidores] = await Promise.all([
      this.searchProducts({ ...filters, bancaId }),
      this.getDistribuidorProducts(bancaId, filters)
    ]);

    return [...proprios, ...distribuidores];
  }
}
