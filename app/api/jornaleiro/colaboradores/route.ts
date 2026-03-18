import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createManagedCollaborator,
  listManagedCollaborators,
} from "@/lib/modules/jornaleiro/collaborators";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapCollaboratorError(error: any) {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "FORBIDDEN_PROMOTE_ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error: "Apenas jornaleiros com perfil Administrador podem criar outros administradores.",
      },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_EMAIL_PASSWORD_REQUIRED") {
    return NextResponse.json(
      { success: false, error: "Email e senha são obrigatórios" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_BANCA_SELECTION") {
    return NextResponse.json(
      { success: false, error: "Selecione pelo menos uma banca" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "FORBIDDEN_BANCA_SCOPE") {
    return NextResponse.json(
      { success: false, error: "Você não tem permissão para essas bancas" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "EMAIL_ALREADY_EXISTS") {
    return NextResponse.json(
      { success: false, error: "Este email já está cadastrado" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await listManagedCollaborators(user.id);
    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapCollaboratorError(error);
    if (mapped) return mapped;

    console.error("[Colaboradores GET] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await req.json();
    const response = await createManagedCollaborator({
      userId: user.id,
      input: body,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapCollaboratorError(error);
    if (mapped) return mapped;

    console.error("[Colaboradores POST] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
