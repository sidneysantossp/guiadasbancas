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
    
    // 2. Verificar no auth.users (usuários comuns ou qualquer conta existente)
    try {
      // Buscar usuários paginando até encontrar ou esgotar
      let page = 1;
      const perPage = 1000;
      let found = false;
      
      while (!found) {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage,
        });
        
        if (authError) {
          console.error('[check-email] Erro listUsers:', authError);
          break;
        }
        
        if (!authData?.users || authData.users.length === 0) {
          break;
        }
        
        // Procurar o email na lista
        const existingUser = authData.users.find(
          (u: any) => u.email?.toLowerCase() === emailLower
        );
        
        if (existingUser) {
          found = true;
          return NextResponse.json({ 
            exists: true, 
            message: "Este e-mail já está cadastrado. Use outro e-mail ou faça login." 
          });
        }
        
        // Se retornou menos que o perPage, não há mais páginas
        if (authData.users.length < perPage) {
          break;
        }
        
        page++;
        
        // Limite de segurança para evitar loop infinito
        if (page > 100) break;
      }
    } catch (authCheckError) {
      console.error('[check-email] Erro ao verificar auth.users:', authCheckError);
      // Continua o fluxo mesmo se falhar esta verificação
    }

    return NextResponse.json({ exists: false });

  } catch (error: any) {
    console.error('[check-email] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
