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
 */
window.arc = window.arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the file importer / exporter.
 */
arc.app.importer = arc.app.importer || {};
arc.app.importer._getSavedDb = function() {
  return new PouchDB('saved-requests');
};
arc.app.importer._getHistoryDb = function() {
  return new PouchDB('history-requests');
};
arc.app.importer._getProjectsDb = function() {
  return new PouchDB('legacy-projects');
};
arc.app.importer._getHistoryDataDb = function() {
  return new PouchDB('history-data');
};
arc.app.importer._getWebsocketsHistoryDb = function() {
  return new PouchDB('websocket-url-history');
};
arc.app.importer._getUrlHistoryDb = function() {
  return new PouchDB('url-history');
};
arc.app.importer._getVariablesDb = function() {
  return new PouchDB('variables');
};
arc.app.importer._getVariablesEnvsDb = function() {
  return new PouchDB('variables-environments');
};
arc.app.importer._getHeadersSetsDb = function() {
  return new PouchDB('headers-sets');
};
arc.app.importer._getCookiesDb = function() {
  return new PouchDB('cookies');
};
arc.app.importer._getAuthDataDb = function() {
  return new PouchDB('auth-data');
};

arc.app.importer._getDatabase = function(name) {
  switch (name) {
    case 'saved-requests':
      return arc.app.importer._getSavedDb();
    case 'history-requests':
      return arc.app.importer._getHistoryDb();
    case 'legacy-projects':
      return arc.app.importer._getProjectsDb();
    case 'history-data':
      return arc.app.importer._getHistoryDataDb();
    case 'websocket-url-history':
      return arc.app.importer._getWebsocketsHistoryDb();
    case 'url-history':
      return arc.app.importer._getUrlHistoryDb();
    case 'variables':
      return arc.app.importer._getVariablesDb();
    case 'headers-sets':
      return arc.app.importer._getHeadersSetsDb();
    case 'cookies':
      return arc.app.importer._getCookiesDb();
    case 'auth-data':
      return arc.app.importer._getAuthDataDb();
    default:
      throw new Error(`Database "${name}" unknown.`);
  }
};

/**
 * Save imported from file data.
 */
arc.app.importer.saveFileData = function(data) {
  switch (data.kind) {
    case 'ARC#SavedHistoryDataExport':
    case 'ARC#AllDataExport':
    case 'ARC#SavedDataExport':
    case 'ARC#HistoryDataExport':
      return arc.app.importer._saveFileDataPouchDbNew(data);
    case 'ARC#requestsDataExport':
      return arc.app.importer._saveFileDataPouchDbOld(data);
    default:
      return arc.app.importer.insertLegacyImport(data);
      // return Promise.reject('This file is no longer supported.');
  }
};

