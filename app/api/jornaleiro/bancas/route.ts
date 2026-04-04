import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createJornaleiroBanca,
  listAccessibleJornaleiroBancas,
} from "@/lib/modules/jornaleiro/bancas";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const privateNoStoreHeaders = buildNoStoreHeaders({ isPrivate: true });

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: privateNoStoreHeaders }
    );
  }

  try {
    const response = await listAccessibleJornaleiroBancas(user.id);
    return NextResponse.json(response, { headers: response.headers });
  } catch (error: any) {
    const message = error?.message || "";
    if (message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    console.error("[API/JORNALEIRO/BANCAS] Erro ao listar bancas:", error);
    return NextResponse.json(
      { success: false, error: message || "Erro ao listar bancas" },
      { status: 500, headers: privateNoStoreHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
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
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "JSON inválido" },
      { status: 400, headers: privateNoStoreHeaders }
    );
  }

  try {
    const response = await createJornaleiroBanca({
      userId: user.id,
      requesterEmail: user.email,
      input: body,
    });

    return NextResponse.json(response, { status: 201, headers: privateNoStoreHeaders });
  } catch (error: any) {
    const message = error?.message || "";

    if (message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    if (message === "FORBIDDEN_COLLABORATOR_CREATE_BANCA") {
      return NextResponse.json(
        { success: false, error: "Apenas administradores podem cadastrar novas bancas" },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    if (message === "ADDITIONAL_BANCA_REQUIRES_LICENSE") {
      return NextResponse.json(
        {
          success: false,
          code: "ADDITIONAL_BANCA_REQUIRES_LICENSE",
          error: "Para cadastrar outra banca, ative uma nova licença em Meu Plano.",
          upgrade_url: "/jornaleiro/meu-plano?source=multiplas-bancas",
        },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    if (message === "INVALID_BANCA_NAME") {
      return NextResponse.json(
        { success: false, error: "Nome da banca é obrigatório" },
        { status: 400, headers: privateNoStoreHeaders }
      );
    }

    if (message === "INVALID_ACCESS_EMAIL_REQUIRED") {
      return NextResponse.json(
        { success: false, error: "Email do usuário é obrigatório" },
        { status: 400, headers: privateNoStoreHeaders }
      );
    }

    if (message === "INVALID_ACCESS_PASSWORD") {
      return NextResponse.json(
        { success: false, error: "Senha do usuário deve ter no mínimo 6 caracteres" },
        { status: 400, headers: privateNoStoreHeaders }
      );
    }

    if (message === "INVALID_ACCESS_EMAIL") {
      return NextResponse.json(
        { success: false, error: "Email do usuário inválido" },
        { status: 400, headers: privateNoStoreHeaders }
      );
    }

    console.error("[API/JORNALEIRO/BANCAS] Erro ao criar banca:", error);
    return NextResponse.json(
      { success: false, error: message || "Erro ao criar banca" },
      { status: 500, headers: privateNoStoreHeaders }
    );
  }
}
