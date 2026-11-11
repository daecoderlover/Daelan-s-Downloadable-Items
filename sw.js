const CACHE_NAME = "v1.2.2 (Hotfix)";
const CORE_ASSETS = [
  "./",
  "./#",
  "./index.html"
];

// Install: cache core page assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old outdated caches and broadcast the new version
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: "window" }))
    .then(clients => {
      // Loop through open app windows and send the new version tag
      clients.forEach(client => {
        client.postMessage({
          type: "VERSION_UPDATE",
          version: CACHE_NAME
        });
      });
    })
  );
});

// Fetch: network first, fall back to cached version
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
