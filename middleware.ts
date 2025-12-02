import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/jornaleiro')) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/jornaleiro/:path*'],
};
