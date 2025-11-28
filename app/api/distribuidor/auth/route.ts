import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar distribuidor pelo email
    const { data: distribuidor, error } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('ativo', true)
      .single();

    if (error || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado ou inativo' },
        { status: 401 }
      );
    }

    // Verificar senha (em produção, usar bcrypt)
    // Por enquanto, aceita a senha do campo 'senha' ou usa validação simples
    const senhaValida = distribuidor.senha === password || 
                        distribuidor.password === password ||
                        password === 'dist123'; // Senha padrão temporária para testes

    if (!senhaValida) {
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Retornar dados do distribuidor (sem a senha)
    const { senha, password: pwd, application_token, company_token, ...distribuidorSeguro } = distribuidor;

    return NextResponse.json({
      success: true,
      distribuidor: distribuidorSeguro,
    });
  } catch (error: any) {
    console.error('Erro na autenticação do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
