export interface Categoria {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Banca {
  id: string;
  name: string;
  slug: string;
  description?: string;
  phone_whatsapp?: string;
  email?: string;
  cover_url?: string;
  avatar_url?: string;
  city?: string;
  state?: string;
  status: 'ativo' | 'pausado' | 'aprovacao';
  created_at?: string;
  updated_at?: string;
}

export interface Produto {
  id: string;
  banca_id?: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  description_full?: string; // Descrição completa com HTML
  specifications?: string; // Especificações técnicas
  gallery_images?: string[]; // Galeria adicional de imagens
  images: string[];
  price: number;
  price_original?: number;
  discount_percent?: number;
  stock_qty?: number;
  track_stock?: boolean;
  active: boolean;
  featured?: boolean;
  sob_encomenda?: boolean;
  pre_venda?: boolean;
  pronta_entrega?: boolean;
  coupon_code?: string;
  rating_avg?: number;
  reviews_count?: number;
  allow_reviews?: boolean; // Permitir avaliações
  created_at?: string;
  updated_at?: string;
}

export interface PedidoItem {
  product_id: string;
  name_snapshot: string;
  price_snapshot: number;
  qty: number;
  image_snapshot?: string;
}

export interface Pedido {
  id: string;
  banca_id: string;
  customer: { name: string; phone_whatsapp: string; email?: string };
  items: PedidoItem[];
  subtotal: number;
  discount_amount?: number;
  shipping_fee?: number;
  total: number;
  payment_method: 'pix' | 'dinheiro' | 'cartao' | 'online';
  status: 'novo' | 'confirmado' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  created_at?: string;
  updated_at?: string;
}
