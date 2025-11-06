import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // 1. Dados da sessão
    const sessionInfo = {
      session_user_id: session.user.id,
      session_email: session.user.email,
      session_name: session.user.name,
      session_role: session.user.role,
    };

    // 2. Buscar TODAS as bancas com este user_id
    const { data: bancasDoUser, error: bancasError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id')
      .eq('user_id', session.user.id);

    // 3. Buscar a banca que seria retornada pela query .single()
    const { data: bancaSingle, error: singleError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id')
      .eq('user_id', session.user.id)
      .single();

    // 4. Buscar o perfil do usuário
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, role, full_name')
      .eq('id', session.user.id)
      .single();

    // 5. Buscar na tabela auth.users (se possível)
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(session.user.id);

    return NextResponse.json({
      debug_info: {
        session: sessionInfo,
        profile: profile,
        auth_user: {
          id: authUser.user?.id,
          email: authUser.user?.email,
        },
        bancas_encontradas: {
          total: bancasDoUser?.length || 0,
          lista: bancasDoUser || [],
          erro: bancasError?.message,
        },
        banca_single: {
          data: bancaSingle,
          erro: singleError?.message,
          code: singleError?.code,
        },
        VALIDACAO: {
          session_email: session.user.email,
          banca_single_email: bancaSingle?.email,
          EMAIL_MATCH: session.user.email === bancaSingle?.email ? '✅ OK' : '🚨 ERRO!',
          session_user_id: session.user.id,
          banca_single_user_id: bancaSingle?.user_id,
          USER_ID_MATCH: session.user.id === bancaSingle?.user_id ? '✅ OK' : '🚨 ERRO!',
        }
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
