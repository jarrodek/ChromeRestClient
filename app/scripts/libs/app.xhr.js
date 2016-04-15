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
/* global Headers, Request, Unibabel */
/**
 * Library for constructing and making XHR calls.
 *
 */

/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
window.arc = window.arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for the XHR object
 *
 * @namespace
 */
arc.app.xhr = arc.app.xhr || {};
/**
 * Holder for current requests data.
 *
 * @type {Map}
 */
arc.app.xhr.requests = new Map();
/**
 * Should be called just before making a request to the endpoint.
 * This will set up new request object for the app and return an ID of the request.
 * The ID should be later used as a reference to this particular object.
 *
 * @param {Object} har A HAR object (v 1.2 spec) http://www.softwareishard.com/blog/har-12-spec/
 * @return {Number} and ID of the request. It should be used to id the request object.
 */
arc.app.xhr.create = function(har) {
  if (!(har && har.log && har.log.entries && har.log.entries.length > 0)) {
    throw new Error('The HAR object does not contain request information.');
  }
  //
  var size = arc.app.xhr.requests.size();
  size++;
  arc.app.xhr.requests.set(size, har);
  return size;
};
/**
 * Run a request for given ID.
 *
 * @param {Number} id ID of the request.
 */
arc.app.xhr.run = function(id) {
  return new Promise(function(resolve, reject) {
    arc.app.xhr._getRequestInfo(id)
      .catch(function(error) {
        reject({
          'message': error.message
        });
      })
      .then(arc.app.xhr._createRequest)
      .then(function(request) {
        return fetch(request);
      })
      .catch(function(error) {
        reject({
          'message': error.message
        });
      })
      .then(arc.app.xhr._readResponse)
      .then(function(responseHar) {
        //TODO:100 add redirect info
        let har = arc.app.xhr.requests.get(id);
        arc.app.xhr.requests.delete(id);
        let refId = har.log.pages[har.log.pages.length - 1].id;
        for (let i = 0, len = har.log.entries.length; i < len; i++) {
          if (har.log.entries[i].pageref === refId && !har.log.entries[i].response) {
            har.log.entries[i].response = responseHar;
            break;
          }
        }
        resolve(har);
      });
  });
};
/**
 * Extract information about the request from the HAR object.
 * This function will result with request object associated with the last reference in the pages
 * property.
 *
 * @return {Promise} A promise that result with the request info object.
 */
arc.app.xhr._getRequestInfo = function(id) {
  return new Promise(function(resolve, reject) {
    let har = arc.app.xhr.requests.get(id);
    if (!har) {
      reject({
        'message': 'There were no request object for given ID.'
      });
      return;
    }
    let refId = har.log.pages[har.log.pages.length - 1].id;
    if (!refId) {
      reject({
        'message': 'HAR object do not contain information about the request.'
      });
      return;
    }
    let filtered = har.log.entries.filter(function(item) {
      return item.pageref === refId;
    });
    if (!filtered.length) {
      reject({
        'message': 'HAR object do not contain information about the request.'
      });
      return;
    }
    resolve(filtered[0].request);
  });
};
/**
 * Creates Request object for fetch API.
 */
arc.app.xhr._createRequest = function(request) {
  var headers = new Headers();
  var method = request.method || 'GET';
  if (request.headers && request.headers.length) {
    request.headers.forEach(function(header) {
      headers.append(header.name, header.value);
    });
  }
  var init = {
    'method': method,
    'cache': 'no-cache'
  };
  if (['GET', 'HEAD'].indexOf(method) === -1 && request.postData) {
    let post = request.postData;
    if (post.params) {
      //post.params can only be available if this should be send as a FormData object
      var fd = FormData();
      post.params.forEach(function(item) {
        if (item.fileName) {
          fd.append(item.name, item.value, item.fileName);
        } else {
          fd.append(item.name, item.value);
        }
      });
      init.body = fd;
      headers.set(post.mimeType || 'multipart/form-data');
    } else if (post.text) {
      init.body = post.text;
      headers.set(post.mimeType || 'application/x-www-form-urlencoded');
    }
  }
  init.headers = headers;
  return new Request(request.url, init);
};
/**
 * Read the network response and convert it into a HAR object.
 */
arc.app.xhr._readResponse = function(response) {
  return new Promise(function(resolve, reject) {
    let headers = [];
    let headersStr = '';
    let contentType = null;
    for (let pair of response.headers.entries()) {
      headers.push({
        'name': pair[0],
        'value': pair[1]
      });
      headersStr += pair[0] + ': ' + pair[1] + '\r\n';
      if (pair[0].toLowerCase() === 'content-type') {
        contentType = pair[1].toLowerCase();
      }
    }

    var har = {
      'status': response.status,
      'statusText': response.statusText,
      'httpVersion': 'HTTP/1.1',
      'cookies': [],
      'headers': headers,
      'content': {
        'size': -1,
        'compression': 0,
        'mimeType': contentType,
        'text': ''
      },
      'redirectURL': '',
      'headersSize': arc.app.xhr.byteLength(headersStr),
      'bodySize': -1
    };
    if (response.type === 'error') {
      reject({
        'har': har,
        'message': 'Network error'
      });
    } else if (response.ok && contentType) {
      if (contentType.indexOf('image') !== -1) {
        response.blob()
          .then(function(blob) {
            har.content.size = blob.size;
            let reader = new window.FileReader();
            reader.onloadend = function() {
              har.content.text = reader.result;
              resolve(har);
            };
            reader.onerror = function(e) {
              reject({
                'har': har,
                'message': e.message
              });
            };
            reader.readAsDataURL(blob);
          });
      } else {
        response.text()
          .then(function(text) {
            let input = Unibabel.strToUtf8Arr(text);
            let b64 = Unibabel.arrToBase64(input);
            har.content.text = btoa(b64);
            har.content.size = arc.app.xhr.byteLength(text);
            resolve(har);
          });
      }
    } else {
      resolve(har);
    }
  });
};
/**
 * Calculate size of the UTF-8 text in bytes.
 * See http://stackoverflow.com/a/23329386/1127848
 *
 * @param {String} str A UTF-8 string
 * @return {Number} Size of the input string in butes
 */
arc.app.xhr.byteLength = function(str) {
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      s++;
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--; //trail surrogate
    }
  }
  return s;
};
}());
