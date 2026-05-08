import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { getJornaleiroWholesaleAccess } from "@/lib/modules/atacado/service";
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
    const access = await getJornaleiroWholesaleAccess(user.id);
    return NextResponse.json(
      { success: true, allowed: access.allowed, banca: access.banca },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, allowed: false, error: error?.message || "Erro ao validar fornecedor" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