arc.app.importer._saveFileDataPouchDbOld = function(data) {
  // In new structure projects do not have a refference to request ids.
  // It's the other way around. It's a bad pattern for object stores but
  // it must suffice for now.
  var projects = data.projects;
  // Requests are de-centralized. History is placed in it's own store, saved the same.
  // Also HAR data is stored in it's own store where each HAR objects is another data object.
  var requests = data.requests;

  var parsedRequests;
  var parsedProjects;
  return arc.app.importer._saveFileDataOldprepareRequestsArrays(requests)
  .then((result) => {
    parsedRequests = result;
    return arc.app.importer._saveFileDataOldProcessProjects(projects);
  })
  .then((result) => {
    parsedProjects = result;
    return arc.app.importer._insertLegacyProjects(result);
  })
  .then((inserts) => {
    parsedProjects = parsedProjects.map((item, i) => {
      item.insertId = inserts[i].id;
      return item;
    });
  })
  .then(() => arc.app.importer._assignLegacyProjects(parsedRequests, parsedProjects))
  .then(() => arc.app.importer._insertSavedRequests(parsedRequests.saved))
  .then(() => arc.app.importer._insertHistorydRequests(parsedRequests.history))
  .then(() => arc.app.importer._insertHistoryData(parsedRequests.har));
};
arc.app.importer._saveFileDataOldProcessProjects = function(projects) {
  if (!projects || !projects.length) {
    return [];
  }
  var list = projects.map((item) => {
    if (!item.requestIds || !item.requestIds.length) {
      return null;
    }
    return {
      updateData: item.requestIds,
      legacyProject: {
        _id: app.$.uuid.generate(),
        name: item.name,
        order: item.order,
        updated: item.updateTime,
        created: item.created
      }
    };
  });
  return list.filter((i) => i !== null);
};
// Returns an array of saved, history and har objects.
arc.app.importer._saveFileDataOldprepareRequestsArrays = function(requests) {
  return new Promise((resolve, reject) => {
    arc.app.importer._saveFileDataOldParsePartRequests(requests, resolve, reject);
  })
  .then((result) => {
    // remove duplicates from the history.
    let ids = [];
    result.history = result.history.filter((item) => {
      if (ids.indexOf(item.request._id) === -1) {
        ids[ids.length] = item.request._id;
        return true;
      }
      return false;
    });
    return result;
  });
};
/**
 * To give a browser a chance to enter to the main loop the work is split to chunks.
 * With this approach the app will not block main thread and will not show "ANR" screen.
 */
arc.app.importer._saveFileDataOldParsePartRequests = function(requests, resolve, reject, saved,
  history, har) {
  saved = saved || [];
  history = history || [];
  har = har || [];
  if (requests.length === 0) {
    resolve({
      saved: saved,
      history: history,
      har: har
    });
    return;
  }
  var len = Math.min(requests.length, 200);
  // Up to 200 loop iteration at once.
  // Then the function return and release main loop.
  for (let i = 0; i < len; i++) {
    let item = requests[i];
    if (item.type === 'history') {
      let result = arc.app.importer._saveFileDataOldParseHistoryItem(item);
      history.push({
        origin: result.originId,
        request: result.request
      });
      har = har.concat(result.historyData);
    } else if (item.type === 'saved') {
      let result = arc.app.importer._saveFileDataOldParseSavedItem(item);
      saved.push({
        origin: result.originId,
        request: result.request
      });
      har = har.concat(result.historyData);
    } else if (item.type === 'drive') {
      let result = arc.app.importer._saveFileDataOldParseDriveItem(item);
      saved.push({
        origin: result.originId,
        request: result.request
      });
      har = har.concat(result.historyData);
    }
  }
  requests.splice(0, len);
  window.setTimeout(() => {
    arc.app.importer._saveFileDataOldParsePartRequests(requests, resolve, reject, saved,
      history, har);
  }, 1);
};
/**
 * Parser for the history request
 * ## The history request object.
 * The request object is consisted with following properties:
 * - _id: url + '/' + method + '/' + date (as today only)
 * - url: String
 * - method: String
 * - headers: String
 * - payload: String
 * - created: time
 *
 * The timestamp in the key represents current day only according to the
 * updateTime property (from the old structure). Each history entry can be saved
 * once per day.
 *
 * @return {Object|null}
 */
arc.app.importer._saveFileDataOldParseHistoryItem = function(item) {
  var today;
  try {
    today = arc.app.importer._getDayToday(item.updateTime);
  } catch (e) {
    today = arc.app.importer._getDayToday(Date.now());
  }
  item.updateTime = item.updateTime || Date.now();
  var obj = {
    _id: today + '/' + encodeURIComponent(item.url) + '/' + item.method,
    method: item.method,
    url: item.url,
    updated: new Date(item.updateTime).getTime()
  };
  // payload and headers
  var har = item._har || item.har;
  var entries = har.entries;
  var entry = entries[entries.length - 1];
  if (entry) {
    let harRequest = entry.request;
    obj.headers = arc.app.importer._parseHarHeders(harRequest.headers);
    obj.payload = harRequest.postData.text;
    let t = new Date(entry.startedDateTime).getTime();
    if (t !== t) {
      t = Date.now();
    }
    obj.created = t;
  } else {
    obj.created = obj.updated;
  }
  return {
    originId: item.id,
    historyData: arc.app.importer._processHar(har),
    request: obj
  };
};
/**
 * Parser for the saved request
 * ## The request object.
 * The request object is consisted with following properties:
 * - _id: name + '/' + url + '/' + method
 * - name: String
 * - url: String
 * - method: String
 * - headers: String
 * - payload: String
 * - created: time
 * - legacyProject: 0
 * @return {Object|null}
 */
