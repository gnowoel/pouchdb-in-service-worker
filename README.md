Trying to sync the local PouchDB with a remote CouchDB in a service worker. It uses [background sync](https://developers.google.com/web/updates/2015/12/background-sync) to trigger a single-shot replication.

## Arrangement

In the web page:

  * Create local and remote databases
  * Sync databases for the first time
  * Watch for changes and trigger `sync` events
  * Register a service worker

In the service worker:

  * Create local and remote databases
  * Capture the `sync` event and sync databases

## Running

```
$ npm install && bower install
$ npm start
```

## Caveats

  * We have PouchDB instances in both the web page and the service worker, but the `sync` event will only be triggered when changes of data happen in the web page (i.e. changes from within the service worker will be ignored).
  * I tried to do the initial sync in the service worker, but failed with a 500 error (due to some `_local` records missing if we use `db.repliate()`, or empty response if we use `db.sync()`).
