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
    
    // 1. Verificar em user_profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('email', emailLower)
      .maybeSingle();

    if (profileError) {
      console.error('[check-email] Erro user_profiles:', profileError);
    }

    if (profiles) {
      return NextResponse.json({ 
        exists: true, 
        message: "Este e-mail já possui uma conta cadastrada. Faça login ou recupere sua senha." 
      });
    }

    // 2. Verificar na tabela de bancas
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
        message: "Este e-mail já está associado a uma banca cadastrada." 
      });
    }

    return NextResponse.json({ exists: false });

  } catch (error: any) {
    console.error('[check-email] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