arc.app.importer._saveFileDataOldParseSavedItem = function(item) {
  var requestName = item.name || item._name;
  var keyName = requestName;
  if (keyName && keyName[0] === '_') {
    keyName = keyName.substr(1);
  }
  var obj = {
    _id: encodeURIComponent(keyName) + '/' + encodeURIComponent(item.url) +
      '/' + item.method,
    name: requestName,
    method: item.method,
    url: item.url,
    type: 'saved'
  };
  // payload and headers
  var harIndex = item.referenceEntry || 0;
  var har = item._har || item.har;
  if (har) {
    var entries = har.entries;
    var entry;
    if (harIndex || harIndex === 0) {
      entry = entries[harIndex];
    } else {
      entry = entries[0];
    }
    if (entry) {
      let harRequest = entry.request;
      obj.headers = arc.app.importer._parseHarHeders(harRequest.headers);
      obj.payload = harRequest.postData.text;
      let t = new Date(entry.startedDateTime).getTime();
      if (t !== t) {
        t = Date.now();
      }
      obj.created = t;
    }
  }

  return {
    originId: item.id,
    historyData: arc.app.importer._processHar(har),
    request: obj
  };
};
// The same as saved but with drive id
arc.app.importer._saveFileDataOldParseDriveItem = function(item) {
  var result = arc.app.importer._saveFileDataOldParseSavedItem(item);
  result.request.driveId = item.driveId;
  result.request.type = 'google-drive';
  return result;
};
// @returns {!String}
arc.app.importer._parseHarHeders = function(headersArray) {
  if (!headersArray || !headersArray.length) {
    return '';
  }
  return headersArray.map((item) => {
    return item.name + ': ' + item.value;
  }).join('\n');
};

/**
 * The history data object.
 * - _id: autogenerated.
 * - headers
 * - payload
 * - url
 * - method
 * - response: Object
 *   - statusCode
 *   - statusText
 *   - headers
 *   - payload
 * - timings
 * - created: int!
 */
arc.app.importer._processHar = function(har) {
  if (!har || !har.entries || !har.entries.length) {
    console.warn('This should not happen!');
    return null;
  }
  return har.entries.map((item) => {
    let req = item.request;
    let res = item.response;
    let cd = new Date(item.startedDateTime).getTime();
    if (cd !== cd) {
      cd = Date.now();
    }
    // id must contain URL, method and autogenerated string so duplicates can be allowed.
    // Requests analyser will search for the URL (when looking for RAML patterns)
    // and charts analyser will look for URL with method.
    // The URL must be strip from query parameters and hash.
    let url;
    try {
      url = new URL(req.url);
      url.search = '';
      url.hash = '';
      url = url.toString();
    } catch (e) {
      let i = req.url.indexOf('?');
      if (i !== -1) {
        url = req.url.substr(0, i);
      } else {
        url = req.url;
      }
    }
    let id = encodeURIComponent(url) + '/' + req.method + '/' + app.$.uuid.generate();
    // Add some data size calculations
    let requestHeaders = arc.app.importer._parseHarHeders(req.headers);
    let responseHeaders = arc.app.importer._parseHarHeders(res.headers);
    let responseHeadersSize = arc.app.utils.calculateBytes(responseHeaders);
    let responsePayloadSize = arc.app.utils.calculateBytes(res.rawBody);
    let requestPayloadSize = arc.app.utils.calculateBytes(req.payload);
    let requestHeadersSize = arc.app.utils.calculateBytes(requestHeaders);
    return {
      _id: id,
      timings: item.timings,
      totalTime: item.time,
      created: cd,
      request: {
        headers: requestHeaders,
        payload: req.postData.text,
        url: req.url,
        method: req.method,
      },
      response: {
        statusCode: Number(res.status),
        statusText: res.statusText,
        headers: responseHeaders,
        payload: res.content.text
      },
      stats: {
        request: {
          headersSize: requestHeadersSize,
          payloadSize: requestPayloadSize
        },
        response: {
          headersSize: responseHeadersSize,
          payloadSize: responsePayloadSize
        }
      }
    };
  });
};

