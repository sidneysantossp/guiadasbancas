import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email não informado" }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();
    
    // 1. Verificar na tabela de bancas (jornaleiros com banca ativa)
    const { data: bancas, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, name')
      .eq('email', emailLower)
      .maybeSingle();

    if (bancaError) {
       console.error('[check-email] Erro bancas:', bancaError);
    }

    if (bancas) {
      return NextResponse.json({ 
        exists: true, 
        message: "Este e-mail já está associado a uma banca cadastrada. Faça login para continuar." 
      });
    }
    
    // NOTA: Não verificamos auth.users aqui porque usuários comuns podem 
    // se tornar jornaleiros. A validação verifica apenas se já existe uma BANCA
    // com este email. O signUp vai vincular a conta existente ou criar nova.

    return NextResponse.json({ exists: false });

  } catch (error: any) {
    console.error('[check-email] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
