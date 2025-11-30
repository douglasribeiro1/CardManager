const CACHE_NAME = 'gestor-idb-v3'; // Mudei de v2 para v3 para forçar atualização
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon.svg',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap'
];

// Instalação: Baixa os arquivos novos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força o SW novo a assumir imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa caches antigos (v1, v2...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Removendo cache antigo:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim(); // Controla a página imediatamente
});

// Interceptação
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});