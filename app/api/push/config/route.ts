import { NextResponse } from 'next/server';

export async function GET() {
  // Aceita tanto NEXT_PUBLIC_VAPID_PUBLIC_KEY quanto VAPID_PUBLIC_KEY
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || '';
  if (!publicKey) {
    // Fallback TEMPORÁRIO para desenvolvimento
    // TODO: REMOVER em produção e configurar as envs corretamente
    const DEV_PUBLIC = 'BI6i7rMl9ZZWCEk1gCEQ1VGQr4XCona6m8-aSKaf1GV1aclA43_G_X5yTDi34yIkyfXuCaHsxc60DSJwOiTqlfw';
    return NextResponse.json({ ok: true, publicKey: DEV_PUBLIC });
  }
  return NextResponse.json({ ok: true, publicKey });
}
