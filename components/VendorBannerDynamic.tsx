'use client';

import { useEffect, useState } from 'react';

interface BannerData {
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
  active: boolean;
}

export default function VendorBannerDynamic() {
  const [banner, setBanner] = useState<BannerData>({
    title: "É jornaleiro?",
    subtitle: "Registre sua banca agora",
    description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
    button_text: "Quero me cadastrar",
    button_link: "/jornaleiro/registrar",
    image_url: "",
    active: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🎯 VendorBannerDynamic montado, carregando dados...');
    
    const loadBanner = async () => {
      try {
        console.log('🎯 Fazendo fetch da API...');
        const response = await fetch('/api/admin/vendor-banner');
        console.log('🎯 Response status:', response.status);
        
        const data = await response.json();
        console.log('🎯 Dados recebidos:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data && data.data.active) {
          console.log('🎯 ✅ Atualizando banner com dados da API!');
          setBanner(data.data);
        } else {
          console.log('🎯 ⚠️ Usando dados padrão');
        }
      } catch (error) {
        console.error('🎯 ❌ Erro ao carregar banner:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, []);

  if (loading) {
    return (
      <div className="py-6">
        <div className="container-max">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="container-max">
        <a 
          href={banner.button_link}
          className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow block"
        >
          <div className="relative h-96 sm:h-64 md:h-72 w-full bg-gray-200">
            {banner.image_url && (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: '100% 0%' }}
                onLoad={() => console.log('🎯 ✅ Imagem carregada:', banner.image_url)}
                onError={(e) => {
                  console.log('🎯 ❌ Erro ao carregar imagem:', banner.image_url);
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/25 px-3 sm:px-5 md:px-8 text-white flex flex-col items-start justify-end md:justify-center gap-2 sm:gap-3 pb-6 sm:pb-6 md:pb-8">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                {banner.title}
              </h3>
              <div className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
                {banner.subtitle}
              </div>
              <p className="text-sm sm:text-base max-w-2xl opacity-90">
                {banner.description}
              </p>
              <span className="inline-flex items-center justify-center rounded-md bg-white text-[#ff5c00] text-sm font-semibold px-4 py-2 shadow hover:opacity-95">
                {banner.button_text}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
