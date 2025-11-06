import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Buscar TODAS as bancas com email "banca10@guiadasbancas.com.br"
    const { data: bancasBanca10 } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id, created_at')
      .eq('email', 'banca10@guiadasbancas.com.br');

    // Buscar TODAS as bancas com nome "Banca do Matheus"
    const { data: bancasMatheus } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id, created_at')
      .ilike('name', '%Banca do Matheus%');

    // Buscar usuário com email banca10@guiadasbancas.com.br no auth
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userBanca10 = authUsers.users.find(u => u.email === 'banca10@guiadasbancas.com.br');

    // Informações do ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NÃO CONFIGURADO';
    const isProduction = process.env.NODE_ENV === 'production';
    const vercelEnv = process.env.VERCEL_ENV || 'LOCAL';

    return NextResponse.json({
      ambiente: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: vercelEnv,
        is_production: isProduction,
        supabase_url_prefix: supabaseUrl.substring(0, 40) + '...',
      },
      
      bancas_com_email_banca10: {
        total: bancasBanca10?.length || 0,
        lista: bancasBanca10 || [],
      },
      
      bancas_com_nome_matheus: {
        total: bancasMatheus?.length || 0,
        lista: bancasMatheus || [],
      },
      
      auth_user_banca10: userBanca10 ? {
        id: userBanca10.id,
        email: userBanca10.email,
        created_at: userBanca10.created_at,
      } : null,
      
      analise: {
        problema_detectado: (bancasBanca10?.length || 0) > 1 ? 
          '🚨 MÚLTIPLAS BANCAS COM MESMO EMAIL!' : 
          'Email único no banco',
        solucao: (bancasBanca10?.length || 0) > 1 ?
          'Precisa deletar as bancas duplicadas ou corrigir os emails' :
          'Verificar se o user_id está correto',
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
