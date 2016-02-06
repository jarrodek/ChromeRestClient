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

/* global Dexie, chrome, HAR, HistoryUrlObject, HistorySocketObject, ProjectObject, 
ServerExportedObject, RequestObject, indexedDB */

/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the database scripts.
 *
 * @namespace
 */
arc.app.db = arc.app.db || {};

/**
 * A namespace for IndexedDB scripts.
 *
 * @namespace
 */
arc.app.db.idb = {};
/**
 * A namespace for request objects queries..
 *
 * @namespace
 */
arc.app.db.idb.requests = {};
/**
 * A namespace for projects queries
 *
 * @namespace
 */
arc.app.db.idb.projects = {};
/**
 * A namespace for websocket history urls queries
 *
 * @namespace
 */
arc.app.db.idb.websockets = {};
/**
 * A flag to be set to true if the datastore has been upgraded from WebSQL successfully.
 * This flag will be used to speed up database open operation.
 * 
 * @type {Boolean}
 */
arc.app.db.idb.upgraded = false;
/**
 * Open the database.
 *
 * @returns {Dexie.Promise} The promise when ready.
 */
arc.app.db.idb.open = function() {
  return new Dexie.Promise(function(resolve, reject) {
    var db = new Dexie('arc');
    db.version(1)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        driveObjects: '[driveId+requestId],driveId,requestId',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds'
      });
    db.projectObjects.mapToClass(ProjectObject);
    db.serverExportObjects.mapToClass(ServerExportedObject);
    db.driveObjects.mapToClass(DriveObject);
    db.requestObject.mapToClass(RequestObject);
    db.historySockets.mapToClass(HistorySocketObject);
    db.historyUrls.mapToClass(HistoryUrlObject);
    db.statuses.mapToClass(HttpStatusObject);
    db.headers.mapToClass(HttpHeaderObject);

    db.on('error', function(error) {
      console.error('IndexedDB global error', error);
    });
    db.on('populate', function() {
      return arc.app.db.idb.downloadDefinitions()
        .catch(function() {
          console.warn('Definitions wasn\'t there. skipping definitions installation.');
          return Dexie.Promise.resolve();
        })
        .then(function(defs) {
          if (!defs) {
            return Dexie.Promise.resolve();
          }
          return db.transaction('rw', db.statuses, db.headers, function() {
            let promises = [];

            let codes = defs.codes;
            defs.requests.forEach((item) => item.type = 'request');
            defs.responses.forEach((item) => item.type = 'response');
            let headers = defs.requests.concat(defs.responses);
            codes.forEach(function(item) {
              promises.push(db.statuses.add(item));
            });
            headers.forEach(function(item) {
              promises.push(db.headers.add(item));
            });

            return Dexie.Promise.all(promises);
          });
        })
        .then(function() {
          console.log('The database has been populated with data.');
        });
    });
    db.on('ready', function() {
      if (arc.app.db.idb.upgraded) {
        return;
      }
      arc.app.db.idb._db = db;
      arc.app.db.idb.appVer = chrome.runtime.getManifest ? chrome.runtime.getManifest()
        .version : 'tests case';
      return new Dexie.Promise(function(resolve) {
          let upgrade = {
            upgraded: {
              indexeddb: false
            }
          };
          if (!chrome.storage) { //tests
            arc.app.db.idb.upgraded = true;
            resolve(false);
            return;
          }
          chrome.storage.local.get(upgrade, (upgrade) => {
            if (upgrade.upgraded.indexeddb) {
              arc.app.db.idb.upgraded = true;
            } else {
              console.info('IndexedDB need to be upgraded.');
            }
            resolve(upgrade.upgraded.indexeddb);
          });
        })
        .then(arc.app.db.idb.upgradeFromWebSQL)
        .then(function(result) {
          if (result === null) {
            return;
          }
          console.info('Database has been upgraded from WebSQL to IndexedDB.');
          let upgrade = {
            upgraded: {
              indexeddb: true
            }
          };
          arc.app.db.idb.upgraded = true;
          if (chrome.storage) { //tests
            chrome.storage.local.set(upgrade, () => {
              console.info('Upgrade finished.');
            });
          } else {
            console.info('Upgrade finished.');
          }
          arc.app.analytics.sendEvent('Upgrade', 'IndexedDB', 'Upgrade from WebSQL');
        })
        .catch(function(error) {
          arc.app.db.idb.deleteDatabase();
          arc.app.db.useIdb = false;
          arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
        });
    });

    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        arc.app.db.idb.deleteDatabase();
        arc.app.db.useIdb = false;
        arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
        reject(error);
      });
  });
};
/**
 * Delete and re-create database.
 *
 * @return {Dexie.Promise} Fulfilled promise if success.
 */
