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

/* global Dexie, chrome, HAR */

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
  return new Promise(function(resolve, reject) {
    var db = new Dexie('advrestclient');
    db.version(1).stores({
      headers: '++id,&[key+type]',
      statuses: 'key',
      historyUrls: 'url',
      historySockets: 'url',
      requestObject: '++id,url,method,driveId,&[url+method]'
    });
    db.on('ready', function() {
      arc.app.db.idb.appVer = chrome.runtime.getManifest().version;
      return db.statuses.count(function(count) {
          if (count === 0) {
            console.log('The statuses database is empty. Populating it...');
            return new Dexie.Promise(function(resolve, reject) {
                arc.app.db.idb.downloadDefinitions().then(resolve, reject);
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
        })
        .then(arc.app.db.idb._getSQLdata)
        .then(function(data) {
          console.log(data);
          return data;
        })
        .then(arc.app.db.idb._converSqlIdb);
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
arc.app.db.idb.downloadDefinitions = function() {
  return fetch('/assets/definitions.json').then(function(response) {
    return response.json();
  });
};
/**
 * Get status code definition by it's code
 */
arc.app.db.idb.getStatusCode = function(code) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      db.statuses.get(code)
        .then(resolve)
        .catch(reject)
        .finally(function() {
          db.close();
        });
    }).catch((e) => reject(e));
  });
};
/**
 * This function is responsible for upgrading app's storage
 * from WebSQL to IndewxedDB.
 */
arc.app.db.idb._upgradeWebSQL = function() {
  return new Dexie.Promise(function(resolve, reject) {
    if (!arc.app.db.websql) {
      resolve();
      reject();
      return;
    }

    return Dexie.Promise.all([
      arc.app.db.idb._upgradeWebSLurlHistory(),
      arc.app.db.idb._upgradeWebSLSocketUrlHistory()
    ]);

  });
};
/**
 * Get all WebSQL data.
 */
arc.app.db.idb._getSQLdata = function() {
  const data = {};
  return new Dexie.Promise(function(resolve, reject) {
    arc.app.db.websql.open().then(function(db) {
      db.transaction(function(tx) {
        let sql = 'SELECT * FROM urls WHERE 1';
        tx.executeSql(sql, [], (tx, result) => {
          data.urls = Array.from(result.rows);
          sql = 'SELECT * FROM websocket_data WHERE 1';
          tx.executeSql(sql, [], (tx, result) => {
            data.websocketData = Array.from(result.rows);
            sql = 'SELECT * FROM history WHERE 1';
            tx.executeSql(sql, [], (tx, result) => {
              data.history = Array.from(result.rows);
              sql = 'SELECT * FROM projects WHERE 1';
              tx.executeSql(sql, [], (tx, result) => {
                data.projects = Array.from(result.rows);
                sql = 'SELECT * FROM request_data WHERE 1';
                tx.executeSql(sql, [], (tx, result) => {
                  data.requestData = Array.from(result.rows);
                  sql = 'SELECT * FROM exported WHERE 1';
                  tx.executeSql(sql, [], (tx, result) => {
                    data.exported = Array.from(result.rows);
                    resolve(data);
                  }, (tx, error) => reject(error));
                }, (tx, error) => reject(error));
              }, (tx, error) => reject(error));
            }, (tx, error) => reject(error));
          }, (tx, error) => reject(error));
        }, (tx, error) => reject(error));
      });
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
arc.app.db.createRequestKey = function(method, url) {
  var args = Array.from(arguments);
  if (args.length !== 2) {
    throw new Error('Number of arguments requires is 2 but ' + args.length +
      ' has been provided');
  }
  return method + ':' + url;
};
/**
 * Convert all data from WebSQL structure to the IndexedDB structure.
 */
arc.app.db.idb._converSqlIdb = function(data) {
  //requestData
  const requests = [];
  data.requestData.forEach((item) => {
    let obj = arc.app.db.idb._createHARfromSql.call(this, item);

    requests.push(obj);
  });

};
arc.app.db.idb._createHARfromSql = function(item) {
  var creator = new HAR.Creator({
    name: 'Advanced REST client',
    version: arc.app.db.idb.appVer,
    comment: 'Created during WebSQL update to IndexedDB'
  });
  var browser = new HAR.Browser({
    name: 'Chrome',
    version: 'unknown'
  });
  var log = new HAR.Log({
    'comment': 'Imported from WebSQL implementation',
    'version': 1.2,
    'creator': creator,
    'browser': browser
  });
  var requestHeaders = arc.app.db.headers.toJSON(item.headers);
  var request = new HAR.Request({
    url: item.url,
    httpVersion: 'HTTP/1.1',
    method: item.method
  });
  if (['GET', 'HEAD'].indexOf(item.method) === -1) {
    //Do not pass encoding for not-payload requests
    arc.app.db.headers._oldCombine(requestHeaders, item.encoding);
    var contentType = arc.app.db.headers.getContentType(requestHeaders) ||
      'application/x-www-form-urlencoded';
    var post = new HAR.PostData({
      mimeType: contentType,
      text: item.payload
    });
    request.postData = post;
  }
  request.headers = requestHeaders;
  var page = new HAR.Page({
    id: arc.app.db.createRequestKey(item.method, item.url),
    title: item.name,
    startedDateTime: new Date(item.time),
    pageTimings: {}
  });
  var entry = new HAR.Entry({
    startedDateTime: new Date(item.time),
    request: request,
    response: {
      status: '0',
      statusText: 'No response'
    }
  });
  entry.setPage(page);
  log.addPage(page);
  log.addEntry(entry, page.id);

  var obj = {
    'har': log,
    'url': item.url,
    'method': item.method,
    'type': 'saved'
  };
  return obj;
};
/**
 * Updgrade URL's history.
 */
arc.app.db.idb._upgradeWebSLurlHistory = function() {
  return new Dexie.Promise(function(resolve, reject) {
    arc.app.db.websql.open().then(function(db) {
      db.transaction(function(tx) {
        let sql = 'SELECT * FROM urls WHERE 1';
        tx.executeSql(sql, [], (tx, result) => {
          if (result.rows.length === 0) {
            resolve();
            return;
          }
          let data = Array.from(result.rows);
          arc.app.db.idb.open().then(function(db) {
            db.transaction('rw', db.historyUrls, function(historyUrls) {
                data.forEach(function(item) {
                  historyUrls.add(item);
                });
              })
              .catch(reject)
              .finally(function() {
                db.close();
                resolve();
              });
          }).catch((e) => reject(e));
        }, function(tx, error) {
          reject(error);
        });
      });
    }).catch((e) => reject(e));
  });
};
/**
 * Updgrade socket URL's history.
 */
arc.app.db.idb._upgradeWebSLSocketUrlHistory = function() {
  return new Dexie.Promise(function(resolve, reject) {
    arc.app.db.websql.open().then(function(db) {
      db.transaction(function(tx) {
        let sql = 'SELECT * FROM websocket_data WHERE 1';
        tx.executeSql(sql, [], (tx, result) => {
          if (result.rows.length === 0) {
            resolve();
            return;
          }
          let data = Array.from(result.rows);
          arc.app.db.idb.open().then(function(db) {
            db.transaction('rw', db.historySockets, function(historySockets) {
                data.forEach(function(item) {
                  historySockets.add(item);
                });
              })
              .catch(reject)
              .finally(function() {
                db.close();
                resolve();
              });
          }).catch((e) => reject(e));
        }, function(tx, error) {
          reject(error);
        });
      });
    }).catch((e) => reject(e));
  });
};
/**
 * Get header from the storage by it's name and type
 */
arc.app.db.idb.getHeaderByName = function(name, type) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      let result = null;
      db.headers.where('[key+type]').equals([name, type])
        .each(function(header) {
          result = header;
        })
        .catch(reject)
        .finally(function() {
          db.close();
          resolve(result);
        });
    }).catch((e) => reject(e));
  });
};
/**
 * Add new URL history value to the `urls` table.
 */
arc.app.db.idb.addUrlHistory = function(url, time) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open().then(function(db) {
      db.transaction('rw', db.historyUrls, function(historyUrls) {
          historyUrls.add({
            'url': url,
            'time': time
          });
        }).then(function() {
          resolve();
        })
        .catch(reject)
        .finally(function() {
          db.close();
        });
    }).catch((e) => reject(e));
  });
};
/**
 * Update a value in a `urls` table.
 */
arc.app.db.idb.updateUrlHistory = function(url, time) {
  return arc.app.db.idb.open().then(function(db) {
    return db.historyUrls.get(url).then(function(hurl) {
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
  return arc.app.db.idb.open().then(function(db) {
    return db.historyUrls.where('url').startsWithIgnoreCase(query)
      .toArray()
      .finally(function() {
        db.close();
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
  }).catch((e) => console.error('DEVMODE::Error initializing the IDB database', e));
};
arc.app.db.idb.initDev();
// @endif
