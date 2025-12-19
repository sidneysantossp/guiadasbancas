import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Verificar se email já existe no Supabase Auth usando busca paginada
    let emailExists = false;
    let page = 1;
    const perPage = 1000;

    while (true) {
      const { data: usersPage, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        console.error("[Check Email] Erro ao listar usuários:", error);
        break;
      }

      if (!usersPage?.users || usersPage.users.length === 0) {
        break;
      }

      const found = usersPage.users.some(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (found) {
        emailExists = true;
        break;
      }

      // Se retornou menos que o perPage, não há mais páginas
      if (usersPage.users.length < perPage) {
        break;
      }

      page++;
    }

    console.log(`[Check Email] Email ${normalizedEmail} existe: ${emailExists}`);

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
