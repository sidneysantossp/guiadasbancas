import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { updateJornaleiroDistributorCatalogProduct } from "@/lib/modules/jornaleiro/distributor-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PUT /api/jornaleiro/catalogo-distribuidor/:productId
// Atualiza customizações de um produto (mesma lógica do PATCH)
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  return PATCH(req, { params });
}

// PATCH /api/jornaleiro/catalogo-distribuidor/:productId
// Atualiza customizações de um produto do catálogo distribuidor
export async function PATCH(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await req.json();
    const response = await updateJornaleiroDistributorCatalogProduct({
      userId: user.id,
      productId: params.productId,
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

    if (error?.message === "FORBIDDEN_JORNALEIRO") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.message === "DISTRIBUTOR_PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado ou não é de distribuidor" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    if (error?.payload && error?.status) {
      return NextResponse.json(error.payload, {
        status: error.status,
        headers: buildNoStoreHeaders({ isPrivate: true }),
      });
    }

    console.error("[API] Erro ao atualizar customização:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
