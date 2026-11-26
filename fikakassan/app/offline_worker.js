// Offline support for Fikakassan on the web.
//
// On install the whole app is downloaded into the cache (the file list is
// written by tool/build_web.sh). After that every request is answered from
// the cache first, so the till starts instantly and keeps working with no
// or bad reception. A new deployment is picked up in the background and
// used from the next start.
const BUILD = '20261126194524'; // stamped by tool/build_web.sh
const CACHE = `fikakassan-${BUILD}`;

// The app shares its origin with other sites (kodsnickerboa.com hosts several
// apps), and caches belong to the origin, not to this worker's scope. Only
// caches with these prefixes are ours to delete; `fikakassen-` is the name
// the app had before it was renamed.
const OWN_CACHES = ['fikakassan-', 'fikakassen-'];
const SHELL = ['./', 'index.html', 'flutter_bootstrap.js', 'main.dart.js', 'manifest.json'];

async function filesToCache() {
  try {
    const response = await fetch('offline_files.json', { cache: 'no-store' });
    // A Set, because the cache refuses a list with the same file twice.
    if (response.ok) return [...new Set(SHELL.concat(await response.json()))];
  } catch (_) {
    // Not built with tool/build_web.sh – cache as the app is used instead.
  }
  return SHELL;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const files = await filesToCache();
      await cache.addAll(files.map((file) => new Request(file, { cache: 'reload' })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const old = keys.filter((key) => key !== CACHE && OWN_CACHES.some((prefix) => key.startsWith(prefix)));
      await Promise.all(old.map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request, { ignoreSearch: true });
      const fresh = fetch(request).then((response) => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      });

      if (cached) {
        // Answer at once; refresh the cached copy in the background.
        event.waitUntil(fresh.catch(() => {}));
        return cached;
      }
      try {
        return await fresh;
      } catch (error) {
        if (request.mode === 'navigate') {
          const shell = await cache.match('index.html');
          if (shell) return shell;
        }
        throw error;
      }
    })(),
  );
});
