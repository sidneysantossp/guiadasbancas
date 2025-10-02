"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  title: string;
  description: string;
  end_date: string;
  impressions: number;
  clicks: number;
  products: {
    id: string;
    slug?: string;
    name: string;
    description: string;
    price: number;
    price_original?: number;
    discount_percent?: number;
    images: string[];
    rating_avg?: number;
    reviews_count: number;
    pronta_entrega: boolean;
    sob_encomenda: boolean;
    pre_venda: boolean;
    active: boolean;
    bancas: {
      id: string;
      name: string;
      cover_image?: string;
    };
  };
}

export default function CampaignSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns?limit=8');
      const json = await res.json();
      
      if (json.success) {
        setCampaigns(json.data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = async (campaignId: string) => {
    // Incrementar clicks
    try {
      await fetch(`/api/campaigns/${campaignId}/click`, { method: 'POST' });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container-max">
          <div className="text-center">Carregando ofertas...</div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return null; // Não exibir a seção se não houver campanhas
  }

  return (
    <section className="bg-white">
      <div 
        className="container-max relative z-10 rounded-2xl px-3 sm:px-6 md:px-8 py-3"
        style={{
          backgroundImage: 'url(https://stackfood-react.6amtech.com/static/paidAdds.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🔥</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ofertas Relâmpago</h2>
            <p className="text-gray-600">Confira ofertas especiais das bancas anunciantes e destaque os principais produtos da sua região.</p>
          </div>
        </div>

        {/* Grid de campanhas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Imagem do produto */}
              <div className="relative">
                <img
                  src={campaign.products.images[0] || '/placeholder-product.jpg'}
                  alt={campaign.products.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge de desconto */}
                {campaign.products.discount_percent && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {campaign.products.discount_percent}% OFF
                  </div>
                )}

                {/* Badge de disponibilidade */}
                {campaign.products.pronta_entrega && (
                  <span className="absolute right-2 top-2 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-[2px]">
                    Pronta entrega
                  </span>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-3">
                {/* Avaliações */}
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => {
                    const filled = (campaign.products.rating_avg || 4.5) >= star - 0.001;
                    return (
                      <svg 
                        key={star} 
                        viewBox="0 0 24 24" 
                        className={`h-3.5 w-3.5 ${filled ? 'text-amber-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        aria-hidden
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193L12 .587z"/>
                      </svg>
                    );
                  })}
                  <span className="text-[12px] text-gray-500 ml-1">
                    {(campaign.products.rating_avg || 4.5).toFixed(1)} ({campaign.products.reviews_count})
                  </span>
                </div>

                {/* Nome do produto */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {campaign.products.name}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {campaign.products.description}
                </p>

                {/* Preços */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {campaign.products.price.toFixed(2)}
                  </span>
                  {campaign.products.price_original && (
                    <span className="text-sm text-gray-500 line-through">
                      R$ {campaign.products.price_original.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Footer com banca e ações */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-5 w-5 rounded-full overflow-hidden bg-orange-100 ring-1 ring-black/5">
                      {campaign.products.bancas.cover_image ? (
                        <img 
                          src={campaign.products.bancas.cover_image} 
                          alt={campaign.products.bancas.name} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-full w-full text-[#ff7a33]" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"/>
                        </svg>
                      )}
                    </span>
                    <span className="text-[12px] text-gray-700 truncate">
                      {campaign.products.bancas.name}
                    </span>
                  </div>
                  
                  <Link
                    href={`/produto/${campaign.products.slug || campaign.products.id}`}
                    onClick={() => handleCampaignClick(campaign.id)}
                    className="rounded-md bg-[#ff5c00] px-2 py-1 text-[11px] font-semibold text-white hover:opacity-95"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver mais */}
        {campaigns.length >= 8 && (
          <div className="text-center mt-8">
            <Link
              href="/ofertas"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Ver Todas as Ofertas
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
