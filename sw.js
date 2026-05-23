// ── VERSÃO DO APP ── bumpa aqui a cada deploy
const CACHE = 'juros-v1';
const APP_VERSION = '1.0.0';

const ASSETS = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap'
];

// INSTALL: cacheia assets, mas NÃO faz skipWaiting automático
// (quem decide quando assumir é o usuário, via banner)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  // Não chama skipWaiting() aqui — o SW fica em "waiting"
});

// ACTIVATE: limpa caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH: cache-first
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    })).catch(() => caches.match('./index.html'))
  );
});

// MENSAGEM: recebe sinal do app para assumir o controle agora
self.addEventListener('message', e => {
  if (e.data?.tipo === 'PULAR_ESPERA') {
    self.skipWaiting();
  }
  // Responde com a versão atual quando solicitado
  if (e.data?.tipo === 'GET_VERSION') {
    e.ports[0]?.postMessage({ version: APP_VERSION, cache: CACHE });
  }
});
