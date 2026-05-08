import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { listJornaleiroWholesaleProducts } from "@/lib/modules/atacado/service";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadJornaleiroMarketplaceModuleEnabled } from "@/lib/jornaleiro-modules";

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
    const marketplaceEnabled = await loadJornaleiroMarketplaceModuleEnabled();
    if (!marketplaceEnabled) {
      return NextResponse.json(
        { success: false, error: "Marketplace indisponível no momento", module_enabled: false },
        { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const data = await listJornaleiroWholesaleProducts(user.id);
    return NextResponse.json(
      { success: true, module_enabled: true, ...data },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar fornecedor" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
