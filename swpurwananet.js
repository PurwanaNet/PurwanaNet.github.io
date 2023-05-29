// Service worker code
self.addEventListener('fetch', function(event) {

	console.log("sw requets:"+event.request.url);
  //event.respondWith(
    // Check if the request is already in the cache
	
	/*
    caches.match(event.request).then(function(response) {
      if (response) {
        // Return the cached response
        return response;
      } else {
        // Fetch the request and cache the response
        return fetch(event.request).then(function(fetchResponse) {
          // Clone the response since it can only be consumed once
          var responseClone = fetchResponse.clone();

          // Open a cache and put the cloned response in it
          caches.open('my-cache').then(function(cache) {
            //cache.put(event.request, responseClone);
          });

          // Return the original fetch response
          return fetchResponse;
        });
      }
    })*/
  //);
});