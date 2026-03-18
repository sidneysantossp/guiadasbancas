import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createJornaleiroProduct,
  listJornaleiroProducts,
} from "@/lib/modules/jornaleiro/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);

  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  try {
    const response = await listJornaleiroProducts({
      userId: user.id,
      requestUrl: request.url,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error) {
    if ((error as any)?.message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erro ao buscar produtos" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);

  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "JSON inválido no corpo da requisição" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  try {
    const response = await createJornaleiroProduct({
      userId: user.id,
      input: body,
    });

    return NextResponse.json(response, {
      status: 201,
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

    if (error?.payload && error?.status) {
      return NextResponse.json(error.payload, {
        status: error.status,
        headers: buildNoStoreHeaders({ isPrivate: true }),
      });
    }

    return NextResponse.json(
      { success: false, error: error.message || "Erro ao criar produto" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
