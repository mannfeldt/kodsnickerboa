// Fikakassen was renamed Fikakassan and moved to /fikakassan/app/.
//
// Browsers that opened the app at this old address still have its offline
// worker, which answers every request from its cache and would keep showing
// the old app. A worker script cannot be redirected, so this file stays here:
// when such a browser checks the old worker for updates it gets this one,
// which deletes the old cache, sends open tabs to the new address and
// removes itself. Lists and sales are not affected: they are stored in the
// site's IndexedDB, which the new address shares.
//
// Everything else under /fikakassen/ is redirected in /_redirects. Remove this
// file once nobody can still have the old worker (a few months is plenty).
const NEW_HOME = '/fikakassan/app/';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith('fikakassen-')).map((key) => caches.delete(key)));
      await self.clients.claim();
      const tabs = await self.clients.matchAll({ type: 'window' });
      await Promise.all(tabs.map((tab) => tab.navigate(NEW_HOME).catch(() => {})));
      await self.registration.unregister();
    })(),
  );
});
