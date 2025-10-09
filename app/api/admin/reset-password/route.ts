import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (process.env.ALLOW_LOCAL_RESET !== "true") {
      return NextResponse.json({ error: "Local reset disabled" }, { status: 403 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "email e password são obrigatórios" }, { status: 400 });
    }

    // Abordagem simples: tentar atualizar senha pelo email diretamente
    // Como temos service_role, podemos usar updateUserByEmail (se disponível) ou buscar por email
    
    // Primeiro: tentar pegar o usuário com signInWithPassword usando qualquer senha
    // para descobrir se existe (aproveitamos o erro para saber se o email existe)
    let userId: string | null = null;
    
    // Tentar um login "dummy" só para verificar se o email existe
    const testLogin = await supabaseAdmin.auth.signInWithPassword({
      email,
      password: '__dummy_password_12345__'
    });
    
    // Se o erro for "Invalid login credentials", significa que o email EXISTE
    // Se for "Email not confirmed" ou similar, também existe
    if (testLogin.error && testLogin.error.message.includes('Email not confirmed')) {
      // Email existe mas não confirmado - vamos buscar na base
    }
    
    // Buscar via RPC SQL function que criamos
    try {
      const { data: userIdFromRpc, error: rpcErr } = await supabaseAdmin
        .rpc('get_user_id_by_email', { user_email: email });
      
      if (!rpcErr && userIdFromRpc) {
        userId = userIdFromRpc;
      }
    } catch (e) {
      // Função não existe, vamos para plano B
    }
    
    // Se ainda não temos userId, retornar erro claro
    if (!userId) {
      return NextResponse.json({ 
        error: "Usuário não encontrado ou função SQL não configurada.",
        hint: "Execute o SQL em database/reset-password-function.sql no Supabase SQL Editor primeiro."
      }, { status: 404 });
    }

    const { data: updated, error: updErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    if (updErr) {
      return NextResponse.json({ error: `Falha ao atualizar senha: ${updErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { id: updated.user?.id, email: updated.user?.email } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 });
  }
}
