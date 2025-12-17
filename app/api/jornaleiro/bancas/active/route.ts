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

  // Verificar se a banca pertence ao usuário autenticado
  const { data: banca, error: bancaError } = await supabaseAdmin
    .from("bancas")
    .select("id, user_id")
    .eq("id", bancaId)
    .single();

  if (bancaError || !banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  if ((banca as any).user_id !== session.user.id) {
    return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .update({ banca_id: bancaId })
    .eq("id", session.user.id);

  if (profileError) {
    console.error("[API/JORNALEIRO/BANCAS/ACTIVE] Erro ao atualizar profile:", profileError);
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, banca_id: bancaId });
}

