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
/* global chrome, OAuth2, fetch, console */
/**
 * Background page for Advanced Rest Client.
 *
 */

var dev = false;
const CLIENT_ID = '10525470235.apps.googleusercontent.com';
const CLIENT_SECRET = '4DERCyUerlYZDmc7qbneQlgf';
const SCOPES = 'https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly.metadata';

window.googleAuth = null;

function initOauth2Object() {
  window.googleAuth = new OAuth2('google', {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    api_scope: SCOPES
  });
}
window.externalDataHolder = {};

function MessageHandling(webRequest) {
  this.webRequest = webRequest;
}
MessageHandling.prototype.init = function() {
  this.setListeners();
};

MessageHandling.prototype.setListeners = function() {
  window.requestAction = function(request, callback) {
    let f = () => {};
    callback = callback || f;
    this.handleMessage(request, callback, null);
  }.bind(this);

  /**
   * Registers listener to handle extension message passing from content script.
   */
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    this.handleMessage(request, sendResponse, sender);
    return true;
  }.bind(this));


  /**
   * External extension communication.
   *
   * @param details:
   *            message - (any data) The message sent by the calling script. It's must be javascript object described in the bottom of this file.
   *            sender - (object): tab - This property will only be present when
   *            the connection was opened from a tab or content script; id - The
   *            extension ID of the extension that opened the connection.
   *            sendResponse - (function) Function to call (at most once) when you
   *            have a response. The argument should be any JSON-ifiable object.
   *
   * To run application from external extension just pass message to it.
   *
   * For message description go to the end of this file.
   *
   * In response callback it will return object with one of values: "success":
   * [true|false], "message": (String, optional) error message
   */
  chrome.extension.onMessageExternal.addListener(function(message, sender,
    sendResponse) {

    var availablePayload = 'create'.split(',');
    if (!message.payload || availablePayload.indexOf(message.payload) == -1) {
      sendResponse({
        'response': null,
        'error': '"Unknown payload'
      });
      return true;
    }
    var result = {
      'success': true
    };
    switch (message.payload) {
      case 'create':
        if (!message.data) {
          sendResponse({
            'response': null,
            'error': 'Required data parameter is not available.'
          });
          return false;
        }
        this.runApplication(message.data);
        break;
    }
    sendResponse(result);
    return true;
  }.bind(this));
};

MessageHandling.prototype.handleMessage = function(request, sendResponse, sender) {
  if (!request.payload) {
    sendResponse({
      'payload': request.payload,
      'response': null,
      'error': 'Unknown payload.'
    });
    return;
  }
  var method = request.payload;
  if (this[method]) {
    this[method](request, sendResponse, sender);
  }
};

MessageHandling.prototype.checkDriveAuth = function(request, sendResponse) {
  if (request && request.forceNew) {
    window.googleAuth.clear();
    window.googleAuth = null;
  }

  if (!window.googleAuth) {
    initOauth2Object();
  }

  var at = window.googleAuth.getAccessToken();
  if (at && window.googleAuth.isAccessTokenExpired()) {
    at = null;
  }
  var data = null;
  if (at) {
    data = {
      'access_token': at,
      'expires_in': window.googleAuth.get('expiresIn') - (~~((Date.now() - window.googleAuth.get('accessTokenDate')) / 1000))
    };
  }
  sendResponse({
    'payload': 'checkDriveAuth',
    'response': data
  });
};
MessageHandling.prototype.gdriveAuth = function(request, sendResponse) {
  if (request && request.forceNew) {
    window.googleAuth.clear();
    window.googleAuth = null;
  }
  if (!window.googleAuth) {
    initOauth2Object();
  }
  window.googleAuth.authorize(function() {
    var at = window.googleAuth.getAccessToken();
    if (at && window.googleAuth.isAccessTokenExpired()) {
      at = null;
    }
    var data = null;
    if (at) {
      data = {
        'access_token': at,
        'expires_in': window.googleAuth.get('expiresIn') - (~~((Date.now() - window.googleAuth.get('accessTokenDate')) / 1000))
      };
    }
    sendResponse({
      'payload': 'checkDriveAuth',
      'response': data
    });
  });
};
MessageHandling.prototype.gdrive = function(request, sendResponse) {
  var query = request.params;
  if (typeof query == 'string') {
    query = JSON.parse(request.params);
  }
  var viewTabUrl = null;
  if (query.action == 'create') {
    viewTabUrl = this.runApplicationFromGoogleDrive(query);
  } else if (query.action == 'open') {
    viewTabUrl = '';
    if (dev) {
      viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:gdrive/' + query.ids[0];
    } else {
      viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:gdrive/' + query.ids[0]);
    }
  }
  if (viewTabUrl !== null) {
    sendResponse({
      assignUrl: viewTabUrl
    });
  }
};
MessageHandling.prototype.setEnvironment = function(request, sendResponse) {
  var data = request.params;
  for (var key in data) {
    window[key] = data[key];
  }
  sendResponse({
    'payload': 'setEnvironment',
    'response': true
  });
};

