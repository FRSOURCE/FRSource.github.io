// Generated into /sw.js by serviceWorker.mjs, which fills in the placeholders below.
const urlsToCache = [
    "https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js",
    "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
    "https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff",
    "/site.webmanifest",
    "/favicon.ico",
    "/favicon-96x96.png",
    "/robots.txt",
    "/humans.txt",
    "/",
    "/_astro/ThemeMenu.DdYj-x3_.css",
    "/_astro/contactDialog.CcFOwkJK.js",
    "/_astro/glitch.veil.PIUt0iYn.js",
    "/_astro/idle.Du679oLF.js",
    "/_astro/index.astro_astro_type_script_index_0_lang.Dg3W-qwx.js"
];
const CACHE_NAME = 'frsource-cache-df18690c2efe';

// pages that are controlled by this service worker
const PAGES_TO_CONTROL = ['/', '/index.html'];

// Listen for the install event, which fires when the service worker is being installed
self.addEventListener('install', (event) => {
    // wait with finishing of the installation until initial caching of statically provided file paths is done
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
});

// Activate is when the service worker actually takes over from the previous
// version, which is a good time to clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    // Remove any cache entry that not matches the current cache name
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key)),
            ),
        ),
    );
});

// Pass-through for requests this worker doesn't handle. A failed network request
// (offline, blocked by an extension, ...) is reported to the page as a regular network
// error instead of an uncaught rejection inside the worker.
const passThrough = (request) => fetch(request).catch(() => Response.error());

self.addEventListener('fetch', function (event) {
    event.respondWith(
        (async () => {
            if (
                event.request.method !== 'GET' ||
                !['http:', 'https:'].includes(
                    new URL(event.request.url).protocol,
                )
            )
                return passThrough(event.request);
            if (!event.clientId) return passThrough(event.request);

            const client = await self.clients.get(event.clientId);
            if (!client) return passThrough(event.request);

            // don't intercept calls coming outside of your scope
            const clientURL = new URL(client.url);
            if (!PAGES_TO_CONTROL.includes(clientURL.pathname))
                return passThrough(event.request);

            const cachedResponse = await caches
                .match(event.request)
                .catch(() => void 0);

            if (cachedResponse) return cachedResponse;

            const fetchedResponse = await fetch(event.request).catch(
                () => void 0,
            );

            if (!fetchedResponse) {
                console.log('Failed to fetch:', event);
                return new Response();
            }

            try {
                const cache = await caches.open(CACHE_NAME);
                // We have to clone the response as response streams can only be read once
                // This way we can put one copy in the cache and return the other to the browser
                cache.put(event.request, fetchedResponse.clone());
            } catch (e) {
                console.log('Failed to store response in cache', event, e);
            }
            return fetchedResponse;
        })(),
    );
});
