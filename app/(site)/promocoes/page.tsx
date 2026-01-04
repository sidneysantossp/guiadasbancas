import PromocoesPageClient from "@/components/PromocoesPageClient";
import { getPromoProducts } from "@/lib/data/products";

type PromoProduct = {
  id: string;
  name: string;
  price: number;
  priceOriginal?: number;
  image?: string;
  promo?: boolean;
  preSale?: boolean;
  category?: string;
  rating?: number;
  sellerName?: string;
  sellerAvatar?: string;
  distanceKm?: number;
  readyToShip?: boolean;
  sellerLat?: number;
  sellerLng?: number;
};

function mapPromos(data: any[]): PromoProduct[] {
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    priceOriginal: p.price_original,
    image: p.images?.[0],
    promo: true,
    category: p.category_id,
    rating: p.rating_avg || 4.5,
    sellerName: p.banca?.name,
    sellerAvatar: p.banca?.avatar,
    readyToShip: p.pronta_entrega,
    sellerLat: p.banca?.lat,
    sellerLng: p.banca?.lng,
  }));
}

async function fetchPromos(): Promise<PromoProduct[] | null> {
  try {
    const data = await getPromoProducts(20);
    return mapPromos(data);
  } catch {
    return null;
  }
}

export default async function PromocoesPage() {
  const initialPromos = await fetchPromos();
  return <PromocoesPageClient initialPromos={initialPromos ?? undefined} />;
}
