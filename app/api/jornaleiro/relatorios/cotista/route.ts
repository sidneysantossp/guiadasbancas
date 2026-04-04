import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadJornaleiroPartnerCatalogReport } from "@/lib/modules/jornaleiro/reports";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/jornaleiro/relatorios/cotista
// Estatisticas de produtos do catalogo parceiro
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await loadJornaleiroPartnerCatalogReport(user.id);
    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    if (error?.message === "BANCA_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "FORBIDDEN_DISTRIBUTOR_PLAN_ONLY") {
      return NextResponse.json(
        {
          success: false,
          error: "Seu plano atual nao libera este relatorio do catalogo parceiro",
          code: "FORBIDDEN_DISTRIBUTOR_PLAN_ONLY",
          upgrade_url: "/jornaleiro/meu-plano?source=relatorio-rede-parceira",
        },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    console.error("[API] Erro ao gerar relatório:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
