import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import {
  COMMERCIAL_PLANNING_DOCUMENT_KEY,
  COMMERCIAL_PLANNING_HISTORY_KEY,
  COMMERCIAL_PLANNING_HISTORY_LIMIT,
  DEFAULT_COMMERCIAL_PLANNING_DOCUMENT,
  normalizeCommercialPlanningDocument,
  normalizeCommercialPlanningHistory,
} from "@/lib/commercial-planning";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("key, value, updated_at")
      .in("key", [COMMERCIAL_PLANNING_DOCUMENT_KEY, COMMERCIAL_PLANNING_HISTORY_KEY]);

    if (error) {
      throw error;
    }

    const currentRow = data?.find((item) => item.key === COMMERCIAL_PLANNING_DOCUMENT_KEY);
    const historyRow = data?.find((item) => item.key === COMMERCIAL_PLANNING_HISTORY_KEY);

    const document =
      typeof currentRow?.value === "string" && currentRow.value.trim()
        ? normalizeCommercialPlanningDocument(JSON.parse(currentRow.value))
        : DEFAULT_COMMERCIAL_PLANNING_DOCUMENT;

    const history =
      typeof historyRow?.value === "string" && historyRow.value.trim()
        ? normalizeCommercialPlanningHistory(JSON.parse(historyRow.value))
        : [];

    return NextResponse.json({
      success: true,
      data: document,
      history,
      updatedAt: currentRow?.updated_at || null,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANEJAMENTO-COMERCIAL][GET]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar planejamento comercial" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const normalized = normalizeCommercialPlanningDocument(body?.document);
    const updatedAt = new Date().toISOString();

    const { data: existingRows, error: existingError } = await supabaseAdmin
      .from("system_settings")
      .select("key, value, updated_at")
      .in("key", [COMMERCIAL_PLANNING_DOCUMENT_KEY, COMMERCIAL_PLANNING_HISTORY_KEY]);

    if (existingError) {
      throw existingError;
    }

    const currentRow = existingRows?.find((item) => item.key === COMMERCIAL_PLANNING_DOCUMENT_KEY);
    const historyRow = existingRows?.find((item) => item.key === COMMERCIAL_PLANNING_HISTORY_KEY);

    const currentDocument =
      typeof currentRow?.value === "string" && currentRow.value.trim()
        ? normalizeCommercialPlanningDocument(JSON.parse(currentRow.value))
        : null;

    const history =
      typeof historyRow?.value === "string" && historyRow.value.trim()
        ? normalizeCommercialPlanningHistory(JSON.parse(historyRow.value))
        : [];

    const currentDocumentSerialized = currentDocument ? JSON.stringify(currentDocument) : "";
    const nextDocumentSerialized = JSON.stringify(normalized);

    const nextHistory =
      currentDocument && currentDocumentSerialized !== nextDocumentSerialized
        ? [
            {
              id: currentRow?.updated_at || updatedAt,
              savedAt: currentRow?.updated_at || updatedAt,
              summary: currentDocument.summary,
              document: currentDocument,
            },
            ...history,
          ].slice(0, COMMERCIAL_PLANNING_HISTORY_LIMIT)
        : history;

    const { error } = await supabaseAdmin.from("system_settings").upsert(
      [
        {
          key: COMMERCIAL_PLANNING_DOCUMENT_KEY,
          value: nextDocumentSerialized,
          description: "Documento vivo do planejamento comercial da plataforma",
          is_secret: false,
          updated_at: updatedAt,
        },
        {
          key: COMMERCIAL_PLANNING_HISTORY_KEY,
          value: JSON.stringify(nextHistory),
          description: "Histórico de versões do planejamento comercial",
          is_secret: false,
          updated_at: updatedAt,
        },
      ],
      { onConflict: "key" }
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: normalized,
      history: nextHistory,
      updatedAt,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANEJAMENTO-COMERCIAL][POST]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao salvar planejamento comercial" },
      { status: 500 }
    );
  }
}
