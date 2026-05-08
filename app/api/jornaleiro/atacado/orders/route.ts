import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import {
  createJornaleiroWholesaleOrder,
  listJornaleiroWholesaleOrders,
} from "@/lib/modules/atacado/service";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  try {
    const data = await listJornaleiroWholesaleOrders(user.id);
    return NextResponse.json(
      { success: true, data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar pedidos do marketplace" },
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

  try {
    const body = await request.json();
    const data = await createJornaleiroWholesaleOrder({
      userId: user.id,
      userEmail: user.email,
      input: body,
    });

    return NextResponse.json(
      { success: true, data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    const unavailable = error?.message === "ATACADO_NOT_AVAILABLE";
    return NextResponse.json(
      {
        success: false,
        error: unavailable
          ? "Marketplace indisponível para esta banca"
          : error?.message || "Erro ao criar pedido do marketplace",
      },
      { status: unavailable ? 403 : 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
