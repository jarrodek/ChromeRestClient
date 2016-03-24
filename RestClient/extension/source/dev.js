"use strict";

/**
 * App's dev environent.
 * During the development the app has no access to Chrome API's
 * and some function need to be mocked or proxied to the background page.
 *
 * This functions will initialize themselfs only if corresponding API is not
 * available.
 *
 * Because content script environment is separated from the page context
 * this script will mock Chrome API and pass the information to the
 * background page and eventually to the background page for execution.
 */
/* global chrome */

chrome.runtime = chrome.runtime || {};

/**
 * Create an ID for function and it's call parameters.
 * It will be used to identify a callback function
 * when the response return from the background page.
 */
function stringifyFunction(functionId, parameters){
  let obj = {
    fn: functionId,
    params: parameters
  };
  return JSON.stringify(obj);
}



if(!chrome.runtime || !chrome.runtime.getManifest){
    chrome.runtime.getManifest = function(){
      //just to be mocked
      return {
        version: 'dev-env'
      }
    };
}

//mock storage.local API
if(!chrome.storage || chrome.storage.local){
  chrome.storage = chrome.storage || {};
  chrome.storage.local = chrome.storage.local || {};

  /**
   * This flag determines that the dev env is applied to this API
   */
  chrome.storage.gwtDev = true;

  chrome.storage.local._hostCallbacks = new Map();

  /**
   * Add a callback function to the queue.
   */
  chrome.storage.local._addCallback = function(id, params, callback){
    let key = stringifyFunction(id, params);
    let obj = chrome.storage.local._hostCallbacks.get(key);
    if(!obj){
      obj = new Set();
    }
    obj.add(callback);
    chrome.storage.local._hostCallbacks.set(key, obj);
  };
  chrome.storage.local._execCallbacks = function(id, params, response){
    let key = stringifyFunction(id, params);
    let obj = chrome.storage.local._hostCallbacks.get(key);
    if(!obj){
      console.warn('There were no callbacks waiting for ', key);
      return;
    }
    chrome.storage.local._hostCallbacks.delete(key);
    for (let item of obj) {
      item.call(window, response);
    }
  };



  chrome.storage.local.get = function(keys, callback){
    const ID = "chrome.storage.local.get";
    chrome.storage.local._addCallback(ID, keys, callback);
    var postObject = {
      source: "gwt:host",
      version: 2,
      payload: "storage.local.get",
      id: ID,
      params: keys
    };
    window.postMessage(postObject, location.href);
  };

  chrome.storage.local.set = function(keys, callback){
    const ID = "chrome.storage.local.set";
    chrome.storage.local._addCallback(ID, keys, callback);
    var postObject = {
      source: "gwt:host",
      version: 2,
      payload: "storage.local.set",
      id: ID,
      params: keys
    };
    window.postMessage(postObject, location.href);
  };

  chrome.storage.onChanged = chrome.storage.onChanged || {};
  chrome.storage.onChanged.addListener = function(){};
}


window.addEventListener("message", receiveMessage, false);
function receiveMessage(e){
  if(e.origin != location.origin){ return; };
  let data = e.data;
  //we don't care about the request, looking for response from Content Script.
  if(!data.source || data.source !== "gwt:cs") return;

  if(!data.version || data.version !== 2){
		return;
	}
  passResponseData(data);
}

function passResponseData(data){
  let src = data['source-data'];
  switch(src.id){
    case 'chrome.storage.local.get':
    case 'chrome.storage.local.set':
      chrome.storage.local._execCallbacks(src.id, src.params, data.result);
    break;
  }
}
