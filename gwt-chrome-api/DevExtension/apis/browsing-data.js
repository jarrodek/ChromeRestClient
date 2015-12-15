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

/* globals chrome,gwt */
//mock browsingData API
if (!chrome.browsingData) {
  // chrome.browsingData = {};
  let functions = 'chrome.browsingData.settings(callback);chrome.browsingData.remove(options,' + 
    'dataToRemove,callback);chrome.browsingData.removeAppcache(options,callback);chrome.' + 
    'browsingData.removeCache(options,callback);chrome.browsingData.removeCookies(options,' +
    'callback);chrome.browsingData.removeDownloads(options,callback);chrome.browsingData.' +
    'removeFileSystems(options,callback);chrome.browsingData.removeFormData(options,callback);' + 
    'chrome.browsingData.removeHistory(options,callback);chrome.browsingData.removeIndexedDB' + 
    '(options,callback);chrome.browsingData.removeLocalStorage(options,callback);chrome.' + 
    'browsingData.removePluginData(options,callback);chrome.browsingData.removePasswords(options' +
    ',callback);chrome.browsingData.removeWebSQL(options,callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
}
