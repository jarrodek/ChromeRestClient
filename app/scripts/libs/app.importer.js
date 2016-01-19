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
ServerExportedObject, RequestObject */

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

  data.requests.forEach((item) => {
    try {
      let obj = arc.app.importer._createHARfromSql(item);
      //just for import, to be removed before save. 
      if (item.project) {
        obj.project = item.project;
      }
      requests.push(obj);
    } catch (e) {
      console.error('Unable to import request object', item, e.message);
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
            delete item.project;
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
                }
              });
          };
          requests.forEach((item) => {
            promises.push(insertRequest(db, item));
          });
          return Dexie.Promise.all(promises)
            .then(() => {
              if (Object.keys(projects)
                .length > 0) {
                Object.keys(projects)
                  .forEach((projectKey) => {
                    db.projectObjects.add(projects[projectKey]);
                  });
              }
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
    version: arc.app.utils.appVer(),
    comment: 'Created during file import'
  });
  var browser = new HAR.Browser({
    name: 'Chrome',
    version: arc.app.utils.getChromeVersion()
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
    'type': 'saved'
  });
  return obj;
};
