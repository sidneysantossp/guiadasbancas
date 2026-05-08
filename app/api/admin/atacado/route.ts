import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { getAdminWholesaleSummary } from "@/lib/modules/atacado/service";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const summary = await getAdminWholesaleSummary();
    return NextResponse.json(
      { success: true, summary },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao carregar fornecedor próprio",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
