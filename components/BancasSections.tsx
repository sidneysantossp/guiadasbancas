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
  rating?: number; 
  featured?: boolean; 
  active: boolean; 
  order: number;
};

type BancasSectionsProps = {
  initialBancas?: ApiBanca[];
};

export default function BancasSections({ initialBancas }: BancasSectionsProps) {
  const hasInitial = Array.isArray(initialBancas) && initialBancas.length > 0;
  // Usa initialBancas como placeholder imediato, mas sempre refaz o fetch no cliente
  const [apiBancas, setApiBancas] = useState<ApiBanca[] | null>(
    hasInitial ? initialBancas! : null
  );
  
  useEffect(() => {
    // Sempre busca dados frescos no cliente para garantir novas bancas
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    </>
  );
}
