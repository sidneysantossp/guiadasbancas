import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // 1. Buscar com supabaseAdmin (sem RLS)
    const { data: adminBanca, error: adminError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, user_id, email, profile_image')
      .eq('user_id', userId)
      .single();

    // 2. Tentar buscar com client (COM RLS) - simular o que o layout faz
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: clientBanca, error: clientError } = await supabaseClient
      .from('bancas')
      .select('id, name, user_id, email, profile_image')
      .eq('user_id', userId)
      .single();

    // 3. Verificar políticas RLS
    const { data: policies } = await supabaseAdmin
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'bancas');

    return NextResponse.json({
      user: {
        id: userId,
        email: userEmail,
      },
      
      admin_query: {
        sucesso: !!adminBanca && !adminError,
        data: adminBanca,
        error: adminError?.message || null,
      },
      
      client_query: {
        sucesso: !!clientBanca && !clientError,
        data: clientBanca,
        error: clientError?.message || null,
        error_code: clientError?.code || null,
        error_details: clientError?.details || null,
      },
      
      diagnostico: {
        admin_funciona: !!adminBanca,
        client_funciona: !!clientBanca,
        problema: !clientBanca && !!adminBanca ? 
          '🚨 RLS está bloqueando! Client não consegue acessar mas Admin sim.' :
          clientBanca ? '✅ Tudo funcionando' : '❌ Banca não existe',
        solucao: !clientBanca && !!adminBanca ?
          'Precisa ajustar as políticas RLS da tabela bancas' :
          null,
      },
      
      rls_policies: policies || [],
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