/**
 * Newest system of data import / export.
 * The import data can contain any of exoired file keys (which are mostly database' names)
 * in import only what is available.
 */
arc.app.importer._saveFileDataPouchDbNew = function(data) {
  var conflictResolution = 'importWins';
  return arc.app.importer.__importRequestsData(data)
  .then(() => arc.app.importer.__importHistoryData(data.history))
  .then(() => arc.app.importer.__importDataWithGeneratedKey(data['websocket-url-history'], 'ARC#WebsocketHistoryData', 'websocket-url-history', conflictResolution))
  .then(() => arc.app.importer.__importDataWithGeneratedKey(data['url-history'], 'ARC#UrlHistoryData', 'url-history', conflictResolution))
  .then(() => arc.app.importer.__importDataWithGeneratedKey(data.cookies, 'ARC#Cookie', 'cookies', conflictResolution))
  .then(() => arc.app.importer.__importDataWithGeneratedKey(data['auth-data'], 'ARC#AuthData', 'auth-data', conflictResolution))
  .then(() => arc.app.importer.__importHeadersSets(data['headers-sets'], conflictResolution));

  //"["variables","headers-sets"]"
};
/**
 * Imports request and projects data in the Pounch DB structure.
 */
arc.app.importer.__importRequestsData = function(data) {
  if (!data || !data.requests || !data.requests.length) {
    console.info('Import does not have request data. Passing requests and projects.');
    return Promise.resolve();
  }
  var p;
  if (data.projects && data.projects.length) {
    var projectsData = data.projects.map((i) => {
      let oldId = i._referenceId;
      delete i._referenceId;
      i._id = app.$.uuid.generate();
      return {
        oldId: oldId,
        save: i
      };
    });
    let db = arc.app.importer._getProjectsDb();
    p = db.bulkDocs(projectsData.map((i) => i.save))
    .then((result) => {
      // console.info('Inserted projects', result);
      result.forEach((item, index) => {
        let data = projectsData[index];
        data.save._id = item.id;
        data.save._rev = item.rev;
        projectsData[index] = data;
      });
      return projectsData;
    });
  } else {
    console.info('Import does not have project data. Passing.');
    p = Promise.resolve([]);
  }

  return p.then((projects) => {
    if (!data.requests || !data.requests.length) {
      // console.info('Import does not have saved data. Passing.');
      return Promise.resolve();
    }
    let requestsSize = data.requests.length;
    // associate requests with projects
    projects.forEach((projectData) => {
      // search for request that has _referenceLegacyProject equal projectData.oldId
      for (var i = 0; i < requestsSize; i++) {
        if (data.requests[i]._referenceLegacyProject &&
          data.requests[i]._referenceLegacyProject === projectData.oldId) {
          delete data.requests[i]._referenceLegacyProject;
          data.requests[i].legacyProject = projectData.save._id;
        }
      }
    });
    data.requests.forEach((i) => {
      delete i._referenceId;
      delete i._har;
      delete i._referenceLegacyProject;
      i._id = encodeURIComponent(i.name) + '/' + encodeURIComponent(i.url) + '/' + i.method;
      if (i.legacyProject) {
        i._id += '/' + i.legacyProject;
      }
    });
    // projects are associated and now it the requests can be saved
    let db = arc.app.importer._getSavedDb();
    return db.bulkDocs(data.requests)
    .then((r) => {
      // console.info('Inserted saved', r);
      // resolve conflicts
      let conflicted = [];
      r.forEach((item, index) => {
        if (item.error && item.status === 409) {
          // It exists in the database and it needs a _rev to update objects.
          conflicted[conflicted.length] = data.requests[index];
        } else if (item.error) {
          console.error('Can not insted saved request into the datastore.', item);
        }
      });
      if (conflicted.length) {
        return arc.app.importer._handleConflictedInserts(db, conflicted);
      }
      return Promise.resolve();
    })
    .catch((e) => {
      console.error('Insert saved requests error', e, data.requests);
      throw e;
    });
  });
};
/**
 * This function will import the history data into the store.
 */
