// Define the name of our cache and content to be cached.
var CACHE = 'game-cache-v7';
var CONTENT_TO_CACHE = [
  './', // This is always needed
  './index.html',
  './template.html',
  './template_offline.html',
  './game.css',
  './site.js',
  './game.js',
  './sw.js',
  './cross.png',
  './tick.png'];

// To install the service worker, we add all content to the cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log("Adding content to cache...");
      return cache.addAll(CONTENT_TO_CACHE);
    })
  );
});

// Once the service worker is activated, we examine previous caches and delete and which are not current.
self.addEventListener('activate', event => {
  console.log("Activated service worker. Checking cache is up-to-date...");
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if ([CACHE].indexOf(key) === -1) {
          console.log("Deleting old cache: " + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Define behaviour upon receive of a network request by the service worker.
self.addEventListener('fetch', event => {

  // If the request was for template content, try the network first.
  // If the server cannot be reached, fall back to a different template file from the cache.
  if (event.request.url.includes("template.html")) {
    event.respondWith(
      fetch(event.request).then(function() {
        console.log("Retrieving online template from server: " + event.request.url);
        return caches.match(event.request);
      }).catch(function() {
        console.log("Retrieving offline template from cache: " + event.request.url);
        return caches.match('template_offline.html');
      })
    );
  }

  else {

  // For everything else, try the cache first then fall back to the network.
    event.respondWith(
      caches.match(event.request).then(response => {
          if (response) {
            console.log("Retrieving resource from cache: " + event.request.url);
            return response;
          }
          console.log("Retrieving resource from server: " + event.request.url);
          return fetch(event.request);
        }
      )
    );

  }
});
