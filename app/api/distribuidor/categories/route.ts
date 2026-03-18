import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { getDistribuidorCategoriesOverview } from "@/lib/modules/distribuidor/categories";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET - Buscar categorias do distribuidor (com contagem de produtos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorCategoriesOverview(distribuidorId!);
    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    logger.error("[Categorias] Erro:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
