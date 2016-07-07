'use strict';
/**
 * Global object for error reporting.
 * The analytics.js file will get the data from here and report errors to the GA.
 */
var pendingAnalytics = [];
/**
 * Advanced Rest Client namespace.
 *
 * @namespace
 */
var arc = arc || {};
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
  var all = chrome.app.window.getAll();
  var length = all.length;
  var id = 'arc-window-' + length;
  chrome.app.window.create(
    url, {
      id: id,
      bounds: {
        width: 1200,
        height: 800
      }
    }, function() {
      arc.bg.recordSession();
    }
  );
};
/**
 * Handler for `onLaunched` event.
 * Depending on launch data it will open window in default view or requested view.
 */
arc.bg.onLaunched = (lunchData) => {
  var url = 'index.html';
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
/**
 * Handler called when the app is installed or updated.
 */
arc.bg.onInstalled = (details) => {
  switch (details.reason) {
    case 'install':
      arc.bg.installDatabase();
      break;
    case 'update':
      arc.bg.notifyBetaUpdate();
      arc.bg.installDatabase();
      break;
  }
};

arc.bg.installDatabase = () => {
  var db = arc.app.db.idb._getDb({checkInstall: true});
  db.open().then(function() {
    db.close();
  });
};
/**
 * If the beta channel, notify user about new version.
 */
arc.bg.notifyBetaUpdate = () => {
  if (!arc.app.utils.releaseChannel || arc.app.utils.releaseChannel === 'stable') {
    return;
  }
  arc.bg.notifications.canNotify()
  .then((granted) => {
    if (granted) {
      arc.bg.notifications.displayUpdate(arc.app.utils.releaseChannel);
    }
  });
};
/**
 * Very base replacement for GA session counter.
 * According to T&C of GA users must have ability to disable GA in the app.
 * However usage stats are crutial for the app.
 * This function will send generated an nonymous ID to the app's backed to record the session.
 * This is the only information send to the backed (time and generated ID)
 */
arc.bg.recordSession = () => {
  arc.app.arc.getAppId((appId) => {
    let url = 'https://chromerestclient.appspot.com/_ah/api/analytics/v1/record/?ai=';
    url += appId + '&t=';
    url += Date.now();
    fetch(url, {
      method: 'POST'
    }).then((response) => {
      if (!response.ok) {
        pendingAnalytics.push({
          'type': 'exception',
          'params': ['Unable send session recording to the backend: ' + response.code, false]
        });
      }
    });
  });
};

// arc.bg.openPreview = (rawResponse) => {
//   chrome.app.window.create('html-preview.html', {
//     'id': 'html-preview',
//     'bounds': {
//       'width': 400,
//       'height': 400
//     }
//   }, (win) => {
//
//     console.log('sending a message to the content window', win.contentWindow);
//
//     win.contentWindow.postMessage({
//       'rawResponse': rawResponse
//     });
//   });
// };

/**
 * Notifications support.
 *
 * @namespace
 */
arc.bg.notifications = {};
/**
 * Checks if the app have permissions to show notifications.
 *
 * @return {!Promise} Fulfilled promise when state is determined.
 */
arc.bg.notifications.canNotify = () => {
  return new Promise((resolve) => {
    chrome.permissions.contains({permissions: ['notifications']}, (granted) => {
      resolve(granted);
    });
  });
};
/**
 * Listen for notifications events.
 */
arc.bg.notifications.listen = () => {
  arc.bg.notifications.canNotify()
  .then((granted) => {
    if (granted) {
      chrome.notifications.onClicked.addListener(arc.bg.notifications.onClicked);
      chrome.notifications.onButtonClicked.addListener(arc.bg.notifications.onButtonClicked);
    }
  });
};
arc.bg.notifications.onClicked = (notificationId) => {
  switch (notificationId) {
    case 'beta-update':
    case 'dev-update':
    case 'canary-update':
      arc.bg.openWindow();
      break;
  }
  chrome.notifications.clear(notificationId);
};
arc.bg.notifications.onButtonClicked = (notificationId, buttonIndex) => {
  switch (notificationId) {
    case 'beta-update':
    case 'dev-update':
    case 'canary-update':
      if (buttonIndex === 0) {
        arc.bg.openWindow();
      }
      break;
  }
  chrome.notifications.clear(notificationId);
};
arc.bg.notifications.displayUpdate = (channel) => {
  var msg = `Test ${channel} channel now and give feedback before stable release.`;
  var opts = {
    type: 'basic',
    iconUrl: 'assets/arc_icon_128.png',
    title: 'Advanced REST Client updated',
    message: msg,
    buttons: [
      {
        title: 'Open app'
      },
      {
        title: 'Close'
      }
    ],
    isClickable: true
  };
  chrome.notifications.create(`${channel}-update`, opts);
};
/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(arc.bg.onLaunched);
chrome.runtime.onInstalled.addListener(arc.bg.onInstalled);
arc.bg.notifications.listen();
/**
 * Called when user use one of the commands registered in the manifest file.
 */
// chrome.commands.onCommand.addListener(function(command) {
//   console.log('Command:', command);
// });
