import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT,
  JOURNALEIRO_PARTNER_LANDING_KEY,
  normalizeJornaleiroPartnerLandingDocument,
} from "@/lib/jornaleiro-partner-landing";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value, updated_at")
      .eq("key", JOURNALEIRO_PARTNER_LANDING_KEY)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const parsed =
      typeof data?.value === "string" && data.value.trim() ? JSON.parse(data.value) : null;

    return NextResponse.json(
      {
        success: true,
        data: parsed
          ? normalizeJornaleiroPartnerLandingDocument(parsed)
          : DEFAULT_JORNALEIRO_PARTNER_LANDING_DOCUMENT,
        updatedAt: data?.updated_at || null,
        source: parsed ? "settings" : "default",
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/ADMIN/JORNALEIRO-PARTNER-LANDING][GET]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar landing do jornaleiro" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const document = normalizeJornaleiroPartnerLandingDocument(body?.document);
    const updatedAt = new Date().toISOString();

    const { error } = await supabaseAdmin.from("system_settings").upsert(
      {
        key: JOURNALEIRO_PARTNER_LANDING_KEY,
        value: JSON.stringify(document),
        description: "Conteudo comercial da landing publica para jornaleiros parceiros",
        is_secret: false,
        updated_at: updatedAt,
      },
      { onConflict: "key" }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, data: document, updatedAt },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/ADMIN/JORNALEIRO-PARTNER-LANDING][POST]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao salvar landing do jornaleiro" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
