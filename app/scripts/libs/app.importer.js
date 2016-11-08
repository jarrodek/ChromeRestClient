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

/**
 * Save imported from file data.
 */
arc.app.importer.saveFileData = function(data) {
  if (app.usePouchDb) {
    return arc.app.importer.saveFileDataPouchDb(data);
  }
  const requests = [];
  const isLegacy = data.kind === undefined ? true : false;
  data.requests.forEach((item) => {
    let obj = arc.app.importer.normalizeRequest(item);
    if (obj) {
      requests.push(obj);
      obj.type = obj.type || 'saved';
    }
  });
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, db.projectObjects, function() {
          const projects = {};
          let promises = [];
          //TODO:60 Is here memory leak?
          let insertRequest = (db, item) => {
            let referencedProjectId = item.project;
            let oldItemId = item.id;
            delete item.project;
            delete item.id;
            return db.requestObject.add(item)
              .then(function(requestId) {
                if (referencedProjectId) {
                  if (!(referencedProjectId in projects)) {
                    let _projects = data.projects.filter(
                      (project) => project.id === referencedProjectId);
                    if (_projects.length === 1) {
                      let project = new ProjectObject({
                        created: _projects[0].time,
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
                } else if (!isLegacy) {
                  for (var i = 0, length = data.projects.length; i < length; i++) {
                    if (!data.projects[i].requestIds) {
                      continue;
                    }
                    if (data.projects[i].requestIds.indexOf(oldItemId) !== -1) {
                      if (!data.projects[i].importRequestIds) {
                        data.projects[i].importRequestIds = [];
                      }
                      data.projects[i].importRequestIds.push(requestId);
                    }
                  }
                }
              });
          };

          requests.forEach((item) => {
            promises.push(insertRequest(db, item));
          });

          return Dexie.Promise.all(promises)
            .then(() => {
              let list = [];
              if (isLegacy) {
                let projectKeys = Object.keys(projects);
                if (projectKeys.length > 0) {
                  projectKeys.forEach((projectKey) => {
                    list.push(new ProjectObject(projects[projectKey]));
                  });
                }
              } else {
                if (data.projects && data.projects.length) {
                  data.projects.forEach((item) => {
                    if (!item.importRequestIds) {
                      item.importRequestIds = [];
                    }
                    item.requestIds = item.importRequestIds;
                    delete item.importRequestIds;
                    list.push(new ProjectObject(item));
                  });
                }
              }

              if (!list.length) {
                return null;
              }
              let promises = [];
              list.forEach((project) => {
                delete project.id;
                promises.push(db.projectObjects.add(project));
              });
              return Dexie.Promise.all(promises);
            });
        })
        .catch(function(error) {
          console.error('An error occurred when importing data.', error);
          // arc.app.analytics.sendException('Importer exception: ' + error.message, false);
          throw error;
        })
        .finally(function() {
          db.close();
        });
    });
};
arc.app.importer.saveFileDataPouchDb = function(data) {
  switch (data.kind) {
    case 'ARC#SavedHistoryDataExport':
    case 'ARC#SavedDataExport':
    case 'ARC#HistoryDataExport':

      return arc.app.importer._saveFileDataPouchDbNew(data);
    case 'ARC#requestsDataExport':
      return arc.app.importer._saveFileDataPouchDbOld(data);
    default:
      return Promise.reject('This file is no longer supported.');
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
},
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
  var obj = {
    _id: today + '/' + encodeURIComponent(item.url) + '/' + item.method,
    method: item.method,
    url: item.url,
    updated: new Date(item.updateTime).getTime()
  };
  // payload and headers
  var entries = item._har.entries;
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
    historyData: arc.app.importer._processHar(item._har),
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
  var obj = {
    _id: encodeURIComponent(item.name || item._name) + '/' + encodeURIComponent(item.url) +
      '/' + item.method,
    name: item.name || item._name,
    method: item.method,
    url: item.url,
    type: 'saved'
  };
  // payload and headers
  var harIndex = item.referenceEntry || 0;
  var entries = item._har.entries;
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
  return {
    originId: item.id,
    historyData: arc.app.importer._processHar(item._har),
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
arc.app.importer._saveFileDataPouchDbNew = function(data) {
  // first save project data and associate _ids with requests.
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
  })
  .then(() => {
    if (!data.history || !data.history.length) {
      console.info('Import does not have history data. Passing.');
      return Promise.resolve();
    }

    data.history.forEach((i) => {
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
    return db.bulkDocs(data.history)
    .then((r) => {
      // console.info('Inserted history', r);
      // resolve conflicts
      let conflicted = [];
      r.forEach((item, index) => {
        if (item.error && item.status === 409) {
          // It exists in the database and it needs a _rev to update objects.
          conflicted[conflicted.length] = data.history[index];
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
      console.error('Insert saved requests error', e, data.history);
      throw e;
    });
  });
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
},
arc.app.importer._insertSavedRequests = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getSavedDb()
    .bulkDocs(data.map((i) => i.request));
},
arc.app.importer._insertHistorydRequests = function(data) {
  if (!data || !data.length) {
    return Promise.resolve();
  }
  return arc.app.importer._getHistoryDb()
    .bulkDocs(data.map((i) => i.request));
},
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
 * Prepare data for export.
 */
arc.app.importer.prepareExport = function(opts) {
  /* global app */
  if (app.usePouchDb) {
    return arc.app.importer.prepareExportPouchDb(opts);
  }
  opts = opts || {};
  var noProjects = false;
  if (opts.type && opts.type === 'history') {
    noProjects = true;
  }
  var db;
  const result = {
    requests: [],
    projects: []
  };
  return arc.app.db.idb.open()
    .then(function(_db) {
      db = _db;
      if (opts.type) {
        return db.requestObject
          .where('type')
          .equals('saved')
          .toArray();
      }
      return db.requestObject
        .limit(10000)
        .toArray();
    })
    .then(function(requests) {
      if (requests && requests.length) {
        requests = requests.filter((item) => !!item._har);
        requests.forEach((item) => item._har = new HAR.Log(item._har));
      }
      result.requests = requests;
      if (noProjects) {
        return [];
      }
      return db.projectObjects
        .toArray();
    })
    .then(function(projects) {
      result.projects = projects;
    })
    .then(function() {
      return arc.app.importer.createExportObject(result);
    })
    .finally(function() {
      db.close();
    });
};
arc.app.importer._cacheDb = null;
arc.app.importer.getDatabase = function() {
  if (arc.app.importer._cacheDb) {
    return Promise.resolve(arc.app.importer._cacheDb);
  }
  return new Promise((resolve, reject) => {
    let request = window.indexedDB.open('arc');
    request.onerror = function(event) {
      reject(event);
    };
    request.onsuccess = function(event) {
      arc.app.importer._cacheDb = event.target.result;
      resolve(event.target.result);
    };
  });
};

arc.app.importer.prepareRequestsExportToPouchDb = function(part) {
  return arc.app.importer._prepareRequestsExportToPouchDb(part)
  .then((data) => {
    if (data.result && data.result.length) {
      data.result = data.result.filter((item) => !!item._har);
      // data.result.forEach((item) => item._har = new HAR.Log(item._har));
    }
    return data;
  });
};

arc.app.importer.prepareExportProjectsToPouchDb = function() {
  return arc.app.importer.getDatabase()
  .then((db) => {
    return new Promise((resolve) => {
      let transaction = db.transaction(['projectObjects'], 'readonly');
      let objectStore = transaction.objectStore('projectObjects');
      let request = objectStore.openCursor();
      let data = [];
      request.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
          data[data.length] = cursor.value;
          cursor.continue();
        } else {
          // console.log('Has keys', keys);
          resolve(data);
        }
      };
      request.onerror = function(event) {
        console.error(event);
      };
    });
  });
};
arc.app.importer._prepareRequestsExportToPouchDb = function(part) {
  var limit = 10000;
  part = part || 0;
  var dbFromIndex = (limit * part);

  return arc.app.importer.getDatabase()
  .then((db) => {
    return new Promise((resolve) => {
      let transaction = db.transaction(['requestObject'], 'readonly');
      let objectStore = transaction.objectStore('requestObject');
      let advanced = dbFromIndex === 0;
      let data = [];
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (!cursor) {
          resolve({
            partial: false,
            result: data
          });
          return;
        }
        if (!advanced) {
          try {
            console.log('Advancing cursor by', dbFromIndex);
            cursor.advance(dbFromIndex);
          } catch (e) {
            // moved past size.
            resolve({
              partial: false,
              result: data
            });
            return;
          }
          advanced = true;
          return;
        }
        data[data.length] = cursor.value;
        if (data.length >= limit) {
          // console.log('Reached limit', limit);
          resolve({
            partial: true,
            result: data
          });
          return;
        }
        cursor.continue();
      };
    });
  });
};

arc.app.importer.prepareExportPouchDb = function(opts) {
  opts = opts || {};
  if (!opts.type) {
    return Promise.reject(new Error('Type of export must be set.'));
  }

  var exportHistory = opts.type === 'history' || opts.type === 'all';
  var exportSaved = opts.type === 'saved' || opts.type === 'all';
  var exportProjects = opts.type === 'saved' || opts.type === 'all';

  const exportData = {
    type: opts.type
  };
  if (exportHistory) {
    exportData.history = [];
  }
  if (exportSaved) {
    exportData.requests = [];
  }
  if (exportProjects) {
    exportData.projects = [];
  }
  var p;
  if (exportHistory) {
    p = arc.app.importer._getHistoryDb().allDocs({
      // jscs:disable
      include_docs: true
      // jscs:enable
    })
    .then((result) => {
      exportData.history = result.rows.map((i) => i.doc);
      return Promise.resolve();
    });
  } else {
    p = Promise.resolve();
  }
  return p.then(() => {
    if (exportSaved) {
      return arc.app.importer._getSavedDb().allDocs({
        // jscs:disable
        include_docs: true
        // jscs:enable
      })
      .then((result) => {
        exportData.requests = result.rows.map((i) => i.doc);
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  })
  .then(() => {
    if (exportProjects) {
      return arc.app.importer._getProjectsDb().allDocs({
        // jscs:disable
        include_docs: true
        // jscs:enable
      })
      .then((result) => {
        exportData.projects = result.rows.map((i) => i.doc);
        return Promise.resolve();
      });
    }
  })
  .then(() => {
    return arc.app.importer.createExportObjectPouchDb(exportData);
  });
};

/**
 * Create a proper export object that have required export definitions.
 *
 * @param {Object} opts
 *  requests - A list of requests to be exported
 *  projects - A list of projects to be exported
 */
arc.app.importer.createExportObject = function(opts) {
  if (app.usePouchDb) {
    return arc.app.importer.createExportObjectPouchDb(opts);
  }
  let exportObject = new FileExport({
    requests: opts.requests,
    projects: opts.projects
  });
  return exportObject;
};

arc.app.importer.createExportObjectPouchDb = function(opts) {
  var result = {
    createdAt: new Date().toISOString(),
    version: arc.app.utils.appVer
  };

  switch (opts.type) {
    case 'all': result.kind = 'ARC#SavedHistoryDataExport'; break;
    case 'saved': result.kind = 'ARC#SavedDataExport'; break;
    case 'history': result.kind = 'ARC#HistoryDataExport'; break;
    default: throw new Error('Unknown export type');
  }

  if (opts.requests && opts.requests.length) {
    opts.requests = opts.requests.map((i) => {
      // to associate projects and requests during import.
      if (i.legacyProject) {
        i._referenceLegacyProject = i.legacyProject;
        delete i.legacyProject;
      }
      delete i._rev;
      delete i._id;
      i.kind = 'ARC#RequestData';
      return i;
    });
    result.requests = opts.requests;
  }

  if (opts.projects && opts.projects.length) {
    opts.projects = opts.projects.map((i) => {
      i._referenceId = i._id; // to associate projects and requests during import.
      delete i._rev;
      delete i._id;
      i.kind = 'ARC#ProjectData';
      return i;
    });
    result.projects = opts.projects;
  }

  if (opts.history && opts.history.length) {
    opts.history = opts.history.map((i) => {
      delete i._rev;
      delete i._id;
      i.kind = 'ARC#HistoryData';
      return i;
    });
    result.history = opts.history;
  }

  return result;
};
/**
 * Setss hours, minutes, seconds and ms to 0 and returns timestamp.
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
}());