arc.app.db.idb.deleteDatabase = function() {
  console.warn('IndexedDB database is going bye bye');
  return new Dexie.Promise(function(resolve, reject) {
    var request = indexedDB.deleteDatabase('arc');
    request.onsuccess = function() {
      arc.app.db.idb.upgraded = false;
      arc.app.db._adapter = 'websql';
      let upgrade = {
        upgraded: {
          indexeddb: false
        }
      };
      if (chrome.storage) { //tests
        chrome.storage.local.set(upgrade, () => {
          console.info('Delete finished.');
          resolve();
        });
      } else {
        console.info('Delete finished.');
        resolve();
      }
    };
    request.onerror = function(event) {
      console.error('Error deleting IndexedDB', event);
      reject(event);
    };
  });
};
/**
 * Perform upgrade from WebSQL to IndexedDB. This function will take all data
 * from old WebSQL storage and insert data to IndexedDB suing new structure.
 *
 * @param {Boolean} isUpgraded True if the storage has been already upgraded.
 * @return {Dexie.Promise} Fulfilled promise means that the import is
 * finished.
 */
arc.app.db.idb.upgradeFromWebSQL = function(isUpgraded) {
  if (isUpgraded) {
    return null;
  }
  console.info('Upgrading WebSQL to IndexedDB');
  return arc.app.db.idb._getSQLdata()
    .then(arc.app.db.idb._converSqlIdb)
    .then(arc.app.db.idb._storeUpgrade);
};
/**
 * Download database definitions from the app directory.
 *
 * @return {Promise} Fulfilled promise returns JSON with definitions.
 */
arc.app.db.idb.downloadDefinitions = function() {
  return fetch('/assets/definitions.json')
    .then(function(response) {
      return response.json();
    });
};
/**
 * Get all WebSQL data.
 *
 * @param {Boolean} dontUpgrade Used in promise chain. Don't upgrade it IndexedDB has been 
 * already upgraded
 */
