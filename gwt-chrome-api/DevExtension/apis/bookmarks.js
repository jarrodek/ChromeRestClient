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
//mock bookmarks API
if (!chrome.bookmarks) {

  // chrome.bookmarks = {};
  let functions = 'chrome.bookmarks.get(idOrIdList,callback);chrome.bookmarks.getChildren(id,' +
    'callback);chrome.bookmarks.getRecent(numberOfItems,callback);chrome.bookmarks.getTree' + 
    '(callback);chrome.bookmarks.getSubTree(id,callback);chrome.bookmarks.search(query,callback)' +
    ';chrome.bookmarks.create(bookmark,callback);chrome.bookmarks.move(id,destination,callback);' +
    'chrome.bookmarks.update(id,changes,callback);chrome.bookmarks.remove(id,callback);chrome.' + 
    'bookmarks.removeTree(id,callback);chrome.bookmarks.onCreated.addListener(callback);chrome.' + 
    'bookmarks.onRemoved.addListener(callback);chrome.bookmarks.onChanged.addListener(callback);' +
    'chrome.bookmarks.onMoved.addListener(callback);chrome.bookmarks.onChildrenReordered.' + 
    'addListener(callback);chrome.bookmarks.onImportBegan.addListener(callback);' + 
    'chrome.bookmarks.onImportEnded.addListener(callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
  /*
  chrome.bookmarks.get = function(idOrIdList, callback) {
    let p = {
      payload: 'chrome.bookmarks.get',
      params: idOrIdList
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.getChildren = function(id, callback) {
    let p = {
      payload: 'chrome.bookmarks.getChildren',
      params: id
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.getRecent = function(numberOfItems, callback) {
    let p = {
      payload: 'chrome.bookmarks.getRecent',
      params: numberOfItems
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.getTree = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.getTree',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.getSubTree = function(id, callback) {
    let p = {
      payload: 'chrome.bookmarks.getSubTree',
      params: id
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.search = function(query, callback) {
    let p = {
      payload: 'chrome.bookmarks.search',
      params: query
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.create = function(bookmark, callback) {
    let p = {
      payload: 'chrome.bookmarks.create',
      params: bookmark
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.move = function(id, destination, callback) {
    let p = {
      payload: 'chrome.bookmarks.move',
      params: [id, destination],
      multiparam: true
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.update = function(id, changes, callback) {
    let p = {
      payload: 'chrome.bookmarks.update',
      params: [id, changes],
      multiparam: true
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.remove = function(id, callback) {
    let p = {
      payload: 'chrome.bookmarks.remove',
      params: id
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.removeTree = function(id, callback) {
    let p = {
      payload: 'chrome.bookmarks.removeTree',
      params: id
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onCreated = chrome.bookmarks.onRemoved = chrome.bookmarks.onChanged = 
  chrome.bookmarks.onMoved = chrome.bookmarks.onChildrenReordered = 
  chrome.bookmarks.onImportBegan = chrome.bookmarks.onImportEnded = {};
  chrome.bookmarks.onCreated.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onCreated.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onRemoved.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onRemoved.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onChanged.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onChanged.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onMoved.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onMoved.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onChildrenReordered.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onChildrenReordered.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onImportBegan.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onImportBegan.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.bookmarks.onImportEnded.addListener = function(callback) {
    let p = {
      payload: 'chrome.bookmarks.onImportEnded.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  */
}
