import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      return NextResponse.json(
        { success: true, data: {} },
        { headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const keys = {
      openaiConfigured: false,
      geminiConfigured: false,
      deepseekConfigured: false,
      groqConfigured: false,
      groqModel: "llama-3.1-8b-instant",
    };
    data?.forEach((item: any) => {
      if (item.key === 'openai_api_key') keys.openaiConfigured = Boolean(item.value);
      if (item.key === 'gemini_api_key') keys.geminiConfigured = Boolean(item.value);
      if (item.key === 'deepseek_api_key') keys.deepseekConfigured = Boolean(item.value);
      if (item.key === 'groq_api_key') keys.groqConfigured = Boolean(item.value);
      if (item.key === 'groq_model' && item.value) keys.groqModel = item.value;
    });

    return NextResponse.json(
      { success: true, data: keys },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const body = await req.json();
    const openai = typeof body?.openai === "string" ? body.openai.trim() : "";
    const gemini = typeof body?.gemini === "string" ? body.gemini.trim() : "";
    const deepseek = typeof body?.deepseek === "string" ? body.deepseek.trim() : "";
    const groq = typeof body?.groq === "string" ? body.groq.trim() : "";
    const groqModel = typeof body?.groqModel === "string" && body.groqModel.trim()
      ? body.groqModel.trim()
      : "llama-3.1-8b-instant";

    const upserts = [{ key: 'groq_model', value: groqModel }];

    if (openai) upserts.push({ key: 'openai_api_key', value: openai });
    if (gemini) upserts.push({ key: 'gemini_api_key', value: gemini });
    if (deepseek) upserts.push({ key: 'deepseek_api_key', value: deepseek });
    if (groq) upserts.push({ key: 'groq_api_key', value: groq });

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(upserts);

    if (error) {
      console.error("Error saving settings:", error);
      if (error.code === '42P01') { // undefined_table
         return NextResponse.json(
           { success: false, error: "Tabela 'settings' não existe. Por favor execute o script SQL em /sql/create_settings_table.sql" },
           { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
         );
      }
      return NextResponse.json(
        { success: false, error: "Erro ao salvar configurações" },
        { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json(
      {
        success: true,
        updated: upserts.map((item) => item.key),
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
