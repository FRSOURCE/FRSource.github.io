/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="WebWorker" />

import { manifest as urlsToCache, version } from '@parcel/service-worker';

// pages that are controlled by this service worker
const PAGES_TO_CONTROL = ['/', '/index.html'];

const CACHE_NAME = 'frsource-cache-' + version;

const typedSelf = self as unknown as ServiceWorkerGlobalScope &
    typeof globalThis;

urlsToCache.unshift(
    'https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js',
    'https://fonts.googleapis.com/css2?family=Inconsolata&display=swap',
    'https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-96x96.png',
    '/robots.txt',
    '/humans.txt',
);

// Listen for the install event, which fires when the service worker is being installed
typedSelf.addEventListener('install', (event) => {
    // wait with finishing of the installation until initial caching of statically provided file paths is done
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
    );
});

// Activate is when the service worker actually takes over from the previous
// version, which is a good time to clean up old caches
typedSelf.addEventListener('activate', (event) => {
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

typedSelf.addEventListener('fetch', function (event) {
    event.respondWith(
        (async () => {
            if (
                event.request.method !== 'GET' ||
                !['http:', 'https:'].includes(
                    new URL(event.request.url).protocol,
                )
            )
                return fetch(event.request);
            if (!event.clientId) return fetch(event.request);

            const client = await typedSelf.clients.get(event.clientId);
            if (!client) return fetch(event.request);

            // don't intercept calls coming outside of your scope
            const clientURL = new URL(client.url);
            if (!PAGES_TO_CONTROL.includes(clientURL.pathname))
                return fetch(event.request);

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
