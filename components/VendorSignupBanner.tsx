"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Dados padrão para evitar hidratação
const DEFAULT_BANNER = {
  title: "É jornaleiro?",
  subtitle: "Registre sua banca agora",
  description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
  button_text: "Quero me cadastrar",
  button_link: "/jornaleiro/registrar",
  image_url: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
  active: true
};

export default function VendorSignupBanner() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🏠 🚀 VendorSignupBanner useEffect iniciado');
    setMounted(true);
    
    // Carregar dados salvos
    const loadBanner = async () => {
      try {
        console.log('🏠 📡 Fazendo fetch para /api/admin/vendor-banner...');
        const response = await fetch('/api/admin/vendor-banner');
        console.log('🏠 📨 Response status:', response.status);
        console.log('🏠 📨 Response ok:', response.ok);
        
        if (response.ok) {
          const result = await response.json();
          console.log('🏠 📊 Resultado completo:', JSON.stringify(result, null, 2));
          
          if (result.success && result.data) {
            console.log('🏠 ✅ Dados válidos recebidos!');
            console.log('🏠 📝 Título:', result.data.title);
            console.log('🏠 🖼️ Imagem:', result.data.image_url);
            console.log('🏠 ✅ Ativo:', result.data.active);
            
            if (result.data.active) {
              console.log('🏠 🎯 ATUALIZANDO BANNER COM DADOS SALVOS!');
              setBanner(result.data);
            } else {
              console.log('🏠 ⚠️ Banner não está ativo');
            }
          } else {
            console.log('🏠 ❌ Dados inválidos:', { success: result.success, hasData: !!result.data });
          }
        } else {
          console.log('🏠 ❌ Response não OK:', response.status);
        }
      } catch (error) {
        console.error('🏠 💥 Erro ao carregar banner:', error);
      }
    };

    // Delay pequeno para garantir que está montado
    setTimeout(loadBanner, 100);
  }, []);

  // Sempre renderizar algo para evitar hidratação
  if (!mounted || !banner.active) {
    return null;
  }

  console.log('🏠 🎯 RENDERIZANDO BANNER:', banner.title);

  // Função de teste
  const testAPI = async () => {
    console.log('🧪 TESTE MANUAL - Chamando API...');
    try {
      const response = await fetch('/api/admin/vendor-banner');
      const result = await response.json();
      console.log('🧪 TESTE MANUAL - Resultado:', result);
      alert(`API Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      console.error('🧪 TESTE MANUAL - Erro:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <section className="w-full">
      <div className="container-max">
        {/* Botão de teste temporário */}
        <div className="mb-4 text-center">
          <button 
            onClick={testAPI}
            className="bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            🧪 TESTAR API BANNER
          </button>
          <p className="text-xs text-gray-600 mt-1">
            Banner atual: {banner.title} | Imagem: {banner.image_url.substring(0, 50)}...
          </p>
        </div>
        <Link 
          href={banner.button_link} 
          className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow block"
        >
          <div className="relative h-96 sm:h-64 md:h-72 w-full">
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover object-[100%_0%] sm:object-[100%_30%]"
              priority
              unoptimized
            />
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
        </Link>
      </div>
    </section>
  );
}
