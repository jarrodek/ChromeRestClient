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

/* global IDBKeyRange, Dexie, chrome, IDBRequest */

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
arc.app.db.idb._dbVersion = 2;
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
  return new Promise(function(resolve) {
    var db = new Dexie('arc');
    db.version(arc.app.db.idb._dbVersion).stores({
      Headers: '++id,&[key+type]',
      Statuses: 'key',
      HistoryUrls: 'url',
      HistorySockets: 'url',
      RequestObject: '++id,url,method,driveId,&[url+method]'
    });
    db.open();
    resolve(db);
    /*if (arc.app.db.idb._db) {
      resolve(arc.app.db.idb._db);
      return;
    }
    var request = indexedDB.open('arc', arc.app.db.idb._dbVersion);
    request.onupgradeneeded = arc.app.db.idb._dbUpgrade;
    request.onsuccess = function(e) {
      arc.app.db.idb._db = e.target.result;
      resolve(arc.app.db.idb._db);
    };
    request.onerror = function(e) {
      reject(e);
    };*/
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

  //in future releases there may be required db structure update.
  if (db.objectStoreNames.length === 0) {
    arc.app.db.idb._createStructure(db);
  }

  console.groupEnd();
};
/**
 * Create a database structure if this is first time run for IndexedDB.
 *
 * @param {IDDatabase} db pointer to the database.
 */
arc.app.db.idb._createStructure = function(db) {
  //Headers store
  if (db.objectStoreNames.contains('Headers')) {
    db.deleteObjectStore('Headers');
    console.info('Datastore "Headers" has been deleted.');
  }
  //Statuses store
  if (db.objectStoreNames.contains('Statuses')) {
    db.deleteObjectStore('Statuses');
    console.info('Datastore "Statuses" has been deleted.');
  }
  //url history
  if (db.objectStoreNames.contains('HistoryUrls')) {
    db.deleteObjectStore('HistoryUrls');
    console.info('Datastore "HistoryUrls" has been deleted.');
  }
  //History of Sockets urls
  if (db.objectStoreNames.contains('HistorySockets')) {
    db.deleteObjectStore('HistorySockets');
    console.info('Datastore "HistorySockets" has been deleted.');
  }
  // RequestObject store
  if (db.objectStoreNames.contains('RequestObject')) {
    db.deleteObjectStore('RequestObject');
    console.info('Datastore "RequestObject" has been deleted.');
  }

  console.info('Creating "Headers" store and indexes.');
  //index for key (header name for search) and type ("request" and "response") combined
  //into one index.
  var headersstore = db.createObjectStore('Headers', {
    keyPath: 'id',
    autoIncrement: true
  });
  headersstore.createIndex('key-type', ['key', 'type'], {
    unique: true
  });

  console.info('Creating "Statuses" store and indexes.');
  //index for key (status code for search), must be unique
  db.createObjectStore('Statuses', {
    keyPath: 'key'
  });

  console.info('Creating "HistoryUrls" store and indexes.');
  //index for url (historical for search), must be unique
  db.createObjectStore('HistoryUrls', {
    keyPath: 'url'
  });

  console.info('Creating "HistorySockets" store and indexes.');
  //index for url (historical for search), must be unique
  db.createObjectStore('HistorySockets', {
    keyPath: 'url'
  });

  console.info('Creating "RequestObject" store and indexes.');
  var requestObject = db.createObjectStore('RequestObject', {
    keyPath: 'id',
    autoIncrement: true
  });
  requestObject.createIndex('url', 'url', {
    unique: false
  });
  requestObject.createIndex('method', 'method', {
    unique: false
  });
  requestObject.createIndex('driveId', 'driveId', {
    unique: false
  });
  requestObject.createIndex('method-url', ['method', 'url'], {
    unique: true
  });
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
 * Ascending compare function
 */
arc.app.db.idb._comparer = (a, b) => a < b ? -1 : a > b ? 1 : 0;
/**
 * A helper function as a replacement for SQl's `IN (...)` statement.
 * This function will return only fully matched records.
 * See https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
 * for more details.
 *
 * @param {IDBIndex} index A reference to the index on which the algorithm will look in.
 * @param {Array<String>} keysToFind A list of words to find in the cursor.
 */
arc.app.db.idb.equalsAnyOf = function(index, keysToFind) {
  const results = [];
  return new Promise(function(resolve) {
    let _set = keysToFind.sort(arc.app.db.idb._comparer);
    let i = 0;
    let cursorReq = index.openCursor();
    cursorReq.onsuccess = function(event) {
      let cursor = event.target.result;
      if (!cursor) {
        resolve(results);
        return;
      }
      let key = cursor.key;
      while (key > _set[i]) {
        // The cursor has passed beyond this key. Check next.
        ++i;
        if (i === _set.length) {
          // There is no next. Stop searching.
          resolve(results);
          return;
        }
      }
      if (key === _set[i]) {
        // The current cursor value should be included and we should continue
        // a single step in case next item has the same key or possibly our
        // next key in set.
        results.push(cursor.value);
        cursor.continue();
      } else {
        // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
        cursor.continue(_set[i]);
      }
    };
  });
};
/**
 * A helper function as a replacement for SQl's `LIKE index = 'needle'` statement.
 * See https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
 *
 * @param {IDBIndex} index An instance of IDBIndex on which the algorithm will look in.
 * @param {String} needle The string to search for
 */
arc.app.db.idb.query = function(index, needle) {
  const results = [];
  return new Promise(function(resolve) {
    let upperNeedle = needle.toUpperCase();
    let lowerNeedle = needle.toLowerCase();
    let cursorReq = (index instanceof IDBRequest) ? index : index.openCursor();
    cursorReq.onsuccess = function(event) {
      let cursor = event.target.result;
      if (!cursor) {
        // No more data to iterate over - call resolve()
        resolve(results);
        return;
      }

      let key = cursor.key;
      if (typeof key !== 'string') {
        // Just in case we stumble on data that isn't what we expect -
        // toLowerCase() wont work on this object. Check next.
        cursor.continue();
        return;
      }

      let lowerKey = key.toLowerCase();
      if (lowerKey === lowerNeedle) {
        results.push(cursor.value);
        cursor.continue(); // Check next record, it might match too!
      } else {
        // Derive least possible casing to appear after key in sort order
        let nextNeedle = arc.app.db.idb._nextCasing(key, lowerKey, upperNeedle, lowerNeedle);
        if (nextNeedle) {
          cursor.continue(nextNeedle);
        } else {
          // No more possible case combinations to look for.
          // Call resolve() and dont call cursor.continue() anymore.
          resolve(results);
        }
      }
    };
  });
};
arc.app.db.idb._nextCasing = function(key, lowerKey, upperNeedle, lowerNeedle) {
  var length = Math.min(key.length, lowerNeedle.length); //lowerNeedle is from outer scope
  var llp = -1; // "llp = least lowerable position"
  // Iterate through the most common first chars for cursor.key and needle.
  for (let i = 0; i < length; ++i) {
    let lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      // The char at position i differs between the found key and needle being
      // looked for when just doing case insensitive match.
      // Now check how they differ and how to trace next casing from this:
      if (arc.app.db.idb._comparer(key[i], upperNeedle[i]) < 0) {
        // We could just append the UPPER version of the key we're looking for
        // since found key is less than that.
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      }

      if (arc.app.db.idb._comparer(key[i], lowerNeedle[i]) < 0) {
        // Found key is between lower and upper version. Lets first append a
        // lowercase char and the rest as uppercase.
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      }

      if (llp >= 0) {
        // Found key is beyond this key. Need to rewind to last lowerable
        // position and return key + 1 lowercase char + uppercase rest.
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      }
      // There are no lowerable positions - all chars are already lowercase
      // (or non-lowerable chars such as space, periods etc)
      return null;
    }

    if (arc.app.db.idb._comparer(key[i], lwrKeyChar) < 0) {
      // Making lowercase of this char would make it appear after key.
      // Therefore set llp = i.
      llp = i;
    }

    // All first common chars of found key and the key we're looking for are equal
    // when ignoring case.
    if (length < lowerNeedle.length) {
      // key was shorter than needle, meaning that we may look for key + UPPERCASE
      // version of the rest of needle.
      return key + upperNeedle.substr(key.length);
    }

    // Found key was longer than the key we're looking for
    if (llp < 0) {
      // ...and there is no way to make key we're looking for appear after found key.
      return null;
    } else {
      // There is a position of a char, that if we make that char lowercase,
      // needle will become greater than found key.
      return key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
    }
  }
};
/**
 * A helper function as a replacement for SQl's `LIKE index = 'needle'` statement.
 * See https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
 *
 * @param {IDBIndex} index An instance of IDBIndex on which the algorithm will look in.
 * @param {String} query The string to search for
 */
arc.app.db.idb.startsWith = function(index, query) {
  const results = [];
  return new Promise(function(resolve) {
    let range = IDBKeyRange.bound(query, query + 'uffff', false, false);
    let cursorReq = index.openCursor(range);
    cursorReq.onsuccess = function(event) {
      var cursor = event.target.result;
      if (!cursor) {
        // No more data to iterate over - call resolve()
        resolve(results);
        return;
      }
      results.push(cursor.value);
      cursor.continue();
    };
  });
};
/**
 * A helper function as a replacement for SQl's `LIKE index = 'needle%'` statement.
 * This is similar to arc.app.db.idb.startsWith but it will ignore case (IC surfix).
 * See https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
 *
 * @param {IDBIndex} index An instance of IDBIndex on which the algorithm will look in.
 * @param {String} needle The string to search for
 */
arc.app.db.idb.startsWithIC = function(index, needle) {
  const results = [];
  return new Promise(function(resolve) {
    let upperNeedle = needle.toUpperCase();
    let lowerNeedle = needle.toLowerCase();
    let cursorReq = (index instanceof IDBRequest) ? index : index.openCursor();
    cursorReq.onsuccess = function(event) {
      var cursor = event.target.result;
      if (!cursor) {
        // No more data to iterate over - call resolve()
        resolve(results);
        return;
      }
      var key = cursor.key;
      if (typeof key !== 'string') {
        // Just in case we stumble on data that isn't what we expect -
        // toLowerCase() wont work on this object. Check next.
        cursor.continue();
        return;
      }
      var lowerKey = key.toLowerCase();
      if (lowerKey.indexOf(lowerNeedle) === 0) {
        results.push(cursor.value);
        cursor.continue(); // Check next record, it might match too!
      } else {
        // Derive least possible casing to appear after key in sort order
        var nextNeedle = arc.app.db.idb._nextCasing(key, lowerKey, upperNeedle, lowerNeedle);
        if (nextNeedle) {
          cursor.continue(nextNeedle);
        } else {
          // No more possible case combinations to look for.
          // Call resolve() and dont call cursor.continue() anymore.
          resolve(results);
        }
      }
    };
  });
};
/**
 * Insert status codes definitions into database.
 * This function should be called once, in background page, when the app is installed for 
 * the first time.
 *
 * @param {Array} codesArray A list of objects to be inserted into the database.
 *                StatusCode: {
 *                  'label' (String) - code label
 *                  'key' (Number) - Status code
 *                  'desc' (String) - a description of the status code.
 *                }
 */
arc.app.db.idb.insertStatusCodes = function(codesArray) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let transaction = db.transaction('Statuses', 'readwrite');
      let statuses = transaction.objectStore('Statuses');
      transaction.oncomplete = function() {
        resolve();
      };
      transaction.onerror = (e) => reject(e.target.error);
      codesArray.forEach(function(item) {
        statuses.add(item);
      });
    }).catch((e) => reject(e));
  });
};
/**
 * Insert HTTP headers definitions into database.
 * This function should be called once, in background page, when the app is installed for 
 * the first time.
 *
 * @param {Array} headersArray A list of objects to be inserted into the database.
 *      StatusCode: {
 *        'key' (String) - Name of the header
 *        'example' (String) - Header usage example
 *        'desc' (String) - a description of the header
 *        'type' (String) - either `request` or `response` determining where the header may appear.
 *      }
 */
