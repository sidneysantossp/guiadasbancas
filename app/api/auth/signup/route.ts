import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  isValidBrazilianDocument,
  normalizeBrazilianDocument,
} from '@/lib/documents';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role, cpf, phone, banca_data } = body;
    const normalizedDocument = normalizeBrazilianDocument(cpf || '');

    console.log('📝 [SIGNUP] Iniciando cadastro:', { email, role, full_name, cpf: cpf ? '***' : null, phone });

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: email, password, full_name, role' },
        { status: 400 }
      );
    }

    if (normalizedDocument && !isValidBrazilianDocument(normalizedDocument)) {
      return NextResponse.json(
        { error: 'CPF/CNPJ inválido' },
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

      if (isAlreadyExists) {
        const errorMessage =
          role === 'jornaleiro'
            ? 'Este e-mail já está cadastrado. Faça login com a senha existente para continuar o cadastro da banca.'
            : 'Este e-mail já está cadastrado. Faça login para continuar.';

        console.log('ℹ️ [SIGNUP] Conta já existente detectada:', email);

        return NextResponse.json(
          {
            error: errorMessage,
            code: 'user_already_exists',
            exists: true,
          },
          { status: 409 }
        );
      } else {
        console.error('❌ [SIGNUP] Erro ao criar usuário:', authError);
        return NextResponse.json(
          { error: authError.message, code: (authError as any)?.code || null },
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

    // Dados do perfil a salvar (incluindo CPF e phone)
    const profileData: any = {
      role: role,
      full_name: full_name,
      email: email,
      email_verified: true,
      active: true,
    };
    
    // Adicionar CPF e phone se fornecidos
    if (normalizedDocument) profileData.cpf = normalizedDocument;
    if (phone) profileData.phone = phone;

    console.log('👤 [SIGNUP] Dados do perfil a salvar:', { ...profileData, cpf: cpf ? '***' : null });

    if (existingProfile) {
      // Perfil existe (criado pelo trigger), apenas atualizar
      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('id', userId);

      if (updateError) {
        console.error('❌ [SIGNUP] Erro ao atualizar perfil:', updateError);
      } else {
        console.log('✅ [SIGNUP] Perfil atualizado com CPF e phone');
      }
    } else {
      // Perfil não existe (trigger falhou ou não existe), criar
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: userId,
          ...profileData,
        });

      if (insertError) {
        // Se falhar por duplicata, tentar update
        if (insertError.code === '23505') {
          console.log('⚠️ [SIGNUP] Perfil já existe (race condition), atualizando...');
          await supabaseAdmin
            .from('user_profiles')
            .update(profileData)
            .eq('id', userId);
        } else {
          console.error('❌ [SIGNUP] Erro ao criar perfil:', insertError);
        }
      } else {
        console.log('✅ [SIGNUP] Perfil criado com CPF e phone');
      }
    }

    // 4. Se banca_data foi fornecido, salvar na tabela jornaleiro_pending_banca
    // Isso permite que o onboarding recupere os dados sem usar localStorage
    if (banca_data && role === 'jornaleiro') {
      console.log('🏪 [SIGNUP] Salvando dados da banca pendente...');
      
      // Usar upsert para evitar duplicatas
      const { error: bancaPendingError } = await supabaseAdmin
        .from('jornaleiro_pending_banca')
        .upsert({
          user_id: userId,
          banca_data: banca_data,
          created_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (bancaPendingError) {
        // Se a tabela não existir, criar ela
        if (bancaPendingError.code === '42P01') {
          console.log('⚠️ [SIGNUP] Tabela jornaleiro_pending_banca não existe, criando...');
          // A tabela será criada via migration, por enquanto apenas logar
          console.log('⚠️ [SIGNUP] Dados da banca serão salvos no onboarding');
        } else {
          console.error('❌ [SIGNUP] Erro ao salvar banca pendente:', bancaPendingError);
        }
      } else {
        console.log('✅ [SIGNUP] Dados da banca pendente salvos no Supabase');
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
