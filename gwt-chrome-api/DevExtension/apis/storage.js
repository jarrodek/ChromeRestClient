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

  /*
  chrome.storage = chrome.storage || {};
  chrome.storage.local = chrome.storage.local || {};

  chrome.storage.local.get = function(keys, callback) {
    let p = {
      payload: 'storage.local.get',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.local.getBytesInUse = function(keys, callback) {
    let p = {
      payload: 'storage.local.getBytesInUse',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.local.set = function(keys, callback) {
    let p = {
      payload: 'storage.local.set',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.local.remove = function(keys, callback) {
    let p = {
      payload: 'storage.local.remove',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.local.clear = function(callback) {
    let p = {
      payload: 'storage.local.clear',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.local.QUOTA_BYTES = 5242880;
}
if (!chrome.storage.sync) {
  chrome.storage.sync = {};

  chrome.storage.sync.get = function(keys, callback) {
    let p = {
      payload: 'storage.sync.get',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.sync.getBytesInUse = function(keys, callback) {
    let p = {
      payload: 'storage.sync.getBytesInUse',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.sync.set = function(keys, callback) {
    let p = {
      payload: 'storage.sync.set',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.sync.remove = function(keys, callback) {
    let p = {
      payload: 'storage.sync.remove',
      params: keys
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.storage.sync.clear = function(callback) {
    let p = {
      payload: 'storage.sync.clear',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  
  chrome.storage.sync.QUOTA_BYTES = 102400;
  chrome.storage.sync.QUOTA_BYTES_PER_ITEM = 8192;
  chrome.storage.sync.MAX_ITEMS = 512;
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_HOUR = 1800;
  chrome.storage.sync.MAX_WRITE_OPERATIONS_PER_MINUTE = 120;
  */
}
/*
chrome.storage.onChanged = chrome.storage.onChanged || {};
chrome.storage.onChanged.addListener = chrome.storage.onChanged.addListener || function(callback) {
  let p = {
    payload: 'storage.onChanged.addListener',
    params: undefined
  };
  gwt.dev.chrome.addCallback(p.payload, p.params, callback);
  gwt.dev.chrome.postMessage(p);
};
*/
