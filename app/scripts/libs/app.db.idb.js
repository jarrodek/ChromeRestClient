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
 * A namespace for status codes definitions queries
 *
 * @namespace
 */
arc.app.db.idb.statuses = {};
/**
 * A namespace for headers definitions queries
 *
 * @namespace
 */
arc.app.db.idb.headers = {};
/**
 * A namespace for exported to app server data queries
 *
 * @namespace
 */
arc.app.db.idb.exported = {};
/**
 * A namespace for url history queries
 *
 * @namespace
 */
arc.app.db.idb.urls = {};
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
    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
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
arc.app.db.idb.requests.createRequestKey = function(method, url) {
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
arc.app.db.idb.statuses.getStatusCode = function(code) {
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
arc.app.db.idb.headers.getHeaderByName = function(name, type) {
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
