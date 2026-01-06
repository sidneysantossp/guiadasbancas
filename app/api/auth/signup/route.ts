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

    // 2. Aguardar um pouco para o trigger do banco criar o perfil
    // O trigger on_auth_user_created cria automaticamente o user_profiles
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Atualizar perfil (o trigger já deve ter criado, então usamos update)
    console.log('👤 [SIGNUP] Atualizando perfil...');
    
    // Primeiro, verificar se o perfil já existe
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingProfile) {
      // Perfil existe (criado pelo trigger), apenas atualizar
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({
          role: role,
          full_name: full_name,
          email_verified: true,
          active: true,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [SIGNUP] Erro ao atualizar perfil:', updateError);
      } else {
        console.log('✅ [SIGNUP] Perfil atualizado');
      }
    } else {
      // Perfil não existe (trigger falhou ou não existe), criar
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: userId,
          role: role,
          full_name: full_name,
          email_verified: true,
          active: true,
        });

      if (insertError) {
        // Se falhar por duplicata, tentar update
        if (insertError.code === '23505') {
          console.log('⚠️ [SIGNUP] Perfil já existe (race condition), atualizando...');
          await supabaseAdmin
            .from('user_profiles')
            .update({
              role: role,
              full_name: full_name,
              email_verified: true,
              active: true,
            })
            .eq('id', userId);
        } else {
          console.error('❌ [SIGNUP] Erro ao criar perfil:', insertError);
        }
      } else {
        console.log('✅ [SIGNUP] Perfil criado');
      }
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
