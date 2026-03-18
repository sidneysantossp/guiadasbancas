import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { updateJornaleiroBancaById } from "@/lib/modules/jornaleiro/bancas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function mapBancaByIdError(error: any) {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
  }

  if (message === "BANCA_NOT_FOUND") {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  if (message === "UNAUTHORIZED_BANCA_ACCESS" || message === "FORBIDDEN_BANCA_ADMIN") {
    return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
  }

  if (message === "INVALID_BANCA_PAYLOAD") {
    return NextResponse.json(
      { success: false, error: "Dados da banca são obrigatórios" },
      { status: 400 }
    );
  }

  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  try {
    const response = await updateJornaleiroBancaById({
      userId: user.id,
      bancaId: params.id,
      input: body,
    });

    return NextResponse.json(
      {
        success: response.success,
        message: response.message,
        banca_id: response.banca_id,
      },
      { headers: response.headers }
    );
  } catch (error: any) {
    const mapped = mapBancaByIdError(error);
    if (mapped) return mapped;

    console.error("[API/JORNALEIRO/BANCAS/:ID] Erro ao atualizar banca:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao atualizar banca" },
      { status: 500 }
    );
  }
}
