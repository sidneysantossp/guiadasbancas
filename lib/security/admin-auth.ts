import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { readAuthenticatedUserClaims } from '@/lib/modules/auth/session';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { matchesAdminBearerToken } from '@/lib/policies/legacy-tokens';

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token || null;
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);
    if (claims?.role === 'admin') return true;
  } catch {
    // noop: fallback para bearer token
  }

  const token = extractBearerToken(request);
  return matchesAdminBearerToken(token);
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
