// Bayou Office Machines — Service Worker
// Handles push notifications and PWA caching

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { return; }

  const options = {
    body: data.body || '',
    icon: '/icon-512.png',
    badge: '/icon-512.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag || 'bom-notification',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Bayou Office Machines', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url === url || c.url.includes('/staff-portal'));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});
