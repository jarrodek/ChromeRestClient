'use strict';
/**
 * Advanced Rest Client namespace.
 *
 * @namespace
 */
const arc = {};
/**
 * ARC background page namespace.
 *
 * @namespace
 */
arc.bg = arc.bg || {};
/**
 * Open new window of the app.
 * Every call will open new window even if another window is already created.
 */
arc.bg.openWindow = (url) => {
  if (!url) {
    url = 'index.html';
  }
  const all = chrome.app.window.getAll();
  const length = all.length;
  const id = 'arc-window-' + length;
  chrome.app.window.create(
    url, {
      id: id,
      bounds: {
        width: 1200,
        height: 800
      }
    },
    function() {
      arc.bg.recordSession();
    }
  );
};
/**
 * Handler for `onLaunched` event.
 * Depending on launch data it will open window in default view or requested view.
 */
arc.bg.onLaunched = (lunchData) => {
  let url = 'index.html';
  if (lunchData && lunchData.id) {
    switch (lunchData.id) {
      case 'google_drive_open':
        let _url = lunchData.url;
        _url = _url.substr(_url.indexOf('state') + 6);
        let data = JSON.parse(decodeURIComponent(_url));
        let id = data.ids[0];
        url += '#!/request/drive/' + id;
        break;
    }
  }
  arc.bg.openWindow(url);
};
arc.bg.uuid = function() {
  // jscs:disable
  /* jshint ignore:start */
  const lut = [];
  for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  const fn = function() {
    const d0 = Math.random() * 0xffffffff | 0;
    const d1 = Math.random() * 0xffffffff | 0;
    const d2 = Math.random() * 0xffffffff | 0;
    const d3 = Math.random() * 0xffffffff | 0;
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
arc.bg.getAppId = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({
      'APP_ID': null
    }, function(result) {
      if (!result.APP_ID) {
        result.APP_ID = arc.bg.uuid();
        chrome.storage.local.set(result, function() {
          resolve(result.APP_ID);
        });
      } else {
        resolve(result.APP_ID);
      }
    });
  });
};
arc.bg.getAppAnonumousId = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get({
      'appAnonymousId': null
    }, function(result) {
      resolve(result.appAnonymousId);
    });
  });
};
arc.bg.releaseChannel = () => {
  const manifest = chrome.runtime.getManifest();
  // jscs:disable
  const manifestName = manifest.version_name;
  // jscs:enable
  let release;
  if (manifestName.indexOf('beta') !== -1) {
    release = 'beta';
  } else if (manifestName.indexOf('dev') !== -1) {
    release = 'dev';
  } else if (manifestName.indexOf('canary') !== -1) {
    release = 'canary';
  } else {
    release = 'stable';
  }
  return release;
};
/**
 * To ensure anynomous app usage the app is using browser's build in crypto functions.
 * It requires to generate some initial random data to encode a string.
 *
 * Generated values are not stored so they can't be used again. Clearing hashed app id
 * (anonumousId) can't be restored.
 */
arc.bg.getAninimizedId = () => {
  return arc.bg.getAppAnonumousId().then((anonymousId) => {
    if (anonymousId) {
      return anonymousId;
    }
    // The app id is kept locally and it's available to the app.
    // It was used to identify user data on server storage.
    // It's not used right now since there's no app's server data synchroznization
    // but it's a subject to change.
    let encodedDataBuffer;
    return arc.bg.getAppId()
    .then((appId) => {
      let encoder = new TextEncoder('utf-8');
      encodedDataBuffer = encoder.encode(appId);
      let aesAlgorithmKeyGen = {
        name: 'AES-CBC',
        length: 128
      };
      return window.crypto.subtle.generateKey(aesAlgorithmKeyGen, false, ['encrypt']);
    })
    .then((cryptoKey) => {
      let aesAlgorithmEncrypt = {
        name: 'AES-CBC',
        iv: window.crypto.getRandomValues(new Uint8Array(16))
      };
      return window.crypto.subtle.encrypt(aesAlgorithmEncrypt, cryptoKey, encodedDataBuffer);
    })
    .then((arrayBuffer) => {
      let view = new Uint8Array(arrayBuffer);
      let arr = Array.prototype.slice.call(view);
      arr = arr.map(function(item) {
        return String.fromCharCode(item);
      });
      return window.btoa(arr.join(''));
    })
    .then((base64) => {
      return new Promise((resolve) => {
        chrome.storage.local.set({
          appAnonymousId: base64
        }, function() {
          resolve(base64);
        });
      });
    });
  });
};
/**
 * Very base replacement for GA session counter.
 * According to T&C of GA users must have ability to disable GA in the app.
 * However usage (only usage which is # of app openings) stats are crutial for the app.
 * This function will send generated an nonymous ID to the app's backed to record the session.
 * This is the only information send to the backed (time and generated ID)
 */
arc.bg.recordSession = () => {
  arc.bg.getAninimizedId().then((aid) => {
    let d = new Date();
    // let url = 'http://localhost:8080/analytics/record';
    let url = 'https://advancedrestclient-1155.appspot.com/analytics/record';
    let data = new FormData();
    data.append('aid', aid); // anonymousId
    data.append('tz', d.getTimezoneOffset()); // timezone
    fetch(url, {
      method: 'POST',
      body: data
    }).catch(() => {});
  });
};
/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(arc.bg.onLaunched);