arc.app.db.idb._getSQLdata = function(dontUpgrade) {
  if (dontUpgrade) {
    return Dexie.Promise.resolve(null);
  }
  const data = {};
  return new Dexie.Promise(function(resolve, reject) {
    arc.app.db.websql.open()
      .then(function(db) {
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
 * Creates key for a RequestObject. It can be used inside HAR object to identify the request.
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
  if (!data) {
    return Dexie.Promise.resolve(null);
  }
  return new Dexie.Promise(function(resolve) {
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
        /* jscs: disable */
        if (data.exported[i].reference_id === item.id) {
          /* jscs: enable */
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

    var result = {
      indexeddb: {
        requests: requests,
        urlHistory: urlHistory,
        socketHistory: socketHistory
      },
      websql: data
    };
    resolve(result);
  });
};
/** IDB object to legacy SQL */
arc.app.db.idb._converIdbSql = function(data) {
  var har = data.har;
  var request = har.entries[0].request;
  var page = har.pages[0];

  return {
    id: data.id,
    name: data.name || null,
    project: 0,
    url: data.url,
    method: data.method,
    encoding: null,
    headers: arc.app.headers.toString(request.headers),
    payload: request.postData.text,
    time: new Date(page.startedDateTime).getTime(),
    driveId: null
  };
};
/**
 * Store upgraded from webSQL storage data in IndexedDb storage.
 */
arc.app.db.idb._storeUpgrade = function(data) {
  if (!data) {
    return null;
  }
  let db = arc.app.db.idb._db;
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
        return db.requestObject.add(item)
          .then(function(requestId) {
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

      return Dexie.Promise.all(promises)
        .then(() => {
          console.info('Exported items to be inserted: %d, projects items to be inserted: %d',
            exported.length, Object.keys(projects)
            .length);
          if (Object.keys(projects)
            .length > 0) {
            console.info('Inserting projects');
            Object.keys(projects)
              .forEach((projectKey) => {
                db.projectObjects.add(projects[projectKey]);
              });
          }
          if (exported.length > 0) {
            console.info('Inserting exported');
            exported.forEach((item) => {
              db.serverExportObjects.add(item);
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
  var requestHeaders = arc.app.headers.toJSON(item.headers);
  var request = new HAR.Request({
    url: item.url,
    httpVersion: 'HTTP/1.1',
    method: item.method
  });
  if (['GET', 'HEAD'].indexOf(item.method) === -1) {
    //Do not pass encoding for not-payload requests
    arc.app.headers._oldCombine(requestHeaders, item.encoding);
    var contentType = arc.app.headers.getContentType(requestHeaders) ||
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
    'name': item.name,
    'type': 'history'
  });
  return obj;
};
/**
 * Get status code definition by it's code.
 *
 * @param {Number} code HTTP status code to look for
 * @return {Promise} Fulfilled promise will result with a {@link
 * HttpStatusObject}
 */
arc.app.db.idb.getStatusCode = function(code) {
  return new Promise(function(resolve, reject) {
    arc.app.db.idb.open()
      .then(function(db) {
        db.statuses.get(code)
          .then(resolve)
          .catch(reject)
          .finally(function() {
            db.close();
          });
      })
      .catch((e) => reject(e));
  });
};
/**
 * Get header from the storage by it's name and type
 * 
 * @param {String} name A header name to look for
 * @param {String} type Either `request` or `response`
 * @return {Promise} Fulfilled promise will result with a {@link
 * HttpHeaderObject}
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
 * Get list of headers by name and type
 *
 * @param {String} name A header name to look for
 * @param {String} type Either `request` or `response`
 * @return {Promise} Fulfilled promise will result with list of {@link
 * HttpHeaderObject}
 */
arc.app.db.idb.getHeadersByName = function(name, type) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.headers.where('key')
        .startsWithIgnoreCase(name)
        .and((item) => item.type === type)
        .sortBy('key')
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Add new / update URL history value.
 *
 * @param {String} url The user to add
 * @param {Number} time Time of creation.
 * @return {Promise} Fulfilled promise will result with id of created {@link
 * HistoryUrlObject}
 */
arc.app.db.idb.putHistoryUrl = function(url, time) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.historyUrls, function(historyUrls) {
          return historyUrls.put({
            'url': url,
            'time': time
          });
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get url values from the `urls` table matching `query`. This function will
 * return all entries that starts with `query`
 *
 * @param {String} query A search string to look for.
 * @return {Promise} Fulfilled promise will result with list of {@link
 * HistoryUrlObject}
 */
arc.app.db.idb.getHistoryUrls = function(query) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.historyUrls.where('url')
        .startsWithIgnoreCase(query)
        .sortBy('url')
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Insert {@link HistorySocketObject} into the store.
 *
 * @param {String} url The user to add
 * @param {Number} time Time of creation.
 *
 * @return {Promise} Fulfilled promise will result with id of created {@link
 * HistorySocketObject}
 */
arc.app.db.idb.websockets.insert = function(url, time) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.historySockets, function(historySockets) {
          return historySockets.put({
            'url': url,
            'time': time
          });
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get {@link HistorySocketObject} matching `query`. This function will
 * return all entries that starts with `query`
 *
 * @param {String} query A search string to look for.
 * @return {Promise} Fulfilled promise will result with list of {@link
 * HistorySocketObject}
 */
arc.app.db.idb.websockets.query = function(query) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.historySockets.where('url')
        .startsWithIgnoreCase(query)
        .sortBy('url')
        .finally(function() {
          db.close();
        });
    });
};
// /**
//  * Add new project data to the `projects` table with existing RequestObject.
//  *
//  * @param {String} name
//  * @param {String} time
//  * @param {Number} requestId Optional. Request id which the project has been
//  * created with.
//  * @return {Promise} Fulfilled promise will result with id of created {@link
//  * ProjectObject}
//  */
// arc.app.db.idb.addProject = function(name, time, requestId) {
//   return arc.app.db.idb.open()
//     .then(function(db) {
//       let project = new ProjectObject({
//         'time': time,
//         'name': name,
//         'requestIds': requestId ? [requestId] : []
//       });
//       return db.transaction('rw', db.projectObjects, function(projectObjects) {
//           return projectObjects.put(project);
//         })
//         .finally(function() {
//           db.close();
//         });
//     });
// };
/**
 * Perform an import (from file / server) with requests and related projects.
 * All requests passed as an argument will be inserted to the store and
 * project will reference them. The `project` can be restored ProjectObject.
 * In this scenario project will be updated in the store instead of insert. So
 * this function can be use just to insert new request to existing project.
 *
 * A Promise results with new project key (if this is new project) or number
 * of updated records (0 or 1 in this case).
 *
 * @param {ProjectObject} project A project to be inserted into the database.
 * @param {Array<RequestObject>} requests A list of requests to be inserted
 * into the database.
 *
 * @return {Promise} Fulfilled promise will result with ID of newly created
 * {@link ProjectObject}.
 */
arc.app.db.idb.projects.addWithRequests = function(project, requests) {
  const requestsArray = []; //array of RequestObject
  if (!(project instanceof ProjectObject)) {
    project = new ProjectObject({
      'time': project.time,
      'name': project.name,
      'requestIds': project.requestIds || []
    });
  }
  requests.forEach((item) => {
    let r = arc.app.db.idb._createHARfromSql.call(this, item);
    r.type = 'saved';
    requestsArray.push(r);
  });
  // first insert request to obtain their ids and then insert project
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.projectObjects, db.requestObject, function() {
        let promises = [];
        let insertRequest = (db, item) => {
          return db.requestObject.add(item)
            .catch(function(e) {
              console.error('Error saving the request.', e);
              throw e;
            })
            .then(function(requestId) {
              project.addRequest(requestId);
            });
        };
        requestsArray.forEach((item) => {
          promises.push(insertRequest(db, item));
        });
        return Dexie.Promise.all(promises)
          .then(() => {
            return db.projectObjects.put(project);
          })
          .finally(function() {
            db.close();
          });
      });
    });
};
/**
 * Get project by the key.
 *
 * @param {!Number} id ID of the project
 *
 * @return {Promise} Fulfilled promise result with {@link ProjectObject} or
 * null if not found
 */
arc.app.db.idb.projects.getProject = function(id) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.projectObjects.get(id)
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Update project data in `projects` table.
 *
 * Fulfilled promise wil result with database ID.
 *
 * @param {ProjectObject} project A project object to be updated
 * @return {Promise} Fulfilled when {@link ProjectObject} has been updated.
 */
arc.app.db.idb.projects.update = function(project) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.projectObjects, function() {
          return db.projectObjects.put(project);
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * List entries from the `projects` table.
 * This function will result with empty array if projects table is empty.
 *
 * @return {Promise} Fulfilled promise will result with list of {@link ProjectObject}s
 */
arc.app.db.idb.projects.list = function() {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.projectObjects.toArray()
        .finally(function() {
          db.close();
        });
    });
};
// /**
//  * Delete project
//  *
//  * @param {Number} id An ID of the project
//  */
// arc.app.db.idb.deleteProject = function(id) {
//   return arc.app.db.idb.open()
//     .then(function(db) {
//       return db.transaction('rw', db.projectObjects, function() {
//           return db.projectObjects.delete(id);
//         })
//         .finally(function() {
//           db.close();
//         });
//     });
// };
/**
 * Insert array of request in one operation.
 *
 * @param {Array<RequestObject>} legacyRequestsList A list of request to be inserted.
 * @return {Promise} Fulfilled promise will result with IDs of inserted {@link RequestObject}s
 */
arc.app.db.idb.requests.import = function(legacyRequestsList) {
  const requestsArray = []; //array of RequestObject
  return arc.app.db.idb.open()
    .then(function(db) {
      legacyRequestsList.forEach((item) => {
        let r = arc.app.db.idb._createHARfromSql.call(this, item);
        r.type = 'saved';
        requestsArray.push(r);
      });
      return db.transaction('rw', db.requestObject, function(requestObject) {
          let promises = [];
          requestsArray.forEach((item) => {
            promises.push(requestObject.add(item));
          });
          return Dexie.Promise.all(promises);
        })
        .finally(function() {
          db.close();
        });
    });
};
arc.app.db.idb.requests.insert = function(requestAsLegacy, type) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, function(requestObject) {
        let obj = arc.app.db.idb._createHARfromSql(requestAsLegacy);
        obj.type = type;
        if (requestAsLegacy.id) {
          obj.id = requestAsLegacy.id;
        }
        return requestObject.add(obj);
      });
    });
};
/**
 * Read the request from the datastore.
 *
 * @param {Number} id Request ID.
 * @return {Promise} Fulfilled promise will result a {@link RequestObject}
 */
arc.app.db.idb.requests.getRequest = function(id) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.requestObject.get(id)
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get request referenced with project represented by projectId.
 *
 * @param {Number} projectId ID of the project.
 * @return {Promise} Fulfilled promise will result with list of {@link RequestObject}
 */
arc.app.db.idb.projects.getProjectRequests = function(projectId) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.projectObjects.get(projectId)
        .then(function(project) {
          if (!project || !project.requestIds || project.requestIds.length === 0) {
            return [];
          }
          return db.requestObject.where(':id')
            .anyOf(project.requestIds)
            .toArray();
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Delete project with referenced requests.
 *
 * @param {Number} projectId A project ID to be removed.
 */
arc.app.db.idb.projects.deleteRecursive = function(projectId) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.projectObjects.get(projectId)
        .then(function(project) {
          let requests = project.requestIds;
          return db.transaction('rw', db.requestObject, db.projectObjects, function() {
            let promises = [];
            promises.push(db.projectObjects.delete(projectId));
            requests.forEach((requestId) => {
              promises.push(db.requestObject.delete(requestId));
            });
            return Dexie.Promise.all(promises);
          });
        })
        .finally(function() {
          db.close();
        });
    });
};
/** List request by type */
arc.app.db.idb.requests.list = function(type) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.requestObject
        .where('type')
        .equals(type)
        .toArray()
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Get a project associated with a request identified by requestId
 *
 * @param  {Number} requestId A request id (New system in indexed DB)
 * @return {Dexie.Promise} Promise fulfilled with a {@link ProjectObject} or null if not found.
 */
arc.app.db.idb.projects.getForRequest = function(requestId) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.projectObjects
        .where('requestIds').equals(requestId).toArray()
        .then(function(objs) {
          return (objs && objs.length) ? objs[0] : null;
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Delete a {@link RequestObject} by database ID.
 * @param {String} id Entry ID.
 * @return {Promise} Fulfilled promise when the entry has been removed from the datastore.
 * Note: If callback `then()` function throw an error the transaction will be rolled back.
 */
arc.app.db.idb.requests.delete = function(id) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, function(requestObject) {
          return requestObject.delete(id);
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Delete objects by the type.
 *
 * @param {String} type Type of object to delete. Either `saved` or `history`
 * @return {Dexie.Promise} Fulfilled promise will result with number of deleted entries.
 * If error occur during the transaction - even in then() block - the transaction will be aborted 
 * and rolled back.
 */
arc.app.db.idb.requests.deleteType = function(type) {
  if (['history', 'saved'].indexOf(type) === -1) {
    throw new Error('Unsupported type.');
  }
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, function(requestObject) {
          return requestObject.where('type').equals(type).delete();
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Make a query to the history table.
 * In this function it is possible to query for url data.
 *
 * @param {Object} opts
 *  limit {Number} Number of results
 *  offset {Number} Starting point
 *  query {String} Optional, a url to query for
 */
arc.app.db.idb.requests.query = function(type, opts) {
  return arc.app.db.idb.open()
    .then(function(db) {
      var builder = db.requestObject;//.orderBy('_name');

      if (opts.query) {
        builder = builder.where('url').startsWithIgnoreCase(opts.query)
        .or('_name').startsWithIgnoreCase(opts.query)
          /*.and((item) => opts.query.indexOf(item.har.pages[0].title) !== -1)*/
        ;
        //TODO: Use OR or other filter function to query for name.
      }
      if (opts.exclude) {
        if (builder.and) {
          builder = builder.and((item) => opts.exclude.indexOf(item.id) === -1);
        } else {
          builder = builder.where(':id').noneOf(opts.exclude);
        }
      }
      if (builder.and) {
        builder = builder.and((item) => item.type === type);
      } else {
        builder = builder.where('type').equals(type);
      }

      if (opts.offset) {
        builder = builder.offset(opts.offset);
      }
      if (opts.limit) {
        builder = builder.limit(opts.limit);
      }

      return builder.toArray()
        .finally(function() {
          db.close();
        });
    });
};
arc.app.db.idb.requests.deleteByProject = function(projectId) {
  var requests;
  return arc.app.db.idb.getProjectRequests(projectId)
    .then((list) => requests = list)
    .then(arc.app.db.idb.open)
    .then((db) => {
      return db.transaction('rw', db.requestObject, function(requestObject) {
          return requestObject.where(':id').anyOf(requests.map((item) => item.id)).delete();
        })
        .finally(function() {
          db.close();
        });
    });
};
/** Update legacy request object */
arc.app.db.idb.requests.update = function(obj) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, function(requestObject) {
          let data = arc.app.db.idb._createHARfromSql(obj);
          data.id = obj.id;
          data.type = 'saved';
          return requestObject.put(data);
        })
        .finally(function() {
          db.close();
        });
    });
};
arc.app.db.idb.requests.updateRequestName = function(id, name) {
  var request;
  return arc.app.db.idb.requests.getRequest(id)
    .then((item) => request = item)
    .then(arc.app.db.idb.open)
    .then((db) => {
      return db.transaction('rw', db.requestObject, function(requestObject) {
          request.name = name;
          return requestObject.put(request);
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Insert list of exported to the app sever objects.
 *
 * @param  {Array} refArray A list of {@link ServerExportedObject} to insert.
 * @return {Dexie.Promise} Fulfilled promise result with list of ids of inserts.
 */
arc.app.db.idb.insertExported = function(refArray) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.serverExportObjects, function(serverExportObjects) {
          let promises = [];
          refArray.forEach((item) => {
            let ref = new ServerExportedObject(item);
            promises.push(serverExportObjects.put(ref));
          });
          return Dexie.Promise.all(promises);
        })
        .finally(function() {
          db.close();
        });
    });
};
/**
 * Query for exported item by a request ID (reference id)
 *
 * @param  {Array<Number>} requestsArray A list of IDs of the referenced requests.
 */
arc.app.db.idb.listExported = function(requestsArray) {
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.serverExportObjects
        .where('requestId')
        .anyOf(requestsArray)
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
  if (location.hostname !== '127.0.0.1' || location.port !== '8888') {
    return;
  }
  arc.app.db.idb.open()
    .then(function() {
      console.log('%cDEVMODE::IndexedDB has been initialized', 'color: #33691E');
    })
    .catch((e) => console.error('DEVMODE::Error initializing the IDB database', e));
};
arc.app.db.idb.initDev();
// @endif
