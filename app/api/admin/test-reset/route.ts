import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log("🔧 Test Reset - Email:", email);
    console.log("🔧 Test Reset - Password length:", password?.length);

    // Teste 1: Verificar se supabaseAdmin está configurado
    console.log("✅ supabaseAdmin configurado");

    // Teste 2: Tentar buscar via função SQL
    let userId: string | null = null;
    
    try {
      const { data, error } = await supabaseAdmin.rpc('get_user_id_by_email', { user_email: email });
      console.log("📞 RPC result:", { data, error: error?.message });
      
      if (error) {
        return NextResponse.json({
          step: "rpc_call",
          error: error.message,
          hint: "A função SQL get_user_id_by_email não existe. Execute database/reset-password-function.sql primeiro."
        }, { status: 500 });
      }
      
      userId = data;
    } catch (e: any) {
      console.error("❌ RPC Error:", e);
      return NextResponse.json({
        step: "rpc_exception",
        error: e.message,
        hint: "Exceção ao chamar RPC"
      }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({
        step: "user_not_found",
        error: "Usuário não encontrado",
        hint: "Verifique se o email está correto"
      }, { status: 404 });
    }

    console.log("👤 User ID encontrado:", userId);

    // Teste 3: Tentar atualizar senha
    const { data: updated, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, { password });
    
    if (updateErr) {
      console.error("❌ Update Error:", updateErr);
      return NextResponse.json({
        step: "update_password",
        error: updateErr.message
      }, { status: 500 });
    }

    console.log("✅ Senha atualizada com sucesso!");
    return NextResponse.json({
      success: true,
      user: { id: updated.user?.id, email: updated.user?.email }
    });

  } catch (e: any) {
    console.error("❌ Exception:", e);
    return NextResponse.json({
      step: "exception",
      error: e.message,
      stack: e.stack
    }, { status: 500 });
  }
}
