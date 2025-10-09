import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role } = body;

    console.log('📝 [SIGNUP] Iniciando cadastro:', { email, role, full_name });

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: email, password, full_name, role' },
        { status: 400 }
      );
    }

    // 1. Criar usuário no Supabase Auth
    console.log('🔐 [SIGNUP] Criando usuário no Auth...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        full_name,
        role,
      },
    });

    if (authError) {
      console.error('❌ [SIGNUP] Erro ao criar usuário:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      console.error('❌ [SIGNUP] Auth OK mas sem user');
      return NextResponse.json(
        { error: 'Falha ao criar usuário' },
        { status: 500 }
      );
    }

    console.log('✅ [SIGNUP] Usuário criado:', authData.user.id);

    // 2. Criar perfil manualmente (caso o trigger não funcione)
    console.log('👤 [SIGNUP] Criando perfil...');
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        role: role,
        full_name: full_name,
        email_verified: true,
        active: true, // Ativar o perfil imediatamente
      });

    if (profileError) {
      // Se o perfil já existe (trigger funcionou), ignorar erro
      if (profileError.code !== '23505') { // duplicate key
        console.error('❌ [SIGNUP] Erro ao criar perfil:', profileError);
      } else {
        console.log('ℹ️ [SIGNUP] Perfil já existe (trigger criou)');
      }
    } else {
      console.log('✅ [SIGNUP] Perfil criado manualmente');
    }

    console.log('🎉 [SIGNUP] Cadastro completo!');
    
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });

  } catch (error: any) {
    console.error('Erro no signup:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
