import "server-only";

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
      cache: "no-store",
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancas(): Promise<any[]> {
  try {
    // Mantido nome legado da função para compatibilidade.
    // Para páginas públicas, usar endpoint público.
    const j = await fetchJson(`${BASE_URL}/api/bancas`, {
      cache: "no-store",
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancasAll(): Promise<any[]> {
  try {
    // Endpoint público já retorna bancas ativas, suficiente para rotas públicas.
    const j = await fetchJson(`${BASE_URL}/api/bancas`, {
      cache: "no-store",
    });
    return Array.isArray(j?.data) ? j.data : [];
  } catch {
    return [];
  }
}

export async function getAdminBancaById(id: string): Promise<any | null> {
  if (!id) return null;
  try {
    const j = await fetchJson(`${BASE_URL}/api/bancas/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (j?.data) return j.data;
  } catch {
    // fallback para ids abreviados no slug (ex.: últimos 12 chars)
    try {
      const list = await getAdminBancasAll();
      return list.find((b: any) => b?.id === id || (typeof b?.id === "string" && b.id.endsWith(id))) || null;
    } catch {
      return null;
    }
  }
  return null;
}
