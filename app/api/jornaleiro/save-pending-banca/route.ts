import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { savePendingJornaleiroBanca } from "@/lib/modules/jornaleiro/pending-banca";
import {
  isValidBrazilianDocument,
  normalizeBrazilianDocument,
} from "@/lib/documents";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildProfilePromotionPayload(params: {
  userEmail: string | null;
  profile: any;
  bancaData: any;
}) {
  const normalizedDocument = normalizeBrazilianDocument(
    params.profile?.cpf || params.bancaData?.cpf || ""
  );
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    role: "jornaleiro",
    jornaleiro_access_level: "admin",
    active: true,
    email_verified: true,
    updated_at: now,
  };

  const email = params.userEmail || params.bancaData?.email;
  const fullName = params.profile?.full_name || params.bancaData?.full_name;
  const phone = params.profile?.phone || params.bancaData?.phone || params.bancaData?.whatsapp;

  if (email) payload.email = email;
  if (fullName) payload.full_name = fullName;
  if (phone) payload.phone = phone;
  if (normalizedDocument && isValidBrazilianDocument(normalizedDocument)) {
    payload.cpf = normalizedDocument;
  }

  return payload;
}

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
    const bancaData = body?.banca_data;
    const response = await savePendingJornaleiroBanca({
      userId: user.id,
      bancaData,
    });
    const promotionPayload = buildProfilePromotionPayload({
      userEmail: user.email,
      profile: body?.profile,
      bancaData,
    });
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert(
        {
          id: user.id,
          ...promotionPayload,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      throw new Error(profileError.message || "Erro ao converter perfil para jornaleiro");
    }

    return NextResponse.json({
      ...response,
      profile_promoted: true,
    }, {
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
