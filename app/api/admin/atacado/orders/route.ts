import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  listAdminWholesaleOrders,
  updateAdminWholesaleOrder,
} from "@/lib/modules/atacado/service";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const status = (request.nextUrl.searchParams.get("status") || "").trim();
    const q = (request.nextUrl.searchParams.get("q") || "").trim();
    const data = await listAdminWholesaleOrders({ status, q });

    return NextResponse.json(
      { success: true, data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao carregar pedidos do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    if (!body?.id) {
      return NextResponse.json(
        { success: false, error: "ID do pedido obrigatório" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const data = await updateAdminWholesaleOrder(body.id, body);
    return NextResponse.json(
      { success: true, data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao atualizar pedido do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
