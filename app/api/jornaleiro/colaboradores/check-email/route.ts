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

    // Verificar se email já existe no Supabase Auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

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
