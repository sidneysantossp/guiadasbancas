import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const targetUserId = '25cd158e-b89a-4928-b6cd-7eb6e551e82f';
    const targetEmail = 'banca10@guiadasbancas.com.br';

    // 1. Verificar se o user_id existe no auth.users
    const { data: userById, error: userByIdError } = await supabaseAdmin.auth.admin.getUserById(targetUserId);

    // 2. Buscar todos os usuários com email parecido
    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
    const usersBanca = allUsers.users.filter(u => u.email?.includes('banca'));

    // 3. Buscar perfil na tabela user_profiles
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    // 4. Buscar banca associada
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    return NextResponse.json({
      target_user_id: targetUserId,
      target_email: targetEmail,
      
      user_existe_no_auth: {
        existe: !!userById.user,
        data: userById.user ? {
          id: userById.user.id,
          email: userById.user.email,
          created_at: userById.user.created_at,
          email_confirmed_at: userById.user.email_confirmed_at,
          last_sign_in_at: userById.user.last_sign_in_at,
        } : null,
        error: userByIdError?.message || null,
      },
      
      profile_existe: {
        existe: !!profile,
        data: profile,
      },
      
      banca_existe: {
        existe: !!banca,
        data: banca ? {
          id: banca.id,
          name: banca.name,
          email: banca.email,
          user_id: banca.user_id,
        } : null,
      },
      
      todos_users_com_banca_no_email: usersBanca.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
      })),
      
      diagnostico: {
        user_auth_existe: !!userById.user,
        profile_existe: !!profile,
        banca_existe: !!banca,
        problema: !userById.user && !!banca ? 
          '🚨 CRÍTICO: Banca existe mas usuário no auth foi deletado!' :
          '✅ Consistente',
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
