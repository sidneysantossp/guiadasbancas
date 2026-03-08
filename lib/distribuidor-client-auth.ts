export const DISTRIBUIDOR_AUTH_KEY = "gb:distribuidorAuth";
export const DISTRIBUIDOR_DATA_KEY = "gb:distribuidor";

type DistribuidorClientCache = {
  distribuidor: any | null;
};

let pendingHydration: Promise<any | null> | null = null;

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function clearDistribuidorClientAuth() {
  try {
    localStorage.removeItem(DISTRIBUIDOR_AUTH_KEY);
    localStorage.removeItem(DISTRIBUIDOR_DATA_KEY);
  } catch {}
}

export function persistDistribuidorClientAuth(params: {
  distribuidor: any;
}) {
  try {
    localStorage.setItem(DISTRIBUIDOR_AUTH_KEY, "1");
    localStorage.setItem(DISTRIBUIDOR_DATA_KEY, JSON.stringify(params.distribuidor));
  } catch {}
}

export function readDistribuidorClientAuth(): DistribuidorClientCache {
  const rawDistribuidor = safeLocalStorageGet(DISTRIBUIDOR_DATA_KEY);

  if (!rawDistribuidor) {
    return { distribuidor: null };
  }

  try {
    return {
      distribuidor: JSON.parse(rawDistribuidor),
    };
  } catch {
    clearDistribuidorClientAuth();
    return { distribuidor: null };
  }
}

export async function hydrateDistribuidorClientAuth(): Promise<any | null> {
  const cached = readDistribuidorClientAuth().distribuidor;
  if (pendingHydration) {
    return pendingHydration;
  }

  pendingHydration = (async () => {
    try {
      const response = await fetch("/api/distribuidor/session", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        clearDistribuidorClientAuth();
        return null;
      }

      const json = await response.json().catch(() => ({}));
      if (!json?.success || !json?.distribuidor) {
        clearDistribuidorClientAuth();
        return null;
      }

      persistDistribuidorClientAuth({ distribuidor: json.distribuidor });
      return json.distribuidor;
    } catch {
      return cached?.id ? cached : null;
    } finally {
      pendingHydration = null;
    }
  })();

  return pendingHydration;
}

export async function destroyDistribuidorSession() {
  try {
    await fetch("/api/distribuidor/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {
    // noop
  } finally {
    clearDistribuidorClientAuth();
  }
}

export function getDistribuidorAuthHeaders(params?: {
  distribuidorId?: string | null;
  includeJson?: boolean;
}): Record<string, string> {
  const headers: Record<string, string> = {};

  if (params?.includeJson) {
    headers["Content-Type"] = "application/json";
  }

  const { distribuidor } = readDistribuidorClientAuth();
  const distribuidorId = params?.distribuidorId || distribuidor?.id;

  if (distribuidorId) {
    headers["x-distribuidor-id"] = distribuidorId;
  }

  return headers;
}
