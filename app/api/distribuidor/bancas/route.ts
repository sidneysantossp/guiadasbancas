import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorBancasOverview } from "@/lib/modules/distribuidor/bancas";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";

// GET - Buscar todas as bancas ativas (igual ao admin) e marcar quais têm produtos do distribuidor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const distribuidorId = searchParams.get("id");
    const q = (searchParams.get("q") || "").toLowerCase();

    const authError = await requireDistribuidorAccess(req, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorBancasOverview({
      distribuidorId: distribuidorId!,
      query: q,
    });

    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    logger.error("[Bancas Distribuidor] Erro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
