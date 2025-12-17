import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  const bancaId = body?.banca_id || body?.bancaId;
  if (!bancaId || typeof bancaId !== "string") {
    return NextResponse.json({ success: false, error: "banca_id é obrigatório" }, { status: 400 });
  }

  // Verificar se o usuário tem acesso à banca (dono ou membro)
  const { data: banca, error: bancaError } = await supabaseAdmin
    .from("bancas")
    .select("id, user_id")
    .eq("id", bancaId)
    .single();

  if (bancaError || !banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  const isOwner = (banca as any).user_id === userId;
  if (!isOwner) {
    const { data: membership } = await supabaseAdmin
      .from("banca_members")
      .select("access_level")
      .eq("banca_id", bancaId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }
  }

  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .update({ banca_id: bancaId })
    .eq("id", userId);

  if (profileError) {
    console.error("[API/JORNALEIRO/BANCAS/ACTIVE] Erro ao atualizar profile:", profileError);
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, banca_id: bancaId });
}
