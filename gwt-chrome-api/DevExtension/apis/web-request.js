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
if (!chrome.webRequest) {
  let functions = 'chrome.webRequest.handlerBehaviorChanged(callback);chrome.webRequest.' +
    'onBeforeRequest.addListener(callback);chrome.webRequest.onBeforeSendHeaders.addListener(' +
    'callback);chrome.webRequest.onSendHeaders.addListener(callback);chrome.webRequest.' + 
    'onHeadersReceived.addListener(callback);chrome.webRequest.onAuthRequired.addListener' +
    '(callback);chrome.webRequest.onResponseStarted.addListener(callback);chrome.webRequest.' +
    'onBeforeRedirect.addListener(callback);chrome.webRequest.onCompleted.addListener(callback);' +
    'chrome.webRequest.onErrorOccurred.addListener(callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));
  chrome.webRequest.MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES = 20;
}