arc.app.importer.__importHistoryData = function(data) {
  if (!data || !data.length) {
    console.info('Import does not have history data. Passing.');
    return Promise.resolve();
  }

  data.forEach((i) => {
    delete i.kind;
    let today;
    try {
      today = arc.app.importer._getDayToday(i.updated || i.created);
    } catch (e) {
      today = arc.app.importer._getDayToday(Date.now());
    }
    i._id = today + '/' + encodeURIComponent(i.url) + '/' + i.method;
  });
  // append history.
  let db = arc.app.importer._getHistoryDb();
  return db.bulkDocs(data)
  .then((r) => arc.app.importer.__resolveImportConflicts(db, r, data))
  .catch((e) => {
    console.error('Insert history data error', e, data);
    throw e;
  });
};
/**
 * A common import function for all the data that have been exported with the database key
 * and stored as a `key` property. In this case the key will be translated into the PouchDb `_id`
 * propoerty and inserted into the database.
 *
 * @param {Array} data A data to insert
 * @param {String} kind Item's `kind` property. If the `kind` value do not match the entry
 * will be rejected from the inport.
 * @param {String} dbName Database name used by the `_getDatabase()` function
 * @param {Strong} conflictResolution Informs what to do when conflict occurr. If set to
 * `importWins` then the import data will override values in the local storage. If set to
 * `localWins` then will not attepmpt to override local data. By default (if not set) it is
 * `importWins`. If it's not any of this two values then error will be raised.
 */
arc.app.importer.__importDataWithGeneratedKey = function(data, kind, dbName, conflictResolution) {
  if (!data || !data.length) {
    return Promise.resolve();
  }

  data = data.map((i) => {
    if (!i.key || i.kind !== kind) {
      return;
    }
    i._id = i.key;
    delete i.kind;
    delete i.key;
    return i;
  })
  .filter((i) => !!i);

  var db = arc.app.importer._getDatabase(dbName);
  return db.bulkDocs(data)
  .then((r) => arc.app.importer.__resolveImportConflicts(db, r, data, conflictResolution))
  .catch((e) => {
    console.error('Insert data error', e, data);
    throw e;
  });
};
/**
 * Imports auth data from the data.
 *
 * @param {Array} data List of auth imports.
 */
arc.app.importer.__importHeadersSets = function(data, conflictResolution) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  data = data.map((i) => {
    if (!i.key || i.kind !== 'ARC#HeadersSet') {
      return;
    }
    delete i.kind;
    i._id = app.$.uuid.generate();
    return i;
  })
  .filter((i) => !!i);

  var db = arc.app.importer._getHeadersSetsDb();
  return db.bulkDocs(data)
  .then((r) => arc.app.importer.__resolveImportConflicts(db, r, data, conflictResolution))
  .catch((e) => {
    console.error('Insert headers sets data error', e, data);
    throw e;
  });
};
/**
 * Imports variables data from the data.
 *
 * @param {Array} data List of variable imports.
 */
