/*
  Basic Service Worker for Web Push Notifications
  - Handles 'push' events and shows notifications
  - Relays a message back to client pages so UI (e.g., a badge) can update
*/

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    try { payload = { title: 'Nova notificação', body: event.data && event.data.text ? event.data.text() : '' }; } catch {}
  }

  const title = payload.title || 'Guia das Bancas';
  const options = {
    body: payload.body || 'Você tem uma nova notificação.',
    icon: payload.icon || '/icons/icon-192.png',
    badge: payload.badge || '/icons/icon-72.png',
    data: payload.data || {},
  };

  event.waitUntil((async () => {
    await self.registration.showNotification(title, options);
    // Inform pages that a push was received (for UI counters)
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach((c) => c.postMessage({ type: 'PUSH_RECEIVED', payload }));
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window' });
    for (const client of allClients) {
      if ('focus' in client) {
        client.postMessage({ type: 'NOTIFICATION_CLICKED', url });
        client.focus();
        return;
      }
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(url);
    }
  })());
});