arc.app.db.idb.insertHeadersDefinitions = function(headersArray) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let transaction = db.transaction('Headers', 'readwrite');
      let headers = transaction.objectStore('Headers');
      transaction.oncomplete = function() {
        resolve();
      };
      transaction.onerror = (e) => reject(e.target.error);
      headersArray.forEach(function(item) {
        headers.add(item);
      });
    }).catch((e) => reject(e));
  });
};

/**
 * Get status code definition by it's code
 */
arc.app.db.idb.getStatusCode = function(code) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let objectStore = db.transaction('Statuses').objectStore('Statuses');
      let request = objectStore.get(code);
      request.onerror = (e) => reject(e.target.error);
      request.onsuccess = function(event) {
        resolve(event.request.result);
      };
    }).catch((e) => reject(e));
  });
};
/**
 * Get header from the storage by it's name and type
 */
arc.app.db.idb.getHeaderByName = function(name, type) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let headers = db.transaction('Headers').objectStore('Headers');
      let index = headers.index('key-type');
      let range = IDBKeyRange.only([name, type]);
      let request = index.get(range);
      request.onerror = (e) => reject(e.target.error);
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
    }).catch((e) => reject(e));
  });
};
/**
 * Add new URL history value to the `urls` table.
 */
arc.app.db.idb.addUrlHistory = function(url, time) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let transaction = db.transaction('HistoryUrls', 'readwrite');
      let historyUrls = transaction.objectStore('HistoryUrls');
      transaction.oncomplete = function() {
        resolve();
      };
      transaction.onerror = (e) => reject(e.target.error);
      historyUrls.add({
        'url': url,
        'time': time
      });
    }).catch((e) => reject(e));
  });
};
/**
 * Update a value in a `urls` table.
 */
