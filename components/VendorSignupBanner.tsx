"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { JOURNALEIRO_MARKETING_PATH } from "@/lib/jornaleiro-marketing";

// Dados padrão para evitar hidratação
const DEFAULT_BANNER = {
  title: "É jornaleiro?",
  subtitle: "Registre sua banca agora",
  description: "Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.",
  button_text: "Quero me cadastrar",
  button_link: JOURNALEIRO_MARKETING_PATH,
  image_url: "https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop",
  active: true
};

export default function VendorSignupBanner() {
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const loadBanner = async () => {
      try {
        const response = await fetch('/api/admin/vendor-banner');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            if (result.data.active) {
              setBanner(result.data);
            }
          }
        }
      } catch {
        return;
      }
    };

    setTimeout(loadBanner, 100);
  }, []);

  // Sempre renderizar algo para evitar hidratação
  if (!mounted || !banner.active) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container-max">
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
