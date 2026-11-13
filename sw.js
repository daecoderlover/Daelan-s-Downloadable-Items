const CACHE_NAME = "v1.3.3 (Hotfix)";
const OFFLINE_CACHE = "daelan-offline-locals-v1";
const CORE_ASSETS = [
  "./",
  "./#",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./gem192.png"
];

// Install: cache core page assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old outdated caches (while keeping OFFLINE_CACHE safe) and broadcast the new version
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== OFFLINE_CACHE)
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

// Message: handle version requests, "+ Add to Locals", and "Remove" from script.js
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "GET_VERSION") {
    event.source.postMessage({
      type: "VERSION_UPDATE",
      version: CACHE_NAME
    });
  }

  if (event.data.type === "SAVE_LOCAL_ITEM") {
    caches.open(OFFLINE_CACHE).then((cache) => {
      return cache.addAll(event.data.urls);
    }).then(() => {
      event.source.postMessage({
        type: "LOCAL_ITEM_SAVED",
        id: event.data.id
      });
    }).catch((err) => {
      console.error("Failed to cache item locally:", err);
    });
  }

  if (event.data.type === "REMOVE_LOCAL_ITEM") {
    caches.open(OFFLINE_CACHE).then((cache) => {
      return Promise.all(event.data.urls.map(url => cache.delete(url)));
    });
  }
});

// Fetch: serve saved Local files offline, otherwise network first with core fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(OFFLINE_CACHE).then((offlineCache) => {
      return offlineCache.match(event.request).then((cachedLocalFile) => {
        if (cachedLocalFile) {
          return cachedLocalFile;
        }
        return fetch(event.request).catch(() => caches.match(event.request));
      });
    })
  );
});