arc.app.db.idb.updateUrlHistory = function(url, time) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let objectStore = db.transaction('HistoryUrls', 'readwrite').objectStore('HistoryUrls');
      let request = objectStore.get(url);
      request.onerror = (e) => reject(e.target.error);
      request.onsuccess = function(event) {
        let data = event.request.result;
        data.time = time;
        let requestUpdate = objectStore.put(data);
        requestUpdate.onerror = (e) => reject(e);
        requestUpdate.onsuccess = function() {
          resolve(data);
        };
      };
    }).catch((e) => reject(e));
  });
};
/**
 * Get url values from the `urls` table matching `query`.
 */
arc.app.db.idb.getHistoryUrls = function(query) {
  return new Promise(function(resolve) {
    arc.app.db.idb.open().then(function(db) {
      let headers = db.transaction('HistoryUrls').objectStore('HistoryUrls');
      //let index = headers.openCursor();
      //return arc.app.db.idb.startsWithIC(index, query);
      const results = [];
      let range = IDBKeyRange.bound(query, query + '\uffff', false, false);
      console.log(range);
      let cursorReq = headers.openCursor(range);
      cursorReq.onsuccess = function(event) {
        var cursor = event.target.result;
        if (!cursor) {
          // No more data to iterate over - call resolve()
          resolve(results);
          return;
        }
        results.push(cursor.value);
        cursor.continue();
      };

    });
  });
};
// @if NODE_ENV='debug'
/**
 * In dev mode there is no direct connection to the database initialized in the background page.
 * This function must be called in Development environment to initialize IndexedDb.
 */
