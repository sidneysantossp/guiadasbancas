"use client";

import { useEffect, useMemo, useState } from "react";
import { categories as fallbackCategories } from "@/components/categoriesData";

export type UICategory = {
  key: string;
  name: string;
  image: string;
  link: string;
};

// Cache global para evitar múltiplas requisições
let globalCache: UICategory[] | null = null;
let cachePromise: Promise<UICategory[]> | null = null;

export function useCategories(): { items: UICategory[]; loading: boolean } {
  const [apiItems, setApiItems] = useState<UICategory[] | null>(globalCache);
  const [loading, setLoading] = useState(!globalCache);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    
    // Se já temos cache, usar imediatamente
    if (globalCache) {
      setApiItems(globalCache);
      setLoading(false);
      return;
    }
    
    // Se já existe uma requisição em andamento, aguardar ela
    if (cachePromise) {
      cachePromise.then((data) => {
        if (mounted) {
          setApiItems(data);
          setLoading(false);
        }
      });
      return;
    }
    
    // Criar nova requisição com cache otimizado
    cachePromise = (async () => {
      try {
        const res = await fetch('/api/categories', { 
          cache: 'force-cache',
          next: { revalidate: 300 } // Cache por 5 minutos
        });
        if (!res.ok) throw new Error('failed');
        const j = await res.json();
        const data = Array.isArray(j?.data) ? j.data : [];
        const processedData = data.map((c: any) => ({ 
          key: c.id, 
          name: c.name, 
          image: c.image || '', 
          link: c.link 
        }));
        
        // Salvar no cache global
        globalCache = processedData;
        return processedData;
      } catch {
        const fallbackData: UICategory[] = [];
        globalCache = fallbackData;
        return fallbackData;
      }
    })();
    
    cachePromise.then((data) => {
      if (mounted) {
        setApiItems(data);
        setLoading(false);
      }
    });
    
    return () => { mounted = false; };
  }, []);

  // Detectar mobile para aplicar filtros específicos da UI
  useEffect(() => {
    const detect = () => {
      try { setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768); } catch { setIsMobile(false); }
    };
    detect();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', detect);
      return () => window.removeEventListener('resize', detect);
    }
  }, []);

  const items = useMemo<UICategory[]>(() => {
    const base = (apiItems && apiItems.length > 0)
      ? apiItems
      : fallbackCategories.map((c, i) => ({ key: `${c.slug}:${i}` , name: c.name, image: c.image || '', link: `/categorias?cat=${c.slug}` }));

    if (!isMobile) return base;
    // Mobile: remover categorias genéricas (case-insensitive e por link)
    const DIVERSOS_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
    const SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';
    return base.filter((c) => {
      const n = (c.name || '').trim().toLowerCase();
      const link = (c.link || '').toLowerCase();
      const byName = n === 'diversos' || n === 'sem categoria';
      const byLink = link.includes('/diversos') || link.includes('/sem-categoria');
      const byId = c.key === DIVERSOS_ID || c.key === SEM_CATEGORIA_ID;
      return !(byName || byLink || byId);
    });
  }, [apiItems, isMobile]);

  return { items, loading };
}
