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

export default function BancasSections() {
  const [apiBancas, setApiBancas] = useState<ApiBanca[] | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/bancas/featured?limit=30', { 
          next: { revalidate: 60 } as any
        });
        if (!res.ok) throw new Error('fail');
        const j = await res.json();
        const list = Array.isArray(j?.data) ? (j.data as ApiBanca[]) : [];
        setApiBancas(list);
      } catch {
        setApiBancas([]);
      }
    })();
  }, []);

  return (
    <>
      {/* Seção 1: Bancas perto de você (ordenadas por distância) */}
      <NearbyBancas bancas={apiBancas} />
      
      {/* Seção 2: Bancas em Destaque (ordenadas por rating) */}
      <FeaturedBancas bancas={apiBancas} />
    </>
  );
}
