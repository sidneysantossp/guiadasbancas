#!/usr/bin/env node

/* CLI to send a Web Push notif to all stored subscriptions.
   Usage:
     node scripts/push-send.js --title "Promoção" --message "Novas ofertas!" --url "/promocoes"
   Env:
     VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
*/

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const args = process.argv.slice(2);
function arg(name, def = '') {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}

const title = arg('title', 'Notificação de Teste');
const message = arg('message', 'Mensagem enviada pela CLI.');
const url = arg('url', '/');

const PUBLIC = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;

if (!PUBLIC || !PRIVATE) {
  console.error('Defina VAPID_PUBLIC_KEY/NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY no ambiente.');
  process.exit(1);
}

webpush.setVapidDetails('mailto:admin@guiadasbancas.com.br', PUBLIC, PRIVATE);

const filePath = path.join(process.cwd(), 'data', 'push-subs.json');
if (!fs.existsSync(filePath)) {
  console.error('Arquivo de subscriptions não encontrado:', filePath);
  process.exit(1);
}
const subs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

(async () => {
  const payload = JSON.stringify({ title, body: message, data: { url } });
  const results = await Promise.allSettled(
    subs.map((sub) => webpush.sendNotification(sub, payload))
  );
  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(JSON.stringify({ sent: ok, failed }, null, 2));
})();
