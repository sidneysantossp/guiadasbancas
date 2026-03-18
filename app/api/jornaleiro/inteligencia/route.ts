import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadJornaleiroIntelligence } from "@/lib/modules/jornaleiro/intelligence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await loadJornaleiroIntelligence({
      userId: user.id,
      period: request.nextUrl.searchParams.get("period"),
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    if (error?.message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "BANCA_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada para esta conta" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    console.error("[API/JORNALEIRO/INTELIGENCIA] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Não foi possível carregar a inteligência da banca" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
