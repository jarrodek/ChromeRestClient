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
    var db = new Dexie('arc');
    db.version(1).stores({
      headers: '&[key+type]',
      statuses: '&key',
      historyUrls: '&url',
      historySockets: '&url',
      requestObject: '++id,url,method,[url+method]',
      driveObjects: '[requestId+requestId],driveId,requestId',
      serverExportObjects: '[serverId+requestId],serverId,requestId',
      projectObjects: '++id,*requestIds'
    });
    db.on('ready', function() {
      arc.app.db.idb._db = db;
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
        .then(function(){
          return new Dexie.Promise(function(resolve) {
            let upgrade = {
              upgraded: {
                indexeddb: false
              }
            };
            chrome.storage.local.get(upgrade, (upgrade) => {
              if(upgrade.upgraded.indexeddb) {
                arc.app.db._adapter = 'indexeddb';
              }
              resolve(upgrade.upgraded.indexeddb);
            });
          });
        })
        .then(arc.app.db.idb._getSQLdata)
        .then(arc.app.db.idb._converSqlIdb)
        .then(arc.app.db.idb._storeUpgrade)
        .then(function(result) {
          if(result === null) {
            return;
          }
          console.info('Database has been upgraded from WebSQL to IndexedDB.');
          arc.app.db._adapter = 'indexeddb';
          let upgrade = {
            upgraded: {
              indexeddb: true
            }
          };
          chrome.storage.local.set(upgrade, () => {
            console.info('Upgrade finished.');
          });
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
 *
 * @param {Boolean} dontUpgrade Used in promise chain. Don't upgrade it IndexedDB has been 
 * already upgraded
 */
arc.app.db.idb._getSQLdata = function(dontUpgrade) {
  if(dontUpgrade) {
    return null;
  }

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
  if(!data) {
    return null;
  }
  const requests = [];
  const urlHistory = [];
  const socketHistory = [];
  const exportedSize = data.exported.length;
  data.requestData.forEach((item) => {
    let obj = arc.app.db.idb._createHARfromSql.call(this, item);
    obj.type = 'saved';
    //just for upgrade, to be removed before save. 
    if (item.project) {
      obj.project = item.project;
    }
    for (let i = 0; i < exportedSize; i++) {
      if (data.exported[i].reference_id === item.id) {
        //just for upgrade, to be removed before save. 
        obj.exported = i;
        break;
      }
    }
    requests.push(obj);
  });
  data.history.forEach((item) => {
    let obj = arc.app.db.idb._createHARfromSql.call(this, item);
    requests.push(obj);
  });
  data.urls.forEach((item) => {
    let obj = new HistoryUrlObject({
      url: item.url,
      time: item.time,
    });
    urlHistory.push(obj);
  });
  data.websocketData.forEach((item) => {
    let obj = new HistorySocketObject({
      url: item.url,
      time: item.time,
    });
    socketHistory.push(obj);
  });

  return {
    indexeddb: {
      requests: requests,
      urlHistory: urlHistory,
      socketHistory: socketHistory
    },
    websql: data
  };
};
/**
 * Store upgraded from webSQL storage data in IndexedDb storage.
 */
arc.app.db.idb._storeUpgrade = function(data) {
  if(!data) {
    return null;
  }
  let db = arc.app.db.idb._db;
  console.info('Upgrading webSQL to IndexedDb');
  return db.transaction('rw', db.historyUrls, db.historySockets, db.requestObject,
    db.serverExportObjects, db.projectObjects,
    function() {
      console.info('Entered transaction. Ready to save data.');
      console.info('Inserting URL history');
      data.indexeddb.urlHistory.forEach((item) => {
        db.historyUrls.put(item);
      });
      console.info('Inserting Socket URL history');
      data.indexeddb.socketHistory.forEach((item) => {
        db.historySockets.put(item);
      });
      const projects = {};
      const exported = [];
      let promises = [];

      let insertRequest = (db, item) => {
        let referencedProjectId = item.project;
        let referencedExported = item.exported;
        delete item.project;
        delete item.exported;
        return db.requestObject.add(item).then(function(requestId) {
          if (referencedProjectId) {
            if (!(referencedProjectId in projects)) {
              let _projects = data.websql.projects.filter(
                (project) => project.id === referencedProjectId);
              if (_projects.length === 1) {
                let project = new ProjectObject({
                  time: _projects[0].time,
                  name: _projects[0].name,
                  requestIds: [requestId]
                });
                projects[referencedProjectId] = project;
              } else if (_projects.length > 1) {
                console.warn('Projects filtered array has more than one element ' +
                  'and it should not happen.');
              }
            } else {
              projects[referencedProjectId].addRequest(requestId);
            }
          }
          if (referencedExported) {
            let exportData = data.websql.exported[referencedExported];
            let exportObject = new ServerExportedObject({
              serverId: exportData.gaeKey,
              requestId: requestId
            });
            exported.push(exportObject);
          }
        });
      };

      console.info('Inserting requests');
      data.indexeddb.requests.forEach((item) => {
        promises.push(insertRequest(db, item));
      });

      return Promise.all(promises).then(() => {
        let promises = [];
        console.info('Exported items to be inserted: %d, projects items to be inserted: %d', exported.length, Object.keys(projects).length);
        if (Object.keys(projects).length > 0) {
          console.info('Inserting projects');
          Object.keys(projects).forEach((projectKey) => {
            db.projectObjects.add(projects[projectKey]).then((id) => console.log('projects item inserted', id)).catch((cause) => console.error('projects item not inserted', cause));
          });
        }
        if (exported.length > 0) {
          console.info('Inserting exported');
          exported.forEach((item) => {
            db.serverExportObjects.add(item).then((id) => console.log('Exported item inserted', id)).catch((cause) => console.error('Exported item not inserted', cause));
          });
        }
      });
    });
};

/**
 * Create a RequestObject from the SQL data
 */
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

  var obj = new RequestObject({
    'har': log,
    'url': item.url,
    'method': item.method,
    'type': 'history'
  });
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
