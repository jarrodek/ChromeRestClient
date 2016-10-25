(function() {
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
/* global fetch */
window.pendingAnalytics = window.pendingAnalytics || [];
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
 * A namespace for the Google Analytics tasks.
 *
 * @namespace
 */
arc.app.analytics = arc.app.analytics || {};

arc.app.analytics.getChannelName = function() {
  return arc.app.analytics._getChannelInfo()
  .then((channel) => {
    if (channel) {
      return channel;
    }
    return arc.app.analytics._loadCSV();
  })
  .then((result) => {
    if (typeof result === 'string') {
      return result;
    }
    if (!(result instanceof Array)) {
      return null;
    }
    let chromeVersion = arc.app.utils.chromeVersion;
    let channel = null;
    for (let i = 0, size = result.length; i < size; i++) {
      let system = result[i];
      for (let k = 0; k < system.versions.length; k++) {
        var version = system.versions[k];
        /*jshint camelcase: false */
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        if (version.current_version === chromeVersion ||
          version.previous_version === chromeVersion) {
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          /*jshint camelcase: true */
          channel = version.channel;
          break;
        }
      }
    }
    if (channel) {
      return arc.app.analytics._setChannelInfo(channel)
      .then(() => channel);
    }
    return null;
  });
};
/**
 * Loads a CSV data with chrome data.
 *
 * @return {Object} Promise will result with parsed object of the current channels.
 */
arc.app.analytics._loadCSV = function() {

  var init = {
    //mode: 'no-cors',
    cache: 'force-cache'
  };
  var os = arc.app.utils.osInfo.osName.toLocaleLowerCase();
  if (os.indexOf('win') !== -1) {
    os = 'win';
  } else if (os.indexOf('mac') !== -1) {
    os = 'mac';
  } else if (os.indexOf('linux') !== -1) {
    os = 'linux';
  } else {
    os = null;
  }
  var url = 'https://omahaproxy.appspot.com/all.json';
  if (os) {
    url += '?os=' + os;
  }
  return fetch(url, init)
  .then(function(response) {
    return response.json();
  });
};
arc.app.analytics._getChannelInfo = function() {
  return new Promise(function(resolve) {
    chrome.storage.local.get({'chromeChannel': null}, function(result) {
      resolve(result.chromeChannel);
    });
  });
};
arc.app.analytics._setChannelInfo = function(channel) {
  return new Promise(function(resolve) {
    chrome.storage.local.set({'chromeChannel': channel}, function() {
      resolve();
    });
  });
};
}());
