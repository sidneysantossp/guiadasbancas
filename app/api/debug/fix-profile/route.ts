import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Primeiro, buscar o user_id correto na tabela bancas
    const { data: bancas, error: bancaError } = await supabase
      .from('bancas')
      .select('user_id, name, email')
      .eq('name', 'SIDNEY SANTOS')
      .order('created_at', { ascending: false })
      .limit(1);

    if (bancaError || !bancas || bancas.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Banca não encontrada',
        details: bancaError?.message || 'Nenhuma banca encontrada com nome SIDNEY SANTOS'
      });
    }

    const userId = bancas[0].user_id;
    
    // Primeiro, verificar se o perfil existe (sem .single() para ver todos)
    const { data: allProfiles, error: checkError } = await supabase
      .from('user_profiles')
      .select('id, phone, cpf, full_name')
      .eq('id', userId);

    if (checkError) {
      logger.error('Erro ao verificar perfil no debug fix-profile:', checkError);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro na consulta',
        details: checkError.message
      });
    }

    if (!allProfiles || allProfiles.length === 0) {
      // Perfil não existe, vamos verificar se existe na tabela users (auth)
      const { data: allUsers } = await supabase.auth.admin.listUsers();
      const user = allUsers.users?.find(u => u.id === userId);
      
      if (user) {
        // Usuário existe no auth mas não tem perfil, vamos criar
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            full_name: 'SIDNEY SANTOS',
            phone: '(11) 99999-9999',
            cpf: '000.000.000-00',
            role: 'jornaleiro'
          })
          .select()
          .single();

        if (createError) {
          return NextResponse.json({ 
            success: false, 
            error: 'Erro ao criar perfil',
            details: createError.message
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Perfil criado com sucesso',
          action: 'created',
          profile: newProfile
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Usuário não encontrado no sistema de autenticação',
          userId: userId
        });
      }
    }

    const existingProfile = allProfiles[0];

    // Atualizar o perfil com os dados
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        phone: '(11) 99999-9999',
        cpf: '000.000.000-00'
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      logger.error('Erro ao atualizar perfil no debug fix-profile:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao atualizar perfil',
        details: updateError.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      before: existingProfile,
      after: updatedProfile
    });

  } catch (error) {
    logger.error('Erro geral no debug fix-profile:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
