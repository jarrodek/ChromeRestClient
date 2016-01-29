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
arc.app.db.init = function(){
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
    return arc.app.db.idb.putHistorySocket(url, time);
  }
  return arc.app.db.websql.insertWebsocketData(url, time);
};
arc.app.db.websockets.query = function(query) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.queryHistorySockets(query);
  }
  return arc.app.db.websql.queryWebsocketData('%' + query + '%');
};

arc.app.db.projects.add = function() {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.addProjectWithRequests.apply(arc.app.db.idb, arguments)
    .then(function(insertId){
      return arc.app.db.idb.getProject(insertId);
    });
  }
  return arc.app.db.websql.addProject.apply(arc.app.db.websql, arguments)
  .then(function(insertId){
      return arc.app.db.websql.getProject(insertId);
    });
};
arc.app.db.projects.update = function(project) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.updateProject(project);
  }
  if (!project.created) {
    project.created = new Date();
  }
  return arc.app.db.websql.updateProject(project.name, project.created.getTime(), project.id);
};
/** List all projects */
arc.app.db.projects.list = function() {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.listProjects();
  }
  return arc.app.db.websql.listProjects();
};
arc.app.db.projects.getProject = function(id) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getProject(id);
  }
  return arc.app.db.websql.getProject(id);
};
arc.app.db.projects.remove = function(id) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.deleteProject(id);
  }
  return arc.app.db.websql.deleteProject(id);
};
/**
 * Get request referenced with project represented by projectId.
 *
 * @param {Number} projectId ID of the project.
 * @return {Promise} Fulfilled promise will result with list of {@link RequestObject}
 */
arc.app.db.requests.getProjectRequests = function(projectId) {
  if (arc.app.db.useIdb) {
    return arc.app.db.idb.getProjectRequests(projectId);
  }
  return arc.app.db.websql.getProjectRequests(projectId);
};
