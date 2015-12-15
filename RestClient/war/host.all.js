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

/**
 * App's dev environent.
 * During the development in GWT the app has no access to Chrome API's
 * and some function need to be mocked or proxied to the background page.
 *
 * This functions will initialize themselfs only if corresponding API is not
 * available.
 *
 * Because content script environment is separated from the page context
 * this script will mock Chrome API and pass the information to the
 * background page and eventually to the background page for execution.
 *
 * Include this file into host page during development to have access
 * to Chrome APIs from GWT dev page.
 */

/**
 * GWT namespace
 */
var gwt = gwt || {};
/**
 * GWT development namespace
 */
gwt.dev = gwt.dev || {};

/**
 * Chrome extension namespace
 */
gwt.dev.chrome = gwt.dev.chrome || {};
/**
 * A map for alll callback functions.
 *
 * A key in the map is a function resulted from 
 * the gwt.dev.chrome.stringifyFunction function.
 * Value is a set of function to be called.
 */
gwt.dev.chrome.callbacks = new Map();
/**
 * Add a callback function to the queue.
 * Callbacks will be executed when the response arrive from the background page.
 *
 * The 'params' and 'id' arguments will be combined into string object and together they will be 
 * used as an identifier of the callback function. Response from the background page will contain 
 * 'source-data' object with original call parameters and function ID so it can be recognized 
 * by the response listener.
 *
 * @param {String} id ID of the function. Response from the background page will contain it in
 * 'source-data' object. All functions for given id and {params} combination will be executed.
 * @param {Any} params parameters of the function that has been called. 
 * @param {Function} callback A function to be called after response arrive.
 */
gwt.dev.chrome.addCallback = function(id, params, callback) {
  let key = gwt.dev.chrome.stringifyFunction(id, params);
  let obj = gwt.dev.chrome.callbacks.get(key);
  if (!obj) {
    obj = new Set();
  }
  obj.add(callback);
  gwt.dev.chrome.callbacks.set(key, obj);
};
/**
 * Execute existing callback for given ID and params combination.
 *
 * @param {String} id ID of the function. Response from the background page will contain it in
 * 'source-data' object. All functions for given id and {params} combination will be executed.
 * @param {Any} params parameters of the function that has been called. 
 * @param {Any} response Response from the background page
 */
gwt.dev.chrome.execCallbacks = function(id, params, response) {
  let key = gwt.dev.chrome.stringifyFunction(id, params);
  let obj = gwt.dev.chrome.callbacks.get(key);
  if (!obj) {
    console.warn('There were no callbacks waiting for ', key);
    return;
  }
  //Don't remove event listeners from the stack.
  if (id.indexOf('addListener') === -1) {
    gwt.dev.chrome.callbacks.delete(key);
  }
  for (let item of obj) {
    item.call(item, response);
  }
};
/**
 * Create an ID from function name and it's parameters.
 * It will be used to identify a callback function
 * when the response return from the background page.
 */
gwt.dev.chrome.stringifyFunction = function(functionId, parameters) {
  let obj = {
    fn: functionId,
    params: parameters
  };
  return JSON.stringify(obj);
};
/**
 * Process the response from the background page (via Content Script)
 * and call callback function.
 *
 * @param {Object} data A `data` object from the message event.
 *    This object will contain:
 *    `source-data` property as an original function call properties
 *    `result` property as a result of API call in background page.
 */
gwt.dev.chrome.passResponseData = function(data) {
  if (!('source-data' in data)) {
    console.warn('`source-data` not available in. Can\'t call callback function');
    return;
  }
  let src = data['source-data'];
  gwt.dev.chrome.execCallbacks(src.id, src.params, data.result);
};
/**
 * A handler for `window.addEventListener('message')` observer.
 */
