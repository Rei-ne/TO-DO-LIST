const VERSION = "v1";

const CACHE_NAME = `todo-app-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/main.css",
    "/main.js",
    "/manifest.json",
    "/icon.png"
];

// On install, cache the static resources
self.addEventListener("install", (e) => {
    e.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
    })()
    );
});

// delete old cache on activate
self.addEventListener("activate", (e) => {
    e.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name)
                    }
                })
            );
            await clients.claim()
        })()
    );
})

// on fetch, intercept server requests and respond with cached responses instead of going to network
self.addEventListener("fetch", (e) => {
    // as a single page app, direct app to always go to cached homepage
    if (e.request.mode === "navigate") {
        e.respondWith(caches.match("/"))
        return;
    }

    // For all other requests, go to the cache first, and then the network.
    e.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(e.request);
            if (cachedResponse) {
                // return if available
                return cachedResponse
            } else {
                // if resource isnt in the cache, return a 404
                return new Response(null, { status: 404 });
            }
        })()
    )
})