arc.app.importer.__importVariables = function(data, conflictResolution) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  var environments = [];
  data = data.map((i) => {
    if (!i.key || i.kind !== 'ARC#Variable') {
      return;
    }
    delete i.kind;
    i._id = app.$.uuid.generate();
    if (i.environment !== 'default' && environments.indexOf(i.environment) === -1) {
      environments[environments.length] = i.environment;
    }
    return i;
  })
  .filter((i) => !!i);

  var db = arc.app.importer._getVariablesDb();
  return db.bulkDocs(data)
  .then((r) => arc.app.importer.__resolveImportConflicts(db, r, data, conflictResolution))
  .then(() => {
    if (!environments.length) {
      return Promise.resolve();
    }
    db = arc.app.importer._getVariablesEnvsDb();
    environments = environments.map((name) => {
      return {
        _id: app.$.uuid.generate(),
        created: Date.now(),
        name: name
      };
    });
    // This time never override co conflict check isn't required.
    return db.bulkDocs(environments);
  })
  .catch((e) => {
    console.error('Insert variable data error', e, data);
    throw e;
  });
};
/**
 * Impoert conflict checks.
 * It should be called after the insert into the datastore.
 *
 * @param {Object} db A PouchDb connection to the datastore.
 * @param {Array} insertResponse A response from the PouchDb's insert action
 * @param {Array} origData List of data that are should be inserted.
 * @param {Strong} conflictResolution Informs what to do when conflict occurr. If set to
 * `importWins` then the import data will override values in the local storage. If set to
 * `localWins` then will not attepmpt to override local data. By default (if not set) it is
 * `importWins`. If it's not any of this two values then error will be raised.
 */
arc.app.importer.__resolveImportConflicts = function(db, insertResponse, origData,
  conflictResolution) {
  conflictResolution = conflictResolution || 'importWins';
  if (['importWins', 'localWins'].indexOf(conflictResolution) === -1) {
    throw new Error('Value for the `conflictResolution` property is invalid', conflictResolution);
  }
  if (conflictResolution === 'localWins') {
    return Promise.resolve();
  }

  var conflicted = [];
  insertResponse.forEach((item, index) => {
    if (item.error && item.status === 409) {
      // It exists in the database and it needs a _rev to update objects.
      conflicted[conflicted.length] = origData[index];
    } else if (item.error) {
      console.error('Can not insted the data into the datastore.', item);
    }
  });

  if (conflicted.length) {
    return arc.app.importer._handleConflictedInserts(db, conflicted);
  }
  return Promise.resolve();
};

