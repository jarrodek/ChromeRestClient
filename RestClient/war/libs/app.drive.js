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
 * Communicating with background page.
 * 
 * While inside Chrome extension environment it need to call 
 * `chrome.runtime.getBackgroundPage` to run any function from it.
 * 
 * In development mode the app does not have access to Chrome APIs.
 * In this case dev extension will communicate with background page
 * instead of calling the API directly.
 * During the development extension from var/extension folder must be loaded into Chrome.
 * It will inject content script which will pass data to background page. 
 * 
 * The call require object informing API which function to call in the background page.
 * The object requires two properties to be available:
 * payload - function name to be called in the background page
 * response - type of expected response; can be "object" or "string"
 * source - must contain "gwt:host" so the content script will recognize it as a command from dev 
 *    environment to the background page.
 * 
 * @example
 * var payload = {
 *  'payload': 'checkDriveAuth',
 *  'source': 'gwt:host'
 * };
 */

/* global chrome, gapi, google */

/**
 * App's client ID.
 */
//const CLIENT_ID = '10525470235.apps.googleusercontent.com';
/**
 * App ID. Required by Drive Picker.
 * @type {String}
 */
const APP_ID = '10525470235';
/**
 * API key for Google Picker
 * @type {string}
 */
const API_KEY_PICKER = 'AIzaSyACzi_VRqOHzLj_Lf7IdJgQAO3jaw5SMNU';

/**
 * Authorization scopes.
 */
/*const SCOPES = 'https://www.googleapis.com/auth/drive.install ' +
  'https://www.googleapis.com/auth/drive.file ' +
  'https://www.googleapis.com/auth/drive.readonly.metadata';*/
/**
 * XHR boundary for POST calls.
 */
const boundary = 'ARCFormBoundary49nr1hyovoq1tt9';
const delimiter = '\r\n--' + boundary + '\r\n';
const closeDelim = '\r\n--' + boundary + '--';
/**
 * Drive's registered content type.
 * It will be used to determine app's files in the Drive. 
 * Drive's handlers will recognize the app and will run it from Drive UI. 
 */
const appMimeType = 'application/restclient+data';
/**
 * Extension name for files stored in Google Drive. 
 */
const appFileExtension = 'arc';
/**
 * Advanced Rest Client namespace
 */
var arc = arc || {};
/**
 * ARC app's namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for Google Drive integration.
 */
arc.app.drive = {};
/**
 * True if code is running in extension's environment.
 */
arc.app.drive.isExtension = !!chrome.runtime.getBackgroundPage;
/**
 * API load is on demand and asynchronous. 
 * This array will contain all callback function which
 * has been requested with API load. 
 */
arc.app.drive._callbacks = new Set();
/**
 * A callback function that should be run after authorization.
 */
arc.app.drive._authCallbacks = new Set();
/**
 * A flag to determine if API has been initialized.
 */
arc.app.drive._initialized = false;
/**
 * A namespace for Google Drive file picker.
 */
arc.app.drive.picker = {};
/**
 * A flag to determine if file picker is shown.
 */
arc.app.drive.picker.initialized = false;
/**
 * Callback to be run after file picker has been initialized. 
 */
arc.app.drive.picker._callbacks = new Set();

/**
 * Add loader to the UI.
 *
 * TODO: This DOM operation is too expensive. Should be appended to DOM at page load.
 */
arc.app.drive.appendLoader = function() {
  let wrapper = document.createElement('div');
  let loader = document.createElement('div');
  loader.classList.add('loaderImage');
  wrapper.classList.add('actionDomLoader');
  wrapper.appendChild(loader);
  document.body.appendChild(wrapper);
};
/**
 * Remove loader from the UI.
 */
arc.app.drive.removeLoader = function() {
  let loader = document.querySelector('.actionDomLoader');
  if (loader) {
    loader.parentNode.removeChild(loader);
  }
};
/**
 * This will load Google apis client. 
 * The call is asynchronous so the function in the window namespace must be exposed that will 
 * handle a callback.
 * This function can't use futures since it will wait until different function will be called.
 */
arc.app.drive.loadApi = function(callback) {
  if (arc.app.drive._initialized) {
    callback.call(this); //this as a arc object 
    return;
  }
  arc.app.drive.appendLoader();
  arc.app.drive._callbacks.add(callback);

  let script = document.createElement('script');
  script.src = 'https://apis.google.com/js/client.js?onload=handleDriveClientLoad';
  script.type = 'text/javascript';
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
};
/**
 * After Google API has been loaded, load Drive API 
 * and run any callback function it may exist.
 */
