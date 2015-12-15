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
//mock storage.local API
if (!chrome.storage || !chrome.storage.local) {
  let functions = 'chrome.storage.local.get(keys,callback);chrome.storage.local.getBytesInUse' +
    '(keys,callback);chrome.storage.local.set(keys,callback);chrome.storage.local.remove(keys,' +
    'callback);chrome.storage.local.clear(callback);chrome.storage.sync.get(keys,callback);' +
    'chrome.storage.sync.getBytesInUse(keys,callback);chrome.storage.sync.set(keys,callback);' + 
    'chrome.storage.sync.remove(keys,callback);chrome.storage.sync.clear(callback);chrome.' +
    'storage.onChanged.addListener(callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));

  chrome.storage.sync.QUOTA_BYTES = 102400;
  chrome.storage.sync.QUOTA_BYTES_PER_ITEM = 8192;
  chrome.storage.sync.MAX_ITEMS = 512;
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_HOUR = 1800;
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_MINUTE = 120;
  chrome.storage.local.QUOTA_BYTES = 5242880;
}
