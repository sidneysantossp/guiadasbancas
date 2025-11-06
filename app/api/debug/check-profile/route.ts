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

    const userId = session.user.id;

    // 1. Buscar no user_profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // 2. Buscar na auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);

    // 3. Buscar TODAS as bancas
    const { data: todasBancas } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id')
      .limit(20);

    // 4. Buscar banca associada a este user_id
    const { data: bancaDoUser } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('user_id', userId)
      .single();

    return NextResponse.json({
      session_user_id: userId,
      session_user_email: session.user.email,
      session_user_name: session.user.name,
      session_user_role: session.user.role,
      
      user_profiles: {
        existe: !!profile,
        data: profile,
        error: profileError?.message || null,
      },
      
      auth_users: {
        existe: !!authUser.user,
        id: authUser.user?.id,
        email: authUser.user?.email,
        created_at: authUser.user?.created_at,
        user_metadata: authUser.user?.user_metadata,
        error: authError?.message || null,
      },
      
      banca_do_user: {
        existe: !!bancaDoUser,
        data: bancaDoUser,
      },
      
      info: {
        problema: "Nome 'Sidney Santos' aparece na sessão mas não existe no banco",
        possivel_causa: "NextAuth pode estar pegando nome de user_metadata ou usando default",
      },
      
      debug_todas_bancas_amostra: todasBancas,
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