MessageHandling.prototype.requestBegin = function(request, sendResponse) {
  var data = request.params;
  this.webRequest.reset();
  this.webRequest.masterURL = data.url;
  sendResponse({
    'payload': 'requestBegin',
    'response': true
  });
};
MessageHandling.prototype.getRequestData = function(request, sendResponse) {
  var data = this.webRequest.getRequestData();
  this.webRequest.reset();
  sendResponse({
    'payload': 'getRequestData',
    'response': data
  });
};
MessageHandling.prototype.getExternalData = function(request, sendResponse) {
  var externalUUid = request.params;
  var externalData = null;
  if (externalUUid in window.externalDataHolder) {
    externalData = window.externalDataHolder[externalUUid];
    delete window.externalDataHolder[externalUUid];
  }
  if (externalData === null) {
    sendResponse({
      'payload': 'getExternalData',
      'response': null,
      'error': 'No data available :(',
    });
  } else {
    sendResponse({
      'payload': 'getExternalData',
      'response': externalData
    });
  }
};
MessageHandling.prototype.copyToClipboard = function(request, sendResponse) {
  var copyData = request.params;
  var clipboardholder = document.createElement('textarea');
  document.body.appendChild(clipboardholder);
  clipboardholder.value = copyData;
  clipboardholder.select();
  document.execCommand('Copy');
  clipboardholder.parentNode.removeChild(clipboardholder);
  sendResponse();
};
MessageHandling.prototype.runApplication = function(requestDetails) {
  var uuid = this.guidGenerator();
  var viewTabUrl = '';
  if (dev) {
    viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:external/' + uuid;
  } else {
    viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:external/' + uuid);
  }
  window.externalDataHolder[uuid] = requestDetails;
  chrome.tabs.create({
    url: viewTabUrl
  });
};
/**
 * Found at http://note19.com/2007/05/27/javascript-guid-generator/
 *
 * @returns {String}
 */
MessageHandling.prototype.guidGenerator = function() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
};
MessageHandling.prototype.runApplicationFromGoogleDrive = function(requestDetails) {
  var uuid = this.guidGenerator();
  var viewTabUrl = '';
  if (dev) {
    viewTabUrl = 'http://127.0.0.1:8888/RestClient.html?gwt.codesvr=127.0.0.1:9997#RequestPlace:gdrive/create/' + uuid;
  } else {
    viewTabUrl = chrome.extension.getURL('RestClient.html#RequestPlace:gdrive/create/' + uuid);
  }
  window.externalDataHolder[uuid] = requestDetails;
  return viewTabUrl;
};
MessageHandling.prototype.finishOAuth = function(request, sendResponse, sender) {
  var param = chrome.extension.getURL('oauth2/oauth2.html') + request.data;
  var url = decodeURIComponent(param.match(/&from=([^&]+)/)[1]);
  var index = url.indexOf('?');
  if (index > -1) {
    url = url.substring(0, index);
  }
  // Derive adapter name from URI and then finish the process.
  try {
    let adapterName = OAuth2.lookupAdapterName(url);
    new OAuth2(adapterName, OAuth2.FINISH, param);
    let senderId = sender ? sender.tab.id : null;
    if (senderId) {
      chrome.tabs.remove(senderId);
    }
  } catch (e) {
    //@TODO: no body in background page
    document.body.innerHTML = e.message;
  }
};

