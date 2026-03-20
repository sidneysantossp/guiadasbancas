import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readAuthenticatedUserClaims } from '@/lib/modules/auth/session';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);
    if (claims?.role === 'admin') return true;
  } catch {
    // noop: sessao invalida
  }
  void request;
  return false;
}

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const authorized = await isAdminAuthorized(request);
  if (authorized) return null;

  return NextResponse.json(
    { success: false, error: 'Não autorizado' },
    {
      status: 401,
      headers: buildNoStoreHeaders({ isPrivate: true, vary: 'Cookie, Authorization' }),
    }
  );
}
