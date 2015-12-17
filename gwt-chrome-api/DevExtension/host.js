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
 * App's dev environent.
 * During the development in GWT the app has no access to Chrome API's
 * and some function need to be mocked or proxied to the background page.
 *
 * This functions will initialize themselfs only if corresponding API is not
 * available.
 *
 * Because content script environment is separated from the page context
 * this script will mock Chrome API and pass the information to the
 * background page and eventually to the background page for execution.
 *
 * Include this file into host page during development to have access
 * to Chrome APIs from GWT dev page.
 */

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
 * A map for alll callback functions.
 *
 * A key in the map is a function resulted from 
 * the gwt.dev.chrome.stringifyFunction function.
 * Value is a set of function to be called.
 */
gwt.dev.chrome.callbacks = new Map();
/**
 * Add a callback function to the queue.
 * Callbacks will be executed when the response arrive from the background page.
 *
 * The 'params' and 'id' arguments will be combined into string object and together they will be 
 * used as an identifier of the callback function. Response from the background page will contain 
 * 'source-data' object with original call parameters and function ID so it can be recognized 
 * by the response listener.
 *
 * @param {String} id ID of the function. Response from the background page will contain it in
 * 'source-data' object. All functions for given id and {params} combination will be executed.
 * @param {Any} params parameters of the function that has been called. 
 * @param {Function} callback A function to be called after response arrive.
 */
gwt.dev.chrome.addCallback = function(id, params, callback) {
  let key = gwt.dev.chrome.stringifyFunction(id, params);
  let obj = gwt.dev.chrome.callbacks.get(key);
  if (!obj) {
    obj = new Set();
  }
  obj.add(callback);
  gwt.dev.chrome.callbacks.set(key, obj);
};
/**
 * Execute existing callback for given ID and params combination.
 *
 * @param {String} id ID of the function. Response from the background page will contain it in
 * 'source-data' object. All functions for given id and {params} combination will be executed.
 * @param {Any} params parameters of the function that has been called. 
 * @param {Any} response Response from the background page
 */
gwt.dev.chrome.execCallbacks = function(id, params, response) {
  let key = gwt.dev.chrome.stringifyFunction(id, params);
  let obj = gwt.dev.chrome.callbacks.get(key);
  if (!obj) {
    console.warn('There were no callbacks waiting for ', key);
    return;
  }
  //Don't remove event listeners from the stack.
  if (id.indexOf('addListener') === -1) {
    gwt.dev.chrome.callbacks.delete(key);
  }
  for (let item of obj) {
    item.call(item, response);
  }
};
/**
 * Create an ID from function name and it's parameters.
 * It will be used to identify a callback function
 * when the response return from the background page.
 */
gwt.dev.chrome.stringifyFunction = function(functionId, parameters) {
  let obj = {
    fn: functionId,
    params: parameters
  };
  return JSON.stringify(obj);
};
/**
 * Process the response from the background page (via Content Script)
 * and call callback function.
 *
 * @param {Object} data A `data` object from the message event.
 *    This object will contain:
 *    `source-data` property as an original function call properties
 *    `result` property as a result of API call in background page.
 */
gwt.dev.chrome.passResponseData = function(data) {
  if (!('source-data' in data)) {
    console.warn('`source-data` not available in. Can\'t call callback function');
    return;
  }
  let src = data['source-data'];
  gwt.dev.chrome.execCallbacks(src.id, src.params, data.result);
};
/**
 * A handler for `window.addEventListener('message')` observer.
 */
gwt.dev.chrome.receiveMessage = function(e) {
  if (e.origin !== location.origin) {
    return;
  }
  let data = e.data;
  //we don't care about the request, looking for response from Content Script.
  if (!data.source || data.source !== 'gwt:cs') {
    return;
  }
  if (!('source-data' in data)) {
    return;
  }
  var src = data['source-data'];
  if (!src.version || src.version !== 2) {
    return;
  }
  gwt.dev.chrome.passResponseData(data);
};
/**
 * Post message to the content script.
 *
 * This function will post a message using window.postMessage. Content Script should listen
 * for messages coming in this channel.
 * Content script will pass function from the same URL as the host page and having 'gwt:host' 
 * property.
 *
 * @param {Object} params The call parameters. It must contain:
 *  'id' - Optional. An ID of the function (unique for all functions defined here). 
 *         If `id` is omitted, `payload` will be used.
 *  'payload' - A Chrome API function name without first "chrome" part.
 *  'params' - Chrome API function call parameters.
 */
gwt.dev.chrome.postMessage = function(params) {
  if (!params || !params.payload) {
    throw new Error('Incomplete function call');
  }
  if (!params.id) {
    params.id = params.payload;
  }
  params.source = 'gwt:host';
  params.version = 2;
  window.postMessage(params, location.href);
};
/**
 * Register Chrome API automatically.
 */
gwt.dev.chrome.registerAPI = function(functionsDef) {
  functionsDef.forEach((name) => {
    let fnData = gwt.dev.chrome.parseFunction(name);

    var call = fnData.path.shift();
    if (!(call in window)) {
      window[call] = {};
    }
    call = window[call];
    fnData.path.forEach((path) => {
      if (!(path in call)) {
        call[path] = {};
      }
      call = call[path];
    });
    call[fnData.name] = function() {
      let args = Array.from(arguments);
      let callback = null;
      if (fnData.callback) {
        callback = args.pop();
      }
      let p = {
        payload: fnData.root.replace('chrome.', ''),
        params: undefined
      };
      if (args.length > 1) {
        p.params = args;
        p.multiparam = true;
      } else if (args.length === 1) {
        p.params = args[0];
      }
      if (typeof callback === 'function') {
        gwt.dev.chrome.addCallback(p.payload, p.params, callback);
      }
      gwt.dev.chrome.postMessage(p);
    };
  });
};

gwt.dev.chrome.parseFunction = function(fnStr) {
  let result = {
    path: [],
    name: undefined,
    params: [],
    callback: false,
  };
  let pn = fnStr.substr(fnStr.indexOf('(') + 1);
  result.params = pn.substr(0, pn.indexOf(')')).split(',');
  result.callback = (result.params.filter((item) => item === 'callback')).length === 0 ?
    false : true;
  result.root = fnStr.substr(0, fnStr.indexOf('('));
  result.path = result.root.split('.');
  result.name = result.path.pop();
  return result;
};
window.addEventListener('message', gwt.dev.chrome.receiveMessage, false);
