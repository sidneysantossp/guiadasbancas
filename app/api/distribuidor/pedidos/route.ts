import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorPedidos } from "@/lib/modules/distribuidor/orders";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";

// GET - Buscar pedidos que contêm produtos do distribuidor
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const distribuidorId = searchParams.get("id");
    const status = searchParams.get("status") || "";
    const q = (searchParams.get("q") || "").toLowerCase();
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const authError = await requireDistribuidorAccess(req, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorPedidos({
      distribuidorId: distribuidorId!,
      status,
      query: q,
      limit,
      page,
    });

    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    logger.error("[Pedidos Distribuidor] Erro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
