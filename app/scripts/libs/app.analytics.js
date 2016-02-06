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
 * A list of created trackers.
 */
arc.app.analytics._trackers = [];
/**
 * A configuration for trackers.
 * The array should contain as many configuration objects as needed.
 * Functions will use this configurations later to call trackers.
 * Value of each object will be passed as an argument to `create` function.
 * Each configuration element should contain a `name` property. If there will be no
 * `name` property the tracker will be not called by this code (but it will be initialized).
 */
arc.app.analytics._trackersConfig = [{
  'trackingId': 'UA-18021184-6'
},{
  'trackingId': 'UA-18021184-14'
}];
/**
 * Initialize Google Analytics code (init tracker).
 */
arc.app.analytics.init = function() {
  arc.app.analytics._initTranckers();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
};
/**
 * Initialize trackers.
 */
arc.app.analytics._initTranckers = function() {
<<<<<<< HEAD:app/scripts/libs/app.analytics.js
  var service = analytics.getService('ARC');
=======
  if (typeof ga !== 'function') {
    return;
  }
>>>>>>> hotfix-db:RestClient/dev/libs/app.analytics.js
  arc.app.analytics._trackersConfig.forEach(function(item) {
    let tracker = service.getTracker(item.trackingId);
    arc.app.analytics._trackers.push(tracker);
  });
};
/**
 * Initialize and set up custom dimmenstion that are used by the app.
 */
arc.app.analytics._setCustomDimmensions = function() {
<<<<<<< HEAD:app/scripts/libs/app.analytics.js
  var appVersion = chrome.runtime.getManifest().version;
=======
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  var appVersion = (chrome && chrome.runtime && chrome.runtime.getManifest) ?
    chrome.runtime.getManifest().version : 'Unknown';
>>>>>>> hotfix-db:RestClient/dev/libs/app.analytics.js
  var chromeVer = arc.app.utils.getChromeVersion();
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.set('dimension1', chromeVer);
    tracker.set('dimension2', appVersion);
    //tracker.set('appVersion', appVersion);
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
    arc.app.analytics._trackers.forEach(function(tracker) {
      tracker.set('userId', uuid);
    });
  };
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({
      'appuid': false
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
          arc.app.analytics._trackers.forEach(function(tracker) {
            tracker.set('dimension3', channel);
          });
          return;
        }
      }
    })
    .catch(function(cause) {
      // @if NODE_ENV='debug'
      console.info('Unable to download Chrome channels list', cause);
      // @endif
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
<<<<<<< HEAD:app/scripts/libs/app.analytics.js
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendEvent(category, action, label, value);
=======
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
>>>>>>> hotfix-db:RestClient/dev/libs/app.analytics.js
  });
};
/**
 * Send a screen name as a screen view.
 *
 * @param {String} screenName A screen name to be send.
 */
arc.app.analytics.sendScreen = function(screenName) {
<<<<<<< HEAD:app/scripts/libs/app.analytics.js
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendAppView(screenName);
=======
  if (typeof ga !== 'function') {
    return;
  }
  var names = arc.app.analytics._getTrackerNames();
  names.forEach(function(name) {
    ga(name + '.send', 'pageview', screenName);
>>>>>>> hotfix-db:RestClient/dev/libs/app.analytics.js
  });
};
/**
 * Send an exception information to the GA server.
 *
 * @param {String} exception An exception message.
 * @param {Boolean} isFatal True if the exception is fatal.
 */
arc.app.analytics.sendException = function(exception, isFatal) {
<<<<<<< HEAD:app/scripts/libs/app.analytics.js
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendException(exception, isFatal);
=======
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
>>>>>>> hotfix-db:RestClient/dev/libs/app.analytics.js
  });
};
