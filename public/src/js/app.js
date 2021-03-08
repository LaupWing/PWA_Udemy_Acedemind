
let deferredPrompt

if('serviceWorker' in navigator){
   navigator.serviceWorker
      .register('/serviceworker.js')
      .then(function(){
         console.log('Service worker registered')
      })
}  

window.addEventListener('beforeinstallprompt', function(event){
   console.log('beforeinstallprompt fired')
   event.preventDefault()
   deferredPrompt = event
   return false
})

const promise = new Promise(function(resolve, reject){
   setTimeout(()=>{
      resolve('Promise is done')
   },3000)
   
})

promise.then(function(data){
   console.log(data)
})