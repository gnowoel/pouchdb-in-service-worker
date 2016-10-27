importScripts('bower_components/pouchdb/dist/pouchdb.js');

// PouchDB.debug.enable('*');

const localMainDB = new PouchDB('localMainDB');
const remoteURL = 'http://couchadmin:test@localhost:5984/main';
// const remoteDB = new PouchDB('http://couchadmin:test@localhost:5984/main');
const remoteDB = new PouchDB('http://localhost:5984/main', {
  // ajax: {
  //   withCredentials: true
  // },
  auth: {
    username: 'couchadmin',
    password: 'test'
  }
});

function push() {
  return localMainDB.replicate.to(remoteDB)
    .on('change', function (info) {
      console.log('push change: ', info);
    }).on('paused', function (err) {
      console.log('push paused: ', info);
    }).on('active', function () {
      console.log('pull active');
    }).on('denied', function (err) {
      console.log('push denied: ', err);
    }).on('complete', function (info) {
      console.log('push complete: ', info);
    }).on('error', function (err) {
      console.log('push error: ', err);
    })
    .catch(function(err) {
      console.log('push promise error: ', err);
    });
}

function pull() {
  return localMainDB.replicate.from(remoteDB)
    .on('change', function (info) {
      console.log('pull change: ', info);
    }).on('paused', function (err) {
      console.log('pull paused: ', info);
    }).on('active', function () {
      console.log('pull active');
    }).on('denied', function (err) {
      console.log('pull denied: ', err);
    }).on('complete', function (info) {
      console.log('pull complete: ', info);
    }).on('error', function (err) {
      console.log('pull error: ', err);
    })
    .catch(function(err) {
      console.log('pull promise error: ', err);
    });
}

// self.addEventListener('install', function(event) {
//   self.skipWaiting();
//   event.registerForeignFetch({
//     scopes: [self.registration.scope],
//     origins: ['*']
//   });
// });

self.addEventListener('activate', function(event) {
  console.log('activate event: ', event);
  event.waitUntil(pull());
});

self.addEventListener('sync', function(event) {
  console.log('sync event: ', event);
  if (event.tag === 'push') {
    event.waitUntil(push());
  } else if (event.tag === 'pull') {
    event.waitUntil(pull());
  }
});

// this.addEventListener('fetch', function(event) {
//   console.log('event.request: ', event.request);
//   event.respondWith(fetch(event.request));
// });
