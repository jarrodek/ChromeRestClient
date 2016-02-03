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
var arc = arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for app database services
 *
 * @namespace
 */
arc.app.db = arc.app.db || {};
/**
 * True if IndexedDB should be used to handle DB connection.
 *
 * @type {Boolean}
 */
arc.app.db.useIdb = false;
/**
 * A namespace for status codes definitions queries
 *
 * @namespace
 */
arc.app.db.statuses = {};
/**
 * A namespace for headers definitions queries
 *
 * @namespace
 */
arc.app.db.headers = {};
/**
 * A namespace for exported to app server data queries
 *
 * @namespace
 */
arc.app.db.exported = {};
/**
 * A namespace for websocket history urls queries
 *
 * @namespace
 */
arc.app.db.websockets = {};
/**
 * A namespace for projects queries
 *
 * @namespace
 */
arc.app.db.projects = {};
/**
 * A namespace for requests queries
 *
 * @namespace
 */
arc.app.db.requests = {};
/**
 * A namespace for url history queries
 *
 * @namespace
 */
arc.app.db.urls = {};
/**
 * Init db adapter.
 * It setups which driver should be used to handle database connection.
 */
arc.app.db.init = function() {
  arc.app.settings.getConfig()
    .then((cfg) => {
      arc.app.db.useIdb = cfg.useIdb;
    });
};
/**
 * Get status code definition by it's code.
 *
 * @param {Number} code HTTP status code to look for
 * @return {Promise} Fulfilled promise will result with a {@link
 * HttpStatusObject}
 */
arc.app.db.statuses.getCode = function(code) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getStatusCode(code);
  }
  return arc.app.db.websql.getStatusCode();
};
/**
 * Get header from the storage by it's name and type
 * 
 * @param {String} name A header name to look for
 * @param {String} type Either `request` or `response`
 * @return {Promise} Fulfilled promise will result with a {@link
 * HttpHeaderObject}
 */
arc.app.db.headers.getHeader = function(name, type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getHeaderByName(name, type);
  }
  return arc.app.db.websql.getHeaderByName(name, type);
};
/**
 * Get list of headers by name and type
 *
 * @param {String} name A header name to look for
 * @param {String} type Either `request` or `response`
 * @return {Promise} Fulfilled promise will result with list of {@link
 * HttpHeaderObject}
 */
arc.app.db.headers.list = function(name, type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getHeadersByName(name, type)
      .then((item) => {
        item.name = item.key;
        return item;
      });
  }
  return arc.app.db.websql.getHeadersByName(name + '%', type);
};
/**
 * Add new / update URL history value.
 *
 * @param {String} url The user to add
 * @param {Date|Number} time Time of creation.
 * @return {Promise} Fulfilled promise will result with id of created {@link
 * HistoryUrlObject}
 */
arc.app.db.urls.insert = function(url, time) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.putHistoryUrl(url, time);
  }
  return arc.app.db.websql.addUrlHistory(url, time);
};
/**
 * Update a value in a `urls` table.
 */
arc.app.db.urls.update = function(url, time) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.putHistoryUrl(url, time);
  }
  return arc.app.db.websql.updateUrlHistory(url, time);
};
/**
 * Get url values from the `urls` table matching `query`. This function will
 * return all entries that starts with `query`
 *
 * @param {String} query A search string to look for.
 * @return {Promise} Fulfilled promise will result with list of {@link
 * HistoryUrlObject}
 */
arc.app.db.urls.list = function(query) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getHistoryUrls(query);
  }
  return arc.app.db.websql.updateUrlHistory(query + '%');
};
/**
 * Insert a list of exported items references.
 *
 */
arc.app.db.exported.insert = function(refArray) {
  if (arc.app.db.useIdb) {
    let inserts = [];
    refArray.forEach((item) => {
      let obj = {
        // jscs:disable
        /* jshint ignore:start */
        'requestId': item.reference_id,
        // jscs:enable
        /* jshint ignore:end */
        'serverId': item.gaeKey
      };
      if (item.id) {
        obj.oldId = item.id;
      }
      inserts.push(obj);
    });
    return arc.app.db.idb.insertExported(inserts);
  }
  return arc.app.db.websql.insertExported(refArray);
};
/**
 * Query for exported item by a request ID (reference id)
 *
 * @param  {Array<Number>} requestsArray A list of IDs of the referenced requests.
 */
