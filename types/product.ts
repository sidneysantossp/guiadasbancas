// Tipos específicos para produtos com melhor type safety

export interface Product {
  id: string;
  name: string;
  description?: string;
  description_full?: string;
  price: number;
  price_original?: number;
  discount_percent?: number;
  images: string[];
  gallery_images?: string[];
  specifications?: Record<string, any>;
  rating_avg?: number;
  reviews_count?: number;
  stock_qty?: number;
  track_stock?: boolean;
  sob_encomenda?: boolean;
  pre_venda?: boolean;
  pronta_entrega?: boolean;
  active: boolean;
  featured?: boolean;
  created_at: string;
  updated_at: string;

  // Relacionamentos
  banca_id: string;
  category_id: string;
  distribuidor_id?: string;

  // Joins populados
  categories?: {
    name: string;
  };
  bancas?: {
    name: string;
    lat?: number;
    lng?: number;
  };
  distribuidores?: {
    id: string;
    nome: string;
  };
}

export interface ProductFilters {
  q?: string;
  category?: string;
  active?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'price' | 'created_at' | 'rating';
  sortOrder?: 'asc' | 'desc';
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
  distance?: number;
  cost_price?: number;
  is_distribuidor?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  banca_id: string;
  category_id: string;
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  category_id: string;
  banca_id: string;
}

// Validações
export interface ProductValidationError {
  field: keyof Product;
  message: string;
}

export interface ProductValidator {
  validate(product: Partial<Product>): ProductValidationError[];
  validateRequired(product: Partial<Product>): ProductValidationError[];
  sanitize(product: Partial<Product>): Partial<Product>;
}
