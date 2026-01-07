import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Verificar se o menu de planos está habilitado
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "plans_menu_enabled")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    // Se não existe a configuração, assume como desabilitado (false)
    const enabled = data?.value === "true";

    return NextResponse.json({ 
      success: true, 
      enabled 
    });
  } catch (error: any) {
    console.error("[API/SETTINGS/PLANS-MENU] Erro:", error);
    return NextResponse.json({ 
      success: true, 
      enabled: false // Em caso de erro, desabilita por segurança
    });
  }
}
