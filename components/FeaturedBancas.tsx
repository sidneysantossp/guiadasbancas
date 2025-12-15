"use client";

import Image from "next/image";
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/lib/useCategories";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import type { Route } from "next";

// Removidos mocks de capas/categorias. Apenas dados reais da API serão exibidos.

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z"/></svg>
    );
    if (i === full && half) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="url(#half)"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="none" stroke="currentColor"/></svg>
    );
    return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-gray-300" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z"/></svg>
    );
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function BancaCard({
  id,
  name,
  address,
  distance,
  cover,
  rating,
  categories,
  uf,
  description,
  featured,
  priority = false,
}: {
  id: string;
  name: string;
  address: string;
  distance: number | null;
  cover: string;
  rating: number;
  categories: { name: string; icon: string }[];
  uf: string;
  description?: string;
  featured?: boolean;
  priority?: boolean;
}) {
  // Removido uso de categorias mockadas; quando houver no futuro, virão direto da API.
  const distanceLabel = distance == null ? null : (distance > 3 ? "+3Km" : `${Math.max(1, Math.round(distance))}Km`);
  const openNow = useMemo(() => {
    try {
      const h = new Date().getHours();
      return h >= 6 && h < 20; // janela padrão 06:00-19:59
    } catch {
      return true;
    }
  }, []);
  return (
    <Link href={(buildBancaHref(name, id, uf) as Route)} className="block min-h-[22rem] rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        {cover ? (
          <Image 
            src={cover} 
            alt={name} 
            fill 
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover" 
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-orange-300" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6"/>
            </svg>
          </div>
        )}
        {/* Removido badge de distância para não poluir a imagem */}
        {featured && (
          <div className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-orange-50 text-[#ff5c00] border border-orange-200 px-2 py-[2px] text-[11px]">Destaque</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        {/* Estrelas + nota + status de abertura */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Stars value={rating} />
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-[2px] text-[11px] font-semibold ${openNow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
            aria-label={openNow ? 'Banca aberta agora' : 'Banca fechada agora'}
          >
            {openNow ? 'Aberta' : 'Fechada'}
          </span>
        </div>
        {/* Nome */}
        <div className="text-[13px] font-semibold leading-snug line-clamp-2">{name}</div>
        {/* Descrição curta */}
        {description && (
          <div className="-mt-1 text-[12px] text-gray-700 line-clamp-2">{description}</div>
        )}
        {/* Ver no Mapa */}
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600 font-medium">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Ver no Mapa
          </span>
        </div>
        <div className="text-xs text-gray-700">
          <div className="mt-3">
            <span className="inline-flex w-full items-center justify-center rounded-full bg-[#ff5c00] px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-[#ff7a33]">
              Ver Banca
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBancas() {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  
  // Carregar localização inicial e escutar atualizações
  useEffect(() => {
    setLoc(loadStoredLocation());
    
    // Escutar evento de atualização de localização
    const handleLocationUpdate = (e: CustomEvent<UserLocation>) => {
      setLoc(e.detail);
    };
    
    window.addEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
    return () => window.removeEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
  }, []);
  
  const uf = (loc?.state || "SP").toLowerCase();

  // Bancas reais do Admin CMS - usando endpoint otimizado que traz apenas 20 bancas
  type ApiBanca = { id: string; name: string; address?: string; lat?: number; lng?: number; cover: string; rating?: number; featured?: boolean; categories?: string[]; active: boolean; order: number };
  const [apiBancas, setApiBancas] = useState<ApiBanca[] | null>(null);
  useEffect(() => {
    (async () => {
      try {
        // OTIMIZAÇÃO: Usar endpoint dedicado que retorna apenas 20 bancas em destaque
        // em vez de carregar todas as bancas do sistema
        const res = await fetch('/api/bancas/featured?limit=20', { 
          next: { revalidate: 60 } as any // Cache de 60 segundos
        });
        if (!res.ok) throw new Error('fail');
        const j = await res.json();
        const list = Array.isArray(j?.data) ? (j.data as ApiBanca[]) : [];
        setApiBancas(list); // Já vem filtrado por active=true no backend
      } catch {
        setApiBancas([]);
      }
    })();
  }, []);

  const rawItems = useMemo(() => {
    const source: Array<{ id: string; name: string; address?: string; lat?: number; lng?: number; cover: string; rating?: number; featured?: boolean }>
      = (apiBancas && apiBancas.length)
        ? apiBancas.map((b) => ({
            id: b.id,
            name: b.name,
            address: b.address,
            lat: b.lat,
            lng: b.lng,
            cover: b.cover,
            rating: typeof b.rating === 'number' ? b.rating : 4.7,
            featured: Boolean(b.featured),
          }))
        : [];

    const mapped = source.map((b) => {
      const distance = (loc && typeof b.lat === 'number' && typeof b.lng === 'number')
        ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng })
        : null;
      return { id: b.id, name: b.name, address: b.address || '', distance, cover: b.cover, rating: b.rating || 4.7, featured: b.featured, categories: [] };
    }).sort((a, b) => {
      // Destaque primeiro
      if (Boolean(a.featured) !== Boolean(b.featured)) return Boolean(b.featured) ? 1 * -1 : 1; // featured true vem antes
      // Depois por distância quando disponível
      if (a.distance == null && b.distance != null) return 1;
      if (b.distance == null && a.distance != null) return -1;
      if (a.distance != null && b.distance != null) return a.distance - b.distance;
      // Fallback por rating desc
      return (b.rating || 0) - (a.rating || 0);
    });

    return mapped.slice(0, 12);
  }, [apiBancas, loc]);

  // Slider responsivo: 1/2/3 por view
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 4; // 4 por view no desktop
  const isMobile = w < 768;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const gapRem = 1.5;
  const normalized = useMemo(() => {
    const minCount = 1;
    if (rawItems.length === 0) return [];
    if (rawItems.length >= minCount) return rawItems;
    return rawItems;
  }, [rawItems]);
  const trackItems = useMemo(() => [...normalized, ...normalized], [normalized]);

  useEffect(() => {
    if (isMobile) return; // autoplay somente no desktop/tablet
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 5000);
    return () => clearInterval(id);
  }, [isMobile]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => i + 1);

  // Não renderizar se não houver bancas reais
  if (!normalized.length) {
    return null;
  }

  return (
    <section className="w-full px-5">
      <div className="container-max relative px-3 sm:px-6 md:px-8 py-6">
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Bancas perto de você</h2>
            <p className="text-sm text-gray-600">Recomendações perto de você</p>
          </div>
          <Link href="/bancas-perto-de-mim" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todas</Link>
        </div>
        {/* Carrossel: mobile scroll-snap manual, desktop slider com setas */}
        {isMobile ? (
          <div className="relative z-10 py-6">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 snap-x snap-mandatory">
                {normalized.map((b, i) => (
                  <div key={`${b.id}-${i}`} className="shrink-0 snap-start" style={{ flex: `0 0 calc(88%)` }}>
                    <BancaCard {...b} uf={uf} description={b.address} priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-6">
            {/* Viewport com gutters para as setas (evita que o card entre sob a seta) */}
            <div className="overflow-hidden px-6">
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(-${(index * (100 / perView))}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                }}
                onTransitionEnd={() => {
                  if (index >= normalized.length) {
                    setAnimating(false);
                    setIndex(0);
                    requestAnimationFrame(() => setAnimating(true));
                  }
                }}
              >
                {trackItems.map((b, i) => (
                  <div
                    key={`${b.id}-${i}`}
                    className="shrink-0"
                    style={{ flex: `0 0 calc((100% - ${(perView - 1) * gapRem}rem) / ${perView})` }}
                  >
                    <BancaCard {...b} uf={uf} description={b.address} priority={i < perView} />
                  </div>
                ))}
              </div>
            </div>
            {/* Arrows desktop */}
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar{ display:none; }
          .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
        `}</style>
      </div>
    </section>
  );
}
