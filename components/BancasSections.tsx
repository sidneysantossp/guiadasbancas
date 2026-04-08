"use client";

import { useEffect, useState } from "react";
import FeaturedBancas from "./FeaturedBancas";
import NearbyBancas from "./NearbyBancas";

type ApiBanca = { 
  id: string; 
  name: string; 
  address?: string; 
  lat?: number; 
  lng?: number; 
  cover: string; 
  profile_image?: string;
  created_at?: string;
  rating?: number; 
  featured?: boolean; 
  active: boolean; 
  order: number;
};

type BancasSectionsProps = {
  initialBancas?: ApiBanca[];
  initialRecentBancas?: ApiBanca[];
};

export default function BancasSections({ initialBancas, initialRecentBancas }: BancasSectionsProps) {
  const hasInitial = Array.isArray(initialBancas) && initialBancas.length > 0;
  // Usa initialBancas como fonte principal para evitar refetch imediato na home
  const [apiBancas, setApiBancas] = useState<ApiBanca[] | null>(
    hasInitial ? initialBancas! : null
  );
  
  useEffect(() => {
    if (hasInitial) return;

    (async () => {
      try {
        const res = await fetch('/api/bancas/featured?limit=50', { 
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('fail');
        const j = await res.json();
        const list = Array.isArray(j?.data) ? (j.data as ApiBanca[]) : [];
        if (list.length > 0) setApiBancas(list);
      } catch {
        if (!hasInitial) setApiBancas([]);
      }
    })();
  }, [hasInitial]);

  // Aguardar dados carregarem antes de renderizar
  if (apiBancas === null) {
    return null;
  }

  return (
    <>
      {/* Seção 1: Bancas perto de você (ordenadas por distância) */}
      <NearbyBancas bancas={apiBancas} />
      
      {/* Seção 2: Bancas em Destaque (ordenadas por rating) */}
      <FeaturedBancas bancas={apiBancas} />

      {/* Seção 3: Bancas recém-chegadas */}
      {Array.isArray(initialRecentBancas) && initialRecentBancas.length > 0 ? (
        <FeaturedBancas
          bancas={initialRecentBancas}
          title="Bancas Recém Chegadas"
          subtitle="As bancas mais novas que acabaram de entrar na plataforma"
          viewAllHref="/bancas-perto-de-mim"
          sortBy="recent"
        />
      ) : null}
    </>
  );
}
