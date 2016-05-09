(function() {
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
  /**
   * Advanced Rest Client namespace
   *
   * @namespace
   */
  window.arc = window.arc || {};
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
  arc.app.db.idb = arc.app.db.idb || {};
  /**
   * Gets a handler to the database object.
   * This is moved from main script to be able
   * to include it into the background page without all the dependencies.
   */
  arc.app.db.idb._getDb = function(opts) {
    opts = opts || {};
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
    db.version(5)
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
        logs: '&time,type',
        cookies: '&uuid,domain,path,name,[domain+path]'
      });
    db.version(6)
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
        logs: '&time,type',
        cookies: '&uuid,_domain,name'
      });
    db.version(7)
      .stores({
        headers: '&[key+type],key,type',
        statuses: '&key',
        historyUrls: '&url',
        historySockets: '&url',
        requestObject: '++id,url,method,[url+method],type,_name',
        serverExportObjects: '[serverId+requestId],serverId,requestId',
        projectObjects: '++id,*requestIds',
        variables: '++id,variable,type',
        basicAuth: '&url,type',
        logs: '&time,type',
        cookies: '&uuid,_domain,name'
      }).upgrade(function(tx) {
        tx.basicAuth.toCollection().modify(function(item) {
          item.type = 'basic';
        });
      });
    if (opts.checkInstall) {
      db.on('ready', function() {
        if (arc.app.db.idb.upgraded) {
          return;
        }
        // arc.app.db.idb._db = db;
        return arc.app.db.idb.populateDatabase(db)
          .then(() => arc.app.db.idb.upgraded = true)
          .catch(() => arc.app.db.idb.upgraded = false);
      });
    }
    return db;
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
          // console.info('Database already populated');
          return Dexie.Promise.resolve(null);
        }
        return new Dexie.Promise((resolve, reject) => {
          arc.app.db.idb.downloadDefinitions()
          .then((response) => {
            resolve(response);
          })
          .catch(function() {
            console.warn('Definitions wasn\'t there. Skipping definitions installation.');
            reject(new Error('Definitions location error'));
          });
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
          console.info('Populating database with predefined values');
          let promises = [];
          let codes = defs.codes;
          codes.forEach(function(item) {
            let p = db.statuses.add(item).catch((e) => {
              if (e.name && e.name === 'ConstraintError') {
                // Key exists, nothing to do here.
                return;
              }
              console.warn('Unable to insert status code definition.', e);
            });
            promises.push(p);
          });
          headers.forEach(function(item) {
            let p = db.headers.add(item).catch((e) => {
              if (e.name && e.name === 'ConstraintError') {
                // Key exists, nothing to do here.
                return;
              }
              console.warn('Unable to insert header definition.', e);
            });
            promises.push(p);
          });
          return Dexie.Promise.all(promises);
        });
      })
      .then(function(res) {
        if (res) {
          console.log('The database has been populated with predefined data.');
        } else {
          console.log('Database version %d is ready.', db.verno);
        }
      })
      .catch(function(e) {
        console.warn('Database population unsuccessfull.', e.message);
        console.warn(JSON.stringify(e));
        if (!window.pendingAnalytics) {
          window.pendingAnalytics = [];
        }
        window.pendingAnalytics[window.pendingAnalytics.length] = {
          'type': 'exception',
          'params': ['IDB populate error::' + JSON.stringify(e), 'false']
        };
      });
  };
  arc.app.db.idb.downloadDefinitions = function() {
    var url = chrome.runtime.getURL ? chrome.runtime.getURL('/assets/definitions.json') :
      '/app/assets/definitions.json'; // for test cases
    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  };
})();
