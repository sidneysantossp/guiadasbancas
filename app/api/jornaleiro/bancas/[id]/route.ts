import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;
  const bancaId = params.id;

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  const { banca, newPassword } = body;

  if (!banca) {
    return NextResponse.json({ success: false, error: "Dados da banca são obrigatórios" }, { status: 400 });
  }

  // Se foi fornecida uma nova senha, atualizar no Supabase Auth
  if (newPassword && typeof newPassword === "string" && newPassword.trim()) {
    try {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: newPassword.trim() }
      );

      if (passwordError) {
        console.error("[API/JORNALEIRO/BANCAS/PUT] Erro ao atualizar senha:", passwordError);
        return NextResponse.json({ 
          success: false, 
          error: "Erro ao atualizar senha: " + passwordError.message 
        }, { status: 500 });
      }
    } catch (e: any) {
      console.error("[API/JORNALEIRO/BANCAS/PUT] Erro ao atualizar senha:", e);
      return NextResponse.json({ 
        success: false, 
        error: "Erro ao atualizar senha" 
      }, { status: 500 });
    }
  }

  // Verificar se o usuário tem acesso à banca (dono ou membro admin)
  const { data: existingBanca, error: bancaError } = await supabaseAdmin
    .from("bancas")
    .select("id, user_id")
    .eq("id", bancaId)
    .single();

  if (bancaError || !existingBanca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  const isOwner = existingBanca.user_id === userId;
  
  if (!isOwner) {
    // Verificar se é membro admin
    const { data: membership } = await supabaseAdmin
      .from("banca_members")
      .select("access_level")
      .eq("banca_id", bancaId)
      .eq("user_id", userId)
      .maybeSingle();

    if (!membership || membership.access_level !== "admin") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }
  }

  // Preparar dados para atualização
  const updateData: any = {};

  if (banca.name) updateData.name = banca.name;
  if (banca.whatsapp) updateData.whatsapp = banca.whatsapp;
  if (banca.cep) updateData.cep = banca.cep;
  if (banca.address) updateData.address = banca.address;
  if (typeof banca.lat === "number") updateData.lat = banca.lat;
  if (typeof banca.lng === "number") updateData.lng = banca.lng;
  if (banca.cover_image !== undefined) updateData.cover_image = banca.cover_image;
  if (banca.profile_image !== undefined) updateData.profile_image = banca.profile_image;
  if (banca.hours) updateData.hours = banca.hours;
  if (banca.payment_methods) updateData.payment_methods = banca.payment_methods;
  if (typeof banca.is_cotista === "boolean") updateData.is_cotista = banca.is_cotista;
  if (banca.cotista_id !== undefined) updateData.cotista_id = banca.cotista_id;
  if (banca.cotista_codigo !== undefined) updateData.cotista_codigo = banca.cotista_codigo;
  if (banca.cotista_razao_social !== undefined) updateData.cotista_razao_social = banca.cotista_razao_social;
  if (banca.cotista_cnpj_cpf !== undefined) updateData.cotista_cnpj_cpf = banca.cotista_cnpj_cpf;

  updateData.updated_at = new Date().toISOString();

  // Atualizar banca
  const { error: updateError } = await supabaseAdmin
    .from("bancas")
    .update(updateData)
    .eq("id", bancaId);

  if (updateError) {
    console.error("[API/JORNALEIRO/BANCAS/PUT] Erro ao atualizar banca:", updateError);
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: "Banca atualizada com sucesso",
    banca_id: bancaId 
  });
}
