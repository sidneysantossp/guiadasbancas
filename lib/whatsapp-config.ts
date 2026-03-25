import { supabaseAdmin } from "@/lib/supabase";

export interface WhatsAppConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  isActive: boolean;
}

const DEFAULT_BASE_URL = "https://api.guiadasbancas.com.br";
const DEFAULT_INSTANCE_NAME = "guiadasbancas";

const SETTINGS_KEYS = {
  baseUrl: "whatsapp_evolution_base_url",
  apiKey: "whatsapp_evolution_api_key",
  instanceName: "whatsapp_evolution_instance_name",
  isActive: "whatsapp_evolution_is_active",
} as const;

const SETTINGS_DESCRIPTION = {
  [SETTINGS_KEYS.baseUrl]: "URL base da Evolution API usada pela plataforma",
  [SETTINGS_KEYS.apiKey]: "API Key da Evolution API usada pela plataforma",
  [SETTINGS_KEYS.instanceName]: "Nome da instância Evolution API usada pela plataforma",
  [SETTINGS_KEYS.isActive]: "Flag de ativação das notificações WhatsApp da plataforma",
} as const;

function normalizeBaseUrl(value: string | null | undefined): string {
  return (value || "").trim().replace(/\/$/, "");
}

function normalizeString(value: string | null | undefined): string {
  return (value || "").trim();
}

function parseBoolean(value: string | null | undefined, fallback: boolean): boolean {
  if (typeof value !== "string") return fallback;

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "sim", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "nao", "não", "off"].includes(normalized)) return false;

  return fallback;
}

function getEnvConfig(): WhatsAppConfig {
  const baseUrl = normalizeBaseUrl(process.env.EVOLUTION_API_URL) || DEFAULT_BASE_URL;
  const apiKey = normalizeString(process.env.EVOLUTION_API_KEY);
  const instanceName = normalizeString(process.env.EVOLUTION_INSTANCE_NAME) || DEFAULT_INSTANCE_NAME;

  return {
    baseUrl,
    apiKey,
    instanceName,
    isActive: Boolean(apiKey && instanceName),
  };
}

async function readSettingsMap(): Promise<Map<string, string>> {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", Object.values(SETTINGS_KEYS));

  if (error) {
    throw new Error(error.message);
  }

  return new Map(
    (data || [])
      .filter((row) => typeof row?.key === "string")
      .map((row) => [row.key as string, typeof row?.value === "string" ? row.value : ""])
  );
}

async function readPersistedOverridesSafe(): Promise<Partial<WhatsAppConfig>> {
  try {
    const settings = await readSettingsMap();

    const baseUrl = normalizeBaseUrl(settings.get(SETTINGS_KEYS.baseUrl));
    const apiKey = normalizeString(settings.get(SETTINGS_KEYS.apiKey));
    const instanceName = normalizeString(settings.get(SETTINGS_KEYS.instanceName));
    const hasIsActive = settings.has(SETTINGS_KEYS.isActive);
    const env = getEnvConfig();

    return {
      ...(baseUrl ? { baseUrl } : {}),
      ...(apiKey ? { apiKey } : {}),
      ...(instanceName ? { instanceName } : {}),
      ...(hasIsActive
        ? { isActive: parseBoolean(settings.get(SETTINGS_KEYS.isActive), env.isActive) }
        : {}),
    };
  } catch (error) {
    console.error("[WHATSAPP CONFIG] Falha ao ler system_settings, usando env:", error);
    return {};
  }
}

export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  const envConfig = getEnvConfig();
  const persisted = await readPersistedOverridesSafe();
  const baseUrl = persisted.baseUrl || envConfig.baseUrl;
  const apiKey = persisted.apiKey || envConfig.apiKey;
  const instanceName = persisted.instanceName || envConfig.instanceName;
  const derivedIsActive = Boolean(apiKey && instanceName);

  return {
    baseUrl,
    apiKey,
    instanceName,
    isActive: persisted.isActive ?? derivedIsActive,
  };
}

