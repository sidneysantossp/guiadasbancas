import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorMercosHealth } from "@/lib/modules/distribuidor/integration";
import { requireDistribuidorAccess } from '@/lib/security/distribuidor-auth';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorMercosHealth(distribuidorId!);
    return NextResponse.json(payload);
  } catch (error: any) {
    logger.error("[Health] Erro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
