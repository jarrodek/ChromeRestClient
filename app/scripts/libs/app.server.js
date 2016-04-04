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
/* global chrome */
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
 * A namespace for the app server API
 *
 * @namespace
 */
arc.app.server = arc.app.server || {};
/**
 * Currently logged in user ID.
 * 
 * @type {String}
 */
arc.app.server.applicationUserId = null;
/**
 * Check if the user has session set on the server.
 *
 * @param {Function} callback A callback function to be called when ready.
 */
arc.app.server.hasSession = function(callback) {
  arc.app.server.request.pingRequest()
    .then(function(json) {
      if (json.error) {
        return {
          'error': true,
          'message': json.error
        };
      }
      var data = {
        state: 2, //unknown
        uid: null //unknown
      };
      if ('hasSession' in json) {
        data.state = json.hasSession ? 1 : 0;
        if (json.hasSession) {
          data.uid = json.userId;
        }
      }
      return data;
    })
    .then(callback);
};
/**
 * Opened auth tab id.
 *
 * @param {Number} _authTab Id of the tab that has been opened.
 */
arc.app.server._authTab = null;
/**
 * Authorize the user in the app.
 * TODO:80 This needs new approach:
 * - Redirect the user to the server's auth callback
 * - from the page call chrome.runtime.sendExtensionMessage
 * - handle message in the background page and call the app
 * - listen (here) for message form BG page and change session state if nescessary.
 * TODO 02: Use AppEngine Oauth provider and use chrome.identity API for server authentication.
 */
arc.app.server.auth = function() {
  return new Promise(function(resolve, reject) {
    var returnPath = 'https://' + chrome.runtime.id + '.chromiumapp.org/appengine_auth';
    var url = arc.app.server.request.AUTH_URL;
    url += '/signin?ret=';
    var regexp = /%20/g;
    url = url + encodeURIComponent(returnPath).replace(regexp, '+');
    chrome.identity.launchWebAuthFlow({
      'url': url,
      'interactive': true
    }, function(redirectUrl) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        let index = redirectUrl.indexOf('auth=1');
        if (index !== -1) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
/**
 * A chrome storage state changes listener.
 * Listen for changes in storage and check if auth object changed.
 */
arc.app.server.authStateMayChanged = function(changes) {
  if (Object.keys(changes).indexOf('applogin') !== -1) {
    arc.app.server.hasSession(function(session) {
      if (window.arcGwtCallbacks && ('sessionchange' in window.arcGwtCallbacks)) {
        window.arcGwtCallbacks.sessionchange(session);
      }
      if (arc.app.server._authTab) {
        chrome.tabs.remove(arc.app.server._authTab);
        arc.app.server._authTab = null;
      }
    });
  }
};
/**
 * Get developer messages from the server.
 */
arc.app.server.getMessages = function(since, callback) {
  arc.app.server.request.messagesRequest(since)
    .then(callback);
};
/**
 * Get user stored data projection from the server.
 *
 * @param {String} uid Uid of the user to import data from.
 */
arc.app.server.getImportSuggestions = function(uid, callback) {
  arc.app.server.request.importSuggestionsRequest(uid)
    .then(function(result) {
      callback(result);
    });
};

/**
 * Get user stored data from the server.
 *
 * @param {Array} uids A list of datastore IDs to import
 */
arc.app.server.getImportData = function(uids, callback) {
  arc.app.server.request.getImportData(uids)
    .then(function(result) {
      callback(result);
    });
};

chrome.storage.onChanged.addListener(arc.app.server.authStateMayChanged);
