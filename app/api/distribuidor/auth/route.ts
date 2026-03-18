import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import logger from '@/lib/logger';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import {
  findActiveDistribuidorForLogin,
  sanitizeDistribuidorSessionData,
} from '@/lib/modules/distribuidor/session';
import {
  buildDistribuidorSessionCookie,
  buildDistribuidorSessionCookieClear,
  hasDistribuidorSessionSecret,
  issueDistribuidorSessionToken,
} from '@/lib/security/distribuidor-session';
import { supabaseAdmin } from '@/lib/supabase';

const allowLegacyDefaultPassword =
  process.env.NODE_ENV !== 'production' &&
  process.env.ALLOW_LEGACY_DISTRIBUIDOR_PASSWORD !== 'false';

const allowLegacyIdentifierLogin =
  process.env.ALLOW_LEGACY_DISTRIBUIDOR_IDENTIFIER_LOGIN !== 'false';

export const dynamic = "force-dynamic";
export const revalidate = 0;

function jsonNoStore(body: Record<string, any>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: buildNoStoreHeaders({ isPrivate: true }),
  });
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
      return jsonNoStore(
        { success: false, error: 'Sessão do distribuidor indisponível' },
        500
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonNoStore(
        { success: false, error: 'Identificador e senha são obrigatórios' },
        400
      );
    }

    const emailLower = email.toLowerCase().trim();
    const distribuidor = await findActiveDistribuidorForLogin(emailLower, {
      allowLegacyIdentifierLogin,
    });

    if (!distribuidor) {
      return jsonNoStore(
        { success: false, error: 'Distribuidor não encontrado ou inativo' },
        401
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
      return jsonNoStore(
        { success: false, error: 'Senha incorreta' },
        401
      );
    }

    const fieldsToUpgrade = [
      ...(senhaMatch.shouldUpgrade ? ['senha'] : []),
      ...(passwordMatch.shouldUpgrade ? ['password'] : []),
    ];

    if (fieldsToUpgrade.length > 0) {
      await hashDistribuidorPasswordIfNeeded(distribuidor.id, password, fieldsToUpgrade);
    }

    const distribuidorComEmail = sanitizeDistribuidorSessionData(distribuidor, emailLower);
    const session = issueDistribuidorSessionToken({
      id: distribuidorComEmail.id,
      email: distribuidorComEmail.email,
      nome: distribuidorComEmail.nome,
    });

    const response = jsonNoStore(
      {
        success: true,
        distribuidor: distribuidorComEmail,
      }
    );
    response.cookies.set(buildDistribuidorSessionCookie(session.token));

    return response;
  } catch (error: any) {
    logger.error('Erro na autenticação do distribuidor:', error);
    return jsonNoStore(
      { success: false, error: 'Erro interno do servidor' },
      500
    );
  }
}

export async function DELETE() {
  const response = jsonNoStore({ success: true });
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}

export async function GET() {
  return jsonNoStore(
    { success: false, error: 'Método não permitido' },
    405
  );
}