arc.app.db.exported.query = function(requestsArray) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.listExported(requestsArray)
      .then((dbList) => {
        let legacyList = [];
        dbList.forEach((item) => {
          legacyList.push({
            // jscs:disable
            /* jshint ignore:start */
            'reference_id': item.requestId,
            // jscs:enable
            /* jshint ignore:end */
            'gaeKey': item.serverId
          });
        });
        return legacyList;
      });
  }
  return arc.app.db.websql.getExportedByReferenceIds(requestsArray);
};

arc.app.db.websockets.insert = function(url, time) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.websockets.insert(url, time);
  }
  return arc.app.db.websql.insertWebsocketData(url, time);
};
arc.app.db.websockets.query = function(query) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.websockets.query(query);
  }
  return arc.app.db.websql.queryWebsocketData('%' + query + '%');
};

arc.app.db.projects.add = function() {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.addWithRequests.apply(arc.app.db.idb, arguments)
      .then(function(insertId) {
        return arc.app.db.idb.getProject(insertId);
      });
  }
  return arc.app.db.websql.addProject.apply(arc.app.db.websql, arguments)
    .then(function(insertId) {
      return arc.app.db.websql.getProject(insertId);
    });
};
arc.app.db.projects.update = function(project) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.update(project);
  }
  if (!project.created) {
    project.created = new Date();
  }
  return arc.app.db.websql.updateProject(project.name, project.created.getTime(), project.id);
};
/** List all projects */
arc.app.db.projects.list = function() {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.list();
  }
  return arc.app.db.websql.listProjects();
};
arc.app.db.projects.getProject = function(id) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.getProject(id);
  }
  return arc.app.db.websql.getProject(id);
};
arc.app.db.projects.getForRequest = function(requestId) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.getForRequest(requestId);
  }
  return arc.app.db.websql.getProjectByRequest(requestId);
};
arc.app.db.projects.remove = function(id) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.deleteRecursive(id);
  }
  return arc.app.db.websql.deleteProject(id);
};
arc.app.db.projects.importData = function(projects, requests) {
  if (arc.app.db.useIdb) {
    let pMap = new Map();
    for (let i in projects) {
      let project = projects[i];
      pMap.set(project.id, {
        project: project,
        requests: []
      });
    }
    for (let i = requests.length - 1; i >= 0; i--) {
      let request = requests[i];
      let isProject = request.project > 0;
      if (!isProject) {
        continue;
      }
      if (!pMap.has(request.project)) {
        continue;
      }
      let data = pMap.get(request.project);
      data.requests.push(request);
      pMap.set(request.project, data);
      requests.splice(i, 1);
    }
    let promises = [];
    for (let value of pMap.values()) {
      if (value.requests.length === 0) {
        continue;
      }
      promises.push(arc.app.db.idb.projects.addWithRequests(
        value.project, value.requests));
    }
    promises.push(arc.app.db.idb.requests.import(requests));
    return Promise.all(promises);
  } else {
    return new Promise(function(resolve, reject) {
      let insertRequests = function(requests) {
        if (!requests || requests.length === 0) {
          console.warn('Request data is empty.');
          resolve();
          return;
        }
        requests.forEach((item) => {
          if (!item.project) {
            item.project = 0;
          }
        });
        arc.app.db.requests.importList(requests)
          .then(resolve)
          .catch(reject);
      };

      if (projects && projects.length > 0) {
        arc.app.db.websql.importProjects2(projects)
          .then(function(inserts) {
            let requestsSize = requests.length;
            for (let i = 0, len = inserts.length; i < len; i++) {
              let currentProjectId = inserts[i];
              let exportedProjectId = projects[i].id;
              for (let j = 0; j < requestsSize; j++) {
                let r = requests[j];
                if (!r.project) {
                  r.project = 0;
                }
                if (r.project === exportedProjectId) {
                  r.project = currentProjectId;
                }
              }
            }
            insertRequests(requests);
          })
          .catch(reject);
      } else {
        insertRequests(requests);
      }
    });
  }
};
/**
 * Get request referenced with project represented by projectId.
 *
 * @param {Number} projectId ID of the project.
 * @return {Promise} Fulfilled promise will result with list of {@link RequestObject}
 */
