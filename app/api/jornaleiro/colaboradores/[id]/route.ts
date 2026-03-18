import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  deleteManagedCollaborator,
  getManagedCollaborator,
  updateManagedCollaborator,
} from "@/lib/modules/jornaleiro/collaborators";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapCollaboratorByIdError(error: any, operation: "read" | "write") {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "COLABORADOR_NOT_FOUND") {
    return NextResponse.json(
      { success: false, error: "Colaborador não encontrado" },
      { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "FORBIDDEN_PROMOTE_ADMIN") {
    return NextResponse.json(
      {
        success: false,
        error:
          "Apenas jornaleiros com perfil Administrador podem promover outros para administrador.",
      },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "FORBIDDEN_BANCA_SCOPE") {
    return NextResponse.json(
      { success: false, error: "Você não tem permissão para essas bancas" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  return NextResponse.json(
    { success: false, error: error?.message || (operation === "read" ? "Erro ao carregar colaborador" : "Erro interno") },
    { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
  );
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await getManagedCollaborator({
      userId: user.id,
      collaboratorId: params.id,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    return mapCollaboratorByIdError(error, "read");
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await req.json();
    const response = await updateManagedCollaborator({
      userId: user.id,
      collaboratorId: params.id,
      input: body,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    return mapCollaboratorByIdError(error, "write");
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await deleteManagedCollaborator({
      userId: user.id,
      collaboratorId: params.id,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    return mapCollaboratorByIdError(error, "write");
  }
}
