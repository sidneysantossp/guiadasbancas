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
    
    // 1. Verificar na tabela de bancas (Fonte primária de emails públicos/cadastrados)
    const { data: bancas, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, name')
      .eq('email', emailLower)
      .maybeSingle();

    if (bancaError) {
       console.error('[check-email] Erro bancas:', bancaError);
       // Não retornamos erro aqui para não bloquear o fluxo em caso de falha de banco momentânea,
       // mas logamos. Se falhar, o signUp final vai pegar.
    }

    if (bancas) {
      return NextResponse.json({ 
        exists: true, 
        message: "Este e-mail já está associado a uma banca cadastrada. Faça login para continuar." 
      });
    }
    
    // NOTA: Não verificamos user_profiles pois a coluna email não existe lá.
    // A verificação final de existência de conta (auth.users) acontece no signUp.

    return NextResponse.json({ exists: false });

  } catch (error: any) {
    console.error('[check-email] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
