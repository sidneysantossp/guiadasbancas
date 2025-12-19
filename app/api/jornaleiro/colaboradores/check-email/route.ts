import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// Usar service role key para ter acesso admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ success: false, error: "Email não informado" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Criar cliente admin diretamente
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

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
    });
  } catch (e: any) {
    console.error("[Check Email] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}
