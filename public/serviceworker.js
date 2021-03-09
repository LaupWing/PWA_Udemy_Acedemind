self.addEventListener('install', function(event){
   console.log('[Service worker] Installing Service Worker', event)
   event.waitUntil(
      caches.open('static')
         .then(function(cache){
            console.log('[Service worker] Precaching App Shell')
            cache.add('/src/js/app.js')
         })
   )
})
self.addEventListener('activate', function(event){
   console.log('[Service worker] Activating Service Worker', event)
   return self.clients.claim()
})
self.addEventListener('fetch', function(event){
   event.respondWith(fetch(event.request))
})