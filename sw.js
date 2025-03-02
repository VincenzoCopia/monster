const CACHE_NAME = 'monster-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './static/style.css',
    './static/script.js',
    './static/favicon-32x32.png',
    './static/sfondo.webp',
    './manifest.json',
    './images/waiting.webp'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('🚀 Cache aperta con successo');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('❌ Errore apertura cache:', error);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    console.log('✅ Risorsa trovata in cache:', event.request.url);
                    return response;
                }

                // Clone the request because it's a stream and can only be consumed once
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            console.log('⚠️ Risposta non valida per:', event.request.url);
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                console.log('💾 Salvo in cache:', event.request.url);
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                ).catch(error => {
                    console.error('❌ Errore fetch:', error);
                    return caches.match('./images/waiting.webp');
                });
            })
    );
});
