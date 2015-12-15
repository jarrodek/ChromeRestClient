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
  /*
  chrome.browserAction = {};
  chrome.browserAction.setTitle = function(details) {
    let p = {
      payload: 'chrome.browserAction.setTitle',
      params: details
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.getTitle = function(details, callback) {
    let p = {
      payload: 'chrome.browserAction.getTitle',
      params: details
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.setIcon = function(details, callback) {
    let p = {
      payload: 'chrome.browserAction.setIcon',
      params: details
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.setPopup = function(details) {
    let p = {
      payload: 'chrome.browserAction.setPopup',
      params: details
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.getPopup = function(details, callback) {
    let p = {
      payload: 'chrome.browserAction.getPopup',
      params: details
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.setBadgeText = function(details) {
    let p = {
      payload: 'chrome.browserAction.setBadgeText',
      params: details
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.getBadgeText = function(details, callback) {
    let p = {
      payload: 'chrome.browserAction.getBadgeText',
      params: details
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.setBadgeBackgroundColor = function(details) {
    let p = {
      payload: 'chrome.browserAction.setBadgeBackgroundColor',
      params: details
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.getBadgeBackgroundColor = function(details, callback) {
    let p = {
      payload: 'chrome.browserAction.getBadgeBackgroundColor',
      params: details
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.enable = function(tabId) {
    let p = {
      payload: 'chrome.browserAction.enable',
      params: tabId
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.disable = function(tabId) {
    let p = {
      payload: 'chrome.browserAction.disable',
      params: tabId
    };
    gwt.dev.chrome.postMessage(p);
  };
  chrome.browserAction.onClicked = {};
  chrome.browserAction.onClicked.addListener = function(callback) {
    let p = {
      payload: 'chrome.browserAction.onClicked.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  */
}
