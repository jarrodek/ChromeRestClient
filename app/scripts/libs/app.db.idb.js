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

/* global Dexie, chrome */

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
 * Open the database.
 *
 * @returns {Promise} The promise when ready.
 */
arc.app.db.idb.open = function() {
  return new Dexie.Promise(function(resolve, reject) {
    var db = new Dexie('arc');
    db.version(1)
      .stores({
        headers: '&[key+type]',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type',
        driveObjects: '[requestId+requestId],driveId,requestId',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds'
      });
    db.on('ready', function() {
      arc.app.db.idb._db = db;
      arc.app.db.idb.appVer = chrome.runtime.getManifest()
        .version;
      return db.statuses.count(function(count) {
        if (count === 0) {
          console.log('The statuses database is empty. Populating it...');
          return new Dexie.Promise(function(resolve, reject) {
              arc.app.db.idb.downloadDefinitions()
                .then(resolve, reject);
            })
            .then(function(defs) {
              return db.transaction('rw', db.statuses, db.headers, function() {
                let codes = defs.codes;
                defs.requests.forEach((item) => item.type = 'request');
                defs.responses.forEach((item) => item.type = 'response');
                let headers = defs.requests.concat(defs.responses);
                codes.forEach(function(item) {
                  db.statuses.add(item);
                });
                headers.forEach(function(item) {
                  db.headers.add(item);
                });
              });
            })
            .then(function() {
              console.log('The database has been populated with data.');
            });
        }
      });
    });
    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};
/**
 * Creates IndexedDB key for a RequestObject.
 * The main key is a combination of [HTTP METHOD]:[URL]
 *
 * @param {String} method A HTTP method
 * @param {String} url An URL of the request.
 * @return {String} a key for the Request object
 */
arc.app.db.idb.createRequestKey = function(method, url) {
  var args = Array.from(arguments);
  if (args.length !== 2) {
    throw new Error('Number of arguments requires is 2 but ' + args.length +
      ' has been provided');
  }
  return method + ':' + url;
};
arc.app.db.idb.downloadDefinitions = function() {
  return fetch('/assets/definitions.json')
    .then(function(response) {
      return response.json();
    });
};
/**
 * Get status code definition by it's code
 */
arc.app.db.idb.getStatusCode = function(code) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.statuses.get(code)
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get header from the storage by it's name and type
 */
arc.app.db.idb.getHeaderByName = function(name, type) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open()
      .then(function(db) {
        let result = null;
        db.headers.where('[key+type]')
          .equals([name, type])
          .each(function(header) {
            result = header;
          })
          .catch(reject)
          .finally(function() {
            db.close();
            resolve(result);
          });
      })
      .catch((e) => reject(e));
  });
};
/**
 * Add new URL history value to the `urls` table.
 */
arc.app.db.idb.addUrlHistory = function(url, time) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open()
      .then(function(db) {
        db.transaction('rw', db.historyUrls, function(historyUrls) {
            historyUrls.add({
              'url': url,
              'time': time
            });
          })
          .then(function() {
            resolve();
          })
          .catch(reject)
          .finally(function() {
            db.close();
          });
      })
      .catch((e) => reject(e));
  });
};
/**
 * Update a value in a `urls` table.
 */
arc.app.db.idb.updateUrlHistory = function(url, time) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.historyUrls.get(url)
        .then(function(hurl) {
          if (!hurl) {
            hurl = {
              'url': url,
              'time': time
            };
          } else {
            hurl.time = time;
          }
          return db.transaction('rw', db.historyUrls, function(historyUrls) {
              return historyUrls.put(hurl);
            })
            .then(function() {
              return db.historyUrls.get(url);
            });
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get url values from the `urls` table matching `query`.
 */
arc.app.db.idb.getHistoryUrls = function(query) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.historyUrls.where('url')
        .startsWithIgnoreCase(query)
        .toArray()
        .finally(function() {
          db.close();
        });
    });
};
/**
 * List entries from the `projects` table.
 * This function will result null if projects table is empty.
 */
arc.app.db.idb.listProjects = function() {
  return arc.app.db.idb.open()
  .then((db) => {
    let projects = db.projectObjects.toArray();
    db.close();
    return projects;
  });
};
