export type PreVendaProduct = {
  id: string;
  name: string;
  price: number;
  priceOriginal?: number;
  image?: string;
  preSale?: boolean;
  releaseDate?: string;
  category?: string;
  rating?: number;
  sellerName?: string;
  sellerAvatar?: string;
  readyToShip?: boolean;
  sellerLat?: number;
  sellerLng?: number;
};

export const preVendaSeed: PreVendaProduct[] = [
  { id: "pv1", name: "Coleção HQ Vol. 10 (Pré-venda)", price: 59.9, priceOriginal: 69.9, image: "/images/sample/hq.jpg", preSale: true, releaseDate: "2025-10-05", category: "hq", rating: 4.6, sellerName: "Banca Central", sellerAvatar: "/images/sample/seller1.jpg", readyToShip: true, sellerLat: -23.55052, sellerLng: -46.633308 },
  { id: "pv2", name: "Café Edição Limitada (Pré-venda)", price: 49.9, priceOriginal: 59.9, image: "/images/sample/coffee2.jpg", preSale: true, releaseDate: "2025-10-12", category: "cafe", rating: 4.2, sellerName: "Banca Gourmet", sellerAvatar: "/images/sample/seller4.jpg", readyToShip: false, sellerLat: -23.559616, sellerLng: -46.658043 },
  { id: "pv3", name: "Revista Tech Pro (Pré-venda)", price: 34.9, priceOriginal: 39.9, image: "/images/sample/mag2.jpg", preSale: true, releaseDate: "2025-10-20", category: "revistas", rating: 4.8, sellerName: "Banca Tech", sellerAvatar: "/images/sample/seller2.jpg", readyToShip: true, sellerLat: -23.563099, sellerLng: -46.654387 },
];
