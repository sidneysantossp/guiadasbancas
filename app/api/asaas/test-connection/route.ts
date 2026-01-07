import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Buscar configurações do Asaas
    const { data: settings } = await supabaseAdmin
      .from("system_settings")
      .select("key, value")
      .in("key", ["asaas_api_key", "asaas_environment"]);

    const apiKey = settings?.find(s => s.key === "asaas_api_key")?.value;
    const environment = settings?.find(s => s.key === "asaas_environment")?.value || "sandbox";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API Key do Asaas não configurada" },
        { status: 400 }
      );
    }

    const baseUrl = environment === "production"
      ? "https://api.asaas.com/v3"
      : "https://sandbox.asaas.com/api/v3";

    // Testar conexão buscando dados da conta
    const res = await fetch(`${baseUrl}/myAccount`, {
      headers: {
        "access_token": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          error: errorData.errors?.[0]?.description || `Erro ${res.status}: ${res.statusText}` 
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      environment,
      walletId: data.walletId,
      name: data.name,
      email: data.email,
    });
  } catch (error: any) {
    console.error("[API/ASAAS/TEST] Erro:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
