// ── VERSÃO DO APP ── bumpa aqui a cada deploy
const CACHE_NAME = 'juros-compostos-v1.0.1';
const APP_VERSION = '1.0.1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap'
];

// ================= INSTALAÇÃO =================
self.addEventListener("install", event => {
  console.log("Service Worker instalando...");

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cache aberto");
        return cache.addAll(ASSETS);
      })
  );

  // 🔥 Permite que a nova versão fique pronta imediatamente
  self.skipWaiting();
});

// ================= ATIVAÇÃO =================
self.addEventListener("activate", event => {
  console.log("Service Worker ativado");

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  // 🔥 Assume controle imediatamente
  return self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// ================= RECEBER COMANDO DO APP =================
self.addEventListener("message", event => {
  if (event.data && event.data.action === "skipWaiting") {
    console.log("Atualizando para nova versão...");
    self.skipWaiting();
  }
});
