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
/**
 * Generate a RFC4122, version 4 ID. Example:
 * "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * http://stackoverflow.com/a/21963136/1127848
 * @return {String} The UUID string.
 */
arc.app.utils.uuid = function() {
  // jscs:disable
  /* jshint ignore:start */
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  var fn = function() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] +
      lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' +
      lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] +
      lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  };
  return fn();
  // jscs:enable
  /* jshint ignore:end */
};
/**
 * This function will search for links in the `input` and replace it with anchor.
 *
 * @param {String} input A search string
 * @return {String} Parsed string.
 */
arc.app.utils.autoLink = function(input) {
  var r = new RegExp('(https?:\\/\\/([^" >]*))', 'gim');
  return input.replace(r, '<a target="_blank" class="auto-link" href="$1">$1</a>');
};
/**
 * Escape characters to display HTML code.
 *
 * @return {String} Encoded string.
 */
arc.app.utils.encodeHtml = function(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
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
      arc.app.utils._appVer = '5.0.5-test';
    } else {
      arc.app.utils._appVer = chrome.runtime.getManifest().version;
    }
    return arc.app.utils._appVer;
  },

  set: function() {
    throw new Error('appVer can\'t be overrited.');
  }
});
arc.app.utils._osInfo = null;
/**
 * Get OS name
 *
 * @type {Object.<string, string>} OS info object with `osName` and `osVersion` keys.
 */
Object.defineProperty(arc.app.utils, 'osInfo', {
  enumerable: true,
  get: function() {
    if (arc.app.utils._osInfo) {
      return arc.app.utils._osInfo;
    }
    var os = 'unknown';
    var nAgt = navigator.userAgent;
    var clientStrings = [{
      s: 'Windows 10',
      r: /(Windows 10.0|Windows NT 10.0)/
    }, {
      s: 'Windows 8.1',
      r: /(Windows 8.1|Windows NT 6.3)/
    }, {
      s: 'Windows 8',
      r: /(Windows 8|Windows NT 6.2)/
    }, {
      s: 'Windows 7',
      r: /(Windows 7|Windows NT 6.1)/
    }, {
      s: 'Windows Vista',
      r: /Windows NT 6.0/
    }, {
      s: 'Windows Server 2003',
      r: /Windows NT 5.2/
    }, {
      s: 'Windows XP',
      r: /(Windows NT 5.1|Windows XP)/
    }, {
      s: 'Windows 2000',
      r: /(Windows NT 5.0|Windows 2000)/
    }, {
      s: 'Windows ME',
      r: /(Win 9x 4.90|Windows ME)/
    }, {
      s: 'Windows 98',
      r: /(Windows 98|Win98)/
    }, {
      s: 'Windows 95',
      r: /(Windows 95|Win95|Windows_95)/
    }, {
      s: 'Windows NT 4.0',
      r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
    }, {
      s: 'Windows CE',
      r: /Windows CE/
    }, {
      s: 'Windows 3.11',
      r: /Win16/
    }, {
      s: 'Android',
      r: /Android/
    }, {
      s: 'Open BSD',
      r: /OpenBSD/
    }, {
      s: 'Sun OS',
      r: /SunOS/
    }, {
      s: 'Linux',
      r: /(Linux|X11)/
    }, {
      s: 'iOS',
      r: /(iPhone|iPad|iPod)/
    }, {
      s: 'Mac OS X',
      r: /Mac OS X/
    }, {
      s: 'Mac OS',
      r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
    }, {
      s: 'QNX',
      r: /QNX/
    }, {
      s: 'UNIX',
      r: /UNIX/
    }, {
      s: 'BeOS',
      r: /BeOS/
    }, {
      s: 'OS/2',
      r: /OS\/2/
    }, {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
    }];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    var osVersion = '-';

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = 'Windows';
    }

    switch (os) {
      case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        break;

      case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        break;
    }
    arc.app.utils._osInfo = {
      osName: os,
      osVersion: osVersion
    };
    return arc.app.utils._osInfo;
  },
  set: function() {
    throw new Error('osInfo can\'t be overrited.');
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
/**
 * Convert ArrayBuffer to readable form
 * @param {ArrayBuffer} buff
 * @returns {String} Converted string
 */
arc.app.utils.arrayBufferToString = function(buff) {
  if (this.aborted) {
    return '';
  }
  var array = new Uint8Array(buff);
  var str = '';
  for (var i = 0; i < array.length; ++i) {
    str += String.fromCharCode(array[i]);
  }
  return str;
};
/**
 * A function that calculates size of string in bytes.
 * See http://stackoverflow.com/a/23329386/1127848
 */
arc.app.utils.calculateBytes = function(str) {
  if (!str || !str.length || typeof str !== 'string') {
    return 0;
  }
  var s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    var code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      s++;
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2;
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--; //trail surrogate
    }
  }
  return s;
};
}());
