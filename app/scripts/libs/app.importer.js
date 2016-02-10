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
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the file importer / exporter.
 */
arc.app.importer = arc.app.importer || {};
/**
 * Save imported from file data.
 */
arc.app.importer.saveFileData = function(data) {
  const requests = [];
  const isLegacy = data.kind === undefined ? true : false;
  data.requests.forEach((item) => {
    let obj = arc.app.importer.normalizeRequest(item);
    if (obj) {
      requests.push(obj);
      obj.type = 'saved';
    }
  });
  return arc.app.db.idb.open()
    .then(function(db) {
      return db.transaction('rw', db.requestObject, db.projectObjects, function() {
          const projects = {};
          let promises = [];
          //TODO: Is here memory leak?
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
          throw error;
        })
        .finally(function() {
          db.close();
        });
    });
};
arc.app.importer.normalizeRequest = function(item) {
  if (item.kind) {
    let har = item._har ? item._har : item.har;
    if (har) {
      item.har = new HAR.Log(har);
    }
    delete item._har;
    item = new RequestObject(item);
    return item;
  }
  try {
    let obj = arc.app.importer._createHARfromSql(item);
    //just for import, to be removed before save.
    if (item.project) {
      obj.project = item.project;
    }
    return obj;
  } catch (e) {
    console.error('Unable to import request object', item, e.message);
  }
  return null;
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
  request.headers = requestHeaders;
  var page = new HAR.Page({
    id: arc.app.db.idb.requests.createRequestKey(item.method, item.url),
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
arc.app.importer.prepareExport = function() {
  var db;
  const result = {
    requests: [],
    projects: []
  };
  return arc.app.db.idb.open()
    .then(function(_db) {
      db = _db;
      return db.requestObject
        .where('type')
        .equals('saved')
        .toArray();
    })
    .then(function(requests) {
      if (requests && requests.length) {
        requests.forEach((item) => item._har = new HAR.Log(item._har))
      }
      result.requests = requests;
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
/**
 * Create a proper export object that have required export definitions.
 *
 * @param {Object} opts
 *  requests - A list of requests to be exported
 *  projects - A list of projects to be exported
 */
arc.app.importer.createExportObject = function(opts) {
  let exportObject = new FileExport({
    requests: opts.requests,
    projects: opts.projects
  });
  return exportObject;
};
