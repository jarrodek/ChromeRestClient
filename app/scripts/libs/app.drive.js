(function () {
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
 * App's client ID.
 */
//const CLIENT_ID = '10525470235.apps.googleusercontent.com';
/**
 * Google Drive REST API namespace.
 *
 * @namespace
 */
window.drive = {};
/**
 * Authorize the app in Google Drive service.
 *
 * @return {Promise} Fulfilled promise with auth token or reject.
 */
window.drive.auth = function() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({'interactive': true}, (authToken) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError.message);
      }
      if (!authToken) {
        return reject('User canceled');
      }
      resolve(authToken);
    });
  });
};
/**
 * Files manipulation API.
 *
 * @namespace
 */
window.drive.file = {};
/**
 * File meta boundary for POST calls.
 */
window.drive.file.boundary = 'ARCFormBoundary49nr1hyovoq1tt9';
window.drive.file.delimiter = '\r\n--' + window.drive.file.boundary + '\r\n';
window.drive.file.closeDelimiter = '\r\n--' + window.drive.file.boundary + '--';
/**
 * Drive's registered content type.
 * It will be used to search for app's files in the Drive.
 * Drive's handlers will recognize the app and will run it from Drive UI.
 */
window.drive.file.mime = 'application/restclient+data';
/**
 * Extension name for files stored in Google Drive.
 */
window.drive.file.extension = 'arc';
/**
 * A list of allowed resources (file metadata) in the file create request.
 * See https://developers.google.com/drive/v3/reference/files/create for full list.
 */
window.drive.file.allowedResource = [
  'appProperties', 'contentHints', 'createdTime', 'description', 'folderColorRgb', 'id',
  'mimeType', 'modifiedTime', 'name', 'parents', 'properties', 'starred', 'viewedByMeTime',
  'viewersCanCopyContent', 'writersCanShare'
];
/**
 * Creates a Google Drive File.
 *
 * If config.resource.mimeType is not set and drive.file.mime is set then `drive.file.mime` will
 * be used as a mime type.
 *
 * This script will automatically set file thumbnail if not set
 * (config.resource.contentHints.thumbnail object value).
 *
 * @param {Object} config A file creation configuration consisted with:
 *  - {Object} resource - A file metadata. See `drive.file.allowedResource` for more information.
 *  - {Object} media - A file contents definition to save on drive. It must have defined following
 * keys:
 *    - {String} mimeType - A media mime type
 *    - {String|Object} body - A content to save.
 */
window.drive.file.create = function(config) {
  return new Promise((resolve, reject) => {
    try {
      config = window.drive.file.ensureDriveFileConfig(config);
    } catch (e) {
      reject(e);
      return;
    }
    if (!config.resource.contentHints || !config.resource.contentHints.thumbnail ||
      !config.resource.contentHints.image) {
      let at;
      window.drive.auth()
      .then((_at) => at = _at)
      .then(window.drive.file._appSafeIcon)
      .then((file) => {
        if (!config.resource.contentHints) {
          config.resource.contentHints = {};
        }
        config.resource.contentHints.thumbnail = {
          image: file,
          mimeType: 'image/png'
        };
        return window.drive.file._uploadFile(at, config);
      })
      .then(resolve)
      .catch(reject);
    } else {
      let at;
      window.drive.auth()
      .then((_at) => at = _at)
      .then(() => window.drive.file._uploadFile(at, config))
      .then(resolve)
      .catch(reject);
    }
  });
};
/**
 * Update the file on Google Drive.
 *
 * @param {String} fileId A Google Drive file ID.
 * @param {Object} config The same as for `create` function.
 * @return {Promise} Fulfilled promise with file properties (the response).
 */
window.drive.file.update = function(fileId, config) {
  return new Promise((resolve, reject) => {
    try {
      config = window.drive.file.ensureDriveFileConfig(config);
    } catch (e) {
      reject(e);
      return;
    }
    let at;
    window.drive.auth()
    .then((_at) => at = _at)
    .then(() => window.drive.file._uploadUpdate(fileId, at, config))
    .then(resolve)
    .catch(reject);
  });
};
/**
 * Ensure that the file has correct configuration and throw an error if not.
 * Also it will add a mime type of the file if not present.
 */
window.drive.file.ensureDriveFileConfig = function(config) {
  if (!('resource' in config) ||
      !('media' in config)) {
    throw new Error('Invalid arguments.');
  }
  let names = Object.getOwnPropertyNames(config.resource);
  let error = false;
  let invalidArguments = [];
  names.forEach((key) => {
    if (window.drive.file.allowedResource.indexOf(key) === -1) {
      error = true;
      invalidArguments.push(key);
    }
  });
  if (error) {
    throw new Error('Unknown argument for resource: ' + invalidArguments.join(', '));
  }
  if (!config.resource.mimeType && window.drive.file.mime) {
    config.resource.mimeType = window.drive.file.mime;
  }
  return config;
};
/**
 * Perform upload action.
 */
