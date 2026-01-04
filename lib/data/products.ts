import "server-only";

import { CACHE_TTL } from "@/lib/data/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`fetch_failed:${res.status}`);
  }
  return res.json();
}

export async function getSearchProducts(query: string, limit = 20): Promise<any[]> {
  const term = String(query || "").trim();
  if (!term) return [];
  try {
    const j = await fetchJson(
      `${BASE_URL}/api/products/most-searched?search=${encodeURIComponent(term)}&limit=${limit}`,
      { next: { revalidate: CACHE_TTL.search } }
    );
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getPromoProducts(limit = 20): Promise<any[]> {
  try {
    const j = await fetchJson(
      `${BASE_URL}/api/products/most-searched?limit=${limit}&promo=true`,
      { next: { revalidate: CACHE_TTL.promos } }
    );
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}
