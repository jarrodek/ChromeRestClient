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
/* global fetch, analytics */
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
},{
  'trackingId': 'UA-71458341-2'
}];
/**
 * Initialize Google Analytics code (init tracker).
 */
arc.app.analytics.init = function() {
  console.group('Initiaize Google Analytics');
  arc.app.analytics._initTranckers();
  arc.app.analytics._setupAnalyticsListener();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
  console.groupEnd();
};
/**
 * Initialize trackers.
 */
arc.app.analytics._initTranckers = function() {
  var service = analytics.getService('ARC');
  console.log('Service has been initialized.');
  service.getConfig().addCallback(arc.app.analytics.initAnalyticsConfig);
  arc.app.analytics._trackersConfig.forEach(function(item) {
    let tracker = service.getTracker(item.trackingId);
    console.log('Setup tracker for ' + item.trackingId);
    arc.app.analytics._trackers.push(tracker);
  });
};
arc.app.analytics.initAnalyticsConfig = function(config) {
  var permitted = config.isTrackingPermitted();
  console.info('[Google Analytics] Tracking is ' + (permitted ? '' : 'not ') + 'permitted');
},
/**
 * Initialize and set up custom dimmenstion that are used by the app.
 */
arc.app.analytics._setCustomDimmensions = function() {
  var appVersion = arc.app.utils.appVer;
  var chromeVer = arc.app.utils.chromeVersion;
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.set('dimension1', chromeVer);
    tracker.set('dimension2', appVersion);
    //tracker.set('appVersion', appVersion);
  });
  console.log('Setting up custom dimension #%d: %s', 1, chromeVer);
  console.log('Setting up custom dimension #%d: %s', 2, appVersion);
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
    console.log('[Google Analytics] Setting up user ID: %s', uuid);
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
  console.log('Setting up chrome channel');
  arc.app.analytics._loadCSV()
    .then(function(obj) {
      if (!(obj instanceof Array)) {
        return;
      }
      let chromeVersion = arc.app.utils.chromeVersion;
      for (let i = 0, size = obj.length; i < size; i++) {
        let system = obj[i];
        for (let k = 0; k < system.versions.length; k++) {
          var version = system.versions[k];
          /*jshint camelcase: false */
          // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
          if (version.current_version === chromeVersion ||
            version.previous_version === chromeVersion) {
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            /*jshint camelcase: true */
            let channel = version.channel;
            for (let j = 0, len = arc.app.analytics._trackers.length; j < len; j++) {
              arc.app.analytics._trackers[j].set('dimension3', channel);
            }
            console.info('[Google Analytics] Setting up custom dimension #%d: %s', 3, channel);
            return;
          }
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
    //mode: 'no-cors',
    cache: 'force-cache'
  };
  return fetch('https://omahaproxy.appspot.com/all.json', init)
  .then(function(response) {
    return response.json();
  });
};
arc.app.analytics._setupAnalyticsListener = function() {
  arc.app.analytics._trackers.forEach(function(tracker) {
    arc.app.analytics._addDebugListeners(tracker);
  });
};
arc.app.analytics._addDebugListeners = function(tracker) {
  tracker.addFilter(
    analytics.filters.FilterBuilder.builder()
    .whenHitType(analytics.HitTypes.EVENT)
    .applyFilter(arc.app.analytics._debugEvent)
    .build());
  tracker.addFilter(
    analytics.filters.FilterBuilder.builder()
    .whenHitType(analytics.HitTypes.APPVIEW)
    .applyFilter(arc.app.analytics._debugAppView)
    .build());
  tracker.addFilter(
    analytics.filters.FilterBuilder.builder()
    .whenHitType(analytics.HitTypes.EXCEPTION)
    .applyFilter(arc.app.analytics._debugHit)
    .build());
  tracker.addFilter(
    analytics.filters.FilterBuilder.builder()
    .whenHitType(analytics.HitTypes.SOCIAL)
    .applyFilter(arc.app.analytics._debugHit)
    .build());
  tracker.addFilter(
    analytics.filters.FilterBuilder.builder()
    .whenHitType(analytics.HitTypes.TIMING)
    .applyFilter(arc.app.analytics._debugHit)
    .build());
};
/**
 * Print event debug info in console.
 */
arc.app.analytics._debugEvent = function(hit) {
  var params = hit.getParameters();
  var cat = params.get(analytics.Parameters.EVENT_CATEGORY);
  var act = params.get(analytics.Parameters.EVENT_ACTION);
  var lab = params.get(analytics.Parameters.EVENT_LABEL);
  console.groupCollapsed(
    '[Google Analytics] Running command: ga("send", "%s", "%s", "%s", "%s")',
    hit.getHitType(), cat, act, lab);
  arc.app.analytics._printHitData(params);
  console.groupEnd();
};
/**
 * Print event debug info in console.
 */
arc.app.analytics._debugAppView = function(hit) {
  var params = hit.getParameters();
  var sn = params.get(analytics.Parameters.DESCRIPTION);
  console.groupCollapsed(
    '[Google Analytics] Running command: ga("send", "%s", "%s")',
    hit.getHitType(), sn);
  arc.app.analytics._printHitData(params);
  console.groupEnd();
};
arc.app.analytics._debugHit = function(hit) {
  var params = hit.getParameters();
  console.groupCollapsed(
    '[Google Analytics] Running command: ga("send", "%s")',
    hit.getHitType(), cat, act, lab);
  arc.app.analytics._printHitData(params);
  console.groupEnd();
};
/**
 * Print a hit params in the table.
 */
arc.app.analytics._printHitData = function(params) {
  var map = params.toObject();
  var list = Object.assign({}, analytics.Parameters, arc.app.analytics.internal.Parameters);
  var properties = Object.getOwnPropertyNames(list);
  var lookup = (propId) => {
    if (propId.indexOf('dimension') === 0) {
      return 'cd' + propId.substr(9);
    }
    for (let i = 0; i < properties.length; i++) {
      let propKey = properties[i];
      if (list[propKey].id === propId) {
        return list[propKey].name;
      }
    }
    return 'unknown';
  };
  Object.getOwnPropertyNames(map).forEach((name) => {
    let param = lookup(name);
    let value = map[name];
    map[name] = {
      'param': param,
      'value': value,
      'name': name
    };
  });
  console.table(map, ['name', 'param', 'value']);
};
arc.app.analytics.internal = {};
arc.app.analytics.internal.Parameters = {
  /* Anonymize IP Addresses */
  ANONYMIZE_IP: {
    id: 'anonymizeIp',
    name: 'aip'
  },
  /* Protocol Version */
  API_VERSION: {
    id: 'apiVersion',
    name: 'v'
  },
  /* Application Name */
  APP_NAME: {
    id: 'appName',
    name: 'an'
  },
  /* Application Version */
  APP_VERSION: {
    id: 'appVersion',
    name: 'av'
  },
  /* Client ID */
  CLIENT_ID: {
    id: 'clientId',
    name: 'cid'
  },
  /* User Language */
  LANGUAGE: {
    id: 'language',
    name: 'ul'
  },
  /* Library version. For internal use only. */
  LIBRARY_VERSION: {
    id: 'libVersion',
    name: '_v'
  },
  /* User sample rate override */
  SAMPLE_RATE_OVERRIDE: {
    id: 'sampleRateOverride',
    name: 'usro'
  },
  /* Screen Colors */
  SCREEN_COLORS: {
    id: 'screenColors',
    name: 'sd'
  },
  /* Screen Resolution */
  SCREEN_RESOLUTION: {
    id: 'screenResolution',
    name: 'sr'
  },
  /* Tracking ID / Web Property ID */
  TRACKING_ID: {
    id: 'trackingId',
    name: 'tid'
  },
  /* Viewport size */
  VIEWPORT_SIZE: {
    id: 'viewportSize',
    name: 'vp'
  }
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
  if (arc.app.analytics._trackers.length === 0) {
    return {
      'type': 'event',
      'params': arguments
    };
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendEvent(category, action, label, value);
  });
};
/**
 * Send a screen name as a screen view.
 *
 * @param {String} screenName A screen name to be send.
 */
arc.app.analytics.sendScreen = function(screenName) {
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendAppView(screenName);
  });
};
/**
 * Send an exception information to the GA server.
 *
 * @param {String} exception An exception message.
 * @param {Boolean} isFatal True if the exception is fatal.
 */
arc.app.analytics.sendException = function(exception, isFatal) {
  if (arc.app.analytics._trackers.length === 0) {
    return {
      'type': 'exception',
      'params': [exception, isFatal + '']
    };
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendException(exception, isFatal);
  });
};
