import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  loadJornaleiroProfileBundle,
  saveJornaleiroProfileBundle,
} from "@/lib/modules/jornaleiro/profile";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const privateNoStoreHeaders = buildNoStoreHeaders({ isPrivate: true });

// GET - Buscar perfil e banca do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: privateNoStoreHeaders }
      );
    }

    const { profile, banca } = await loadJornaleiroProfileBundle(user.id);

    return NextResponse.json({
      success: true,
      profile,
      banca: banca || null,
    }, {
      headers: privateNoStoreHeaders,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500, headers: privateNoStoreHeaders }
    );
  }
}

// PUT - Atualizar perfil e banca do jornaleiro
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: privateNoStoreHeaders }
      );
    }

    const body = await request.json();
    const { profile: profileUpdates, banca: bancaUpdates } = body;
    const { profile, banca } = await saveJornaleiroProfileBundle({
      userId: user.id,
      profileUpdates,
      bancaUpdates,
    });

    return NextResponse.json({
      success: true,
      profile,
      banca,
    }, {
      headers: privateNoStoreHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    if (message === "FORBIDDEN_COLLABORATOR_CREATE_BANCA") {
      return NextResponse.json(
        { error: "Colaboradores não podem criar uma nova banca" },
        { status: 403, headers: privateNoStoreHeaders }
      );
    }

    if (message === "PROFILE_NOT_FOUND") {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404, headers: privateNoStoreHeaders }
      );
    }

    if (message === "INVALID_BANCA_NAME") {
      return NextResponse.json(
        { error: "Nome da banca é obrigatório" },
        { status: 400, headers: privateNoStoreHeaders }
      );
    }

    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500, headers: privateNoStoreHeaders }
    );
  }
}
