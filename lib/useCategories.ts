"use client";

import { useEffect, useMemo, useState } from "react";
import { categories as fallbackCategories } from "@/components/categoriesData";
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

let cachePromise: Promise<UICategory[]> | null = null;
let cachedCategories: UICategory[] | null = null;
let cacheExpiresAt = 0;
const CLIENT_CATEGORY_TTL_MS = 5 * 60 * 1000;

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

    if (cachedCategories && Date.now() < cacheExpiresAt) {
      setApiItems(cachedCategories);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (!cachePromise) {
      cachePromise = (async () => {
        try {
          const res = await fetch('/api/categories', { cache: 'force-cache' });
          if (!res.ok) throw new Error('failed');
          const j = await res.json();
          const data = Array.isArray(j?.data) ? j.data : [];
          const mapped = data.map((c: any) => ({
            key: c.id,
            name: c.name,
            image: sanitizePublicImageUrl(c.image),
            link: c.link
          }));
          cachedCategories = mapped;
          cacheExpiresAt = Date.now() + CLIENT_CATEGORY_TTL_MS;
          return mapped;
        } catch {
          return [] as UICategory[];
        } finally {
          cachePromise = null;
        }
      })();
    }

    cachePromise.then((data) => {
      if (!mounted) return;
      setApiItems(data);
      setLoading(false);
    });

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
    const rawBase = (apiItems && apiItems.length > 0)
      ? apiItems
      : fallbackCategories.map((c, i) => ({ key: `${c.slug}:${i}` , name: c.name, image: sanitizePublicImageUrl(c.image), link: `/categorias?cat=${c.slug}` }));

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
