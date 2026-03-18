import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { runDistribuidorMercosSync } from "@/lib/modules/distribuidor/integration";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutos - necessário para processar catálogos grandes

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const full = searchParams.get("full") === "true";
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;
    if (!distribuidorId) {
      return NextResponse.json({ success: false, error: "Distribuidor não informado" }, { status: 400 });
    }

    const payload = await runDistribuidorMercosSync({ distribuidorId, full });
    return NextResponse.json(payload);
  } catch (error: any) {
    logger.error("[Sync] Erro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