arc.app.importer._handleConflictedInserts = function(db, conflicted) {
  return db.allDocs({keys: conflicted.map((i) => i._id)})
  .then((result) => {
    let promises = result.rows.map((i, index) => {
      // i.id + i.value.rev + i.value.deleted
      if (i.value.deleted) {
        return db.get(i.id, {rev: i.value.rev})
        .then((r) => {
          r._deleted = false;
          return db.put(r);
        })
        .then((result) => {
          conflicted[index]._rev = result.rev || result._rev;
          return conflicted[index];
        });
      }
      conflicted[index]._rev = i.value.rev;
      return Promise.resolve(conflicted[index]);
    });
    return Promise.all(promises);
  })
  .then((_data) => db.bulkDocs(_data))
  .then((r) => console.info('Conflicted insert', r));
};
arc.app.importer._insertLegacyProjects = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getProjectsDb()
    .bulkDocs(data.map((i) => i.legacyProject));
};
arc.app.importer._insertSavedRequests = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getSavedDb()
    .bulkDocs(data.map((i) => i.request));
};
arc.app.importer._insertHistorydRequests = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getHistoryDb()
    .bulkDocs(data.map((i) => i.request));
};
arc.app.importer._insertHistoryData = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getHistoryDataDb().bulkDocs(data);
};
arc.app.importer._assignLegacyProjects = function(data, projects) {
  if (!projects || !projects.length) {
    return;
  }
  data.saved = data.saved || [];
  var savedLen = data.saved.length;
  for (let i = 0, pLen = projects.length; i < pLen; i++) {
    let project = projects[i];
    if (!project || !project.insertId) {
      continue;
    }
    let newProjectId = project.insertId;
    for (let j = 0, rLen = project.updateData.length; j < rLen; j++) {
      let rId = project.updateData[j];
      for (let k = 0; k < savedLen; k++) {
        if (data.saved[k].origin === rId) {
          if (!data.saved[k].legacyProject) {
            data.saved[k].request._id += '/' + newProjectId;
            data.saved[k].request.legacyProject = newProjectId;
            break;
          }
        }
      }
    }
  }
};
arc.app.importer.normalizeRequest = function(item) {
  delete item.id;
  delete item._id;
  delete item._rev;

  if (item.kind === 'ARC#RequestObject') {
    return arc.app.importer._parseLegacySavedItem(item);
  } else if (item.kind === 'ARC#RequestData') {
    delete item.kind;
    return item;
  }

  try {
    let obj = arc.app.importer._createHARfromSql(item);
    //just for import, to be removed before save.
    if (item.project) {
      obj.project = item.project;
    }
    obj = arc.app.importer._parseLegacySavedItem(obj);
    obj.type = 'history';
    return obj;
  } catch (e) {
    console.error('Unable to import request object', item, e.message);
    // arc.app.analytics.sendException('Importer exception (normalize): ' + e.message, false);
  }
  return null;
};

/**
 * Parser for the legacy saved request
 * ## The request object.
 * The request object is consisted with following properties:
 * - name: String
 * - url: String
 * - method: String
 * - headers: String
 * - payload: String
 * - created: time
 * - legacyProject: 0
 * @return {Object|null}
 */
arc.app.importer._parseLegacySavedItem = function(item) {
  var obj = {
    name: item.name,
    method: item.method,
    url: item.url,
    type: item.type === 'drive' ? 'google-drive' : 'saved'
  };
  // payload and headers
  var harIndex = item.referenceEntry || 0;
  var entries = item.har ? item.har.entries : null;
  if (!entries) {
    return obj;
  }
  var entry;
  if (harIndex || harIndex === 0) {
    entry = entries[harIndex];
  } else {
    entry = entries[0];
  }
  if (entry) {
    let harRequest = entry.request;

    if (harRequest.headers && harRequest.headers.length) {
      obj.headers = harRequest.headers.map((item) => {
        return item.name + ': ' + item.value;
      }).join('\n');
    } else {
      obj.headers = '';
    }
    obj.payload = harRequest.postData.text;
    let t = new Date(entry.startedDateTime).getTime();
    if (t !== t) {
      t = Date.now();
    }
    obj.created = t;
  }
  return obj;
};
/**
 * To be used to transform old system data to new data structure.
 *
 * @param {Object} item
 *  {
 *    "url": "Request URL",
 *    "method": "Request HTTP method",
 *    "encoding": "Old encoding value",
 *    "payload": "HTTP entity",
 *    "headers": "HTTP headers",
 *    "project": "Id of the project",
 *    "time": "Add time"
 *  }
 */
