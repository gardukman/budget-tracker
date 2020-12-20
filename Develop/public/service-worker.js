const APP_PREFIX = 'BudgetTracker-'
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/idb.js',
    './js/index.js'
 ];
 
 // this is the event listener that recognizes a fetch
 self.addEventListener('fetch', function(event) {
    
    //this checks the fetch request.
    event.respondWith(caches.match(event.request).then(function (req) {
       return req || fetch(event.req);
    }));
 });
 
 // this adds the new cache to save
 self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
       console.log('installing cache : ' + CACHE_NAME);
       return cache.addAll(FILES_TO_CACHE);
    }));
 });
 
 // this removes the previous caches
 self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (keyList) {
       let cacheKeepList = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX);
       });
 
       cacheKeepList.push(CACHE_NAME);
 
       return Promise.all(keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
             console.log('deleting cache : ' + keyList[i]);
             return caches.delete(keyList[i]);
          }
       }));
    }));
 });