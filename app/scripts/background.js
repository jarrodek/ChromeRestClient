'use strict';

class ArcBackground {
  constructor() {
    this.windows = {};
    this.indexes = [];
  }

  getWindowId() {
    let min = 0;
    for (let i = 0; i < this.indexes.length; i++) {
      const index = this.indexes[i];
      if (index > min) {
        return min;
      }
      min++;
    }
    return min;
  }

  onLaunched(launchData) {
    const url = 'index.html';
    this.createWindow(url)
    .then((result) => {
      result.appWindow.launchData = launchData;
      this._addWindow(result);
      this._recordSession();
    });
  }

  onClosed() {
    console.log('WONDOW CLOSED', arguments);
  }

  onMessage(message, sender, callback) {
    const u = new URL(sender.url);
    let index = u.searchParams.get('window-index');
    if (!index) {
      return;
    }
    index = Number(index);
    const appWindow = this.windows[index];
    if (!appWindow) {
      return;
    }
    switch (message.payload) {
      case 'window-initial-state-read':
        callback(this.processLaunchData(appWindow.launchData, index));
        break;
    }
  }

  createWindow(url) {
    const index = this.getWindowId();
    const id = 'arc-window-' + index;
    const delim = url.indexOf('?') === -1 ? '?' : '&';
    url += delim + 'window-index=' + index;
    const opts = {
      id,
      bounds: {
        width: 1200,
        height: 800
      }
    };
    return new Promise((resolve) => {
      chrome.app.window.create(url, opts, (win) => {
        resolve({
          index,
          id,
          appWindow: win
        });
      });
    });
  }

  _addWindow(info) {
    this.windows[info.index] = info.appWindow;
    this.indexes.splice(info.index, 0, info.index);
  }
  /**
   * Very basic analytics. It records anonymized ID of the app when new window
   * is opened. The ID cannot be traced back to the app, owner, or any data.
   * This really helps keep the project running.
   * Also, this is separated from Google Analytics. GA tracks application usage
   * so it's easier to make design decissions.
   */
  _recordSession() {
    const endpoint = 'https://app.advancedrestclient.com/analytics/record';
    this.getAninimizedId()
    .then((aid) => {
      const d = new Date();
      let data = new FormData();
      data.append('aid', aid); // anonymousId
      data.append('tz', d.getTimezoneOffset()); // timezone
      fetch(endpoint, {
        method: 'POST',
        body: data
      }).catch(() => {});
    });
  }

  getAppAnonumousId() {
    return new Promise((resolve) => {
      chrome.storage.local.get({
        'appAnonymousId': null
      }, function(result) {
        resolve(result.appAnonymousId);
      });
    });
  }

  getAninimizedId() {
    return this.getAppAnonumousId()
    .then((anonymousId) => {
      if (anonymousId) {
        return anonymousId;
      }
      return this.createAnonymousId();
    });
  }

  createAnonymousId() {
    // The app id is kept locally and it's available to the app.
    // It was used to identify user data on server storage.
    // It's not used right now since there's no app's server data synchroznization
    // but it's a subject to change.
    let encodedDataBuffer;
    return this.getAppId()
    .then((appId) => {
      const encoder = new TextEncoder('utf-8');
      encodedDataBuffer = encoder.encode(appId);
      let aesAlgorithmKeyGen = {
        name: 'AES-CBC',
        length: 128
      };
      return window.crypto.subtle.generateKey(aesAlgorithmKeyGen, false, ['encrypt']);
    })
    .then((cryptoKey) => {
      const aesAlgorithmEncrypt = {
        name: 'AES-CBC',
        iv: window.crypto.getRandomValues(new Uint8Array(16))
      };
      return window.crypto.subtle.encrypt(aesAlgorithmEncrypt, cryptoKey, encodedDataBuffer);
    })
    .then((arrayBuffer) => {
      const view = new Uint8Array(arrayBuffer);
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
  }

  getAppId() {
    return new Promise((resolve) => {
      chrome.storage.local.get({
        'APP_ID': null
      }, (result) => {
        if (!result.APP_ID) {
          result.APP_ID = this.uuid();
          chrome.storage.local.set(result, function() {
            resolve(result.APP_ID);
          });
        } else {
          resolve(result.APP_ID);
        }
      });
    });
  }

  uuid() {
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
  }

  processLaunchData(data, index) {
    const result = {
      index
    };
    if (!data || !data.id) {
      return result;
    }
    switch (data.id) {
      case 'google_drive_open':
        let url = data.url;
        url = url.substr(url.indexOf('state') + 6);
        const parsed = JSON.parse(decodeURIComponent(url));
        const id = parsed.ids[0];
        result.action = 'google-drive-open';
        result.id = id;
        break;
    }
    return result;
  }
}

const instance = new ArcBackground();
/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(instance.onLaunched.bind(instance));
chrome.app.window.onClosed.addListener(instance.onClosed.bind(instance));
chrome.runtime.onMessage.addListener(instance.onMessage.bind(instance));

// arc.bg.releaseChannel = () => {
//   const manifest = chrome.runtime.getManifest();
//   // jscs:disable
//   const manifestName = manifest.version_name;
//   // jscs:enable
//   let release;
//   if (manifestName.indexOf('beta') !== -1) {
//     release = 'beta';
//   } else if (manifestName.indexOf('dev') !== -1) {
//     release = 'dev';
//   } else if (manifestName.indexOf('canary') !== -1) {
//     release = 'canary';
//   } else {
//     release = 'stable';
//   }
//   return release;
// };
