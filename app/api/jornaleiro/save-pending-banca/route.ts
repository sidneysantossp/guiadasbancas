import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { savePendingJornaleiroBanca } from "@/lib/modules/jornaleiro/pending-banca";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// POST - Salvar dados da banca pendente no Supabase
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await request.json();
    const response = await savePendingJornaleiroBanca({
      userId: user.id,
      bancaData: body?.banca_data,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    if (error?.message === "INVALID_BANCA_DATA") {
      return NextResponse.json(
        { error: "Dados da banca são obrigatórios" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    console.error("❌ [save-pending-banca] Erro:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
