importScripts('bower_components/pouchdb/dist/pouchdb.js');

PouchDB.debug.enable('*');

// const localMainDB = new PouchDB('localMainDB');
let localMainDB;
let syncingRemote;

function setupRemoteSync() {
  localMainDB = new PouchDB('localMainDB');
  const remoteURL = 'http://couchadmin:test@localhost:5984/main';
  const promise = localMainDB.sync(remoteURL, {
    live: true,
    retry: true
  }).on('change', function(info) {
    console.log('local sync change', info);
  }).on('paused', function(info) {
    console.log('local sync paused', info);
  }).on('active', function(info) {
    console.log('local sync active', info);
  }).on('denied', function(info) {
    console.log('local sync denied:', info);
  }).on('complete', function(info) {
    console.log('local sync complete:', info);
  }).on('uptodate', function(info) {
    console.log('local sync up-to-date:', info);
  }).on('error', function(err) {
    console.log('local sync error:', err);
  });
  return promise.catch(function(err) {
    console.log('Error setting up remote sync', err);
  });
}

// 1. Register directly
// syncingRemote = setupRemoteSync();

// 2. Register on install
// self.addEventListener('install', function(event) {
//   syncingRemote = setupRemoteSync();
//   event.waitUntil(syncingRemote);
// });

// 3. Register on activate
self.addEventListener('activate', function(event) {
  syncingRemote = setupRemoteSync();
  event.waitUntil(syncingRemote);
});

// Not needed
// this.addEventListener('fetch', function(event) {
//   console.log('event.request: ', event.request);
//   event.respondWith(fetch(event.request));
// });