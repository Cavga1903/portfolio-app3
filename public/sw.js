// Service Worker for Portfolio App
const CACHE_NAME = 'portfolio-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/logos/turkcell.webp',
  '/logos/siliconmade.webp',
  '/logos/concentrix.webp',
  '/logos/uopeople_logo.webp',
  '/logos/upwork.svg',
  '/logos/anadolu.svg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Favicon ve icon dosyalarını cache'leme - her zaman network'ten al
  if (url.pathname.includes('tabLogo') || url.pathname.includes('favicon') || url.pathname.includes('icon')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Network hatası durumunda fallback
        return caches.match(event.request);
      })
    );
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
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
