'use strict';

/**
 * Listens for the app launching then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(lunchData) {
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
  var all = chrome.app.window.getAll();
  var length = all.length;
  var id = 'arc-window-' + length;
  chrome.app.window.create(
    url, {
      id: id,
      bounds: {
        width: 800,
        height: 600
      }
    }
  );
});

/**
 * Called when user use one of the commands registered in the manifest file.
 */
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});
