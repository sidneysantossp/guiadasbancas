export const DISTRIBUIDOR_AUTH_KEY = "gb:distribuidorAuth";
export const DISTRIBUIDOR_DATA_KEY = "gb:distribuidor";
export const DISTRIBUIDOR_SESSION_KEY = "gb:distribuidorSession";
export const DISTRIBUIDOR_SESSION_EXPIRES_AT_KEY = "gb:distribuidorSessionExpiresAt";

type DistribuidorClientSession = {
  distribuidor: any | null;
  sessionToken: string | null;
  expiresAt: string | null;
};

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
    localStorage.removeItem(DISTRIBUIDOR_SESSION_KEY);
    localStorage.removeItem(DISTRIBUIDOR_SESSION_EXPIRES_AT_KEY);
  } catch {}
}

export function persistDistribuidorClientAuth(params: {
  distribuidor: any;
  sessionToken: string;
  expiresAt: string;
}) {
  try {
    localStorage.setItem(DISTRIBUIDOR_AUTH_KEY, "1");
    localStorage.setItem(DISTRIBUIDOR_DATA_KEY, JSON.stringify(params.distribuidor));
    localStorage.setItem(DISTRIBUIDOR_SESSION_KEY, params.sessionToken);
    localStorage.setItem(DISTRIBUIDOR_SESSION_EXPIRES_AT_KEY, params.expiresAt);
  } catch {}
}

export function readDistribuidorClientAuth(): DistribuidorClientSession {
  const rawDistribuidor = safeLocalStorageGet(DISTRIBUIDOR_DATA_KEY);
  const sessionToken = safeLocalStorageGet(DISTRIBUIDOR_SESSION_KEY);
  const expiresAt = safeLocalStorageGet(DISTRIBUIDOR_SESSION_EXPIRES_AT_KEY);

  if (!rawDistribuidor || !sessionToken || !expiresAt) {
    return { distribuidor: null, sessionToken: null, expiresAt: null };
  }

  const expiry = new Date(expiresAt);
  if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
    clearDistribuidorClientAuth();
    return { distribuidor: null, sessionToken: null, expiresAt: null };
  }

  try {
    return {
      distribuidor: JSON.parse(rawDistribuidor),
      sessionToken,
      expiresAt,
    };
  } catch {
    clearDistribuidorClientAuth();
    return { distribuidor: null, sessionToken: null, expiresAt: null };
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

  const { distribuidor, sessionToken } = readDistribuidorClientAuth();
  const distribuidorId = params?.distribuidorId || distribuidor?.id;

  if (distribuidorId) {
    headers["x-distribuidor-id"] = distribuidorId;
  }

  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
  }

  return headers;
}
