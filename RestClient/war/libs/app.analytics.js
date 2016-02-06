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
/* global ga, chrome, fetch */
/**
 * Advanced Rest Client namespace
 * 
 * @namespace
 */
var arc = arc || {};
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
/**
 * A configuration for trackers.
 * The array should contain as many configuration objects as needed.
 * Functions will use this configurations later to call trackers.
 * Value of each object will be passed as an argument to `create` function.
 * Each configuration element should contain a `name` property. If there will be no
 * `name` property the tracker will be not called by this code (but it will be initialized).
 */
arc.app.analytics._trackersConfig = [{
  'trackingId': 'UA-18021184-6',
  'cookieDomain': 'auto',
  'name': 'legacy'
}];
/**
 * Initialize Google Analytics code (init tracker).
 */
arc.app.analytics.init = function() {
  arc.app.analytics._loadLibrary();
  arc.app.analytics._initTranckers();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
};
/**
 * Load GA library.
 */
arc.app.analytics._loadLibrary = function() {
  // jscs:disable
  /* jshint ignore:start */
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /* jshint ignore:end */
  // jscs:enable
};
/**
 * Initialize trackers.
 */
arc.app.analytics._initTranckers = function() {
  if (typeof ga !== 'function') {
    return;
  }
  arc.app.analytics._trackersConfig.forEach(function(item) {
    ga('create', item);
    if (!item.name) {
      return;
    }
    ga(item.name + '.set', 'checkProtocolTask', null);
    //ga(item.name + '.set', 'appName', 'ARC');
    //ga(item.name + '.set', 'appId', 'org.rest.client');
  });
};
/**
 * Returns an array of tracker names.
 * If the config object does not contain a name property it wont be included into the array.
 *
 * @return {Array<String>} An array with tracker names.
 */
arc.app.analytics._getTrackerNames = function() {
  var names = arc.app.analytics._trackersConfig.map(function(item) {
    if (!!item.name) {
      return item.name;
    }
  });
  return names.filter(function(item) {
    return !!item;
  });
};
/**
 * Initialize and set up custom dimmenstion that are used by the app.
 */
arc.app.analytics._setCustomDimmensions = function() {
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  var appVersion = (chrome && chrome.runtime && chrome.runtime.getManifest) ?
    chrome.runtime.getManifest().version : 'Unknown';
  var chromeVer = arc.app.utils.getChromeVersion();
  names.forEach(function(name) {
    //ga(name + '.set', 'appVersion', appVersion);
    ga(name + '.set', 'dimension2', appVersion);
    ga(name + '.set', 'dimension1', chromeVer);
  });
};
/**
 * The app is creating a anonymous UUID and is keeping it into
 * sync storage. This value will be propagated across app instances of the same user.
 * This information will be used in compliance with Google Analytics terms & conditions
 * which disallows any user information to be send to the GA server.
 * It's only for statistical reports.
 *
 * TODO: Add possibility to disable tracking code in settings.
 */
arc.app.analytics._setAppUid = function() {
  var setUid = function(uuid) {
    let names = arc.app.analytics._getTrackerNames();
    names.forEach(function(name) {
      ga(name + '.set', 'userId', uuid);
    });
  };
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({
      'appuid': null
    }, function(data) {
      if (data.appuid) {
        setUid(data.appuid);
      } else {
        data.appuid = arc.app.utils.uuid();
        chrome.storage.sync.set(data, function() {
          setUid(data.appuid);
        });
      }
    });
  }
};
/**
 * If possible list current Chrom[e|ium] channels and find current version's channel.
 * Then set it up as a custom dimension.
 */
arc.app.analytics._setChromeChannel = function() {
  if (!window.navigator.onLine) {
    return;
  }
  if (typeof ga !== 'function') {
    return;
  }
  arc.app.analytics._loadCSV()
    .then(function(obj) {
      if (!(obj instanceof Array)) {
        return;
      }
      let version = arc.app.utils.getChromeVersion();
      for (let i = 0, size = obj[1].length; i < size; i++) {
        let item = obj[1][i];
        /*jshint camelcase: false */
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        if (item.current_version === version ||
          item.previous_version === version) {
          // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          /*jshint camelcase: true */
          let channel = item.channel;
          let names = arc.app.analytics._getTrackerNames();
          for (let j = 0, namesSize = names.length; j < namesSize; j++) {
            let name = names[j];
            ga(name + '.set', 'dimension3', channel);
          }
          return;
        }
      }
    })
    .catch(function(cause) {
    });
};
/**
 * Loads a CSV data with chrome data.
 *
 * @return {Object} Promise will result with parsed object of the current channels.
 */
arc.app.analytics._loadCSV = function() {
  var init = {
    mode: 'no-cors',
    cache: 'force-cache'
  };
  return fetch('https://omahaproxy.appspot.com/all?csv=1', init).then(function(response) {
    return response.text();
  }).then(function(data) {
    return data.split('\n');
  }).then(function(lines) {
    var keys = lines[0].split(',');
    var data = [];
    for (var i = 1; i < lines.length; ++i) {
      var line = lines[i];
      if (!line.length) {
        continue;
      }
      var columns = line.split(',');
      var row = {};
      for (var j = 0; j < columns.length; ++j) {
        row[keys[j]] = columns[j];
      }
      data.push(row);
    }
    return [keys, data];
  });
};
/**
 * And an event to the Google Analytics.
 *
 * @param {String} category Event's category
 * @param {String} action Event's action
 * @param {String} label Event's label
 * @param {!Number} value An optional value of the event. 
 */
arc.app.analytics.sendEvent = function(category, action, label, value) {
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  var config = {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  };
  if (typeof value !== 'undefined') {
    config.eventValue = value;
  }
  names.forEach(function(name) {
    ga(name + '.send', config);
  });
};
/**
 * Send a screen name as a screen view.
 *
 * @param {String} screenName A screen name to be send.
 */
arc.app.analytics.sendScreen = function(screenName) {
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  names.forEach(function(name) {
    ga(name + '.send', 'pageview', screenName);
  });
};
/**
 * Send an exception information to the GA server.
 *
 * @param {String} exception An exception message.
 * @param {Boolean} isFatal True if the exception is fatal.
 */
arc.app.analytics.sendException = function(exception, isFatal) {
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  var value = {
    'exDescription': '' + exception
  };
  if (typeof isFatal !== 'undefined') {
    value.exFatal = isFatal;
  }
  names.forEach(function(name) {
    ga(name + '.send', 'exception', value);
  });
};
