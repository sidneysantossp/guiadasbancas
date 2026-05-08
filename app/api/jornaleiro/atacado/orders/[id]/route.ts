import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { getJornaleiroWholesaleOrder } from "@/lib/modules/atacado/service";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedRequestUser(request);
  if (!user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  const { id } = await params;

  try {
    const data = await getJornaleiroWholesaleOrder(user.id, id);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Pedido não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar pedido do marketplace" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
