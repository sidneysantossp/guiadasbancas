import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to fetch keys
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['openai_api_key', 'gemini_api_key', 'deepseek_api_key']);

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
    });

    return NextResponse.json({ success: true, data: keys });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { openai, gemini, deepseek } = body;

    const upserts = [
      { key: 'openai_api_key', value: openai || '' },
      { key: 'gemini_api_key', value: gemini || '' },
      { key: 'deepseek_api_key', value: deepseek || '' }
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
