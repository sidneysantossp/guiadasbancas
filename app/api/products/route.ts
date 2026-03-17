import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import type { Produto } from "@/types/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  bancaHasLegacyDistributorCatalogAccess,
  DEFAULT_PRODUCT_IMAGE,
  DISTRIBUIDOR_PRODUCTS_CATEGORY_ID,
  formatLegacyProductListItems,
  listDistributorCatalogForBanca,
  listOwnedCatalogProducts,
} from "@/lib/modules/products/service";
import { loadPrimaryOwnedBanca } from "@/lib/modules/jornaleiro/access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);
    
    // SEGURANÇA: Verificar autenticação
    if (!claims?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const userRole = claims.role;
    const userId = claims.id;
    
    // SEGURANÇA: Verificar role válido
    if (!['admin', 'jornaleiro'].includes(userRole)) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const category = searchParams.get("category") || "";
    const active = searchParams.get("active");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Máximo 100
    let bancaId = searchParams.get("banca_id") || "";
    const activeFilter =
      active === "true" ? true : active === "false" ? false : null;

    // SEGURANÇA: Para jornaleiros, forçar filtro pela própria banca
    if (userRole === 'jornaleiro') {
      const { data: bancaData } = await loadPrimaryOwnedBanca<{ id: string }>({
        userId,
        select: "id",
      });
      
      if (!bancaData) {
        return NextResponse.json(
          { error: "Banca não encontrada" },
          { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }
      bancaId = bancaData.id;
    }

    const ownProducts = await listOwnedCatalogProducts({
      bancaId: bancaId || null,
      filters: {
        q,
        category,
        active: activeFilter,
        limit,
      },
    });

    const distributorCatalog = bancaId
      ? await listDistributorCatalogForBanca({
          bancaId,
          filters: {
            q,
            category,
            limit,
          },
          canAccessCatalog: await bancaHasLegacyDistributorCatalogAccess(bancaId),
          fallbackImageUrl: DEFAULT_PRODUCT_IMAGE,
          distributorCategoryId: DISTRIBUIDOR_PRODUCTS_CATEGORY_ID,
        })
      : { items: [], totalAvailable: 0 };

    const items = formatLegacyProductListItems([...ownProducts, ...distributorCatalog.items]);

    return NextResponse.json(
      { items, total: items.length },
      {
        headers: buildNoStoreHeaders({
          isPrivate: true,
          extra: {
            'CDN-Cache-Control': 'max-age=180',
          },
        }),
      }
    );
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return NextResponse.json(
      { items: [], total: 0 },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const productData = {
      banca_id: body.banca_id,
      category_id: body.category_id || null,
      name: body.name,
      description: body.description || null,
      description_full: body.description_full || null,
      price: Number(body.price || 0),
      price_original: body.price_original ? Number(body.price_original) : null,
      discount_percent: body.discount_percent || null,
      images: body.images || null,
      gallery_images: body.gallery_images || null,
      specifications: body.specifications || null,
      rating_avg: body.rating_avg || null,
      reviews_count: body.reviews_count || 0,
      stock_qty: body.stock_qty || null,
      track_stock: !!body.track_stock,
      sob_encomenda: !!body.sob_encomenda,
      pre_venda: !!body.pre_venda,
      pronta_entrega: body.pronta_entrega !== false
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro na criação de produto:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
