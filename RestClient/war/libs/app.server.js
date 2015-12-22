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
 * A namespace for the app server API
 */
arc.app.server = arc.app.server || {};
/**
 * Currently logged in user ID.
 */
arc.app.server.applicationUserId = null;
/**
 * Check if the user has session set on the server.
 */
arc.app.server.hasSession = function(callback){
  arc.app.server.request.pingRequest()
  .then(function(json) {
    if(json.error) {
      return {
        'error': true,
        'message': json.error
      };
    }
    var data = {
      state: 2, //unknown
      uid: null //unknown
    }
    if('hasSession' in json) {
      data.state = json.hasSession ? 1 : 0;
      if(json.hasSession){
        data.uid = json.userId;
      }
    }
    return data;
  })
  .then(callback);
};
/**
 * Opened auth tab id.
 */
arc.app.server._authTab = null;
/**
 * Authorize the user in the app.
 */
arc.app.server.auth = function(){
  var returnPath = '';
  if(arc.app.utils.isProdMode()){
    returnPath = 'chrome-extension://' + chrome.runtime.id + "/auth.html#auth";
  } else {
    returnPath = "http://127.0.0.1:8888/auth.html#auth";
  }
  var url = arc.app.server.request.AUTH_URL;
  url += "/signin?ret=";
  var regexp = /%20/g;
  url = url + encodeURIComponent(returnPath).replace(regexp, "+");
  chrome.tabs.create({
    url: url
  }, function(tab){
    arc.app.server._authTab = tab.id;
  });
};
/**
 * A chrome storage state changes listener.
 * Listen for changes in storage and check if auth object changed.
 */
arc.app.server.authStateMayChanged = function(changes){
  if(Object.keys(changes).indexOf('applogin')){
    arc.app.server.hasSession(function(session){
      if(window.arcGwtCallbacks && ('sessionchange' in window.arcGwtCallbacks)){
        window.arcGwtCallbacks['sessionchange']();
      }
      if(arc.app.server._authTab){
        chrome.tabs.remove(arc.app.server._authTab);
        arc.app.server._authTab = null;
      }
    });
  }
};
/**
 * Get developer messages from the server.
 */
arc.app.server.getMessages = function(since, callback){
  arc.app.server.request.messagesRequest(since)
    .then(callback);
};
/**
 * Get user stored data projection from the server.
 *
 * @param {String} uid Uid of the user to import data from.
 */
arc.app.server.getImportSuggestions = function(uid, callback){
  arc.app.server.request.importSuggestionsRequest(uid)
    .then(function(result){

      //Object {error: true, code: 404, message: "Not found", time: 1450745875705}
      //Array [Object {key:"ahBjaHJvbWVyZXN0Y2xpZW50cjoLEgdBcHBVc2VyIhUxODU4MDQ3NjQyMjAxMzkxMjQxMTgMCxILUmVxdWVzdEl0ZW0YgICAgICA3goM", name:"aaaa", updated:1450705657260, url:"http://google.com"}]


      callback(result);
    });
};

chrome.storage.onChanged.addListener(arc.app.server.authStateMayChanged);
