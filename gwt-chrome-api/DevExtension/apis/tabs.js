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
//mock tabs API
if (!chrome.tabs) {
  let functions = 'chrome.tabs.get(tabId,callback);' +
    'chrome.tabs.getCurrent(callback);' +
    'chrome.tabs.sendRequest(tabId,request,callback);' +
    'chrome.tabs.sendMessage(tabId,message,options,callback);' +
    'chrome.tabs.getSelected(windowId,callback);' +
    'chrome.tabs.getAllInWindow(windowId,callback);' +
    'chrome.tabs.create(createProperties,callback);' +
    'chrome.tabs.duplicate(tabId,callback);' +
    'chrome.tabs.query(queryInfo,callback);' +
    'chrome.tabs.highlight(highlightInfo,callback);' +
    'chrome.tabs.update(tabId,updateProperties,callback);' +
    'chrome.tabs.move(tabIds,moveProperties,callback);' +
    'chrome.tabs.reload(tabId,reloadProperties,callback);' +
    'chrome.tabs.remove(tabIds,callback);' +
    'chrome.tabs.detectLanguage(tabId,callback);' +
    'chrome.tabs.captureVisibleTab(windowId,options,callback);' +
    'chrome.tabs.executeScript(tabId,details,callback);' +
    'chrome.tabs.insertCSS(tabId,details,callback);' +
    'chrome.tabs.setZoom(tabId,zoomFactor,callback);' +
    'chrome.tabs.getZoom(tabId,callback);' +
    'chrome.tabs.setZoomSettings(tabId,zoomSettings,callback);' +
    'chrome.tabs.getZoomSettings(tabId,callback);' +
    'chrome.tabs.onCreated.addListener(callback);' +
    'chrome.tabs.onUpdated.addListener(callback);' +
    'chrome.tabs.onMoved.addListener(callback);' +
    'chrome.tabs.onActivated.addListener(callback);' +
    'chrome.tabs.onHighlighted.addListener(callback);' +
    'chrome.tabs.onDetached.addListener(callback);' +
    'chrome.tabs.onAttached.addListener(callback);' +
    'chrome.tabs.onRemoved.addListener(callback);' +
    'chrome.tabs.onReplaced.addListener(callback);' +
    'chrome.tabs.onZoomChange.addListener(callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));
}
