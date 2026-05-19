const CACHE_NAME = 'html-code-to-file-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles/style.css',
  './scripts/script.js',
  './manifest.json',
  './assets/favicon/favicon.png'
];

// 安裝 Service Worker 並快取資產
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// 啟動 Service Worker 並清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求並從快取回應
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
