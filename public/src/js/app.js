console.log(navigator.serviceWorker)
console.log(navigator)

if('serviceWorker' in navigator){
   navigator.serviceWorker
      .register('/serviceworker.js')
      .then(function(){
         console.log('Service worker registered')
      })
}  