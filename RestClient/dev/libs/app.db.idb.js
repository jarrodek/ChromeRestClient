'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

/* global IDBKeyRange, indexedDB */

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the database scripts.
 */
arc.app.db = arc.app.db || {};

/**
 * A namespace for IndexedDB scripts.
 */
arc.app.db.idb = {};
/**
 * A handler to current connection to the database.
 * @type IDBDatabase
 */
arc.app.db.idb._db = null;
/**
 * Current database schema version.
 * @type Number
 */
arc.app.db.idb._dbVersion = 1;
/**
 * Generic error handler.
 *
 * @param {Error} e
 */
arc.app.db.idb.onerror = function(e) {
  console.error('app::db:error');
  console.log(e.message);
};
/**
 * Open the database.
 *
 * @returns {Promise} The promise when ready.
 */
arc.app.db.idb.open = function() {
  return new Promise(function(resolve, reject) {
    if (arc.app.db.idb._db) {
      resolve();
      return;
    }
    var request = indexedDB.open('arc', arc.app.db.idb._dbVersion);
    request.onupgradeneeded = arc.app.db.idb._dbUpgrade;
    request.onsuccess = function(e) {
      arc.app.db.idb._db = e.target.result;
      resolve();
    };
    request.onerror = function(e) {
      reject(e);
    };
  });
};
/**
 * Called when database version change.
 * 
 * This function will create new database structure.
 *
 * @param {Event} e 
 */
arc.app.db.idb._dbUpgrade = function(e) {
  console.group('Database upgrade');
  console.info('Upgrading the database to version %d.', arc.app.db.idb._dbVersion);

  var db = e.target.result;
  e.target.transaction.onerror = arc.app.db.idb.onerror;

  //headers store
  if (db.objectStoreNames.contains('headers')) {
    db.deleteObjectStore('headers');
    console.info('Datastore "headers" has been deleted.');
  }
  //statuses store
  if (db.objectStoreNames.contains('statuses')) {
    db.deleteObjectStore('statuses');
    console.info('Datastore "statuses" has been deleted.');
  }
  //url history
  if (db.objectStoreNames.contains('autofillurls')) {
    db.deleteObjectStore('autofillurls');
    console.info('Datastore "autofillurls" has been deleted.');
  }
  //history
  if (db.objectStoreNames.contains('history')) {
    db.deleteObjectStore('history');
    console.info('Datastore "history" has been deleted.');
  }

  console.info('Creating "headers" store and indexes.');
  //index for name (header name for search), type ("request" and "response") and combined
  //name-type to search for a particular header in a context of request or response.
  var headersstore = db.createObjectStore('headers', {
    keyPath: 'id'
  });
  headersstore.createIndex('name', 'name', {
    unique: false
  });
  headersstore.createIndex('type', 'type', {
    unique: false
  });
  headersstore.createIndex('name-type', ['name', 'type'], {
    unique: true
  });

  console.info('Creating "statuses" store and indexes.');
  //index for code (status code for search), must be unique
  var statusesstore = db.createObjectStore('statuses', {
    keyPath: 'id'
  });
  statusesstore.createIndex('code', 'code', {
    unique: true
  });

  console.info('Creating "autofillurls" store and indexes.');
  //index for url (historical for search), must be unique
  var autofillurlsstore = db.createObjectStore('autofillurls', {
    keyPath: 'id'
  });
  autofillurlsstore.createIndex('url', 'url', {
    unique: true
  });

  console.info('Creating "history" store and indexes.');
  //index for url (not unique), method (not unique), created (not unique), url-method (unique)
  //and store (not unique). Store key is to determine if item is in history, saved or drive store
  var historystore = db.createObjectStore('history', {
    keyPath: 'id'
  });
  historystore.createIndex('url', 'url', {
    unique: false
  });
  historystore.createIndex('method', 'method', {
    unique: false
  });
  historystore.createIndex('created', 'created', {
    unique: false
  });
  historystore.createIndex('store', 'store', {
    unique: false
  });
  historystore.createIndex('url-method', ['url', 'method'], {
    unique: true
  });

  console.groupEnd();
};
/**
 * Close a connection to the database.
 */
arc.app.db.idb.close = function() {
  if (arc.app.db.idb._db === null) {
    return;
  }
  arc.app.db.idb._db.close();
  arc.app.db.idb._db = null;
};
/**
 * 
 * @param {String} date A YYYY-mm-dd date representation.
 * @returns {Promise} Resolved with an entry.
 */
arc.app.db.idb.getCdno = function(date) {
  return arc.app.db.idb.open().then(function() {
    return new Promise(function(resolve, reject) {
      var transaction = arc.app.db.idb._db.transaction(['cdno']);
      transaction.onerror = function(e) {
        reject(e);
      };
      var objectStore = transaction.objectStore('cdno');
      var index = objectStore.index('date-type');
      var range = IDBKeyRange.only([date, 'main']);
      var request = index.get(range);
      request.onerror = function(event) {
        reject(event);
      };
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
    });
  }).catch(function(e) {
    console.error('can\'t call arc.app.db.idb.open');
    throw e;
  });
};
