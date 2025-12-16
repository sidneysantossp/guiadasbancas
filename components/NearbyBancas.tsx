"use client";

import Image from "next/image";
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import { useEffect, useMemo, useState } from "react";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import type { Route } from "next";

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z"/></svg>
    );
    if (i === full && half) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><defs><linearGradient id="half-nearby"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="url(#half-nearby)"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="none" stroke="currentColor"/></svg>
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
  uf,
  description,
  priority = false,
}: {
  id: string;
  name: string;
  address: string;
  distance: number | null;
  cover: string;
  rating: number;
  uf: string;
  description?: string;
  priority?: boolean;
}) {
  // Formatar distância: usar vírgula como separador decimal e "KM" maiúsculo
  // Se distância > 100km, não mostrar (provavelmente erro de localização)
  const distanceLabel = distance == null || distance > 100 ? null : `${distance.toFixed(1).replace('.', ',')} KM`;
  const openNow = useMemo(() => {
    try {
      const h = new Date().getHours();
      return h >= 6 && h < 20;
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
        {/* Badge de distância */}
        {distanceLabel && (
          <div className="absolute right-2 top-2 z-10 inline-flex items-center rounded-full bg-white/90 text-gray-700 border border-gray-200 px-2 py-[2px] text-[11px] font-medium shadow-sm">
            📍 {distanceLabel}
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Stars value={rating} />
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-[2px] text-[11px] font-semibold ${openNow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
          >
            {openNow ? 'Aberta' : 'Fechada'}
          </span>
        </div>
        <div className="text-[13px] font-semibold leading-snug line-clamp-2">{name}</div>
        {description && (
          <div className="-mt-1 text-[12px] text-gray-700 line-clamp-2">{description}</div>
        )}
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600 font-medium">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Ver no Mapa
          </span>
        </div>
      </div>
    </Link>
  );
}

type ApiBanca = { 
  id: string; 
  name: string; 
  address?: string; 
  lat?: number; 
  lng?: number; 
  cover: string; 
  rating?: number; 
  featured?: boolean; 
  active: boolean; 
};

interface NearbyBancasProps {
  bancas: ApiBanca[] | null;
}

export default function NearbyBancas({ bancas }: NearbyBancasProps) {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  
  useEffect(() => {
    setLoc(loadStoredLocation());
    
    const handleLocationUpdate = (e: CustomEvent<UserLocation>) => {
      setLoc(e.detail);
    };
    
    window.addEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
    return () => window.removeEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
  }, []);
  
  const uf = (loc?.state || "SP").toLowerCase();

  // Ordenar por distância (menor primeiro)
  const nearbyItems = useMemo(() => {
    if (!bancas || !bancas.length) return [];
    
    const mapped = bancas.map((b) => {
      const distance = (loc && typeof b.lat === 'number' && typeof b.lng === 'number')
        ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng })
        : null;
      return { 
        id: b.id, 
        name: b.name, 
        address: b.address || '', 
        distance, 
        cover: b.cover, 
        rating: typeof b.rating === 'number' ? b.rating : 4.7
      };
    });

    // Ordenar por distância (menor primeiro), depois por rating
    return mapped
      .filter(b => b.distance !== null) // Só mostrar bancas com coordenadas
      .sort((a, b) => {
        // Primeiro por distância
        if (a.distance != null && b.distance != null) {
          return a.distance - b.distance;
        }
        // Fallback por rating
        return (b.rating || 0) - (a.rating || 0);
      })
      .slice(0, 12);
  }, [bancas, loc]);

  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 4;
  const isMobile = w < 768;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const gapRem = 1.5;
  
  const normalized = useMemo(() => {
    if (nearbyItems.length === 0) return [];
    return nearbyItems;
  }, [nearbyItems]);
  
  const trackItems = useMemo(() => [...normalized, ...normalized], [normalized]);

  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 6000);
    return () => clearInterval(id);
  }, [isMobile]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => i + 1);

  // Não renderizar se não houver bancas ou localização
  if (!normalized.length || !loc) {
    return null;
  }

  return (
    <section className="w-full px-5">
      <div className="container-max relative px-3 sm:px-6 md:px-8 py-6">
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Bancas perto de você</h2>
            <p className="text-sm text-gray-600">Ordenadas pela menor distância</p>
          </div>
          <Link href="/bancas-perto-de-mim" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todas</Link>
        </div>
        
        {isMobile ? (
          <div className="relative z-10 py-6">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 snap-x snap-mandatory">
                {normalized.map((b, i) => (
                  <div key={`nearby-${b.id}-${i}`} className="shrink-0 snap-start" style={{ flex: `0 0 calc(88%)` }}>
                    <BancaCard {...b} uf={uf} description={b.address} priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-6">
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
                    key={`nearby-${b.id}-${i}`}
                    className="shrink-0"
                    style={{ flex: `0 0 calc((100% - ${(perView - 1) * gapRem}rem) / ${perView})` }}
                  >
                    <BancaCard {...b} uf={uf} description={b.address} priority={i < perView} />
                  </div>
                ))}
              </div>
            </div>
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
