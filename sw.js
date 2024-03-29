const VERSION = "v1";

const CACHE_NAME = `todo-app-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/main.css",
    "/main.js",
    "/icon.png",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })()
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
            await clients.claim();
        })()
    );
});
// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
        e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )) {
        return;
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});

// // On fetch, intercept server requests
// // and respond with cached responses instead of going to network
// self.addEventListener("fetch", (event) => {
//     // As a single page app, direct app to always go to cached home page.
//     if (event.request.mode === "navigate") {
//         event.respondWith(caches.match("/"));
//         return;
//     }

//     // For all other requests, go to the cache first, and then the network.
//     event.respondWith(
//         (async () => {
//             const cache = await caches.open(CACHE_NAME);
//             const cachedResponse = await cache.match(event.request);
//             if (cachedResponse) {
//                 // Return the cached response if it's available.
//                 return cachedResponse;
//             } else {
//                 // If resource isn't in the cache, return a 404.
//                 return new Response(null, { status: 404 });
//             }
//         })()
//     );
// });