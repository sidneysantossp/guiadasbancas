import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import {
  buildDistribuidorSessionCookie,
  buildDistribuidorSessionCookieClear,
  hasDistribuidorSessionSecret,
  issueDistribuidorSessionToken,
} from '@/lib/security/distribuidor-session';
import { supabaseAdmin } from '@/lib/supabase';

const allowLegacyDefaultPassword =
  process.env.NODE_ENV !== 'production' &&
  process.env.ALLOW_LEGACY_DISTRIBUIDOR_PASSWORD === 'true';

const allowLegacyIdentifierLogin =
  process.env.NODE_ENV !== 'production' &&
  process.env.ALLOW_LEGACY_DISTRIBUIDOR_IDENTIFIER_LOGIN === 'true';

function normalizeIdentifier(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
}

async function verifyStoredPassword(inputPassword: string, storedPassword?: string | null) {
  if (!storedPassword) {
    return { matched: false, shouldUpgrade: false };
  }

  if (storedPassword === inputPassword) {
    return { matched: true, shouldUpgrade: true };
  }

  if (/^\$2[aby]\$\d+\$/.test(storedPassword)) {
    try {
      return {
        matched: await bcrypt.compare(inputPassword, storedPassword),
        shouldUpgrade: false,
      };
    } catch {
      return { matched: false, shouldUpgrade: false };
    }
  }

  return { matched: false, shouldUpgrade: false };
}

async function hashDistribuidorPasswordIfNeeded(distribuidorId: string, password: string, fieldsToUpgrade: string[]) {
  if (fieldsToUpgrade.length === 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const payload = fieldsToUpgrade.reduce<Record<string, string>>((acc, fieldName) => {
    acc[fieldName] = hashedPassword;
    return acc;
  }, {});

  await supabaseAdmin
    .from('distribuidores')
    .update(payload)
    .eq('id', distribuidorId);
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && !hasDistribuidorSessionSecret()) {
      return NextResponse.json(
        { success: false, error: 'Sessão do distribuidor indisponível' },
        { status: 500 }
      );
    }

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

    // 2. Fallback controlado apenas em desenvolvimento para bases antigas sem email confiável
    if (!distribuidor && allowLegacyIdentifierLogin) {
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
    const senhaMatch = await verifyStoredPassword(password, distribuidor.senha);
    const passwordMatch = await verifyStoredPassword(password, distribuidor.password);
    const senhaValida =
      senhaMatch.matched ||
      passwordMatch.matched ||
      (allowLegacyDefaultPassword && password === 'dist123');

    if (!senhaValida) {
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    const fieldsToUpgrade = [
      ...(senhaMatch.shouldUpgrade ? ['senha'] : []),
      ...(passwordMatch.shouldUpgrade ? ['password'] : []),
    ];

    if (fieldsToUpgrade.length > 0) {
      await hashDistribuidorPasswordIfNeeded(distribuidor.id, password, fieldsToUpgrade);
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

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Método não permitido' },
    { status: 405 }
  );
}
