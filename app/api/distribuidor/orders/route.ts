import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorRecentOrders } from "@/lib/modules/distribuidor/orders";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const items = await getDistribuidorRecentOrders({
      distribuidorId: distribuidorId!,
      limit,
    });

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    logger.error("Erro ao buscar pedidos do distribuidor:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
