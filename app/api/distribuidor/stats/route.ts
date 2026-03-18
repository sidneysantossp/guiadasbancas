import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorStats } from "@/lib/modules/distribuidor/stats";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const debug = searchParams.get("debug") === "true";

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorStats({
      distribuidorId: distribuidorId!,
      debug,
    });

    return NextResponse.json({ success: true, ...(debug ? { debug: true } : {}), ...payload });
  } catch (error: any) {
    logger.error("[Stats] Erro ao buscar stats do distribuidor:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
