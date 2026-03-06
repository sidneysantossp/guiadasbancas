import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    // Try to fetch keys
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['openai_api_key', 'gemini_api_key', 'deepseek_api_key', 'groq_api_key', 'groq_model']);

    if (error) {
      console.error("Error fetching settings:", error);
      // If table doesn't exist, return empty
      return NextResponse.json({ success: true, data: {} });
    }

    const keys: any = {};
    data?.forEach((item: any) => {
      if (item.key === 'openai_api_key') keys.openai = item.value;
      if (item.key === 'gemini_api_key') keys.gemini = item.value;
      if (item.key === 'deepseek_api_key') keys.deepseek = item.value;
      if (item.key === 'groq_api_key') keys.groq = item.value;
      if (item.key === 'groq_model') keys.groqModel = item.value;
    });

    return NextResponse.json({ success: true, data: keys });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const body = await req.json();
    const { openai, gemini, deepseek, groq, groqModel } = body;

    const upserts = [
      { key: 'openai_api_key', value: openai || '' },
      { key: 'gemini_api_key', value: gemini || '' },
      { key: 'deepseek_api_key', value: deepseek || '' },
      { key: 'groq_api_key', value: groq || '' },
      { key: 'groq_model', value: groqModel || 'llama-3.1-8b-instant' }
    ];

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(upserts);

    if (error) {
      console.error("Error saving settings:", error);
      if (error.code === '42P01') { // undefined_table
         return NextResponse.json({ success: false, error: "Tabela 'settings' não existe. Por favor execute o script SQL em /sql/create_settings_table.sql" }, { status: 500 });
      }
      return NextResponse.json({ success: false, error: "Erro ao salvar configurações" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
