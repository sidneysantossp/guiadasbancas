import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  loadManagedJornaleiroWhatsApp,
  removeManagedJornaleiroWhatsApp,
  saveManagedJornaleiroWhatsApp,
} from "@/lib/modules/jornaleiro/whatsapp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mapWhatsAppError(error: any) {
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

  if (message === "UNAUTHORIZED_BANCA_ACCESS" || message === "FORBIDDEN_BANCA_ADMIN") {
    return NextResponse.json(
      { success: false, error: "Acesso negado" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_WHATSAPP_REQUIRED") {
    return NextResponse.json(
      { success: false, error: "Número do WhatsApp é obrigatório" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (message === "INVALID_WHATSAPP_NUMBER") {
    return NextResponse.json(
      { success: false, error: "Número de WhatsApp inválido. Use formato: 11999999999" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  return null;
}

// GET - Buscar WhatsApp do jornaleiro
export async function GET(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await loadManagedJornaleiroWhatsApp({
      userId: user.id,
      bancaId: params.bancaId,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapWhatsAppError(error);
    if (mapped) return mapped;

    return NextResponse.json(
      { success: false, error: error.message || "Erro ao buscar dados do jornaleiro" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// POST - Salvar/Atualizar WhatsApp do jornaleiro
export async function POST(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await req.json();
    const response = await saveManagedJornaleiroWhatsApp({
      userId: user.id,
      bancaId: params.bancaId,
      whatsappNumber: body?.whatsappNumber,
      bancaName: body?.bancaName,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    const mapped = mapWhatsAppError(error);
    if (mapped) return mapped;

    console.error("[JORNALEIRO] Erro ao configurar WhatsApp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao salvar configurações" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// DELETE - Remover configuração do WhatsApp
export async function DELETE(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await removeManagedJornaleiroWhatsApp({
      userId: user.id,
      bancaId: params.bancaId,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });

  } catch (error: any) {
    const mapped = mapWhatsAppError(error);
    if (mapped) return mapped;

    console.error("[JORNALEIRO] Erro ao remover WhatsApp:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao remover configuração" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
