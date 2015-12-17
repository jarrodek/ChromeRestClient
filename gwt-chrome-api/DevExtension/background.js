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

  gwt.dev.background.callApi(request, sendResponse);

  return true; // must return true so the port will not be closed when this function finish.
};
/**
 * Call the API action.
 */
gwt.dev.background.callApi = function(request, sendResponse) {
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
