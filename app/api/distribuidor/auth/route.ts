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

    const emailLower = email.toLowerCase().trim();
    let distribuidor = null;

    // 1. Tentar buscar pelo email (se o campo existir)
    const { data: distByEmail } = await supabaseAdmin
      .from('distribuidores')
      .select('*')
      .eq('email', emailLower)
      .eq('ativo', true)
      .maybeSingle();

    if (distByEmail) {
      distribuidor = distByEmail;
    }

    // 2. Se não encontrou por email, tentar pelo nome (case insensitive)
    if (!distribuidor) {
      const { data: distByName } = await supabaseAdmin
        .from('distribuidores')
        .select('*')
        .ilike('nome', `%${emailLower.split('@')[0]}%`)
        .eq('ativo', true)
        .limit(1)
        .maybeSingle();

      if (distByName) {
        distribuidor = distByName;
      }
    }

    // 3. Buscar todos os distribuidores ativos para matching parcial
    if (!distribuidor) {
      const { data: allDist } = await supabaseAdmin
        .from('distribuidores')
        .select('*')
        .eq('ativo', true);

      if (allDist) {
        // Tentar encontrar pelo nome parcial
        const searchTerm = emailLower.split('@')[0].toLowerCase();
        distribuidor = allDist.find((d: any) => 
          d.nome?.toLowerCase().includes(searchTerm) ||
          d.nome?.toLowerCase().replace(/\s+/g, '').includes(searchTerm.replace(/\s+/g, ''))
        );
      }
    }

    if (!distribuidor) {
      console.log('[Auth] Distribuidor não encontrado para:', emailLower);
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

    // Retornar dados do distribuidor (sem a senha e tokens sensíveis)
    const { senha, password: pwd, application_token, company_token, ...distribuidorSeguro } = distribuidor;

    // Garantir que o email está presente no objeto retornado
    const distribuidorComEmail = {
      ...distribuidorSeguro,
      email: distribuidor.email || emailLower, // Usar o email do banco ou o email usado no login
    };

    console.log('[Auth] Login bem-sucedido para distribuidor:', distribuidorComEmail.nome, '- Email:', distribuidorComEmail.email);

    return NextResponse.json({
      success: true,
      distribuidor: distribuidorComEmail,
    });
  } catch (error: any) {
    console.error('Erro na autenticação do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET para listar distribuidores disponíveis (debug)
export async function GET() {
  try {
    const { data: distribuidores } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, email, ativo')
      .eq('ativo', true);

    return NextResponse.json({
      success: true,
      distribuidores: distribuidores?.map((d: any) => ({
        id: d.id,
        nome: d.nome,
        email: d.email || 'Sem email cadastrado',
        ativo: d.ativo,
      })) || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
