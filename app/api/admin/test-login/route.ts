import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log("🧪 [TEST-LOGIN] Iniciando teste para:", email);

    // Teste 1: Tentar autenticar
    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log("❌ [TEST-LOGIN] Erro auth:", authError.message);
      return NextResponse.json({
        step: "auth",
        success: false,
        error: authError.message,
        hint: "Senha incorreta ou usuário não existe no Supabase Auth"
      });
    }

    if (!authData.user) {
      return NextResponse.json({
        step: "auth",
        success: false,
        error: "Auth retornou sucesso mas sem usuário"
      });
    }

    console.log("✅ [TEST-LOGIN] Auth OK, user_id:", authData.user.id);

    // Teste 2: Buscar perfil usando RPC para bypass RLS
    // Primeiro tentar query direta com service_role (deve ignorar RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .limit(1)
      .maybeSingle();

    if (profileError) {
      console.log("❌ [TEST-LOGIN] Erro perfil:", profileError.message);
      return NextResponse.json({
        step: "profile",
        success: false,
        user_id: authData.user.id,
        error: profileError.message,
        hint: "Execute o SQL para criar o perfil:\n\ninsert into user_profiles (id, role, full_name, active, email_verified)\nvalues ('" + authData.user.id + "', 'jornaleiro', 'Banca Guia das Bancas', true, true)\non conflict (id) do update set active = true, role = 'jornaleiro';"
      });
    }

    if (!profile) {
      return NextResponse.json({
        step: "profile",
        success: false,
        user_id: authData.user.id,
        error: "Perfil não encontrado",
        hint: "Execute o SQL para criar o perfil"
      });
    }

    console.log("✅ [TEST-LOGIN] Perfil:", profile);

    if (!profile.active) {
      return NextResponse.json({
        step: "active",
        success: false,
        error: "Usuário está inativo",
        hint: "Execute: update user_profiles set active = true where id = '" + authData.user.id + "';"
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        active: profile.active,
        full_name: profile.full_name
      }
    });

  } catch (e: any) {
    console.error("❌ [TEST-LOGIN] Exception:", e);
    return NextResponse.json({
      step: "exception",
      success: false,
      error: e.message
    }, { status: 500 });
  }
}
