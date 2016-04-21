(function() {
'use strict';
/*******************************************************************************
 * Copyright 2016 Pawel Psztyc, The ARC team
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
/* global chrome */
/**
 * Advanced Rest Client namespace
 *
 * @namespace
 */
window.arc = window.arc || {};
/**
 * ARC app's namespace
 *
 * @namespace
 */
arc.app = arc.app || {};
/**
 * A namespace for app settings
 *
 * @namespace
 */
arc.app.settings = arc.app.settings || {};
/**
 * Get current user configuration stored in sync storage.
 *
 * @return {Promise}
 */
arc.app.settings.getConfig = function() {
  return new Promise(function(resolve) {
    var values = {
      'HISTORY_ENABLED': true,
      'MAGICVARS_ENABLED': true,
      'useCookieStorage': true,
      'requestDefaultTimeout': 30
    };
    try {
      chrome.storage.sync.get(values, function(result) {
        resolve(result);
      });
    } catch (e) {
      console.error('arc.app.settings.getConfig', e);
      resolve(values);
    }
  });
};
/**
 * Save user configuration to sync storage.
 *
 * @param  {String} key A configuration key to be saved
 * @param  {Boolean} value A value to be saved
 *
 * @return {Promise}
 */
arc.app.settings.saveConfig = function(key, value) {
  return new Promise(function(resolve) {
    var o = {};
    o[key] = value;
    chrome.storage.sync.set(o, resolve);
  });
};
arc.app.settings.observe = function(callback) {
  chrome.storage.onChanged.addListener(function(changes, area) {
    callback(changes, area);
  });
};
}());
