import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  clearPendingJornaleiroBanca,
  loadPendingJornaleiroBanca,
} from "@/lib/modules/jornaleiro/pending-banca";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Buscar dados da banca pendente do Supabase
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await loadPendingJornaleiroBanca(user.id);
    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    console.error("❌ [get-pending-banca] Erro:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// DELETE - Limpar dados da banca pendente após criar a banca
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(request);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const response = await clearPendingJornaleiroBanca(user.id);
    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    console.error("❌ [get-pending-banca] Erro:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
