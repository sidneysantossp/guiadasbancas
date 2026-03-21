import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { setActiveJornaleiroBanca } from "@/lib/modules/jornaleiro/bancas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const privateNoStoreHeaders = buildNoStoreHeaders({ isPrivate: true });

function mapActiveBancaError(error: any) {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: privateNoStoreHeaders }
    );
  }

  if (message === "BANCA_NOT_FOUND") {
    return NextResponse.json(
      { success: false, error: "Banca não encontrada" },
      { status: 404, headers: privateNoStoreHeaders }
    );
  }

  if (message === "UNAUTHORIZED_BANCA_ACCESS") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: privateNoStoreHeaders }
    );
  }

  return null;
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: privateNoStoreHeaders }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido" },
      { status: 400, headers: privateNoStoreHeaders }
    );
  }

  const bancaId = body?.banca_id || body?.bancaId;
  if (!bancaId || typeof bancaId !== "string") {
    return NextResponse.json(
      { success: false, error: "banca_id é obrigatório" },
      { status: 400, headers: privateNoStoreHeaders }
    );
  }

  try {
    const response = await setActiveJornaleiroBanca({
      userId: user.id,
      bancaId,
    });

    return NextResponse.json(
      { success: response.success, banca_id: response.banca_id },
      { headers: response.headers }
    );
  } catch (error: any) {
    const mapped = mapActiveBancaError(error);
    if (mapped) return mapped;

    console.error("[API/JORNALEIRO/BANCAS/ACTIVE] Erro ao definir banca ativa:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao definir banca ativa" },
      { status: 500, headers: privateNoStoreHeaders }
    );
  }
}
