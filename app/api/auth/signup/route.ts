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

    // 1. Tentar criar usuário no Supabase Auth
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

    let userId: string;

    if (authError) {
      // Verificar se é erro de usuário já existente
      const isAlreadyExists = 
        authError.message?.includes('already been registered') ||
        authError.message?.includes('already exists') ||
        (authError as any).code === 'user_already_exists';
      
      if (isAlreadyExists && role === 'jornaleiro') {
        // Usuário comum querendo virar jornaleiro - isso é permitido!
        // Não criamos novo usuário, apenas retornamos sucesso
        // O fluxo do wizard vai tentar fazer signIn depois
        console.log('ℹ️ [SIGNUP] Usuário já existe - permitindo fluxo de conversão para jornaleiro');
        
        // Buscar o ID do usuário existente
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
        const existingUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          userId = existingUser.id;
          console.log('✅ [SIGNUP] Usuário existente encontrado:', userId);
        } else {
          // Não encontrou - retornar erro genérico
          console.error('❌ [SIGNUP] Usuário existe mas não foi encontrado na listagem');
          return NextResponse.json(
            { error: 'Erro ao localizar conta existente. Tente fazer login.' },
            { status: 400 }
          );
        }
      } else {
        console.error('❌ [SIGNUP] Erro ao criar usuário:', authError);
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        );
      }
    } else if (!authData.user) {
      console.error('❌ [SIGNUP] Auth OK mas sem user');
      return NextResponse.json(
        { error: 'Falha ao criar usuário' },
        { status: 500 }
      );
    } else {
      userId = authData.user.id;
      console.log('✅ [SIGNUP] Usuário criado:', userId);
    }

    // 2. Criar ou atualizar perfil
    console.log('👤 [SIGNUP] Criando/atualizando perfil...');
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: userId,
        role: role,
        full_name: full_name,
        email_verified: true,
        active: true,
      }, { onConflict: 'id' });

    if (profileError) {
      console.error('❌ [SIGNUP] Erro ao criar/atualizar perfil:', profileError);
    } else {
      console.log('✅ [SIGNUP] Perfil criado/atualizado');
    }

    console.log('🎉 [SIGNUP] Cadastro completo!');
    
    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: email,
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
