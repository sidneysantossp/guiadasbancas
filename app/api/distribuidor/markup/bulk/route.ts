import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import {
  applyBulkDistribuidorMarkup,
  deleteAllDistribuidorProductMarkups,
} from "@/lib/modules/distribuidor/markup";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// POST - Aplicar markup em massa a todos os produtos do distribuidor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      distribuidor_id,
      tipo_calculo,
      markup_percentual,
      markup_fixo,
      margem_percentual,
      margem_divisor,
    } = body;
    const authError = await requireDistribuidorAccess(request, distribuidor_id);
    if (authError) return authError;

    const result = await applyBulkDistribuidorMarkup({
      distribuidorId: String(distribuidor_id || ""),
      tipoCalculo: tipo_calculo,
      markupPercentual: markup_percentual,
      markupFixo: markup_fixo,
      margemPercentual: margem_percentual,
      margemDivisor: margem_divisor,
    });

    return NextResponse.json(
      {
        success: true,
        updated: result.updated,
        total: result.total,
        ...(result.total === 0 ? { message: "Nenhum produto encontrado para este distribuidor" } : {}),
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    logger.error("[Markup Bulk] Erro geral:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Remover todos os markups individuais de produtos
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("distribuidor_id");
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const result = await deleteAllDistribuidorProductMarkups(String(distribuidorId || ""));

    return NextResponse.json(
      {
        success: true,
        deleted: result.deleted,
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    logger.error("[Markup Bulk] Erro geral:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
