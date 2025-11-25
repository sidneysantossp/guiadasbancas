"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";

// REMOVIDO: Todos os mocks foram removidos
// Este componente agora só exibe dados reais da API
// Até que a API de anúncios seja implementada, o componente não renderiza nada

export type AdItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  rating?: number;
  reviews?: number;
  badgeText?: string;
  vendorName: string;
  vendorAvatar: string;
  vendorId: string;
};

function RatingPill({ rating = 4.7, reviews = 30 }: { rating?: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-[#fff3ec] text-[#ff5c00] px-2 py-[6px] text-xs font-semibold shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z" />
      </svg>
      {rating.toFixed(1)} <span className="opacity-70">({reviews}+)</span>
    </span>
  );
}

function HeartButton() {
  return (
    <button aria-label="Favoritar" className="ml-auto rounded-full p-2 text-gray-500 hover:text-[#ff5c00]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}

function AdCard({ ad }: { ad: AdItem }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
      <div className="relative h-40 sm:h-44 w-full">
        <Image src={ad.image} alt={ad.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        {ad.badgeText && (
          <span className="absolute top-3 left-3 rounded-xl bg-white/90 text-[#ff5c00] text-xs font-extrabold px-2 py-1 shadow">{ad.badgeText}</span>
        )}
        {ad.cta && (
          <span className="absolute left-3 bottom-3 rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold px-2 py-1 shadow">{ad.cta}</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center">
          <RatingPill rating={ad.rating} reviews={ad.reviews} />
          <HeartButton />
        </div>
        <div className="mt-2 font-semibold text-[15px] leading-snug line-clamp-2">{ad.title}</div>
        <div className="text-[12px] text-gray-600 line-clamp-2">{ad.subtitle}</div>
        <div className="mt-3 flex items-center justify-between">
          <Link href={("/bancas/" + ad.vendorId) as Route} className="flex items-center gap-2 min-w-0 hover:opacity-90">
            <div className="h-7 w-7 rounded-full overflow-hidden border border-white shadow">
              <Image src={ad.vendorAvatar} alt={ad.vendorName} width={28} height={28} className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-medium text-gray-800 truncate">{ad.vendorName}</span>
          </Link>
          <Link href="#" className="inline-flex items-center justify-center rounded-full border border-[#ff5c00] text-[#ff5c00] hover:bg-[#fff3ec] w-8 h-8 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdsHighlights() {
  // TODO: Implementar API de anúncios patrocinados
  // Por enquanto, não renderiza nada para evitar mocks
  // Quando a API estiver pronta, carregar dados reais aqui
  
  // Retorna null - componente não renderiza nada até ter dados reais
  return null;
}
