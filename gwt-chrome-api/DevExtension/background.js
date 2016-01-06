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

/* globals chrome */

/**
 * This is a background page that will handle messages passed from the GWT host 
 * page via content script.
 * Learn more in cs.js file description. 
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
gwt.dev.background = gwt.dev.background || {};
/**
 * Handle message from content script. 
 */
gwt.dev.background.handleMessage = function(request, sender, sendResponse) {

  gwt.dev.background.callApi(request, sendResponse, sender);

  return true; // must return true so the port will not be closed when this function finish.
};
/**
 * A list of registered callback function for event listeners.
 */
gwt.dev.background.eventCallbacks = new Map();

/**
 * Register a callback function for event listener.
 * If the function already existed for an API call this function will return null
 * which means that the call is going to be made anyway. In this case do not register event 
 * listener again because two or more calls will be made back to the host page.
 *
 * @param {String} id api name as a string to identify the callback function
 * @return {Function|null} A function to be called of null if the function for the API has been 
 *                         already registered.
 */
gwt.dev.background.registerEventCallback = function(id, sender) {
  if (gwt.dev.background.eventCallbacks.has(id)) {
    return null;
  }
  var fn = function() {
    let args = Array.from(arguments);
    let p = {
      payload: id,
      result: undefined,
      source: 'gwt:bg',
      tab: sender.tab.id
    };
    p['source-data'] = {
      source: 'gwt:host',
      payload: id,
      id: id,
      version: 2
    };
    if (args.length === 1) {
      p.result = args[0];
    } else if (args.length > 1) {
      p.result = args;
      p.multiparam = true;
    }
    gwt.dev.background.postEventMessage(p);
  };
  gwt.dev.background.eventCallbacks.set(id, fn);
  return fn;
};
/**
 * Remove event callback function from the list of registered function.
 *
 * @param {String} id api name as a string to identify the callback function
 * @return {Function|null} A registered function of null if the callback function for given API 
 *                         didn't existed.
 */
gwt.dev.background.removeEventCallback = function(id) {
  if (!gwt.dev.background.eventCallbacks.has(id)) {
    return null;
  }
  var fn = gwt.dev.background.eventCallbacks.get(id);
  gwt.dev.background.eventCallbacks.delete(id);
  return fn;
};
/**
 * Get event callback function from the list of registered function.
 *
 * @param {String} id api name as a string to identify the callback function
 * @return {Function|null} A registered function of null if the callback function for given API 
 *                         didn't existed.
 */
gwt.dev.background.getEventCallback = function(id) {
  if (!gwt.dev.background.eventCallbacks.has(id)) {
    return null;
  }
  return gwt.dev.background.eventCallbacks.get(id);
};
/**
 * This function will be called every time when event listener handle an event from the API.
 * This will pass the response to the content script with 'gwt:bg' value for source property
 * and the contect script will pass it to the host page.
 */
gwt.dev.background.postEventMessage = function(params) {
  var tab = params.tab;
  delete params.tab;
  chrome.tabs.sendMessage(tab, params);
};
/**
 * Call the API action.
 */
gwt.dev.background.callApi = function(request, sendResponse, sender) {
  if (request.payload.indexOf('.') !== -1) {

    let parts = request.payload.split('.');
    let call = chrome; //start with chrome namespace.
    let action = parts.pop(); //last part is the function name to call.
    parts.forEach(function(name) {
      call = call[name];
    });
    let params = request.params;

    let responseFn = function(result) {
      let response = {
        'result': result
      };
      if (chrome.runtime.lastError) {
        response.error = chrome.runtime.lastError;
      }
      sendResponse(response);
    };
    let multiparam = request.multiparam || false;
    try {
      if (gwt.dev.background.isSync(request.payload)) {
        if (typeof call[action] !== 'function') {
          responseFn(call[action]);
        } else {
          let result; //default to undefined
          if (params === undefined) {
            result = call[action]();
          } else if (!multiparam) {
            result = call[action](params);
          } else {
            result = call[action](...params);
          }
          responseFn(result);
        }
      } else if (action === 'addListener') {
        let fn = gwt.dev.background.registerEventCallback(request.payload, sender);
        if (fn) {
          call[action](fn);
        }
      } else if (action === 'removeListener') {
        let fn = gwt.dev.background.removeEventCallback(request.payload);
        if (fn) {
          call[action](fn);
        }
      } else if (action === 'hasListener') {
        let fn = gwt.dev.background.getEventCallback(request.payload);
        if (fn) {
          responseFn(true);
        } else {
          responseFn(false);
        }
      } else {
        if (params === undefined) {
          call[action](responseFn);
        } else if (!multiparam) {
          call[action](params, responseFn);
        } else {
          params.push(responseFn);
          call[action](...params);
        }
      }
    } catch (e) {
      let response = {
        'result': undefined,
        'error': chrome.runtime.lastError
      };
      sendResponse(response);
    }
  }
};

/**
 * Some Chrome APIs are synchronous and it should be called differently. 
 */
gwt.dev.background.isSync = function(payload) {
  let fns = new Set();
  let fnList = 'runtime.id,runtime.getManifest,runtime.getURL,runtime.reload,runtime.restart,' +
    'runtime.connect,runtime.connectNative,alarms.create,browserAction.setTitle,' +
    'browserAction.setPopup,browserAction.setBadgeText,browserAction.setBadgeBackgroundColor,' +
    'browserAction.enable,browserAction.disable,desktopCapture.cancelChooseDesktopMedia,' +
    'devtools.inspectedWindow.reload,downloads.open,downloads.show,downloads.showDefaultFolder,' +
    'downloads.drag,downloads.setShelfEnabled,extension.getURL,extension.getViews,' +
    'extension.getBackgroundPage,extension.getExtensionTabs,extension.setUpdateUrlData,' +
    'i18n.getMessage,i18n.getUILanguage,identity.getRedirectURL,idle.setDetectionInterval,' +
    'input.ime.hideInputView,input.ime.keyEventHandled,omnibox.setDefaultSuggestion,' +
    'pageAction.show,pageAction.hide,pageAction.setTitle,pageAction.setPopup,' +
    'platformKeys.subtleCrypto,power.requestKeepAwake,power.releaseKeepAwake,tabs.connect,' +
    'tts.stop,tts.pause,tts.resume,location.watchLocation,location.clearWatch';
  fnList = fnList.split(',');
  fnList.forEach((name) => fns.add(name));
  return fns.has(payload);
};

/**
 * Registers listener to handle extension message passing from content script.
 */
chrome.runtime.onMessage.addListener(gwt.dev.background.handleMessage);
