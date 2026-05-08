import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createAdminWholesaleProduct,
  listAdminWholesaleProducts,
} from "@/lib/modules/atacado/service";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || 1));
    const pageSize = Math.max(1, Math.min(100, Number(request.nextUrl.searchParams.get("pageSize") || request.nextUrl.searchParams.get("limit") || 50)));
    const q = (request.nextUrl.searchParams.get("q") || request.nextUrl.searchParams.get("search") || "").trim();
    const status = (request.nextUrl.searchParams.get("status") || "").trim();
    const availability = (request.nextUrl.searchParams.get("availability") || "").trim();
    const category = (request.nextUrl.searchParams.get("category") || "").trim();

    const result = await listAdminWholesaleProducts({ page, pageSize, q, status, availability, category });
    return NextResponse.json(
      {
        success: true,
        data: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        summary: result.summary,
        categoryCounts: result.categoryCounts,
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const pendingMigration = error?.message === "MIGRATION_OWN_WHOLESALE_PENDING";
    return NextResponse.json(
      {
        success: false,
        error: pendingMigration
          ? "Migration do fornecedor próprio ainda não aplicada"
          : error?.message || "Erro ao carregar produtos do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const product = await createAdminWholesaleProduct(body);

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
          : error?.message || "Erro ao criar produto do fornecedor",
        pendingMigration,
      },
      { status: pendingMigration ? 424 : 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
