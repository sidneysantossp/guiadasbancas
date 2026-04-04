import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  createJornaleiroCampaign,
  listJornaleiroCampaigns,
} from "@/lib/modules/jornaleiro/campaigns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapCampaignError(error: any) {
  const message = error?.message || "";

  if (message === "FORBIDDEN_JORNALEIRO") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "BANCA_NOT_FOUND") {
    return NextResponse.json(
      { success: false, error: "Banca não encontrada" },
      { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "PREMIUM_REQUIRED_CAMPAIGNS") {
    return NextResponse.json(
      {
        success: false,
        error: "Campanhas fazem parte do plano Premium",
        code: "PREMIUM_REQUIRED_CAMPAIGNS",
        upgrade_url: "/jornaleiro/meu-plano?source=campanhas",
      },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_PRODUCT_REQUIRED") {
    return NextResponse.json(
      { success: false, error: "Produto é obrigatório" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_CAMPAIGN_DURATION") {
    return NextResponse.json(
      { success: false, error: "Duração de campanha inválida" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "PRODUCT_NOT_FOUND_IN_BANCA") {
    return NextResponse.json(
      { success: false, error: "Produto não encontrado na sua banca" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  return null;
}

// GET - Listar campanhas do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await listJornaleiroCampaigns({
      userId: user.id,
      status: new URL(request.url).searchParams.get("status"),
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapCampaignError(error);
    if (mapped) return mapped;

    console.error("Seller campaigns API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// POST - Criar nova campanha
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await request.json();
    const response = await createJornaleiroCampaign({
      userId: user.id,
      input: body,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapCampaignError(error);
    if (mapped) return mapped;

    console.error("Create campaign API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
