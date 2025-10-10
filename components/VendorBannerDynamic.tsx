'use client';

import { useEffect, useState } from 'react';

interface BannerData {
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  overlay_opacity: number;
  text_position: string;
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
    background_color: "#000000",
    text_color: "#FFFFFF",
    button_color: "#FF5C00",
    button_text_color: "#FFFFFF",
    overlay_opacity: 0.45,
    text_position: "bottom-left",
    active: true
  });

  const [loading, setLoading] = useState(true);

  // Função para registrar clique
  const handleClick = async (e: React.MouseEvent) => {
    try {
      // Não bloquear a navegação
      console.log('📊 Registrando clique no banner...');
      
      // Fazer requisição assíncrona para registrar o clique
      fetch('/api/admin/vendor-banner/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banner_id: (banner as any).id,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      }).then(response => {
        if (response.ok) {
          console.log('📊 ✅ Clique registrado com sucesso');
        } else {
          console.log('📊 ⚠️ Erro ao registrar clique');
        }
      }).catch(error => {
        console.log('📊 ❌ Erro ao registrar clique:', error);
      });
      
    } catch (error) {
      console.log('📊 ❌ Erro ao registrar clique:', error);
    }
    
    // Continuar com a navegação normal
  };

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

  // Função para determinar classes de posicionamento
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'justify-start items-start pt-6 sm:pt-6 md:pt-8';
      case 'top-center':
        return 'justify-start items-center pt-6 sm:pt-6 md:pt-8 text-center';
      case 'center':
        return 'justify-center items-center text-center';
      case 'bottom-center':
        return 'justify-end items-center pb-6 sm:pb-6 md:pb-8 text-center';
      case 'bottom-left':
      default:
        return 'justify-end items-start pb-6 sm:pb-6 md:pb-8';
    }
  };

  return (
    <div className="py-6">
      <div className="container-max">
        <a 
          href={banner.button_link}
          onClick={handleClick}
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
            <div 
              className={`absolute inset-0 px-3 sm:px-5 md:px-8 flex flex-col gap-2 sm:gap-3 ${getPositionClasses(banner.text_position)}`}
              style={{
                background: `linear-gradient(to bottom, ${banner.background_color}${Math.round(banner.overlay_opacity * 255).toString(16).padStart(2, '0')}, ${banner.background_color}${Math.round(banner.overlay_opacity * 0.6 * 255).toString(16).padStart(2, '0')})`,
                color: banner.text_color
              }}
            >
              <h3 
                className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
                style={{ color: banner.text_color }}
              >
                {banner.title}
              </h3>
              <div 
                className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight"
                style={{ color: banner.text_color }}
              >
                {banner.subtitle}
              </div>
              <p 
                className="text-sm sm:text-base max-w-2xl opacity-90"
                style={{ color: banner.text_color }}
              >
                {banner.description}
              </p>
              <span 
                className="inline-flex items-center justify-center rounded-md text-sm font-semibold px-4 py-2 shadow hover:opacity-95"
                style={{ 
                  backgroundColor: banner.button_color,
                  color: banner.button_text_color
                }}
              >
                {banner.button_text}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
