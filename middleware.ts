import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LEGACY_ADMIN_TOKEN = 'admin-token';
const PROD_BLOCKED_PREFIXES = ['/api/debug/', '/api/test/', '/debug/'];
const PROD_BLOCKED_EXACT = new Set([
  '/api/admin/test-login',
  '/api/admin/test-reset',
  '/api/admin/test-codigo-mercos',
]);

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

async function hasAdminSession(request: NextRequest): Promise<boolean> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return (token as any)?.role === 'admin';
}

function isLegacyAdminTokenAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_LEGACY_ADMIN_TOKEN === 'true';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProduction = process.env.NODE_ENV === 'production';
  if (
    isProduction &&
    (PROD_BLOCKED_EXACT.has(pathname) || PROD_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
  ) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  if (pathname.startsWith('/api/admin')) {
    const sessionAllowed = await hasAdminSession(request).catch(() => false);
    if (!sessionAllowed) {
      const bearerToken = extractBearerToken(request);
      const configuredAdminTokens = adminApiTokensFromEnv();
      const hasConfiguredToken = !!bearerToken && configuredAdminTokens.has(bearerToken);
      const hasLegacyToken = bearerToken === LEGACY_ADMIN_TOKEN && isLegacyAdminTokenAllowed();

      if (!hasConfiguredToken && !hasLegacyToken) {
        return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
      }
    }
  }

  if (pathname.startsWith('/jornaleiro')) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/jornaleiro/:path*',
    '/api/admin/:path*',
    '/api/debug/:path*',
    '/api/test/:path*',
    '/debug/:path*',
  ],
};
