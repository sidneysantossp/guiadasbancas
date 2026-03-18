import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import {
  createDistribuidorProduct,
  getDistribuidorProductsOverview,
  updateDistribuidorProduct,
} from "@/lib/modules/distribuidor/products";
import { requireDistribuidorAccess } from "@/lib/security/distribuidor-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const distribuidorId = searchParams.get("id");
    const limit = parseInt(searchParams.get("limit") || "10000", 10);
    const sort = searchParams.get("sort") || "name";
    const activeOnly = searchParams.get("active") !== "false";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const productId = searchParams.get("productId");

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const payload = await getDistribuidorProductsOverview({
      distribuidorId: distribuidorId!,
      limit,
      sort,
      activeOnly,
      search,
      category,
      productId,
    });

    if (productId) {
      const single = payload.product;
      if (!single) {
        return NextResponse.json(
          { success: false, error: "Produto não encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: [single],
          product: single,
          distribuidor_id: distribuidorId,
        },
        { headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json({ success: true, ...payload }, { headers: NO_STORE_HEADERS });
  } catch (error: any) {
    logger.error("[API Distribuidor] Erro ao buscar produtos:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const distribuidorId = body?.distribuidorId || body?.distribuidor_id;
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const result = await createDistribuidorProduct({
      distribuidorId,
      body,
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    logger.error("Erro ao criar produto do distribuidor:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, distribuidorId, updates } = body;

    if (!productId || !distribuidorId) {
      return NextResponse.json(
        { success: false, error: "IDs obrigatórios" },
        { status: 400 }
      );
    }

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const result = await updateDistribuidorProduct({ productId, distribuidorId, updates });
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, data: result.data }, { headers: NO_STORE_HEADERS });
  } catch (error: any) {
    logger.error("Erro ao atualizar produto:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
