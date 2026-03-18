import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createPrimaryJornaleiroBanca,
  loadActiveJornaleiroBanca,
  updateActiveJornaleiroBanca,
} from "@/lib/modules/jornaleiro/bancas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function mapBancaError(error: any) {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
  }

  if (message === "UNAUTHORIZED_BANCA_ACCESS") {
    return NextResponse.json(
      {
        success: false,
        error: "Erro de validação de segurança. Faça logout e login novamente.",
        details: "USER_ID_MISMATCH",
      },
      { status: 403 }
    );
  }

  if (message === "BANCA_NOT_FOUND") {
    return NextResponse.json(
      { success: false, error: "Banca não encontrada para este usuário" },
      { status: 404 }
    );
  }

  if (message === "INVALID_BANCA_NAME") {
    return NextResponse.json(
      { success: false, error: "Nome da banca é obrigatório" },
      { status: 400 }
    );
  }

  return null;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const banca = await loadActiveJornaleiroBanca(user.id);

    if (!banca) {
      return NextResponse.json(
        { success: false, error: "Banca não encontrada para este usuário" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: banca },
      { headers: buildNoStoreHeaders() }
    );
  } catch (error: any) {
    const mapped = mapBancaError(error);
    if (mapped) return mapped;

    console.error("[API/JORNALEIRO/BANCA] Erro ao carregar banca:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar banca" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const response = await createPrimaryJornaleiroBanca({
      userId: user.id,
      requesterEmail: user.email,
      input: body,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    const mapped = mapBancaError(error);
    if (mapped) return mapped;

    console.error("[API/JORNALEIRO/BANCA] Erro ao criar banca:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao criar banca" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const response = await updateActiveJornaleiroBanca({
      userId: user.id,
      input: body,
    });

    return NextResponse.json(
      { success: response.success, data: response.data },
      { headers: response.headers }
    );
  } catch (error: any) {
    const mapped = mapBancaError(error);
    if (mapped) return mapped;

    console.error("[API/JORNALEIRO/BANCA] Erro ao atualizar banca:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao atualizar banca" },
      { status: 500 }
    );
  }
}