gwt.dev.chrome.receiveMessage = function(e) {
  if (e.origin !== location.origin) {
    return;
  }
  let data = e.data;
  //we don't care about the request, looking for response from Content Script.
  if (!data.source || data.source !== 'gwt:cs') {
    return;
  }
  if (!('source-data' in data)) {
    return;
  }
  var src = data['source-data'];
  if (!src.version || src.version !== 2) {
    return;
  }
  gwt.dev.chrome.passResponseData(data);
};
/**
 * Post message to the content script.
 *
 * This function will post a message using window.postMessage. Content Script should listen
 * for messages coming in this channel.
 * Content script will pass function from the same URL as the host page and having 'gwt:host' 
 * property.
 *
 * @param {Object} params The call parameters. It must contain:
 *  'id' - Optional. An ID of the function (unique for all functions defined here). 
 *         If `id` is omitted, `payload` will be used.
 *  'payload' - A Chrome API function name without first "chrome" part.
 *  'params' - Chrome API function call parameters.
 */
gwt.dev.chrome.postMessage = function(params) {
  if (!params || !params.payload) {
    throw new Error('Incomplete function call');
  }
  if (!params.id) {
    params.id = params.payload;
  }
  params.source = 'gwt:host';
  params.version = 2;
  window.postMessage(params, location.href);
};
/**
 * Register Chrome API automatically.
 */
gwt.dev.chrome.registerAPI = function(functionsDef) {
  functionsDef.forEach((name) => {
    let fnData = gwt.dev.chrome.parseFunction(name);

    var call = fnData.path.shift();
    if (!(call in window)) {
      window[call] = {};
    }
    call = window[call];
    fnData.path.forEach((path) => {
      if (!(path in call)) {
        call[path] = {};
      }
      call = call[path];
    });
    call[fnData.name] = function() {
      let args = Array.from(arguments);
      let callback = null;
      if (fnData.callback) {
        callback = args.pop();
      }
      let p = {
        payload: fnData.root.replace('chrome.', ''),
        params: undefined
      };
      if (args.length > 1) {
        p.params = args;
        p.multiparam = true;
      } else if (args.length === 1) {
        p.params = args[0];
      }
      if (typeof callback === 'function') {
        gwt.dev.chrome.addCallback(p.payload, p.params, callback);
      }
      gwt.dev.chrome.postMessage(p);
    };
  });
};

gwt.dev.chrome.parseFunction = function(fnStr) {
  let result = {
    path: [],
    name: undefined,
    params: [],
    callback: false,
  };
  let pn = fnStr.substr(fnStr.indexOf('(') + 1);
  result.params = pn.substr(0, pn.indexOf(')')).split(',');
  result.callback = (result.params.filter((item) => item === 'callback')).length === 0 ?
    false : true;
  result.root = fnStr.substr(0, fnStr.indexOf('('));
  result.path = result.root.split('.');
  result.name = result.path.pop();
  return result;
};
window.addEventListener('message', gwt.dev.chrome.receiveMessage, false);

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
//mock alarms API
if (!chrome.alarms) {
  let functions = 'chrome.alarms.create(name,alarmInfo);chrome.alarms.get(name,callback);chrome.' +
  'alarms.getAll(callback);chrome.alarms.clear(name,callback);chrome.alarms.clearAll(callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
  /*chrome.alarms = {};
  chrome.alarms.create = function(name, callback) {
    let p = {
      payload: 'chrome.alarms.create',
      params: name
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.alarms.get = function(name, callback) {
    let p = {
      payload: 'chrome.alarms.get',
      params: name
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.alarms.getAll = function(callback) {
    let p = {
      payload: 'chrome.alarms.getAll',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.alarms.clear = function(name, callback) {
    let p = {
      payload: 'chrome.alarms.clear',
      params: name
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.alarms.clearAll = function(name, callback) {
    let p = {
      payload: 'chrome.alarms.clearAll',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.alarms.onAlarm = {};
  chrome.alarms.onAlarm.addListener = function(callback) {
    let p = {
      payload: 'chrome.alarms.onAlarm.addListener',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };*/
}

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
//mock browsingData API
if (!chrome.browsingData) {
  // chrome.browsingData = {};
  let functions = 'chrome.browsingData.settings(callback);chrome.browsingData.remove(options,' + 
    'dataToRemove,callback);chrome.browsingData.removeAppcache(options,callback);chrome.' + 
    'browsingData.removeCache(options,callback);chrome.browsingData.removeCookies(options,' +
    'callback);chrome.browsingData.removeDownloads(options,callback);chrome.browsingData.' +
    'removeFileSystems(options,callback);chrome.browsingData.removeFormData(options,callback);' + 
    'chrome.browsingData.removeHistory(options,callback);chrome.browsingData.removeIndexedDB' + 
    '(options,callback);chrome.browsingData.removeLocalStorage(options,callback);chrome.' + 
    'browsingData.removePluginData(options,callback);chrome.browsingData.removePasswords(options' +
    ',callback);chrome.browsingData.removeWebSQL(options,callback)';

  gwt.dev.chrome.registerAPI(functions.split(';'));
}

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

