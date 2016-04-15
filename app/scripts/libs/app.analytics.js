(function () {
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
/**
 * Print debug messages to the console.
 * @type {Boolean}
 */
arc.app.analytics.debug = false;
/**
 * A list of created trackers.
 */
arc.app.analytics._trackers = [];
/**
 * Handler to the service object.
 * @type {Object}
 */
arc.app.analytics._service = null;
/**
 * State of the library. True when GA tracking is permitted.
 * @type {Boolean}
 */
arc.app.analytics.enabled = true;
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
  if (arc.app.analytics.debug) {
    console.group('Initiaize Google Analytics');
  }
  arc.app.analytics._initTranckers();
  arc.app.analytics._setupAnalyticsListener();
  arc.app.analytics._setCustomDimmensions();
  arc.app.analytics._setAppUid();
  arc.app.analytics._setChromeChannel();
  if (arc.app.analytics.debug) {
    console.groupEnd();
  }
};
/**
 * Initialize trackers.
 */
arc.app.analytics._initTranckers = function() {
  var service = analytics.getService('ARC');
  arc.app.analytics._service = service;
  if (arc.app.analytics.debug) {
    console.log('Service has been initialized.');
  }
  service.getConfig().addCallback(arc.app.analytics.initAnalyticsConfig);
  arc.app.analytics._trackersConfig.forEach(function(item) {
    let tracker = service.getTracker(item.trackingId);
    if (arc.app.analytics.debug) {
      console.log('Setup tracker for ' + item.trackingId);
    }
    arc.app.analytics._trackers.push(tracker);
  });
};
arc.app.analytics.initAnalyticsConfig = function(config) {
  var permitted = config.isTrackingPermitted();
  arc.app.analytics.enabled = permitted;
  if (arc.app.analytics.debug) {
    console.info('[Google Analytics] Tracking is ' + (permitted ? '' : 'not ') + 'permitted');
  }
},
/**
 * Enable or disable Google Analytics tracking.
 *
 * @param {Boolean} permitted True if the analytics is permitted to send data to the GA.
 * @return {Promise} Fulfilled promise when state has been set.
 */
arc.app.analytics.setAnalyticsPermitted = function(permitted) {
  if (!arc.app.analytics._service) {
    return Promise.reject(new Error('Google Analytics not ready.'));
  }
  if (arc.app.analytics.debug) {
    var msg = '[Google Analytics] Tracking state is' + (permitted ? 'enabled' : 'disabled');
    console.info(msg);
  }
  arc.app.analytics.enabled = permitted;
  return new Promise((result) => {
    arc.app.analytics._service.getConfig().addCallback((config) => {
      config.setTrackingPermitted(permitted, () => {
        result();
      });
    });
  });
};

/**
 * Initialize and set up custom dimmenstion that are used by the app.
 */
arc.app.analytics._setCustomDimmensions = function() {
  var appVersion = arc.app.utils.appVer;
  var chromeVer = arc.app.utils.chromeVersion;
  var manifest = chrome.runtime.getManifest();
  // jscs:disable
  var manifestName = manifest.version_name;
  // jscs:enable
  var channel = null;
  if (manifestName.indexOf('canary') !== -1) {
    channel = 'canary';
  } else if (manifestName.indexOf('dev') !== -1) {
    channel = 'dev';
  } else if (manifestName.indexOf('beta') !== -1) {
    channel = 'beta';
  } else {
    channel = 'stable';
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.set('dimension1', chromeVer);
    tracker.set('dimension2', appVersion);
    tracker.set('dimension5', channel);
    //tracker.set('appVersion', appVersion);
  });
  if (arc.app.analytics.debug) {
    console.log('Setting up custom dimension #%d: %s', 1, chromeVer);
    console.log('Setting up custom dimension #%d: %s', 2, appVersion);
  }
};
/**
 * The app is creating a anonymous UUID and is keeping it into
 * sync storage. This value will be propagated across app instances of the same user.
 * This information will be used in compliance with Google Analytics terms & conditions
 * which disallows any user information to be send to the GA server.
 * It's only for statistical reports.
 */
arc.app.analytics._setAppUid = function() {
  var setUid = function(uuid) {
    arc.app.analytics._trackers.forEach(function(tracker) {
      tracker.set('userId', uuid);
    });
    if (arc.app.analytics.debug) {
      console.log('[Google Analytics] Setting up user ID: %s', uuid);
    }
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
  if (arc.app.analytics.debug) {
    console.log('Setting up chrome channel');
  }
  arc.app.analytics._getChannelName()
  .then((channel) => {
    if (!channel) {
      if (arc.app.analytics.debug) {
        console.info('[Google Analytics] Chrome Channel can\'t be determined.');
      }
      return;
    }
    for (let j = 0, len = arc.app.analytics._trackers.length; j < len; j++) {
      arc.app.analytics._trackers[j].set('dimension3', channel);
    }
    if (arc.app.analytics.debug) {
      console.info('[Google Analytics] Setting up custom dimension #%d: %s', 3, channel);
    }
  })
  .catch(function(cause) {
    if (arc.app.analytics.debug) {
      console.info('Unable to download Chrome channels list', cause);
    }
  });
};

arc.app.analytics._getChannelName = function() {
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
  if (!arc.app.analytics.debug) {
    return;
  }
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
  if (!arc.app.analytics.debug) {
    return;
  }
  var params = hit.getParameters();
  var sn = params.get(analytics.Parameters.DESCRIPTION);
  console.groupCollapsed(
    '[Google Analytics] Running command: ga("send", "%s", "%s")',
    hit.getHitType(), sn);
  arc.app.analytics._printHitData(params);
  console.groupEnd();
};
arc.app.analytics._debugHit = function(hit) {
  if (!arc.app.analytics.debug) {
    return;
  }
  var params = hit.getParameters();
  console.groupCollapsed(
    '[Google Analytics] Running command: ga("send", "%s")',
    hit.getHitType());
  arc.app.analytics._printHitData(params);
  console.groupEnd();
};
/**
 * Print a hit params in the table.
 */
arc.app.analytics._printHitData = function(params) {
  if (!arc.app.analytics.debug) {
    return;
  }
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
  if (!arc.app.analytics.enabled) {
    return;
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
  if (!arc.app.analytics.enabled) {
    return;
  }
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
  if (!arc.app.analytics.enabled) {
    return;
  }
  arc.app.analytics._trackers.forEach(function(tracker) {
    tracker.sendException(exception, isFatal);
  });
};
}());
