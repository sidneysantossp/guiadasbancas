import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Pegar o token do header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token não encontrado no header'
      });
    }

    const token = authHeader.substring(7);
    
    // Verificar qual usuário está autenticado
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token inválido ou usuário não encontrado',
        details: error?.message
      });
    }

    console.log('🔍 Usuário atual:', user.id);

    // Buscar perfil do usuário atual
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Buscar banca do usuário atual
    const { data: banca, error: bancaError } = await supabase
      .from('bancas')
      .select('id, name, user_id')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      currentUser: {
        id: user.id,
        email: user.email
      },
      profile: profile || null,
      profileError: profileError?.message || null,
      banca: banca || null,
      bancaError: bancaError?.message || null
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
