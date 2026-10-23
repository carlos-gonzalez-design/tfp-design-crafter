// Mantiene una caché versionada del shell y sirve recursos locales desde caché cuando no hay red.
const CACHE_NAME = 'design-crafter-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/apple-touch-icon.png']

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  // Elimina versiones antiguas de esta aplicación antes de tomar el control de las pestañas abiertas.
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('design-crafter-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // Guarda la última página principal válida para que las rutas de la SPA abran sin conexión.
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response.ok) event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put('/index.html', response.clone())))
        return response
      } catch {
        return caches.match('/index.html')
      }
    })())
    return
  }

  // Para assets, prioriza la copia local y almacena en caché las respuestas de red satisfactorias.
  event.respondWith((async () => {
    const cached = await caches.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response.ok) event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone())))
    return response
  })())
})
