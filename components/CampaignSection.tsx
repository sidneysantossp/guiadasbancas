"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  products: {
    id: string;
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
        <div className="container mx-auto px-4">
          <div className="text-center">Carregando ofertas...</div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return null; // Não exibir a seção se não houver campanhas
  }

  return (
    <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
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

                {/* Badges de disponibilidade */}
                <div className="absolute top-3 right-3 space-y-1">
                  {campaign.products.pronta_entrega && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✅
                    </div>
                  )}
                  {campaign.products.sob_encomenda && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      📋
                    </div>
                  )}
                  {campaign.products.pre_venda && (
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      🔮
                    </div>
                  )}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-3">
                {/* Avaliações */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <span 
                        key={star} 
                        className={`text-sm ${
                          star <= (campaign.products.rating_avg || 4.5) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({campaign.products.reviews_count})
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
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden">
                      {campaign.products.bancas.cover_image ? (
                        <img
                          src={campaign.products.bancas.cover_image}
                          alt={campaign.products.bancas.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 truncate">
                      {campaign.products.bancas.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Favoritar"
                    >
                      ❤️
                    </button>
                    <Link
                      href={`/produto/${campaign.products.id}`}
                      onClick={() => handleCampaignClick(campaign.id)}
                      className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                      🛒
                    </Link>
                  </div>
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
