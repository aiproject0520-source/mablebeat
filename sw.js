// 新しい版があればネットから取り、オフラインのときだけキャッシュを使う
const VERSION = 'marblebeat-v15';
const FILES = ['./','index.html','units.js','story1.js','story2.js','engine.js','battle.js','cosmic.js','manifest.json',
  'icon-180.png','icon-192.png','icon-512.png','icon-512-maskable.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html')))
  );
});
