const CACHE_NAME = 'hello-world-pwa-cache';
const urlsToCache = [
    '/PWA-Sheets/',
    '/PWA-Sheets/index.html',
    '/PWA-Sheets/styles.css',
    '/PWA-Sheets/app.js',
    '/PWA-Sheets/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
