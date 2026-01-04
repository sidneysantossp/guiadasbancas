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

export async function getPublicBancas(): Promise<any[]> {
  try {
    const j = await fetchJson(`${BASE_URL}/api/bancas`, {
      next: { revalidate: CACHE_TTL.bancas },
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancas(): Promise<any[]> {
  try {
    const j = await fetchJson(`${BASE_URL}/api/admin/bancas`, {
      next: { revalidate: CACHE_TTL.bancas },
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancasAll(): Promise<any[]> {
  try {
    const j = await fetchJson(`${BASE_URL}/api/admin/bancas?all=true`, {
      next: { revalidate: CACHE_TTL.bancas },
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancaById(id: string): Promise<any | null> {
  if (!id) return null;
  try {
    const j = await fetchJson(`${BASE_URL}/api/admin/bancas?id=${encodeURIComponent(id)}`, {
      next: { revalidate: CACHE_TTL.bancas },
    });
    return j?.data ?? null;
  } catch {
    return null;
  }
}
