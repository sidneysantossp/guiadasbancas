import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email não informado" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Método 1: Tentar buscar usuários e filtrar
    let emailExists = false;
    
    try {
      // Buscar todos os usuários (primeira página de 1000)
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (!error && data?.users) {
        emailExists = data.users.some(
          (u) => u.email?.toLowerCase() === normalizedEmail
        );
        console.log(`[Check Email] Encontrados ${data.users.length} usuários, email ${normalizedEmail} existe: ${emailExists}`);
      } else {
        console.error("[Check Email] Erro ao listar usuários:", error);
      }
    } catch (listError) {
      console.error("[Check Email] Exceção ao listar usuários:", listError);
    }

    // Método 2: Se não encontrou, verificar na tabela user_profiles como fallback
    if (!emailExists) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from("user_profiles")
        .select("id, email")
        .ilike("email", normalizedEmail)
        .limit(1);

      if (!profileError && profileData && profileData.length > 0) {
        emailExists = true;
        console.log(`[Check Email] Email encontrado em user_profiles: ${normalizedEmail}`);
      }
    }

    // Método 3: Verificar também na tabela bancas (email de login)
    if (!emailExists) {
      const { data: bancaData, error: bancaError } = await supabaseAdmin
        .from("bancas")
        .select("id, email")
        .ilike("email", normalizedEmail)
        .limit(1);

      if (!bancaError && bancaData && bancaData.length > 0) {
        emailExists = true;
        console.log(`[Check Email] Email encontrado em bancas: ${normalizedEmail}`);
      }
    }

    console.log(`[Check Email] Resultado final - Email ${normalizedEmail} existe: ${emailExists}`);

    return NextResponse.json({ 
      success: true, 
      exists: emailExists,
      message: emailExists ? "Este email já está cadastrado na plataforma" : null
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (e: any) {
    console.error("[Check Email] Erro:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
