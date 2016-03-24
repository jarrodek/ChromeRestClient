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
 * GWT namespace
 */
var gwt = gwt || {};
/**
 * GWT development namespace
 */
gwt.dev = gwt.dev || {};

/**
 * Chrome extension namespace
 */
gwt.dev.chrome = gwt.dev.chrome || {};

/**
 * Process message from host page (ensure if it the message is directed to this
 * extension) and send it to the app's background page to call function specific in payload.
 */
gwt.dev.chrome.handleMessage = function(e) {
  let data = e.data;
  try {
    gwt.dev.chrome.isLocation(e);
    gwt.dev.chrome.isSource(data);
    gwt.dev.chrome.isNotAPIcall(data);
  } catch (e) {
    return; // don't print error messages in the console.
  }
  gwt.dev.chrome.sendMessage(data);
};
/**
 * Throw an error if the call is not from the host page.
 */
gwt.dev.chrome.isLocation = function(e) {
  if (e.origin !== location.origin) {
    throw 'Call not from the host page.';
  }
};

/**
 * Throw an error if the call is not having "gwt:host" value in source key. 
 */
gwt.dev.chrome.isSource = function(data) {
  if (!(data && data.source && data.source === 'gwt:host')) {
    throw 'This is not message to this CS';
  }
};

/**
 * Throw an error if it is direct API call.
 * This will be done by another extension. 
 */
gwt.dev.chrome.isNotAPIcall = function(data) {
  if (!(data && data.payload && data.payload.indexOf('.') === -1)) {
    throw 'This message will not be processed by this message passing system.';
  }
};
/**
 * Send message to the background page, wait for response and send the response back 
 * to the host page.
 */
gwt.dev.chrome.sendMessage = function(data) {
  chrome.runtime.sendMessage(data, function(response) {
    var result = response.response;
    var post = {
      'source': 'gwt:cs',
      'result': result,
      'source-data': data
    };
    if (response.error) {
      post.error = response.error;
    }
    window.postMessage(post, location.href);
  });
};

window.addEventListener('message', gwt.dev.chrome.handleMessage, false);
