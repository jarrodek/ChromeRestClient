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
/* global Headers */
/**
 * Library for making a requests to the app's API.
 */

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the app server API
 */
arc.app.server = arc.app.server || {};
/**
 * A namespace for request object builder.
 */
arc.app.server.request = {};
/**
 * Initialize the library. This should be called once.
 */
arc.app.server.request.init = function() {
  var root = 'https://chromerestclient.appspot.com/';
  root = 'http://127.0.0.1:8888/';
  arc.app.server.request.SERVICE_URL = root + 'ext-channel';
  arc.app.server.request.PING_URL = root + 'ping/session';
  arc.app.server.request.AUTH_URL = root + 'auth';
  arc.app.server.request.ASSETS_URL = root + 'static/';
  arc.app.server.request.MESSAGES_URL = root + 'messages/';

  arc.app.server.request.SUGGESTIONS_LISTING = arc.app.server.request.SERVICE_URL + '/list/';
  arc.app.server.request.GET_IMPORT_DATA = arc.app.server.request.SERVICE_URL + '/get';
  arc.app.server.request.EXPORT_DATA = arc.app.server.request.SERVICE_URL + '/put';
};

/**
 * Build a base for the request
 */
arc.app.server.request.buildRequest = function(url, method, body) {
  var init = {
    method: method || 'GET',
    credentials: 'include',
    cache: 'no-cache'
  };
  var headers = new Headers();
  headers.append('X-Chrome-Extension', 'ChromeRestClient');
  if (body) {
    init.body = body;
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  init.headers = headers;
  return fetch(url, init);
};

arc.app.server.request.pingRequest = function() {
  return arc.app.server.request.buildRequest(arc.app.server.request.PING_URL)
    .then((response) => response.json())
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Error to load response from server. Session state unknown. (' + 
          error.message + ')'
      };
    });
};
/**
 * Make a request to the server for new messages.
 */
arc.app.server.request.messagesRequest = function(since) {
  return arc.app.server.request.buildRequest(arc.app.server.request.MESSAGES_URL + since)
    .then((response) => response.json())
    .then(function(json) {
      var data = [];
      json.forEach(function(item) {
        data.push({
          actionUrl: item.actionUrl,
          message: item.message
        });
      });
      return data;
    })
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};
/**
 * During the data import first it will download a list of suggestions.
 * This list contain a projection of user data stored on the server.
 *
 * @param {String} uid Uid of the user to import data from. Default to "me" which means logged in 
 *                used data.
 */
arc.app.server.request.importSuggestionsRequest = function(uid) {
  uid = uid || 'me';
  return arc.app.server.request.buildRequest(arc.app.server.request.SUGGESTIONS_LISTING + uid)
    .then((response) => response.json())
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};
/**
 * Import user data from the server.
 *
 * @param {Array} uids An array of uids to import.
 */
arc.app.server.request.getImportData = function(uids) {
  var data = '';
  uids.forEach((uid) => data += 'k%5B%5D=' + uid + '&');
  data = data.substring(0, data.length - 1);
  return arc.app.server.request.buildRequest(arc.app.server.request.GET_IMPORT_DATA, 'POST', data)
    .then((response) => response.json())
    .catch(function(error) {
      return {
        'error': true,
        'message': 'Can\'t get messages list from the server. (' + error.message + ')'
      };
    });
};

arc.app.server.request.init();
