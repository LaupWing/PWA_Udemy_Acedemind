const CACHE_STATIC_NAME = 'static-v3'
const CACHE_DYNAMIC_NAME = 'dynamic-v3'
const STATIC_ASSETS =[
   '/',
   '/index.html',
   '/offline.html',
   '/src/js/app.js',
   '/src/js/feed.js',
   '/src/js/material.min.js',
   '/src/css/app.css',
   '/src/css/feed.css',
   '/src/images/main-image.jpg',
]

self.addEventListener('install', function(event){
   console.log('[Service worker] Installing Service Worker', event)
   event.waitUntil(
      caches.open(CACHE_STATIC_NAME)
         .then(function(cache){
            console.log('[Service worker] Precaching App Shell')
            cache.addAll([
               '/',
               '/index.html',
               '/offline.html',
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
               if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
                  console.log('[Service worker] Removing old cache')
                  return caches.delete(key)
               }
            }))
         })
   )
   return self.clients.claim()
})

// Cache only
// self.addEventListener('fetch', function(event){
//    event.respondWith(
//       caches.match(event.request)
//    )
// })

// Network only
// self.addEventListener('fetch', function(event){
//    event.respondWith(
//       fetch(event.request)
//    )
// })

// Network with Cache fallback
// self.addEventListener('fetch', function(event){
//    event.respondWith(
//       fetch(event.request)
//          .catch(function(err){
//             return caches.match(event.request)
//          })
//    )
// })


self.addEventListener('fetch', function(event){
   if(event.request.url === 'https://httpbin.org/get'){
      event.respondWith(
         caches.open(CACHE_DYNAMIC_NAME)
            .then(function(cache){
               return fetch(event.request)
                  .then(res=>{
                     cache.put(event.request, res.clone())
                     return res
                  })
            })
      )
   }else if(new RegExp('\\b'+STATIC_ASSETS.join('\\b|\\b')+'\\b').test(event.request.url)){
      event.respondWith(
         fetch(event.request)
      )
   }else{
      event.respondWith(
         caches.match(event.request)
            .then(function(response){
               if(response){
                  return response 
               }else{
                  return fetch(event.request)
                     .then(function(res){
                        return caches.open(CACHE_DYNAMIC_NAME)
                           .then(function(cache){
                              cache.put(event.request.url, res.clone())
                              return res
                           })
                     })
                     .catch(function(err){
                        return caches.open(CACHE_STATIC_NAME)
                           .then(function(cache){
                              if(event.request.url.indexOf('/help')){
                                 return cache.match('/offline.html')
                              }
                           })
   
                     })
               }
            })
      )
   }
})

// self.addEventListener('fetch', function(event){
//    console.log(event.request)
//    event.respondWith(
//       caches.match(event.request)
//          .then(function(response){
//             if(response){
//                return response 
//             }else{
//                return fetch(event.request)
//                   .then(function(res){
//                      return caches.open(CACHE_DYNAMIC_NAME)
//                         .then(function(cache){
//                            cache.put(event.request.url, res.clone())
//                            return res
//                         })
//                   })
//                   .catch(function(err){
//                      return caches.open(CACHE_STATIC_NAME)
//                         .then(function(cache){
//                            return cache.match('/offline.html')
//                         })

//                   })
//             }
//          })
//    )
// })