self.addEventListener('install', function(event){
   console.log('[Service worker] Installing Service Worker', event)
   event.waitUntil(
      caches.open('static')
         .then(function(cache){
            console.log('[Service worker] Precaching App Shell')
            cache.addAll([
               '/',
               '/index.html',
               '/src/js/app.js',
               '/src/js/feed.js',
               '/src/js/material.min.js',
               '/src/css/app.css',
               '/src/css/feed.css',
               '/src/images/main-image.jpg',
               'https://fonts.googleapis.com/icon?family=Material+Icons',
               'https://fonts.googleapis.com/css?family=Roboto:400,700',
               'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
            ])
         })
   )
})
self.addEventListener('activate', function(event){
   console.log('[Service worker] Activating Service Worker', event)
   event.waitUntil(
      caches.keys()
         .then(function(keyList){
            return Promise.all(keyList.map(function(key){
               if(key !== 'static-v2' && key !== 'dynamic'){
                  console.log('[Service worker] Removing old cache')
                  return caches.delete(key)
               }
            }))
         })
   )
   return self.clients.claim()
})
self.addEventListener('fetch', function(event){
   console.log(event.request)
   event.respondWith(
      caches.match(event.request)
         .then(function(response){
            if(response){
               return response 
            }else{
               return fetch(event.request)
                  .then(function(res){
                     return caches.open('dynamic')
                        .then(function(cache){
                           cache.put(event.request.url, res.clone())
                           return res
                        })
                  })
                  .catch(function(err){})
            }
         })
   )
})