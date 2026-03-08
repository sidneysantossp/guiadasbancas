import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import {
  buildDistribuidorSessionCookie,
  buildDistribuidorSessionCookieClear,
  issueDistribuidorSessionToken,
} from '@/lib/security/distribuidor-session';
import { supabaseAdmin } from '@/lib/supabase';

const allowLegacyDefaultPassword =
  process.env.NODE_ENV !== 'production' &&
  process.env.ALLOW_LEGACY_DISTRIBUIDOR_PASSWORD === 'true';

function normalizeIdentifier(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
}

async function matchesPassword(inputPassword: string, storedPassword?: string | null) {
  if (!storedPassword) return false;
  if (storedPassword === inputPassword) return true;

  if (/^\$2[aby]\$\d+\$/.test(storedPassword)) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch {
      return false;
    }
  }

  return false;
}

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

    // 2. Fallback controlado: permitir login por nome exato normalizado para bases antigas sem email cadastrado
    if (!distribuidor) {
      const { data: allDist } = await supabaseAdmin
        .from('distribuidores')
        .select('*')
        .eq('ativo', true);

      if (allDist) {
        const searchTerm = normalizeIdentifier(emailLower.includes('@') ? emailLower.split('@')[0] : emailLower);
        distribuidor = allDist.find((d: any) => 
          normalizeIdentifier(d.email || '') === searchTerm ||
          normalizeIdentifier(d.nome || '') === searchTerm
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

    // Verificar senha
    const senhaValida =
      (await matchesPassword(password, distribuidor.senha)) ||
      (await matchesPassword(password, distribuidor.password)) ||
      (allowLegacyDefaultPassword && password === 'dist123');

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
    const session = issueDistribuidorSessionToken({
      id: distribuidorComEmail.id,
      email: distribuidorComEmail.email,
      nome: distribuidorComEmail.nome,
    });

    console.log('[Auth] Login bem-sucedido para distribuidor:', distribuidorComEmail.nome, '- Email:', distribuidorComEmail.email);

    const response = NextResponse.json(
      {
        success: true,
        distribuidor: distribuidorComEmail,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
    response.cookies.set(buildDistribuidorSessionCookie(session.token));

    return response;
  } catch (error: any) {
    console.error('Erro na autenticação do distribuidor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}

// GET para listar distribuidores disponíveis (debug)
export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }

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
