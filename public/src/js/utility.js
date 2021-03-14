const dbPromise = idb.open('posts-store', 1, function(db){
   if(!db.objectStoreNames.contains('posts')){
      db.createObjectStore('posts', {keyPath: 'id'}) // search for given id
   }
})

function writeData(storeName, data){
   return dbPromise.then(db=>{
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      store.put(data)
   }) 
}

function readAllData(storeName){
   return dbPromise
      .then(function(db){
         const tx = db.transaction(storeName, 'readonly')
         const store = tx.objectStore(storeName)
         return store.getAll()
      })
}