arc.app.drive.loadDriveApi = function() {
  gapi.client.load('drive', 'v2', function() {
    arc.app.drive._initialized = true;
    arc.app.drive.removeLoader();

    for (let clb of arc.app.drive._callbacks) {
      clb.call(arc);
      arc.app.drive._callbacks.delete(clb);
    }
  });
};
/**
 * Check if current user have authorized application.
 * Callback function will contain auth result object (if user have authorized application)
 * with token data or null if not authorized.
 * 
 * @param {Function} callback Callback function to be called after auth state check.
 * 
 * @example 
 * var fn = function(authResult){
 *  if(!authResult){
 *    // the app is not authorized by the user
 *  } else {
 *    let access_token = authResult.access_token;
 *    // use token.
 *  }
 * }
 */
arc.app.drive.checkDriveAuth = function(callback) {
  arc.app.drive.auth(callback);
};
/**
 * Authorize the app in Google Drive service.
 * 
 * Callback function will contain auth result object (if user have authorized application)
 * with token data or null if user resign with authentication.
 * 
 * @param {Function} callback Callback function to be called after authorization.
 */
arc.app.drive.auth = function(callback) {
  chrome.identity.getAuthToken({'interactive': true}, callback);
};

/**
 * Set access token to be used by Google OAuth library.
 */
arc.app.drive._setAccessToken = function(authResult) {
  // jscs:disable
  if (authResult && authResult.access_token) {
    gapi.auth.setToken({
      // jscs:disable
      'access_token': authResult.access_token
    });
  }
};
/**
 * Insert new file to Google Drive.
 * 
 * Callback function will contain insert result or 'error' if error occured.
 * 
 * @param {String} parentId Id of parent folder in Google Drive. Null to keep files in root folder.
 * @param {String} filename File name visible in Drive interface.
 * @param {String|Object} content Content to be saved in the file. Anything else then String will 
 *        be passed to JSON.stringify function.
 * @param {Function} callback A callback function to be called after insert.
 */
arc.app.drive.insertFile = function(parentId, filename, content, callback) {
  try {
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }

    let metadata = {
      'title': filename + '.' + appFileExtension,
      'mimeType': appMimeType,
      'parents': [{
        'id': parentId
      }]
    };
    let metaString = JSON.stringify(metadata);
    let payload = btoa(content);
    let multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${metaString}`;
    multipartRequestBody += `${delimiter}Content-Type: ${appMimeType}\r\n`;
    multipartRequestBody += `Content-Transfer-Encoding: base64\r\n\r\n${payload}${closeDelim}`;
    let request = gapi.client.request({
      'path': '/upload/drive/v2/files',
      'method': 'POST',
      'params': {
        'uploadType': 'multipart'
      },
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody
    });
    request.execute(callback);
  } catch (e) {
    callback({
      'error': e
    });
  }
};
/**
 * Update content of the file.
 * 
 * @param {String} fileId Google Drive file id.
 * @param {String|Object} content Content to be saved in the file. Anything else then String 
 *            will be passed to JSON.stringify function.
 * @param {Function} callback A callback function to be called after patch.
 */
arc.app.drive.updateFile = function(fileId, content, callback) {
  try {
    if (typeof content !== 'string') {
      content = JSON.stringify(content);
    }
    let metadata = {
      'mimeType': appMimeType
    };
    let metaString = JSON.stringify(metadata);
    let payload = btoa(content);
    let multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${metaString}`;
    multipartRequestBody += `${delimiter}Content-Type: ${appMimeType}\r\n`;
    multipartRequestBody += `Content-Transfer-Encoding: base64\r\n\r\n${payload}${closeDelim}`;
    let request = gapi.client.request({
      'path': `/upload/drive/v2/files/${fileId}`,
      'method': 'PUT',
      'params': {
        'uploadType': 'multipart'
      },
      'headers': {
        'Content-Type': `multipart/mixed; boundary="${boundary}"`
      },
      'body': multipartRequestBody
    });
    request.execute(callback);
  } catch (e) {
    callback({
      'error': e
    });
  }
};
/**
 * Get Google Drive file metadata.
 * 
 * @param {String} fileId Google Drive file id.
 * @param {Function} callback A callback function to be called.
 */
arc.app.drive.getFileMeta = function(fileId, callback) {
  let request = gapi.client.request({
    'path': `/drive/v2/files/${fileId}`,
    'method': 'GET',
    'params': {
      'fields': 'downloadUrl,title,etag'
    }
  });
  request.execute(function(resp) {
    callback(resp);
  });
};
/**
 * Get file contents from Google Drive.
 * 
 * @param {String} downloadUrl File's download URL (received from the API)
 * @param {Function} callback A callback function to be called.
 */
