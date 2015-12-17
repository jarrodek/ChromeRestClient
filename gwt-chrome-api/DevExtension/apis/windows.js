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
//mock webRequest API
if (!chrome.windows) {
  let functions = 'chrome.windows.get(windowId,getInfo,callback);' +
    'chrome.windows.getCurrent(getInfo,callback);chrome.windows.getLastFocused(getInfo,callback);' +
    'chrome.windows.getAll(getInfo,callback);' + 
    'chrome.windows.create(createData,callback);' +
    'chrome.windows.update(windowId,updateInfo,callback);' +
    'chrome.windows.remove(windowId,callback);' +
    'chrome.windows.onCreated.addListener(callback);' +
    'chrome.windows.onRemoved.addListener(callback);' +
    'chrome.windows.onFocusChanged.addListener(callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));
  chrome.windows.WINDOW_ID_NONE = -1;
  chrome.windows.WINDOW_ID_CURRENT = -2;
}
