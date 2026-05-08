import { supabaseAdmin } from "@/lib/supabase";

export const JORNALEIRO_MARKETPLACE_MODULE_SETTING_KEY = "jornaleiro_marketplace_enabled";

export function parseBooleanSystemSetting(value: unknown): boolean {
  return String(value ?? "").trim().toLowerCase() === "true";
}

export async function loadJornaleiroMarketplaceModuleEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", JORNALEIRO_MARKETPLACE_MODULE_SETTING_KEY)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return parseBooleanSystemSetting(data?.value);
  } catch (error) {
    console.error("[JORNALEIRO MODULES] Erro ao carregar módulo Marketplace:", error);
    return false;
  }
}