arc.app.importer._createHARfromSql = function(item) {
  var creator = new HAR.Creator({
    name: 'Advanced REST client',
    version: arc.app.utils.appVer,
    comment: 'Created during file import'
  });
  var browser = new HAR.Browser({
    name: 'Chrome',
    version: arc.app.utils.chromeVersion
  });
  var log = new HAR.Log({
    'comment': 'Imported from the file.',
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
  if (!item.time) {
    item.time = Date.now();
  }
  request.headers = requestHeaders;
  var page = new HAR.Page({
    id: arc.app.db.idb.createRequestKey(item.method, item.url),
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
    'type': 'saved'
  });
  return obj;
};

/**
 * Sets hours, minutes, seconds and ms to 0 and returns timestamp.
 *
 * @return {Number} Timestamp to the day.
 */
arc.app.importer._getDayToday = function(timestamp) {
  var d = new Date(timestamp);
  var tCheck = d.getTime();
  if (tCheck !== tCheck) {
    throw new Error('Invalid timestamp: ' + timestamp);
  }
  d.setMilliseconds(0);
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  return d.getTime();
};

arc.app.importer.insertLegacyImport = function(data) {
  var projects = arc.app.importer.transformLegacyProjects(data.projects);
  // {"id":Number, "name":String, "created":Number}
  // {created: Number, name: String, order: 0, updated: Number}
  var requests = arc.app.importer.transformLegacyRequests(data.requests, projects);
  // Structure
  // {
  //  "id":Number,
  //  "encoding": String,
  //  "headers": String,
  //  "method": String,
  //  "name": String,
  //  "payload": String,
  //  "project": Number,
  //  "time": Number,
  //  "url": String,
  //  "driveId": String
  // }
  // transform into
  // {
  //  created: Number,
  //  headers: String,
  //  legacyProject: String,
  //  method: String,
  //  name: String
  //  payload: String,
  //  type: String,
  //  url: String,
  //  driveId?: String
  // }
  projects = projects.map((item) => {
    delete item._oldId;
    return item;
  });
  var projectsDb = arc.app.importer._getProjectsDb();
  return projectsDb.bulkDocs(projects)
  .then(() => {
    let db = arc.app.importer._getSavedDb();
    return db.bulkDocs(requests)
    .then((r) => {
      // resolve conflicts
      let conflicted = [];
      r.forEach((item, index) => {
        if (item.error && item.status === 409) {
          // It exists in the database and it needs a _rev to update objects.
          conflicted[conflicted.length] = data.requests[index];
        } else if (item.error) {
          console.error('Can\'t insted saved request into the datastore.', item);
        }
      });
      if (conflicted.length) {
        return arc.app.importer._handleConflictedInserts(db, conflicted);
      }
      return Promise.resolve();
    })
    .catch((e) => {
      console.error('Insert saved requests error', e, data.requests);
      throw e;
    });
  });
};
arc.app.importer.transformLegacyProjects = function(projects) {
  if (!projects || !(projects instanceof Array) || !projects.length) {
    return [];
  }
  return projects.map((item) => {
    let created = Number(item.created);
    if (created !== created) {
      created = Date.now();
    }
    return {
      _id: app.$.uuid.generate(),
      created: created,
      name: item.name,
      order: 0,
      updated: created,
      _oldId: item.id
    };
  });
};
arc.app.importer.transformLegacyRequests = function(requests, projects) {
  if (!requests || !(requests instanceof Array) || !requests.length) {
    return [];
  }
  return requests.map((item) => {
    // generate an ID
    item.name = item.name || 'unnamed';
    let _id = encodeURIComponent(item.name) + '/' + encodeURIComponent(item.url) + '/' +
      item.method;
    let legacyProject = arc.app.importer.findProject(item.project, projects);
    if (legacyProject) {
      _id += '/' + legacyProject._id;
    }

    let created = Number(item.time);
    if (created !== created) {
      created = Date.now();
    }

    let result = {
      _id: _id,
      created: created,
      headers: item.headers,
      legacyProject: legacyProject ? legacyProject._id : undefined,
      method: item.method,
      name: item.name,
      payload: item.payload,
      type: 'saved',
      url: item.url
    };

    if (item.driveId) {
      result.driveId = item.driveId;
      result.type = 'google-drive';
    }

    return result;
  });
};

arc.app.importer.findProject = function(projectId, projects) {
  if (!projectId || !projects || !(projects instanceof Array) || !projects.length) {
    return;
  }
  for (var i = 0, len = projects.length; i < len; i++) {
    if (projects[i]._oldId === projectId) {
      return projects[i];
    }
  }
};
}());
