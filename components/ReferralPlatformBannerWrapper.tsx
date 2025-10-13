'use client';

import React, { useState, useEffect } from 'react';

interface BannerData {
  id?: string;
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

export default function ReferralPlatformBannerWrapper() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        console.log('🎯 Carregando banner (fonte: referral-banner admin, no-store)...');
        const response = await fetch(`/api/admin/referral-banner?_=${Date.now()}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('🎯 Dados do banner (referral):', data);
          
          if (data.success && data.data) {
            console.log('🎯 Aplicando dados do banner:', {
              titulo_novo: data.data.title,
              dados_completos: data.data
            });
            setBanner(data.data);
          }
        }
      } catch (error) {
        console.error('🎯 Erro ao carregar banner de indicação:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, []);

  // Função para tracking de cliques
  const handleClick = async () => {
    if (!banner) return;
    
    try {
      await fetch('/api/admin/referral-banner/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'click',
          banner_id: banner.id || 'referral-banner',
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
    }
  };

  // Função para determinar classes de posicionamento
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'justify-start items-start pt-6 sm:pt-6 md:pt-8';
      case 'top-center':
        return 'justify-start items-center pt-6 sm:pt-6 md:pt-8 text-center';
      case 'center':
        return 'justify-center items-center text-center';
      case 'center-left':
        return 'justify-center items-start';
      case 'bottom-center':
        return 'justify-end items-center pb-6 sm:pb-6 md:pb-8 text-center';
      case 'bottom-left':
      default:
        return 'justify-end items-start pb-6 sm:pb-6 md:pb-8';
    }
  };

  if (loading || !banner) {
    return (
      <div className="py-6">
        <div className="container-max">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Não renderizar se banner não estiver ativo
  if (!banner.active) {
    return null;
  }

  return (
    <div className="py-6">
      <div className="container-max">
        <a 
          href={banner.button_link}
          onClick={handleClick}
          className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow block"
        >
          <div className="relative h-96 sm:h-64 md:h-72 w-full bg-gray-800">
            {/* Imagem de fundo */}
            {banner.image_url && banner.image_url.trim() !== '' && (
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
                style={{ objectPosition: '60% 40%' }}
                onError={(e) => {
                  console.log('Erro ao carregar imagem do banner');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            
            {/* Overlay dinâmico */}
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${banner.background_color}${Math.round(banner.overlay_opacity * 255).toString(16).padStart(2, '0')}, ${banner.background_color}${Math.round(banner.overlay_opacity * 0.6 * 255).toString(16).padStart(2, '0')})`,
              }}
            ></div>
            
            {/* Conteúdo */}
            <div 
              className={`absolute inset-0 px-6 sm:px-8 md:px-12 flex flex-col gap-2 sm:gap-3 ${getPositionClasses(banner.text_position)}`}
              style={{ color: banner.text_color }}
            >
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {banner.title}
              </h3>
              
              {banner.subtitle && (
                <h4 className="text-xl sm:text-2xl font-medium opacity-90">
                  {banner.subtitle}
                </h4>
              )}
              
              <p className="text-lg sm:text-xl max-w-2xl opacity-90 leading-relaxed">
                {banner.description}
              </p>
              
              <span 
                className="inline-flex items-center justify-center rounded-lg text-lg font-semibold px-8 py-3 shadow-lg hover:opacity-90 transition-all mt-2"
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
