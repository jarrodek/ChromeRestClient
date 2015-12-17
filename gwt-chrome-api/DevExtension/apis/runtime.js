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

if (!chrome.runtime.getManifest) {
  let manifest = {
    version: 'dev-env',
    permissions: []
  };
  /**
   * Mock the getManifest function.
   */
  chrome.runtime.getManifest = function() {
    return manifest;
  };
  chrome.runtime.getManifestAsync = function(callback) {
    let p = {
      payload: 'runtime.getManifest',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.runtime.getManifestAsync(function(result) {
    if (result) {
      manifest = result;
    }
  });
}
if (!chrome.runtime.openOptionsPage) {
  chrome.runtime.lastError = null;

  chrome.runtime.getId = function(callback) {
    let p = {
      payload: 'runtime.id',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.runtime.getId((id) => chrome.runtime.id = id);

  let functions = '' +
  'chrome.runtime.openOptionsPage(callback);chrome.runtime.setUninstallURL(url,' +
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
}
