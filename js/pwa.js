(() => {
  if (!('serviceWorker' in navigator)) return;

  const SW_URL = './sw.js?v=20261005-3';
  const CLEAN_KEY = 'tgm-sw-clean-20261005-3';

  window.addEventListener('load', () => {
    const cleanLegacy = async () => {
      if (localStorage.getItem(CLEAN_KEY) === '1') return;
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations
          .filter(reg => reg.scope === new URL('./', location.href).href)
          .map(reg => reg.unregister()));
        const keys = await caches.keys();
        await Promise.all(keys
          .filter(key => /^tgm-shell-v1$/.test(key))
          .map(key => caches.delete(key)));
      } catch (error) {
        console.warn('PWA legacy-cache cleanup failed:', error);
      } finally {
        localStorage.setItem(CLEAN_KEY, '1');
      }
    };

    cleanLegacy()
      .catch(() => {})
      .then(() => navigator.serviceWorker.register(SW_URL, { scope: './', updateViaCache: 'none' }))
      .catch((error) => {
        console.warn('PWA service worker registration failed:', error);
      });
  });
})();