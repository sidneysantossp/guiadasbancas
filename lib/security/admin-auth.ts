import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const LEGACY_ADMIN_TOKEN = 'admin-token';

function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token || null;
}

function adminApiTokensFromEnv(): Set<string> {
  const raw = [
    process.env.ADMIN_API_TOKEN,
    process.env.INTERNAL_ADMIN_API_TOKEN,
    process.env.ADMIN_BEARER_TOKEN,
  ].filter(Boolean) as string[];

  return new Set(raw.map((token) => token.trim()).filter(Boolean));
}

function isLegacyAdminTokenAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_LEGACY_ADMIN_TOKEN === 'true';
}

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export async function isAdminAuthorized(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth();
    if ((session?.user as any)?.role === 'admin') return true;
  } catch {
    // noop: fallback para bearer token
  }

  const token = extractBearerToken(request);
  if (!token) return false;

  const configuredTokens = adminApiTokensFromEnv();
  if (configuredTokens.has(token)) return true;

  return token === LEGACY_ADMIN_TOKEN && isLegacyAdminTokenAllowed();
}

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const authorized = await isAdminAuthorized(request);
  if (authorized) return null;

  return NextResponse.json(
    { success: false, error: 'Não autorizado' },
    { status: 401 }
  );
}
