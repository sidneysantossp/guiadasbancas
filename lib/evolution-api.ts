type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type AuthMode = "apikey" | "bearer" | "both";

export interface EvolutionCallOptions {
  baseUrl: string;
  apiKey: string;
  path: string;
  method?: HttpMethod;
  body?: unknown;
  timeoutMs?: number;
}

export interface EvolutionCallResult {
  ok: boolean;
  status: number | null;
  data: any;
  raw: string;
  authMode: AuthMode | "none";
  error?: string;
}

export interface EvolutionInstanceStatus {
  connected: boolean;
  state: string;
  source: "connectionState" | "fetchInstances" | "unknown";
  profileName?: string | null;
  profilePicUrl?: string | null;
  instanceId?: string | null;
  token?: string | null;
  authModeUsed?: AuthMode | "none";
  upstreamStatus?: number | null;
  raw?: any;
}

function normalizeBaseUrl(baseUrl: string): string {
  return (baseUrl || "").trim().replace(/\/$/, "");
}

function normalizePath(path: string): string {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildAuthHeaders(apiKey: string, mode: AuthMode): HeadersInit {
  const trimmedKey = (apiKey || "").trim();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (mode === "apikey" || mode === "both") headers.apikey = trimmedKey;
  if (mode === "bearer" || mode === "both") headers.Authorization = `Bearer ${trimmedKey}`;

  return headers;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonSafely(raw: string): any {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getEvolutionErrorMessage(
  result: Pick<EvolutionCallResult, "status" | "data" | "raw" | "error">,
  fallback = "Falha na Evolution API"
): string {
  const data = result.data;

  if (data && typeof data === "object") {
    const message =
      data?.response?.message ||
      data?.message ||
      data?.error ||
      data?.details ||
      null;
    if (typeof message === "string" && message.trim().length > 0) {
      return result.status ? `HTTP ${result.status}: ${message}` : message;
    }
  }

  if (result.raw && result.raw.trim().length > 0) {
    return result.status ? `HTTP ${result.status}: ${result.raw}` : result.raw;
  }

  if (result.error && result.error.trim().length > 0) {
    return result.error;
  }

  return result.status ? `${fallback} (HTTP ${result.status})` : fallback;
}

export async function callEvolutionApi(options: EvolutionCallOptions): Promise<EvolutionCallResult> {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const path = normalizePath(options.path);
  const timeoutMs = Math.max(1000, options.timeoutMs ?? 15000);
  const method = options.method ?? "GET";
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const url = `${baseUrl}${path}`;

  const authModes: AuthMode[] = ["apikey", "bearer", "both"];
  let lastResult: EvolutionCallResult = {
    ok: false,
    status: null,
    data: null,
    raw: "",
    authMode: "none",
    error: "Falha ao conectar com Evolution API",
  };

  for (const authMode of authModes) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method,
          headers: buildAuthHeaders(options.apiKey, authMode),
          body,
        },
        timeoutMs
      );

      const raw = await response.text();
      const data = parseJsonSafely(raw);

      const result: EvolutionCallResult = {
        ok: response.ok,
        status: response.status,
        data,
        raw,
        authMode,
      };

      if (response.ok) return result;

      lastResult = result;

      // Quando for erro de autenticação, tentar próximo formato de header
      if (response.status === 401 || response.status === 403) {
        continue;
      }

      // Para outros erros HTTP (404/409/500), não faz sentido trocar auth mode
      return result;
    } catch (error: any) {
      lastResult = {
        ok: false,
        status: null,
        data: null,
        raw: "",
        authMode,
        error: error?.message || "fetch failed",
      };
    }
  }

  return lastResult;
}

function isConnectedState(value: unknown): boolean {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "open" || normalized === "connected" || normalized === "online";
}

export async function getEvolutionInstanceStatus(options: {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  timeoutMs?: number;
}): Promise<EvolutionInstanceStatus> {
  const connectionStateResult = await callEvolutionApi({
    baseUrl: options.baseUrl,
    apiKey: options.apiKey,
    path: `/instance/connectionState/${encodeURIComponent(options.instanceName)}`,
    method: "GET",
    timeoutMs: options.timeoutMs ?? 15000,
  });

  const connectionPayload = connectionStateResult.data?.instance || connectionStateResult.data || null;
  const connectionState = String(
    connectionPayload?.state ||
      connectionPayload?.status ||
      connectionPayload?.connectionStatus ||
      ""
  ).trim();

  const fetchInstancesResult = await callEvolutionApi({
    baseUrl: options.baseUrl,
    apiKey: options.apiKey,
    path: "/instance/fetchInstances",
    method: "GET",
    timeoutMs: options.timeoutMs ?? 15000,
  });

  const instances = Array.isArray(fetchInstancesResult.data) ? fetchInstancesResult.data : [];
  const matchedInstance = instances.find((instance) => {
    const byName = String(instance?.name || "").trim() === options.instanceName;
    const byInstanceName = String(instance?.instanceName || "").trim() === options.instanceName;
    return byName || byInstanceName;
  });

  const fetchState = String(
    matchedInstance?.connectionStatus ||
      matchedInstance?.state ||
      matchedInstance?.status ||
      ""
  ).trim();

  if (matchedInstance) {
    return {
      connected: isConnectedState(fetchState),
      state: fetchState || connectionState || "unknown",
      source: "fetchInstances",
      profileName: matchedInstance?.profileName || null,
      profilePicUrl: matchedInstance?.profilePicUrl || null,
      instanceId: matchedInstance?.id || null,
      token: matchedInstance?.token || null,
      authModeUsed: fetchInstancesResult.authMode,
      upstreamStatus: fetchInstancesResult.status,
      raw: matchedInstance,
    };
  }

  if (connectionStateResult.ok) {
    return {
      connected: isConnectedState(connectionState),
      state: connectionState || "unknown",
      source: "connectionState",
      profileName: connectionPayload?.profileName || null,
      profilePicUrl: connectionPayload?.profilePicUrl || null,
      authModeUsed: connectionStateResult.authMode,
      upstreamStatus: connectionStateResult.status,
      raw: connectionPayload,
    };
  }

  return {
    connected: false,
    state: connectionState || fetchState || "unknown",
    source: "unknown",
    authModeUsed: fetchInstancesResult.ok ? fetchInstancesResult.authMode : connectionStateResult.authMode,
    upstreamStatus: fetchInstancesResult.ok ? fetchInstancesResult.status : connectionStateResult.status,
    raw: fetchInstancesResult.ok ? fetchInstancesResult.data : connectionStateResult.data,
  };
}
