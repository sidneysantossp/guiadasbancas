import { NextResponse } from 'next/server';
import { listSubscriptions } from '@/lib/pushStore';

// We import web-push dynamically so the app still runs if it's not installed in prod.
async function getWebPush() {
  try {
    const mod = await import('web-push');
    return mod.default || mod;
  } catch (e) {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const title = body?.title || 'Notificação de Teste';
  const message = body?.message || 'Mensagem enviada pelo endpoint /api/push/send.';
  const url = body?.url || '/';

  const subs = listSubscriptions();
  const webpush = await getWebPush();
  if (!webpush) {
    return NextResponse.json({ ok: false, error: 'Dependência web-push não instalada. Rode: npm i web-push -D' }, { status: 500 });
  }

  let PUBLIC = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  let PRIVATE = process.env.VAPID_PRIVATE_KEY;
  if (!PUBLIC || !PRIVATE) {
    // Fallback TEMPORÁRIO para desenvolvimento
    // TODO: REMOVER em produção e configurar as envs corretamente
    PUBLIC = 'BI6i7rMl9ZZWCEk1gCEQ1VGQr4XCona6m8-aSKaf1GV1aclA43_G_X5yTDi34yIkyfXuCaHsxc60DSJwOiTqlfw';
    PRIVATE = 'ULdiv_oPdQ1TALXrviRdftWqKvfmOamxQkAVJLD2AkA';
  }

  webpush.setVapidDetails('mailto:admin@guiadasbancas.com.br', PUBLIC, PRIVATE);

  const payload = JSON.stringify({ title, body: message, data: { url } });

  const results = await Promise.allSettled(
    subs.map((sub) => webpush.sendNotification(sub as any, payload))
  );

  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return NextResponse.json({ ok: true, sent: ok, failed });
}

export async function GET() {
  return NextResponse.json({ ok: true, info: 'Use POST com { title, message, url } para enviar.' });
}
