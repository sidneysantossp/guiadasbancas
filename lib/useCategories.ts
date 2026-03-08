"use client";

import { useEffect, useMemo, useState } from "react";
import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";

export type UICategory = {
  key: string;
  name: string;
  image: string;
  link: string;
};

const FIXED_ROOT_SLUGS = new Set(["colecionavel", "panini", "panini-collections"]);

function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCategoryLink(name: string, link?: string): string {
  const expectedSlug = slugify(name) || "categoria";
  const raw = (link || "").trim();

  if (!raw) return `/categorias/${expectedSlug}`;
  if (!raw.startsWith("/")) return `/categorias/${expectedSlug}`;

  if (raw.startsWith("/categoria/")) {
    return raw.replace("/categoria/", "/categorias/");
  }

  if (raw.startsWith("/categorias/")) {
    const [pathname, query] = raw.split("?");
    const segments = pathname.split("/").filter(Boolean);
    const currentSlug = segments[1] || "";

    if (!query && currentSlug && currentSlug !== expectedSlug && !FIXED_ROOT_SLUGS.has(currentSlug)) {
      return `/categorias/${expectedSlug}`;
    }

    return raw;
  }

  return raw;
}

export function useCategories(initialItems?: UICategory[]): { items: UICategory[]; loading: boolean } {
  const seededItems = Array.isArray(initialItems) && initialItems.length > 0 ? initialItems : null;
  const [apiItems, setApiItems] = useState<UICategory[] | null>(seededItems);
  const [loading, setLoading] = useState(!seededItems);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    if (seededItems) {
      setApiItems(seededItems);
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) throw new Error('failed');
        const j = await res.json();
        const data = Array.isArray(j?.data) ? j.data : [];
        const mapped = data.map((c: any) => ({
          key: c.id,
          name: c.name,
          image: sanitizePublicImageUrl(c.image),
          link: c.link
        }));
        if (!mounted) return;
        setApiItems(mapped);
      } catch {
        if (!mounted) return;
        setApiItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [seededItems]);

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
    const rawBase = Array.isArray(apiItems) ? apiItems : [];

    const base = rawBase.map((c) => ({
      ...c,
      image: sanitizePublicImageUrl(c.image),
      link: normalizeCategoryLink(c.name, c.link),
    }));

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
