import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { getAdminWholesaleProduct, updateAdminWholesaleProduct } from "@/lib/modules/atacado/service";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const product = await getAdminWholesaleProduct(id);

    return NextResponse.json(
      { success: true, data: product, product },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao carregar produto do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const body = await request.json();
    const product = await updateAdminWholesaleProduct(id, body);

    return NextResponse.json(
      { success: true, data: product },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao atualizar produto do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const { error } = await supabaseAdmin
      .from("own_wholesale_products")
      .update({ active: false, visible: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { success: true },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao remover produto do fornecedor" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
