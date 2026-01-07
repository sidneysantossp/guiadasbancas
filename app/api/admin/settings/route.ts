import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Listar configurações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get("keys")?.split(",");

    let query = supabaseAdmin.from("system_settings").select("*");
    
    if (keys && keys.length > 0) {
      query = query.in("key", keys);
    }

    const { data, error } = await query.order("key");

    if (error) throw error;

    // Mascarar valores secretos
    const maskedData = data?.map((setting) => ({
      ...setting,
      value: setting.is_secret && setting.value 
        ? "••••••••" + setting.value.slice(-4) 
        : setting.value,
    }));

    return NextResponse.json({ success: true, data: maskedData });
  } catch (error: any) {
    console.error("[API/ADMIN/SETTINGS] Erro ao listar:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar ou atualizar configuração
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, description, is_secret } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key é obrigatória" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .upsert(
        {
          key,
          value,
          description,
          is_secret,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API/ADMIN/SETTINGS] Erro ao salvar:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
