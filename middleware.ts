import { NextRequest, NextResponse } from 'next/server';
const PROD_BLOCKED_PREFIXES = ['/api/debug/', '/api/test/', '/debug/'];
const PROD_BLOCKED_EXACT = new Set([
  '/api/admin/test-login',
  '/api/admin/test-reset',
  '/api/admin/test-codigo-mercos',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProduction = process.env.NODE_ENV === 'production';
  if (
    isProduction &&
    (PROD_BLOCKED_EXACT.has(pathname) || PROD_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
  ) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
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