/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the background page.
 */
arc.app.bg = {};
/**
 * A handler to be called when the app is upgraded. 
 * It should perform an update tasks if necessary.
 */
arc.app.bg.onInstalled = function(details) {
  switch (details.reason) {
    case 'update':
      arc.app.bg.performStorageUpgrade();
      break;
    case 'install':
      arc.app.bg.installApp();
      break;
  }
  // Initialize database tables in here so the app will not do it on every start.
  arc.app.db.websql.open().then(function(db){
    console.log('Database has been initialized');
  }).catch((e) => console.error('Error initializing the database', e));
};
/**
 * //TODO: Upgrade WebSQL to IndexedDb.
 */
arc.app.bg.installApp = function() {
  // chrome.storage.local.get('firstrun', function(result){
  //     if('firstrun' in result){
  //         return;
  //     }
  //     arc.app.bg.downloadDefinitions()
  //     .then((r) => console.log(r));
  // });
};
arc.app.bg.downloadDefinitions = function() {
  return fetch('/assets/definitions.json').then(function(response) {
    return response.json();
  });
};
/**
 * Perform upgrade to newest version
 */
arc.app.bg.performStorageUpgrade = function() {
  if (!('localStorage' in window)) {
    return;
  }
  if (localStorage['upgraded.v4']) {
    return;
  }
  //set shortcuts values 
  var save = {};
  var shortcuts = arc.app.bg.performShortcutsUpgrade();
  var settings = arc.app.bg.performSettingsUpgrade();
  if (shortcuts) {
    Object.assign(save, shortcuts);
  }
  Object.assign(save, settings);
  chrome.storage.sync.set(save, function() {
    console.info('localStorage has been upgraded to chrome.storage.sync');
  });
  var local = arc.app.bg.performLocalDataUpgrade();
  chrome.storage.local.set(local, function() {
    console.info('localStorage has been upgraded to chrome.storage.local');
  });
  localStorage['upgraded.v4'] = true;
};
/**
 * To be called when upgrading to chrome.storage.
 * Pass shortcuts to the store.
 */
arc.app.bg.performShortcutsUpgrade = function() {
  var shortcuts;
  try {
    let v = 'SHORTCUTS';
    shortcuts = JSON.parse(localStorage[v]);
  } catch (e) {
    return null;
  }
  //shortcuts structure changed to:
  // (boolean) alt
  // (boolean) ctrl
  // (boolean) shift
  // (int) key
  // (String) type
  let save = [];
  shortcuts.forEach((s) => {
    let shortcut = {
      'alt': s.a,
      'ctrl': s.c,
      'shift': s.s,
      'key': s.k,
      'type': s.t
    };
    save[save.length] = shortcut;
  });
  if (save.length > 0) {
    return save;
  }
  return null;
};
/**
 * To be called when upgrading to chrome.storage.
 * Pass settings data to the store.
 */
arc.app.bg.performSettingsUpgrade = function() {
  var save = {
    'DEBUG_ENABLED': localStorage['DEBUG_ENABLED'] === 'true' ? true : false,
    'HISTORY_ENABLED': localStorage['HISTORY_ENABLED'] === 'true' ? true : false,
    'MAGICVARS_ENABLED': localStorage['MAGICVARS_ENABLED'] === 'true' ? true : false,
	'CMH_ENABLED': localStorage['CMH_ENABLED'] === 'true' ? true : false,
	'CMP_ENABLED': localStorage['CMP_ENABLED'] === 'true' ? true : false
  };
  var tutorials;
  try {
    tutorials = JSON.parse(localStorage['tutorials']);
  } catch (e) {}
  if (tutorials) {
    save.tutorials = tutorials;
  }
  var lm;
  try {
    lm = parseInt(localStorage['LATESTMSG']);
  } catch (e) {}
  if (lm) {
    save.LATESTMSG = lm;
  }
  var ls = localStorage['latstSocket'];
  if(ls && ls.trim() !== ""){
	  save.latestSocket = ls;
  }
  return save;
};
/**
 * To be called when upgrading to chrome.storage.
 * This should return items that should be kept in local storage.
 */
