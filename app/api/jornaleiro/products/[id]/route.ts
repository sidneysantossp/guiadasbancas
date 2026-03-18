import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  deleteJornaleiroProduct,
  loadJornaleiroProductDetail,
  updateJornaleiroProduct,
} from "@/lib/modules/jornaleiro/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await loadJornaleiroProductDetail({
      userId: user.id,
      productId: context.params.id,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    if (error?.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.payload && error?.status) {
      return NextResponse.json(error.payload, {
        status: error.status,
        headers: buildNoStoreHeaders({ isPrivate: true }),
      });
    }

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Erro ao processar requisição" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await updateJornaleiroProduct({
      userId: user.id,
      productId: context.params.id,
      input: body,
    });

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

    if (error?.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "FORBIDDEN_PRODUCT_EDIT") {
      return NextResponse.json(
        { success: false, error: "Não autorizado a editar este produto" },
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
      { success: false, error: "Erro interno: " + (error?.message || "desconhecido") },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await deleteJornaleiroProduct({
      userId: user.id,
      productId: context.params.id,
    });

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

    if (error?.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "FORBIDDEN_PRODUCT_DELETE") {
      return NextResponse.json(
        { success: false, error: "Não autorizado a deletar este produto" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
