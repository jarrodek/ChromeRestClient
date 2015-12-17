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
//mock browserAction API
if (!chrome.browserAction) {
  let functions = 'chrome.browserAction.setTitle(details);chrome.browserAction.getTitle(details,' +
    'callback);chrome.browserAction.setIcon(details,callback);chrome.browserAction.setPopup' +
    '(details);chrome.browserAction.getPopup(details,callback);chrome.browserAction.setBadgeText' +
    '(details);chrome.browserAction.getBadgeText(details,callback);chrome.browserAction.' + 
    'setBadgeBackgroundColor(details);chrome.browserAction.getBadgeBackgroundColor(details,' + 
    'callback);chrome.browserAction.enable(tabId);chrome.browserAction.disable(tabId);' + 
    'chrome.browserAction.onClicked.addListener(callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
}