arc.app.bg.performLocalDataUpgrade = function() {
  var save = {};
  var fr;
  try {
    fr = parseInt(localStorage['firstrun']);
  } catch (e) {}
  if (fr) {
    save.firstrun = fr;
  }
  var lrd;
  try {
    lrd = JSON.parse(localStorage['latest_request_data']);
  } catch (e) {}
  if (lrd) {
    save.latest_request_data = lrd;
  }
  var lgdf = localStorage['LATEST_GDRIVE_FOLDER'];
  if(lgdf){
	  save.LATEST_GDRIVE_FOLDER = lgdf; 
  }
  
  return save;
};



class WebRequest {

  constructor() {
    this.masterURL = null;
    this.redirectURL = null;
    this.responseHeaders = [];
    this.requestHeaders = [];
    this.redirectData = [];
    this.requestFilter = {
      urls: ['<all_urls>'],
      types: ['xmlhttprequest']
    };
  }
  /**
   * Setup application, set rules, handlers etc.
   */
  init() {
    /*
     * Register Web Requests listeners to handle sent/received headers info in
     * proper way (get all info) See more at <a
     * href="http://developer.chrome.com/extensions/webRequest.html">http://developer.chrome.com/extensions/webRequest.html</a>
     */
    chrome.webRequest.onSendHeaders.addListener(this.onHeadersSend.bind(this), this.requestFilter, ['requestHeaders']);
    chrome.webRequest.onBeforeRedirect.addListener(this.onBeforeRedirect.bind(this), this.requestFilter, ['responseHeaders']);
    chrome.webRequest.onCompleted.addListener(this.onRequestCompleted.bind(this), this.requestFilter, ['responseHeaders']);
    chrome.webRequest.onErrorOccurred.addListener(this.onRequestError.bind(this), this.requestFilter);
  }
  reset() {
    this.masterURL = null;
    this.redirectURL = null;
    this.responseHeaders = [];
    this.requestHeaders = [];
    this.redirectData = [];
    this.errorData = {};
  }

  getRequestData() {
    return {
      URL: this.masterURL,
      RESPONSE_HEADERS: this.responseHeaders,
      REQUEST_HEADERS: this.requestHeaders,
      REDIRECT_DATA: this.redirectData,
      ERROR: this.errorData
    };
  }
  /**
   * Check if request url match tested URL
   */
  checkRequestUrl(details) {
    if (details.url === null || details.url.length === 0) {
      return false;
    }

    var currentCheckUrl = this.masterURL;
    if (this.redirectURL !== null) {
      currentCheckUrl = this.redirectURL;
    }
    if (currentCheckUrl === null || currentCheckUrl.length === 0) {
      return false;
    }
    if (!(currentCheckUrl === details.url || details.url.indexOf(currentCheckUrl) > -1)) {
      return false;
    }
    return true;
  }
  /**
   * Called when request's headers has been sent. It filter requests by current
   * set URL. After request filter URL is cleared.
   *
   * @param details
   */
  onHeadersSend(details) {
    if (!this.checkRequestUrl(details)) {
      return;
    }
    this.requestHeaders = details.requestHeaders;
  }
  /**
   * Called when the request will be redirected.
   * It is async call.
   *
   * @param details
   */
  onBeforeRedirect(details) {
    if (!this.checkRequestUrl(details)) {
      return;
    }
    var data = {
      fromCache: details.fromCache,
      redirectUrl: details.redirectUrl,
      statusCode: details.statusCode,
      statusLine: details.statusLine,
      responseHeaders: details.responseHeaders
    };

    this.redirectData[this.redirectData.length] = data;
    this.redirectURL = details.redirectUrl;
  }