arc.app.drive.getFile = function(downloadUrl, callback) {
  let accessToken = gapi.auth.getToken().access_token;
  if (!accessToken) {
    console.warn('Access token is not available. Call rejected');
    callback.call(this, {
      'error': 'Not authorized'
    });
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.open('GET', downloadUrl);
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xhr.onload = function() {
    callback.call(arc, xhr.responseText);
  };
  xhr.onerror = function(e) {
    callback.call(arc, e);
  };
  xhr.send();
};
arc.app.drive.listFiles = function(mimeType, nextPageToken, query, callback) {
  let accessToken = gapi.auth.getToken().access_token;
  if (!accessToken) {
    console.warn('Access token is not available. Call rejected');
    callback.call(this, {
      'error': 'Not authorized'
    });
    return;
  }
  let q = `mimeType="${mimeType}" and trashed = false`;
  if (query) {
    q += ` and title contains '${query}'`;
  }
  let params = {
    'q': q,
    'maxResults': 50,
    'fields': 'items(createdDate,iconLink,id,title),nextLink,nextPageToken'
  };
  if (nextPageToken !== null) {
    params.pageToken = nextPageToken;
  }

  //TODO: why do I need it here?
  if (accessToken) {
    gapi.auth.setToken({
      'access_token': accessToken
    });
  }
  try {
    var request = gapi.client.request({
      'path': '/drive/v2/files',
      'method': 'GET',
      'params': params
    });
    request.execute(callback);
  } catch (e) {
    callback.call(this, {
      'error': e
    });
  }
};
/**
 * Load Google Drive file picker.
 * The call is asynchronous so the function in the window namespace must be exposed that will 
 * handle a callback.
 * This function can't use futures since it will wait until different function will be called.
 */
arc.app.drive.picker.load = function(callback) {
  if (arc.app.drive.picker.initialized) {
    callback.call(window);
    return;
  }
  arc.app.drive.appendLoader();
  arc.app.drive.picker._callbacks.add(callback);

  let script = document.createElement('script');
  script.src = 'https://apis.google.com/js/api.js?onload=handlePickerLoad';
  script.type = 'text/javascript';
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
};
/**
 * Handle library load event.
 * Call all callback functions.
 */
arc.app.drive.picker.loadHandler = function() {
  arc.app.drive.picker.initialized = true;
  arc.app.drive.removeLoader();
  for (let clb of arc.app.drive.picker._callbacks) {
    clb.call(arc);
    arc.app.drive.picker._callbacks.delete(clb);
  }
};
/**
 * Construct new Picker object.
 *
 * @param {String} authToken User's auth token
 * @param {Function} callback A callback function to be called after dialog closes.
 * @param {Array} views Rest parameter for views that should be attached to the picker.
 */
arc.app.drive.picker._constructPicker = function(authToken, callback, ...views) {
  var pickerBuilder = new google.picker.PickerBuilder()
    .setDeveloperKey(API_KEY_PICKER)
    .setOAuthToken(authToken)
    .setCallback(callback)
    .setAppId(APP_ID)
    //.setOrigin('http://127.0.0.1:8888')
    .disableFeature(google.picker.Feature.MULTISELECT_ENABLED);
  views.forEach(view => pickerBuilder.addView(view));
  return pickerBuilder;
};
/**
 * Open picker to select application file.
 *
 * @param {String} authToken An auth token to be used with the picker.
 * @param {Function} callback A callback function to be called after dialog closes.
 */
arc.app.drive.picker.getAppFile = function(authToken, callback) {
  let filesView = new google.picker.View(google.picker.ViewId.DOCS);
  filesView.setMimeTypes('application/restclient+data');
  //proxy callback function to react on cancel or select actions.
  var fn = function(data) {
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED ||
      data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
      callback.call(arc, data);
    }
  };
  let pickerBuilder = arc.app.drive.picker._constructPicker(authToken, fn, filesView);
  let picker = pickerBuilder.build();
  picker.setVisible(true);
};
/**
 * Open picker to select folder from Google Dive.
 * Folders are user by the app to select app files save location.  
 *
 * @param {String} authToken An auth token to be used with the picker.
 * @param {Function} callback A callback function to be called after dialog closes.
 */
arc.app.drive.picker.getFolder = function(authToken, callback) {
  var foldersView = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
  foldersView.setIncludeFolders(true);
  foldersView.setSelectFolderEnabled(true);

  //proxy callback function to react on cancel or select actions.
  var fn = function(data) {
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED ||
      data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
      callback.call(arc, data);
    }
  };
  var pickerBuilder = arc.app.drive.picker._constructPicker(authToken, fn, foldersView);
  pickerBuilder.setTitle('Select a folder');
  var picker = pickerBuilder.build();
  picker.setVisible(true);
};
/**
 * Google Drive integration. Initalize Google Drive library.
 * This function should be available in window scope since it will be called from the library 
 * itself.
 */
window.handleDriveClientLoad = function() {
  arc.app.drive.loadDriveApi();
};
/**
 * Drive file picker integration. 
 */
window.handlePickerLoad = function() {
  gapi.load('picker', {
    'callback': arc.app.drive.picker.loadHandler
  });
};
