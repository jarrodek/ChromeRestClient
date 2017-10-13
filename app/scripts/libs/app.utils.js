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
 * A namespace for the utilis functions
 *
 * @namespace
 */
arc.app.utils = {};
arc.app.utils._chromeVersion = null;
/**
 * Get Chrome full version.
 *
 * @type {String} A full version or `(not set)` is can't find.
 */
Object.defineProperty(arc.app.utils, 'chromeVersion', {
  enumerable: true,

  get: function() {
    if (arc.app.utils._chromeVersion) {
      return arc.app.utils._chromeVersion;
    }
    var raw = navigator.userAgent.match(/Chrom[e|ium]\/([0-9\.]+)/);
    arc.app.utils._chromeVersion = raw ? raw[1] : '(not set)';
    return arc.app.utils._chromeVersion;
  },

  set: function() {
    throw new Error('appVer can\'t be overrited.');
  }
});
arc.app.utils._appVer = null;
/**
 * Get ARC version from the manifest file.
 *
 * @type {String} An ARC version.
 */
Object.defineProperty(arc.app.utils, 'appVer', {
  enumerable: true,

  get: function() {
    if (arc.app.utils._appVer) {
      return arc.app.utils._appVer;
    }
    if (!chrome || !chrome.runtime || !chrome.runtime.getManifest) {
      //testing
      arc.app.utils._appVer = 'app-test';
    } else {
      arc.app.utils._appVer = chrome.runtime.getManifest().version;
    }
    return arc.app.utils._appVer;
  },

  set: function() {
    throw new Error('appVer can\'t be overrited.');
  }
});
arc.app.utils._releaseChannel = null;
/**
 * Get release channel name.
 *
 * @type {String} Stable, beta, dev or canary.
 */
Object.defineProperty(arc.app.utils, 'releaseChannel', {
  enumerable: true,
  get: function() {
    if (arc.app.utils._releaseChannel) {
      return arc.app.utils._releaseChannel;
    }
    var manifest = chrome.runtime.getManifest();
    // jscs:disable
    var manifestName = manifest.version_name;
    // jscs:enable
    var release = null;
    if (manifestName.indexOf('beta') !== -1) {
      release = 'beta';
    } else if (manifestName.indexOf('dev') !== -1) {
      release = 'dev';
    } else if (manifestName.indexOf('canary') !== -1) {
      release = 'canary';
    } else {
      release = 'stable';
    }
    arc.app.utils._releaseChannel = release;
    return release;
  },
  set: function() {
    throw new Error('releaseChannel can\'t be set.');
  }
});
}());