  /**
   * Called when the request complete.
   *
   * @param details
   */
  onRequestCompleted(details) {
    if (!this.checkRequestUrl(details)) {
      return;
    }

    this.responseHeaders = details.responseHeaders;
  }
  /**
   * Called when the request complete with error.
   *
   * @param details
   */
  onRequestError(details) {
    if (!this.checkRequestUrl(details)) {
      return;
    }

    this.errorData = {
      error: details.error,
      fromCache: details.fromCache,
      timeStamp: details.timeStamp,
      url: details.url
    };
  }
  /**
   * Create URL object from request url for Rule object.
   */
  getUrlData(requestUrl) {
    var parser = document.createElement('a');
    parser.href = requestUrl;

    var urlData = {};
    if (parser.hostname) {
      urlData.hostEquals = parser.hostname;
    }
    if (parser.protocol) {
      urlData.schemes = [parser.protocol.replace(':', '')];
    }
    if (parser.port) {
      urlData.ports = [parseInt(parser.port)];
    }
    if (parser.pathname) {
      urlData.pathEquals = parser.pathname;
    }
    if (parser.search) {
      urlData.queryEquals = parser.search;
    }
    return urlData;
  }

  parseHeaders(str) {
    var result = [];
    if (!str) {
      return result;
    }
    var headers = str.split(/\n/);
    for (var i in headers) {
      var header = headers[i];
      var headerData = header.split(/:\s?/);
      result[result.length] = {
        name: headerData.shift(),
        value: headerData.join(':')
      };
    }
    return result;
  }
  
}

var webRequest = new WebRequest();
webRequest.init();
var messageHandling = new MessageHandling(webRequest);
messageHandling.init();
chrome.runtime.onInstalled.addListener(arc.app.bg.onInstalled);

/**
 * External extension communication.
 *
 * @param details:
 *            message - (any data) The message sent by the calling script. It's must be javascript object described in the bottom of this file.
 *            sender - (object): tab - This property will only be present when
 *            the connection was opened from a tab or content script; id - The
 *            extension ID of the extension that opened the connection.
 *            sendResponse - (function) Function to call (at most once) when you
 *            have a response. The argument should be any JSON-ifiable object.
 *
 * To run application from external extension just pass message to it.
 *
 * For message description go to the end of this file.
 *
 * In response callback it will return object with one of values: "success":
 * [true|false], "message": (String, optional) error message
 */


/**
 * ======================================== External data structure
 * If you want to run this application either from other extension/application you need to pass a message object:
 * <ul>
 * <li>"payload" (required) - message payload: "create" to open new application window with values; (other payloads may be available in future).
 * <li>"data" - (required) javascript object with any of values:
 * <ul>
 *      <li>url - (String) request URL to set</li>
 *      <li>method - (String) request method to set</li>
 *      <li>headers - (String) an RFC string representing request headers
 *                  example: >>> User-Agent: X-Extension
 *                               X-header: header value; second value <<<
 *      <li>payload - (String) data to pass into payload field. Only for http methods that carry payload data</li>
 *      <li>encoding - (String) data form encoding</li>
 * </ul>
 * </ul>
 * <p>Every entry in "data" parameter is optional. Any other parameters are not used by application.</p>
 *
 *
 * Example of usage:
 * <pre>
 * var message = { 'payload': 'create', 'data': { 'url': 'http://www.google.com/', 'method': 'GET', 'headers': "User-Agent: Chrome-Extension\nX-extension-id: SomeID" } };
 * </pre>
 * Via extensions message passing system:
 * <pre>
 * chrome.runtime.sendMessage(THIS_APPLICATION_ID_FROM_CHROME_WEB_STORE, message, function(response) {});
 * </pre>
 * </pre>
 */
