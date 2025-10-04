self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e){}
  const title = data.title || '日程通知';
  const body  = data.body  || '詳細を開いて確認してください。';
  const url   = data.url   || '/';
  const tag   = data.tag   || 'sched';

  event.waitUntil(self.registration.showNotification(title, {
    body, tag, data: { url },
    icon: './icon-192.png', badge: './icon-72.png'
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
