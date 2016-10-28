importScripts('bower_components/pouchdb/dist/pouchdb.js');

// PouchDB.debug.enable('*');

let localMainDB = new PouchDB('localMainDB');
let remoteDB = new PouchDB('http://couchadmin:test@localhost:5984/main');

function push() {
  console.log('sw pushing');
  return localMainDB.replicate.to(remoteDB)
    .on('change', function(info) {
      console.log('push change: ', info);
    }).on('paused', function(err) {
      console.log('push paused: ', err);
    }).on('active', function() {
      console.log('pull active');
    }).on('denied', function(err) {
      console.log('push denied: ', err);
    }).on('complete', function(info) {
      console.log('push complete: ', info);
    }).on('error', function(err) {
      console.log('push error: ', err);
    })
    .catch(function(err) {
      console.log('push promise error: ', err);
    });
}

function pull() {
  console.log('sw pulling');
  return localMainDB.replicate.from(remoteDB)
    .on('change', function(info) {
      console.log('pull change: ', info);
    }).on('paused', function(err) {
      console.log('pull paused: ', err);
    }).on('active', function() {
      console.log('pull active');
    }).on('denied', function(err) {
      console.log('pull denied: ', err);
    }).on('complete', function(info) {
      console.log('pull complete: ', info);
    }).on('error', function(err) {
      console.log('pull error: ', err);
    })
    .catch(function(err) {
      console.log('pull promise error: ', err);
    });
}

// self.addEventListener('install', function(event) {
//   self.skipWaiting();
// });

self.addEventListener('activate', function(event) {
  console.log('sw activate event: ', event);
  // event.waitUntil(pull());  // failed with 500 missing
});

self.addEventListener('sync', function(event) {
  console.log('sw sync event: ', event);
  if (event.tag === 'push') {
    event.waitUntil(push());
  } else if (event.tag === 'pull') {
    event.waitUntil(pull());
  }
});

// this.addEventListener('fetch', function(event) {
//   console.log('sw fetch event: ', event);
//   event.respondWith(fetch(event.request));
// });
