import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  BANCA_ABOUT_TEMPLATE_KEY,
  DEFAULT_BANCA_ABOUT_TEMPLATE,
} from "@/lib/banca-about-template";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: true,
          data: {
            key: BANCA_ABOUT_TEMPLATE_KEY,
            value: DEFAULT_BANCA_ABOUT_TEMPLATE,
            source: "default",
          },
        },
        { headers: { "Cache-Control": "public, max-age=300" } }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", BANCA_ABOUT_TEMPLATE_KEY)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const value =
      typeof data?.value === "string" && data.value.trim()
        ? data.value
        : DEFAULT_BANCA_ABOUT_TEMPLATE;

    return NextResponse.json(
      {
        success: true,
        data: {
          key: BANCA_ABOUT_TEMPLATE_KEY,
          value,
          source: data?.value ? "settings" : "default",
        },
      },
      { headers: { "Cache-Control": "public, max-age=300" } }
    );
  } catch (error: any) {
    console.error("[API/SETTINGS/BANCA-ABOUT-TEMPLATE] Erro:", error);
    return NextResponse.json(
      {
        success: true,
        data: {
          key: BANCA_ABOUT_TEMPLATE_KEY,
          value: DEFAULT_BANCA_ABOUT_TEMPLATE,
          source: "default",
        },
      },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  }
}

