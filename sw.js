// 新しい版があればネットから取り、オフラインのときだけキャッシュを使う。
// GitHub Pages はファイルを10分ほどブラウザに保存させるので、毎回サーバーに「変わった？」と確認しにいく（cache:'no-cache'）
const VERSION = 'marblebeat-v18';
const FILES = ['./','index.html','units.js','story1.js','story2.js','engine.js','battle.js','cosmic.js','manifest.json',
  'icon-180.png','icon-192.png','icon-512.png','icon-512-maskable.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(FILES.map(f => new Request(f, {cache:'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;
  const req = sameOrigin ? new Request(e.request, {cache:'no-cache'}) : e.request;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html')))
  );
});
