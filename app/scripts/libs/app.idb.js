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

/* global Dexie, HistoryUrlObject, HistorySocketObject, ProjectObject,
 ServerExportedObject, RequestObject, HttpStatusObject, HttpHeaderObject, MagicVariableObject */
window.pendingAnalytics = window.pendingAnalytics || [];
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
 * Open the database.
 *
 * @returns {Promise} The promise when ready.
 */
arc.app.db.idb.open = function() {
  return new Dexie.Promise(function(resolve, reject) {
    var db = arc.app.db.idb._getDb();
    arc.app.db.idb.mapsObjects(db);
    arc.app.db.idb.addHooks(db);
    // db.on('error', function(error) {
    //   console.error('IndexedDB global error', error);
    //   let pending = arc.app.analytics.sendException('IDB error:: ' + JSON.stringify(error));
    //   if (pending) {
    //     window.pendingAnalytics[window.pendingAnalytics.length] = pending;
    //   }
    // });
    db.open()
      .then(function() {
        resolve(db);
      })
      .catch(function(error) {
        console.error('IDB open main catch block', error);
        // let pending = arc.app.analytics.sendException('IDB create error::' + JSON.stringify(error));
        // if (pending) {
        //   window.pendingAnalytics[window.pendingAnalytics.length] = pending;
        // }
        reject(error);
      });
  });
};
arc.app.db.idb.mapsObjects = function(db) {
  db.projectObjects.mapToClass(ProjectObject);
  db.serverExportObjects.mapToClass(ServerExportedObject);
  db.requestObject.mapToClass(RequestObject);
  db.historySockets.mapToClass(HistorySocketObject);
  db.historyUrls.mapToClass(HistoryUrlObject);
  db.statuses.mapToClass(HttpStatusObject);
  db.headers.mapToClass(HttpHeaderObject);
  db.variables.mapToClass(MagicVariableObject);
  db.basicAuth.mapToClass(AuthData);
  db.logs.mapToClass(LogObject);
  db.cookies.mapToClass(Cookie);
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
  var createDbUuid = () => {
    return arc.app.utils.uuid();
  };
  db.projectObjects.hook('creating', createUpdateTime);
  db.projectObjects.hook('updating', updateUpdateTime);

  db.requestObject.hook('creating', createUpdateTime);
  db.requestObject.hook('updating', updateUpdateTime);

  db.variables.hook('creating', createUpdateTime);
  db.variables.hook('updating', updateUpdateTime);

  db.cookies.hook('creating', createDbUuid);
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
}());
