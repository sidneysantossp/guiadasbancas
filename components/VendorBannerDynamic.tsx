'use client';

import { useEffect, useState } from 'react';
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";
import VendorBannerCard, { type VendorBannerData } from "@/components/VendorBannerCard";

export default function VendorBannerDynamic() {
  const [banner, setBanner] = useState<VendorBannerData>({
    title: "É jornaleiro?",
    subtitle: "Registre sua banca agora",
    description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
    button_text: "Quero me cadastrar",
    button_link: JOURNALEIRO_MARKETING_PATH,
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
      fetch('/api/vendor-banner/analytics', {
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
        const response = await fetch('/api/vendor-banner', { cache: 'no-store' });
        console.log('🎯 Response status:', response.status);
        
        const data = await response.json();
        console.log('🎯 Dados recebidos:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
          console.log('🎯 ✅ Dados válidos recebidos!');
          console.log('🎯 Banner ativo?', data.data.active);
          console.log('🎯 Título:', data.data.title);
          console.log('🎯 Imagem:', data.data.image_url);
          
          setBanner(data.data);
        } else {
          console.log('🎯 ⚠️ Dados inválidos, usando padrão');
        }
      } catch (error) {
        console.error('🎯 ❌ Erro ao carregar banner:', error);
      } finally {
        setLoading(false);
        console.log('🎯 Loading finalizado, banner será renderizado');
      }
    };

    loadBanner();
  }, []);

  if (loading) {
    console.log('🎯 Renderizando loading...');
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
    console.log('🎯 Banner inativo, não renderizando');
    return null;
  }

  console.log('🎯 Renderizando banner:', banner.title, '| Imagem:', banner.image_url ? 'SIM' : 'NÃO');

  return (
    <div className="py-6">
      <div className="container-max">
        <a 
          href={banner.button_link}
          onClick={handleClick}
          className="block"
        >
          <VendorBannerCard banner={banner} />
        </a>
      </div>
    </div>
  );
}