chrome.runtime = chrome.runtime || {};

if (!chrome.runtime.getManifest) {
  /**
   * Mock the getManifest function.
   * Because this function is synchronous it will mock the object with default values.
   * If you pass a function as a parameter it will call background page to get real data.
   *
   * Warning: parameter in this function is only for development purpose. Real API do not
   * accept argument here.
   *
   * @param {Function} asyncFn Optional. If passed a function it will perform and async operation
   * and call background page to receive real manifest info. It can't be used on real API.
   */
  chrome.runtime.getManifest = function(asyncFn) {
    if (asyncFn && typeof asyncFn === 'function') {
      let callback = (manifest) => {
        asyncFn.call(asyncFn, manifest);
      };
      let p = {
        payload: 'runtime.getManifest',
        params: undefined
      };
      gwt.dev.chrome.addCallback(p.payload, p.params, callback);
      gwt.dev.chrome.postMessage(p);
      return;
    }
    //just to be mocked
    return {
      version: 'dev-env',
      permissions: []
    };
  };
}

let functions = 'chrome.runtime.openOptionsPage(callback);chrome.runtime.setUninstallURL(url,' +
  'callback);chrome.runtime.setUninstallURL(url,callback);chrome.runtime.reload();chrome.runtime' +
  '.requestUpdateCheck(callback);chrome.runtime.restart();chrome.runtime.sendMessage(extensionId' +
  ',message,options,callback);chrome.runtime.sendNativeMessage(application,message,callback);' +
  'chrome.runtime.getPlatformInfo(callback);chrome.runtime.getPackageDirectoryEntry(callback);' + 
  'chrome.runtime.onStartup.addListener(callback);chrome.runtime.onInstalled.addListener(' +
  'callback);chrome.runtime.onSuspend.addListener(callback);chrome.runtime.onSuspendCanceled.' + 
  'addListener(callback);chrome.runtime.onUpdateAvailable.addListener(callback);chrome.runtime.' + 
  'onConnect.addListener(callback);chrome.runtime.onConnectExternal.addListener(callback);chrome' +
  '.runtime.onMessage.addListener(callback)';

gwt.dev.chrome.registerAPI(functions.split(';'));
/*
if (!chrome.runtime.openOptionsPage) {
  chrome.runtime.openOptionsPage = function(callback) {
    let p = {
      payload: 'chrome.runtime.openOptionsPage',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.setUninstallURL) {
  chrome.runtime.setUninstallURL = function(url, callback) {
    let p = {
      payload: 'chrome.runtime.setUninstallURL',
      params: url
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.reload) {
  chrome.runtime.reload = function() {
    let p = {
      payload: 'chrome.runtime.reload',
      params: undefined
    };
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.requestUpdateCheck) {
  chrome.runtime.requestUpdateCheck = function(callback) {
    let p = {
      payload: 'chrome.runtime.requestUpdateCheck',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.restart) {
  chrome.runtime.restart = function() {
    let p = {
      payload: 'chrome.runtime.restart',
      params: undefined
    };
    gwt.dev.chrome.postMessage(p);
  };
}
if (!chrome.runtime.getPlatformInfo) {
  chrome.runtime.getPlatformInfo = function(callback) {
    let p = {
      payload: 'chrome.runtime.getPlatformInfo',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
}
*/

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
