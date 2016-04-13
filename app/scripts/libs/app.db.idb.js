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

/* global Dexie, chrome, HistoryUrlObject, HistorySocketObject, ProjectObject,
 ServerExportedObject, RequestObject, HttpStatusObject, HttpHeaderObject, MagicVariableObject */
window.pendingAnalytics = window.pendingAnalytics || [];
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
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds'
      });
    db.version(2)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds',
        variables: '++id,variable,type'
      });
    db.version(3)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds',
        variables: '++id,variable,type',
        basicAuth: '&url'
      });
    db.version(4)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds',
        variables: '++id,variable,type',
        basicAuth: '&url',
        logs: '&time,type'
      });
    db.projectObjects.mapToClass(ProjectObject);
    db.serverExportObjects.mapToClass(ServerExportedObject);
    db.requestObject.mapToClass(RequestObject);
    db.historySockets.mapToClass(HistorySocketObject);
    db.historyUrls.mapToClass(HistoryUrlObject);
    db.statuses.mapToClass(HttpStatusObject);
    db.headers.mapToClass(HttpHeaderObject);
    db.variables.mapToClass(MagicVariableObject);
    db.basicAuth.mapToClass(BasicAuth);
    db.logs.mapToClass(LogObject);
    db.on('error', function(error) {
      console.error('IndexedDB global error', error);
      let pending = arc.app.analytics.sendException('IDB error:: ' + JSON.stringify(error));
      if (pending) {
        window.pendingAnalytics[window.pendingAnalytics.length] = pending;
      }
    });
    db.on('ready', function() {
      if (arc.app.db.idb.upgraded) {
        return;
      }
      arc.app.db.idb._db = db;
      return arc.app.db.idb.populateDatabase(db)
      .then(() => arc.app.db.idb.upgraded = true)
      .catch(() => arc.app.db.idb.upgraded = false);
    });
    arc.app.db.idb.addHooks(db);
    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        console.error('IDB open main catch block', error);
        let pending = arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
        if (pending) {
          window.pendingAnalytics[window.pendingAnalytics.length] = pending;
        }
        reject(error);
      });
  });
};
arc.app.db.idb.addHooks = function(db) {
  var createUpdateTime = (primKey, obj) => {
    obj.updateTime = Date.now();
  };
  var updateUpdateTime = (/*modifications, primKey, obj*/) => {
    return {
      updateTime: Date.now()
    };
  };
  db.projectObjects.hook('creating', createUpdateTime);
  db.projectObjects.hook('updating', updateUpdateTime);

  db.requestObject.hook('creating', createUpdateTime);
  db.requestObject.hook('updating', updateUpdateTime);

  db.variables.hook('creating', createUpdateTime);
  db.variables.hook('updating', updateUpdateTime);
};
/**
 * Populate database with initial data
 *
 * @return {Promise} Fulfilled promise when data were populated or no population is needed.
 */
arc.app.db.idb.populateDatabase = function(db) {
  //if statuses are set headers must be set as well since they are inserted in single transaction.
  return db.statuses.count()
    .then((count) => {
      if (count > 0) {
        console.info('Database already populated');
        return Dexie.Promise.resolve(null);
      }
      return arc.app.db.idb.downloadDefinitions()
        .catch(function() {
          console.warn('Definitions wasn\'t there. skipping definitions installation.');
          return Dexie.Promise.reject(new Error('Definitions location error'));
        });
    })
    .then(function(defs) {
      if (!defs) {
        return Dexie.Promise.resolve(null);
      }

      defs.requests.forEach((item) => {
        item.type = 'request';
        item.key = item.key.toLowerCase();
      });
      defs.responses.forEach((item) => {
        item.type = 'response';
        item.key = item.key.toLowerCase();
      });
      let headers = defs.requests.concat(defs.responses);

      return db.transaction('rw', db.statuses, db.headers, function() {
        console.info('populating database with predefined values');
        let promises = [];
        let codes = defs.codes;
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
    })
    .catch(function(e) {
      console.warn('Database population unsuccessfull.', e);
      let pending = arc.app.analytics.sendException('IDB populate error::' + JSON.stringify(e));
      if (pending) {
        window.pendingAnalytics[window.pendingAnalytics.length] = pending;
      }
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
  var url = chrome.runtime.getURL ? chrome.runtime.getURL('/assets/definitions.json') :
    '/app/assets/definitions.json'; // for test cases
  return fetch(url)
    .then(function(response) {
      return response.json();
    });
};