arc.app.db.idb.initDev = function() {
  arc.app.db.idb.open().then(function() {
    console.log('%cDEVMODE::IndexedDB has been initialized', 'color: #33691E');
    chrome.storage.local.get({
      'dev': {
        'definitions': false
      }
    }, (result) => {
      if (result.dev.definitions) {
        return;
      }
      arc.app.db.idb.downloadDefinitions()
        .then(arc.app.db.idb.installDefinitions)
        .then(() => {
          console.log('%cDEVMODE::IDB has been filled with default values.', 'color: #33691E');
          result.dev.definitions = true;
          chrome.storage.local.set(result.dev.definitions, () => {});
        })
        .catch((r) => console.error('There was an error when filling up the IDB database with ' +
          'definitions.', r));
    });

  }).catch((e) => console.error('DEVMODE::Error initializing the IDB database', e));
};
arc.app.db.idb.downloadDefinitions = function() {
  return fetch('/assets/definitions.json').then(function(response) {
    return response.json();
  });
};
arc.app.db.idb.installDefinitions = function(defs) {
  if (!defs || !defs.codes || !defs.requests || !defs.responses) {
    return Promise.reject({
      'message': 'No definitions found'
    });
  }
  return arc.app.db.idb.insertStatusCodes(defs.codes)
    .then(function() {
      defs.requests.forEach((item) => item.type = 'request');
      defs.responses.forEach((item) => item.type = 'response');
      let save = defs.requests.concat(defs.responses);
      return arc.app.db.idb.insertHeadersDefinitions(save);
    });
};
arc.app.db.idb.initDev();
// @endif
