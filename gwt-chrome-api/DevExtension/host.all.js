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
//mock commands API
if (!chrome.commands) {
  let functions = 'chrome.commands.getAll(callback);' +
    'chrome.commands.getAll(callback)';
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
//mock cookies API
if (!chrome.cookies) {
  let functions = 'chrome.cookies.get(details,callback);' +
    'chrome.cookies.getAll(details,callback);' +
    'chrome.cookies.set(details,callback);' +
    'chrome.cookies.remove(details,callback);' +
    'chrome.cookies.getAllCookieStores(callback);' +
    'chrome.cookies.onChanged.addListener(callback)';
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
//mock gcm API
if (!chrome.gcm) {
  let functions = 'chrome.gcm.register(senderIds,callback);' +
    'chrome.gcm.unregister(callback);' +
    'chrome.gcm.send(message,callback);' +
    'chrome.gcm.onMessage.addListener(callback);' +
    'chrome.gcm.onMessagesDeleted.addListener(callback);' +
    'chrome.gcm.onSendError.addListener(callback)';
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
//mock storage.local API
if (!chrome.history) {
  let functions = 'chrome.history.search(query,callback);chrome.history.getVisits(details,' +
    'callback);chrome.history.addUrl(details,callback);chrome.history.deleteUrl(details,' +
    'callback);chrome.history.deleteRange(range,callback);chrome.history.deleteAll(callback);' +
    'chrome.history.onVisited.addListener(callback);chrome.history.onVisitRemoved.addListener(' +
    'callback)';
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
//mock i18n API
if (!chrome.i18n) {
  let functions = 'chrome.i18n.getAcceptLanguages(callback);' +
    'chrome.i18n.getMessage(messageName,substitutions);' +
    'chrome.i18n.getUILanguage();' +
    'chrome.i18n.detectLanguage(text,callback)';
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
//mock identity API
if (!chrome.identity) {
  let functions = 'chrome.identity.getAccounts(callback);' +
    'chrome.identity.getAuthToken(details,callback);' +
    'chrome.identity.getProfileUserInfo(callback);' + 
    'chrome.identity.removeCachedAuthToken(details,callback);' +
    'chrome.identity.launchWebAuthFlow(details,callback);' +
    'chrome.identity.getRedirectURL(path);' +
    'chrome.identity.onSignInChanged.addListener(callback)';
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
//mock idle API
if (!chrome.idle) {
  let functions = 'chrome.idle.queryState(detectionIntervalInSeconds,callback);' +
    'chrome.idle.setDetectionInterval(intervalInSeconds);' +
    'chrome.idle.onStateChanged.addListener(callback)';
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
//mock instanceID API
if (!chrome.instanceID) {
  let functions = 'chrome.instanceID.getID(callback);' +
    'chrome.instanceID.getCreationTime(callback);' +
    'chrome.instanceID.getToken(getTokenParams,callback);' +
    'chrome.instanceID.deleteToken(deleteTokenParams,callback);' +
    'chrome.instanceID.deleteID(callback);' +
    'chrome.instanceID.onTokenRefresh.addListener(callback)';
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
//mock notifications API
if (!chrome.notifications) {
  let functions = 'chrome.notifications.create(notificationId,options,callback);' +
    'chrome.notifications.update(notificationId,options,callback);' +
    'chrome.notifications.clear(notificationId,callback);' +
    'chrome.notifications.getAll(callback);' +
    'chrome.notifications.getPermissionLevel(callback);' +
    'chrome.notifications.onClosed.addListener(callback);' +
    'chrome.notifications.onClicked.addListener(callback);' +
    'chrome.notifications.onButtonClicked.addListener(callback);' +
    'chrome.notifications.onPermissionLevelChanged.addListener(callback);' +
    'chrome.notifications.onShowSettings.addListener(callback)';
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
//mock permissions API
if (!chrome.permissions) {
  let functions = 'chrome.permissions.getAll(callback);' +
    'chrome.permissions.contains(permissions,callback);' +
    'chrome.permissions.request(permissions,callback);' +
    'chrome.permissions.remove(permissions,callback);' +
    'chrome.permissions.onAdded.addListener(callback);' +
    'chrome.permissions.onRemoved.addListener(callback)';
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

if (!chrome.runtime.getManifest) {
  let manifest = {
    version: 'dev-env',
    permissions: []
  };
  /**
   * Mock the getManifest function.
   */
  chrome.runtime.getManifest = function() {
    return manifest;
  };
  chrome.runtime.getManifestAsync = function(callback) {
    let p = {
      payload: 'runtime.getManifest',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.runtime.getManifestAsync(function(result) {
    if (result) {
      manifest = result;
    }
  });
}
if (!chrome.runtime.openOptionsPage) {
  chrome.runtime.lastError = null;

  chrome.runtime.getId = function(callback) {
    let p = {
      payload: 'runtime.id',
      params: undefined
    };
    gwt.dev.chrome.addCallback(p.payload, p.params, callback);
    gwt.dev.chrome.postMessage(p);
  };
  chrome.runtime.getId((id) => chrome.runtime.id = id);

  let functions = '' +
  'chrome.runtime.openOptionsPage(callback);chrome.runtime.setUninstallURL(url,' +
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
if (!chrome.windows) {
  let functions = 'chrome.windows.get(windowId,getInfo,callback);' +
    'chrome.windows.getCurrent(getInfo,callback);chrome.windows.getLastFocused(getInfo,callback);' +
    'chrome.windows.getAll(getInfo,callback);' + 
    'chrome.windows.create(createData,callback);' +
    'chrome.windows.update(windowId,updateInfo,callback);' +
    'chrome.windows.remove(windowId,callback);' +
    'chrome.windows.onCreated.addListener(callback);' +
    'chrome.windows.onRemoved.addListener(callback);' +
    'chrome.windows.onFocusChanged.addListener(callback)';
  gwt.dev.chrome.registerAPI(functions.split(';'));
  chrome.windows.WINDOW_ID_NONE = -1;
  chrome.windows.WINDOW_ID_CURRENT = -2;
}