arc.app.db.requests.getProjectRequests = function(projectId) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.getProjectRequests(projectId)
      .then(function(list) {
        let result = [];
        list.forEach((item) => {
          result.push(arc.app.db.idb._converIdbSql(item));
        });
        return result;
      });
  }
  return arc.app.db.websql.getProjectRequests(projectId);
};

arc.app.db.requests.insert = function(legacyRequestObject, type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.insert(legacyRequestObject, type);
  }
  return arc.app.db.websql.insertHistoryObject(legacyRequestObject);
};
arc.app.db.requests.importList = function(legacyRequestList) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.import(legacyRequestList);
  }
  return arc.app.db.websql.importRequests(legacyRequestList);
};
arc.app.db.requests.getRequest = function(id, type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.getRequest(id)
      .then(arc.app.db.idb._converIdbSql);
  }
  if (type === 'history') {
    return arc.app.db.websql.getHistoryObject(id);
  } else {
    return arc.app.db.websql.getRequest(id);
  }
};
arc.app.db.requests.list = function(type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.list(type)
      .then(function(list) {
        let result = [];
        list.forEach((item) => {
          result.push(arc.app.db.idb._converIdbSql(item));
        });
        return result;
      });
  }
  if (type === 'history') {
    return arc.app.db.websql.getAllHistoryObjects();
  }
  return arc.app.db.websql.listRequestObjects();
};
/** Remove single entry */
arc.app.db.requests.remove = function(id) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.delete(id);
  }
  return arc.app.db.websql.removeHistoryObject(id);
};
/** Remove all entries for given type */
arc.app.db.requests.removeAll = function(type) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.deleteType(type);
  }
  if (type === 'history') {
    return arc.app.db.websql.truncateHistoryTable();
  }
  throw new Error('Unsupported API call'); // no remove all saved action in the UI.
};
arc.app.db.requests.deleteByProject = function(projectId) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.deleteByProject(projectId);
  }
  return arc.app.db.websql.deleteRequestByProject(projectId);
};
arc.app.db.requests.update = function(obj) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.update(obj);
  }
  return arc.app.db.websql.updateRequestObject(obj);
};
arc.app.db.requests.updateName = function(id, name) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.requests.updateRequestName(id, name);
  }
  return arc.app.db.websql.updateRequestName(id, name);
};
/**
 * Query the request objects.
 * @param {String} type Type of request object. Either `saved` or `history`
 * @param {Object} queryOpts Query options:
 * - limit {Number} Number of results
 * - offset {Number} Starting point
 * - query {String} Optional, a url to query for
 * - exclude {Array<Number>} Optional. A list of requests that should be excluded from the query.
 * @return {Promise} Fulfilled promise will result with legacy request objects structure.
 */
arc.app.db.requests.query = function(type, queryOpts) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.projects.list()
      .then(function(projects) {
        var requestsIds = [];
        projects.forEach((item) => {
          requestsIds = requestsIds.concat(item.requestIds);
        });
        if (requestsIds.length > 0) {
          queryOpts.exclude = requestsIds;
        }
      })
      .then(() => arc.app.db.idb.requests.query(type, queryOpts))
      .then(function(list) {
        let result = [];
        list.forEach((item) => {
          result.push(arc.app.db.idb._converIdbSql(item));
        });
        return result;
      });
  }
  if (type === 'history') {
    return arc.app.db.websql.queryHistoryTable(queryOpts);
  }
  return arc.app.db.websql.queryRequestsTable(queryOpts);
};
