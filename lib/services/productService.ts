import {
  bancaHasLegacyDistributorCatalogAccess,
  calculateDistributorProductMarkup,
  listDistributorCatalogForBanca,
  listOwnedCatalogProducts,
} from "@/lib/modules/products/service";

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

function toLegacyProductSearchResult(product: any): ProductSearchResult {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    images: Array.isArray(product.images) ? product.images : [],
    category_id: product.category_id,
    category_name: product.category_name || null,
    banca_id: product.banca_id,
    banca_name: product.bancas?.name || product.banca_name || null,
    active: product.active ?? true,
    cost_price: product.cost_price != null ? Number(product.cost_price) : undefined,
    is_distribuidor: product.is_distribuidor === true,
  };
}

export class ProductService {
  static async searchProducts(filters: ProductFilters): Promise<ProductSearchResult[]> {
    const items = await listOwnedCatalogProducts({
      bancaId: filters.bancaId || null,
      filters: {
        q: filters.q,
        category: filters.category,
        active: typeof filters.active === "boolean" ? filters.active : null,
        featured: typeof filters.featured === "boolean" ? filters.featured : null,
        limit: filters.limit,
      },
    });

    return items.map(toLegacyProductSearchResult);
  }

  static async calculatePriceWithMarkup(
    basePrice: number,
    productId: string,
    distribuidorId: string,
    categoryId: string
  ): Promise<number> {
    if (!distribuidorId) {
      return basePrice;
    }

    return calculateDistributorProductMarkup({
      basePrice,
      productId,
      distribuidorId,
      categoryId,
    });
  }

  static async getDistribuidorProducts(
    bancaId: string,
    filters: ProductFilters
  ): Promise<ProductSearchResult[]> {
    const canAccessCatalog = await bancaHasLegacyDistributorCatalogAccess(bancaId);
    const result = await listDistributorCatalogForBanca({
      bancaId,
      canAccessCatalog,
      filters: {
        q: filters.q,
        category: filters.category,
        limit: filters.limit,
      },
    });

    return result.items.map(toLegacyProductSearchResult);
  }

  static async getCombinedProducts(
    bancaId: string,
    filters: ProductFilters
  ): Promise<ProductSearchResult[]> {
    const [proprios, distribuidores] = await Promise.all([
      this.searchProducts({ ...filters, bancaId }),
      this.getDistribuidorProducts(bancaId, filters),
    ]);

    return [...proprios, ...distribuidores];
  }
}
