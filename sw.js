// ── VERSÃO DO APP ── bumpa aqui a cada deploy
const CACHE_NAME = 'juros-compostos-v1.0.2';
const APP_VERSION = '1.0.2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ================= INSTALAÇÃO =================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// ================= ATIVAÇÃO =================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  return self.clients.claim();
});

// ================= FETCH =================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// ================= RECEBER COMANDO DO APP =================
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data && event.data.tipo === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: APP_VERSION, cache: CACHE_NAME });
  }
});
