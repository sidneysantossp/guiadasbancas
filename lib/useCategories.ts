"use client";

import { useEffect, useMemo, useState } from "react";
import { categories as fallbackCategories } from "@/components/categoriesData";

export type UICategory = {
  key: string;
  name: string;
  image: string;
  link: string;
};

export function useCategories(): { items: UICategory[]; loading: boolean } {
  const [apiItems, setApiItems] = useState<UICategory[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const j = await res.json();
        const data = Array.isArray(j?.data) ? j.data : [];
        if (mounted) {
          setApiItems(
            data.map((c: any) => ({ key: c.id, name: c.name, image: c.image || '', link: c.link }))
          );
        }
      } catch {
        if (mounted) setApiItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const items = useMemo<UICategory[]>(() => {
    if (apiItems && apiItems.length > 0) return apiItems;
    return fallbackCategories.map((c, i) => ({ key: `${c.slug}:${i}` , name: c.name, image: c.image || '', link: `/categorias?cat=${c.slug}` }));
  }, [apiItems]);

  return { items, loading };
}