window.drive.file._uploadFile = function(accessToken, options) {
  var init = {
    method: 'POST',
    body: window.drive.file._getPayload(options),
    headers: window.drive.file._getUploadHeaders(accessToken),
  };
  return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', init)
  .then(function(response) {
    return response.json();
  });
};
window.drive.file._appSafeIcon = () => {
  return new Promise((resolve) => {
    let url = chrome.runtime.getURL ? chrome.runtime.getURL('/assets/arc_icon_128.png') :
      '/app/assets/arc_icon_128.png'; // for test cases
    fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function(e) {
        let data = e.target.result;
        data = btoa(data)
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
        resolve(data);
      };
    });
  });
};
window.drive.file._uploadUpdate = function(fileId, accessToken, options) {
  var init = {
    method: 'PATCH',
    body: window.drive.file._getPayload(options),
    headers: window.drive.file._getUploadHeaders(accessToken),
  };
  return fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
    init)
  .then(function(response) {
    return response.json();
  })
  .catch((e) => {
    throw e;
  });
};
window.drive.file._getUploadHeaders = function(accessToken) {
  var headers = new Headers();
  headers.set('Authorization', 'Bearer ' + accessToken);
  headers.set('Content-Type', 'multipart/related; boundary="' + window.drive.file.boundary + '"');
  return headers;
};
window.drive.file._getPayload = function(config) {
  var content;
  if (typeof config.media.body !== 'string') {
    content = JSON.stringify(config.media.body);
  } else {
    content = config.media.body;
  }
  var d = window.drive.file.delimiter;
  var cd = window.drive.file.closeDelimiter;
  let meta = JSON.stringify(config.resource);

  let body = `${d}Content-Type: application/json; charset=UTF-8\r\n\r\n${meta}`;
  body += `${d}Content-Type: ${config.media.mimeType}\r\n\r\n`;
  body += `${content}${cd}`;
  return body;
};
//
// /**
//  * Update content of the file.
//  *
//  * @param {String} fileId Google Drive file id.
//  * @param {String|Object} content Content to be saved in the file. Anything else then String
//  *            will be passed to JSON.stringify function.
//  * @param {Function} callback A callback function to be called after patch.
//  */
// arc.app.drive.updateFile = function(fileId, content, callback) {
//   try {
//     if (typeof content !== 'string') {
//       content = JSON.stringify(content);
//     }
//     let metadata = {
//       'mimeType': appMimeType
//     };
//     let metaString = JSON.stringify(metadata);
//     let payload = btoa(unescape(encodeURIComponent(content)));
//     let multipartRequestBody = `${delimiter}Content-Type: application/json\r\n\r\n${metaString}`;
//     multipartRequestBody += `${delimiter}Content-Type: ${appMimeType}\r\n`;
//     multipartRequestBody += `Content-Transfer-Encoding: base64\r\n\r\n${payload}${closeDelim}`;
//
//     let request = gapi.client.request({
//       'path': `/upload/drive/v2/files/${fileId}`,
//       'method': 'PUT',
//       'params': {
//         'uploadType': 'multipart'
//       },
//       'headers': {
//         'Content-Type': `multipart/mixed; boundary="${boundary}"`
//       },
//       'body': multipartRequestBody
//     });
//     request.execute(callback);
//   } catch (e) {
//     callback({
//       'error': e
//     });
//   }
// };
// /**
//  * Get Google Drive file metadata.
//  *
//  * @param {String} fileId Google Drive file id.
//  * @param {Function} callback A callback function to be called.
//  */
// arc.app.drive.getFileMeta = function(fileId, callback) {
//   let request = gapi.client.request({
//     'path': `/drive/v2/files/${fileId}`,
//     'method': 'GET',
//     'params': {
//       'fields': 'downloadUrl,title,etag'
//     }
//   });
//   request.execute(function(resp) {
//     callback(resp);
//   });
// };
// /**
//  * Get file contents from Google Drive.
//  *
//  * @param {String} downloadUrl File's download URL (received from the API)
//  * @param {Function} callback A callback function to be called.
//  */
// arc.app.drive.getFile = function(downloadUrl, callback) {
//   let accessToken = gapi.auth.getToken().access_token;
//   if (!accessToken) {
//     console.warn('Access token is not available. Call rejected');
//     callback.call(this, {
//       'error': 'Not authorized'
//     });
//     return;
//   }
//   let xhr = new XMLHttpRequest();
//   xhr.open('GET', downloadUrl);
//   xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
//   xhr.onload = function() {
//     callback.call(arc, xhr.responseText);
//   };
//   xhr.onerror = function(e) {
//     callback.call(arc, e);
//   };
//   xhr.send();
// };
// arc.app.drive.listFiles = function(mimeType, nextPageToken, query, callback) {
//   let accessToken = gapi.auth.getToken().access_token;
//   if (!accessToken) {
//     console.warn('Access token is not available. Call rejected');
//     callback.call(this, {
//       'error': 'Not authorized'
//     });
//     return;
//   }
//   let q = `mimeType="${mimeType}" and trashed = false`;
//   if (query) {
//     q += ` and title contains '${query}'`;
//   }
//   let params = {
//     'q': q,
//     'maxResults': 50,
//     'fields': 'items(createdDate,iconLink,id,title),nextLink,nextPageToken'
//   };
//   if (nextPageToken !== null) {
//     params.pageToken = nextPageToken;
//   }
//   //application/restclient+data
//   //TODO:30 why do I need it here?
//   if (accessToken) {
//     gapi.auth.setToken({
//       'access_token': accessToken
//     });
//   }
//   try {
//     var request = gapi.client.request({
//       'path': '/drive/v2/files',
//       'method': 'GET',
//       'params': params
//     });
//     request.execute(callback);
//   } catch (e) {
//     callback.call(this, {
//       'error': e
//     });
//   }
// };
}());