export async function setWhatsAppConfig(config: Partial<WhatsAppConfig>): Promise<WhatsAppConfig> {
  const currentConfig = await getWhatsAppConfig();

  const normalized: Partial<WhatsAppConfig> = {
    ...(config.baseUrl !== undefined ? { baseUrl: normalizeBaseUrl(config.baseUrl) } : {}),
    ...(config.apiKey !== undefined ? { apiKey: normalizeString(config.apiKey) } : {}),
    ...(config.instanceName !== undefined ? { instanceName: normalizeString(config.instanceName) } : {}),
    ...(config.isActive !== undefined ? { isActive: Boolean(config.isActive) } : {}),
  };

  const nextConfig: WhatsAppConfig = {
    baseUrl: normalized.baseUrl || currentConfig.baseUrl,
    apiKey: normalized.apiKey || currentConfig.apiKey,
    instanceName: normalized.instanceName || currentConfig.instanceName,
    isActive: normalized.isActive ?? currentConfig.isActive,
  };

  const timestamp = new Date().toISOString();
  const upserts: Array<{
    key: string;
    value: string;
    description: string;
    is_secret: boolean;
    updated_at: string;
  }> = [];

  if (normalized.baseUrl !== undefined) {
    upserts.push({
      key: SETTINGS_KEYS.baseUrl,
      value: nextConfig.baseUrl,
      description: SETTINGS_DESCRIPTION[SETTINGS_KEYS.baseUrl],
      is_secret: false,
      updated_at: timestamp,
    });
  }

  if (normalized.apiKey !== undefined && normalized.apiKey) {
    upserts.push({
      key: SETTINGS_KEYS.apiKey,
      value: nextConfig.apiKey,
      description: SETTINGS_DESCRIPTION[SETTINGS_KEYS.apiKey],
      is_secret: true,
      updated_at: timestamp,
    });
  }

  if (normalized.instanceName !== undefined) {
    upserts.push({
      key: SETTINGS_KEYS.instanceName,
      value: nextConfig.instanceName,
      description: SETTINGS_DESCRIPTION[SETTINGS_KEYS.instanceName],
      is_secret: false,
      updated_at: timestamp,
    });
  }

  if (normalized.isActive !== undefined) {
    upserts.push({
      key: SETTINGS_KEYS.isActive,
      value: String(nextConfig.isActive),
      description: SETTINGS_DESCRIPTION[SETTINGS_KEYS.isActive],
      is_secret: false,
      updated_at: timestamp,
    });
  }

  if (upserts.length > 0) {
    const { error } = await supabaseAdmin
      .from("system_settings")
      .upsert(upserts, { onConflict: "key" });

    if (error) {
      throw new Error(error.message);
    }
  }

  return getWhatsAppConfig();
}

export async function updateWhatsAppConfig(updates: Partial<WhatsAppConfig>): Promise<WhatsAppConfig> {
  return setWhatsAppConfig(updates);
}

export function validateWhatsAppConfig(config: Partial<WhatsAppConfig>): string[] {
  const errors: string[] = [];

  if (!config.baseUrl) {
    errors.push("URL da Evolution API é obrigatória");
  } else if (!config.baseUrl.startsWith("http")) {
    errors.push("URL deve começar com http:// ou https://");
  }

  if (!config.apiKey) {
    errors.push("API Key é obrigatória");
  } else if (config.apiKey.length < 10) {
    errors.push("API Key deve ter pelo menos 10 caracteres");
  }

  if (!config.instanceName) {
    errors.push("Nome da instância é obrigatório");
  }

  return errors;
}

export async function isWhatsAppConfigured(): Promise<boolean> {
  const config = await getWhatsAppConfig();
  return Boolean(config.baseUrl && config.apiKey && config.instanceName);
}
