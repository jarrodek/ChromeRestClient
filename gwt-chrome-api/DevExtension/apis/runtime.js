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

/* globals chrome, gwt */

chrome.runtime = chrome.runtime || {};

if (!chrome.runtime.getManifest) {
  /**
   * Mock the getManifest function.
   * Because this function is synchronous it will mock the object with default values.
   * If you pass a function as a parameter it will call background page to get real data.
   *
   * Warning: parameter in this function is only for development purpose. Real API do not
   * accept argument here.
   *
   * @param {Function} asyncFn Optional. If passed a function it will perform and async operation
   * and call background page to receive real manifest info. It can't be used on real API.
   */
  chrome.runtime.getManifest = function(asyncFn) {
    if (asyncFn && typeof asyncFn === 'function') {
      let callback = (manifest) => {
        asyncFn.call(asyncFn, manifest);
      };
      let p = {
        payload: 'runtime.getManifest',
        params: undefined
      };
      gwt.dev.chrome.addCallback(p.payload, p.params, callback);
      gwt.dev.chrome.postMessage(p);
      return;
    }
    //just to be mocked
    return {
      version: 'dev-env',
      permissions: []
    };
  };
}

let functions = 'chrome.runtime.openOptionsPage(callback);chrome.runtime.setUninstallURL(url,' +
  'callback);chrome.runtime.setUninstallURL(url,callback);chrome.runtime.reload();chrome.runtime' +
  '.requestUpdateCheck(callback);chrome.runtime.restart();chrome.runtime.sendMessage(extensionId' +
  ',message,options,callback);chrome.runtime.sendNativeMessage(application,message,callback);' +
  'chrome.runtime.getPlatformInfo(callback);chrome.runtime.getPackageDirectoryEntry(callback);' + 
  'chrome.runtime.onStartup.addListener(callback);chrome.runtime.onInstalled.addListener(' +
  'callback);chrome.runtime.onSuspend.addListener(callback);chrome.runtime.onSuspendCanceled.' + 
  'addListener(callback);chrome.runtime.onUpdateAvailable.addListener(callback);chrome.runtime.' + 
  'onConnect.addListener(callback);chrome.runtime.onConnectExternal.addListener(callback);chrome' +
  '.runtime.onMessage.addListener(callback)';

gwt.dev.chrome.registerAPI(functions.split(';'));
/*
if (!chrome.runtime.openOptionsPage) {
  chrome.runtime.openOptionsPage = function(callback) {
    let p = {
      payload: 'chrome.runtime.openOptionsPage',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL = function(url, callback) {
    let p = {
      payload: 'chrome.runtime.setUninstallURL',
      params: url
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.reload) {
  chrome.runtime.reload = function() {
    let p = {
      payload: 'chrome.runtime.reload',
      params: undefined
    };
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.requestUpdateCheck) {
  chrome.runtime.requestUpdateCheck = function(callback) {
    let p = {
      payload: 'chrome.runtime.requestUpdateCheck',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.restart) {
  chrome.runtime.restart = function() {
    let p = {
      payload: 'chrome.runtime.restart',
      params: undefined
    };
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.getPlatformInfo) {
  chrome.runtime.getPlatformInfo = function(callback) {
    let p = {
      payload: 'chrome.runtime.getPlatformInfo',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
*/
