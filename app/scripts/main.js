(function(document, window) {
  'use strict';

  let app = document.querySelector('#app');
  app.pageTitle = 'Request';
  /**
   * Selected request database ID
   */
  app.selectedRequest = null;
  app.gaCustomDimensions = [];
  app.appId = chrome.runtime && chrome.runtime.id ? chrome.runtime.id : 'not-in-chrome-app';
  app.analyticsDisabled = false;
  app.initialized = false;
  // True if the user is signed in to Chrome browser and can authorize the app.
  app.chromeSignedIn = false;

  app.observers = [
    '_routeChanged(route, params.*)'
  ];

  app._routeChanged = function(route, paramsRecord) {
    var params = paramsRecord && paramsRecord.base;
    switch (route) {
      case 'request':
        app.pageTitle = 'Request';
        if (!params || !params.type) {
          return;
        }
        var id;
        switch (params.type) {
          case 'history': id = params.historyId; break;
          case 'saved': id = params.savedId; break;
          case 'restore':
          case 'latest':
          case 'current':
            app.selectedRequest = undefined;
            return;
          case 'drive':
            app.selectedRequest = undefined;
            return app.openDriveItem(params.driveId);
          default:
            app.selectedRequest = undefined;
            console.error('ID not handled!', params);
            throw new Error('ID not handled!');
        }
        app.selectedRequest = decodeURIComponent(id);
        return;
      case 'project':
        if (!params) {
          return;
        }
        app.fire('selected-project-changed', {
          value: params.projectId
        });
        app.pageTitle = 'Project details';
        break;
      case 'socket':
        app.pageTitle = 'Socket';
        app.selectedRequest = undefined;
        break;
      case 'settings':
        app.pageTitle = 'Settings';
        app.selectedRequest = undefined;
        break;
      case 'history':
        app.pageTitle = 'History';
        app.selectedRequest = undefined;
        break;
      case 'saved':
        app.pageTitle = 'Saved request';
        app.selectedRequest = undefined;
        break;
      default:
        app.selectedRequest = undefined;
    }
  };
  // Event fired when all components has been initialized.
  app.addEventListener('dom-change', function() {
    app.updateBranding();
  });
  // Called when current request changed.
  window.addEventListener('selected-request', (e) => {
    app.selectedRequest = e.detail.id ? e.detail.id : null;
  });
  // event fired when the app is initialized and can remove loader.
  window.addEventListener('ArcInitialized', function() {
    document.querySelector('arc-loader-screen').opened = false;
    app.initialized = true;
  });
  window.addEventListener('WebComponentsReady', function() {
    app.initAnalytics();
    app.initRouting();
  });
  app.initRouting = () => {
    if (app.routingInitialized) {
      console.warn('Routing is already initialized.');
      return;
    }
    app.routingInitialized = true;
    let event = new Event('initializeRouting');
    window.dispatchEvent(event);
  };
  //When changin route this will scroll page top. This is called from router.
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };
  //called by the router to close a drawer (in mobile view) when changing route.
  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };
  // called when any component want to change request link.
  document.body.addEventListener('action-link-change', (e) => {
    var url = e.detail.url;
    var setUrl = function(url) {
      let panel = document.querySelector('request-panel');
      panel.set('request.url', url);
    };
    var getUrl = function() {
      return document.querySelector('request-panel').request.url;
    };
    var currentUrl = getUrl();
    if (currentUrl && url.indexOf('/') === 0) {
      var parser;
      try {
        parser = new URL(currentUrl);
        url = parser.origin + url;
        setUrl(url);
      } catch (e) {
        console.log('URL parse error', e);
        this.fire('app-log', {
          message: e
        });
        setUrl(url);
      }
    } else {
      setUrl(url);
    }
    app.scrollPageToTop();
  });

  app.onSave = (e, detail) => {
    var ctrl = document.querySelector('arc-request-panel');
    ctrl.onSave({
      source: 'shortcut',
      shift: detail.keyboardEvent.shiftKey
    });
    var label = 'Save';
    if (detail.keyboardEvent.shiftKey) {
      label += ' (shift)';
    }
    app.fire('send-analytics', {
      type: 'event',
      category: 'Shortcats usage',
      action: 'Called',
      label: label
    });
  };
  app.onSaveShift = (e, detail) => app.onSave(e, detail);

  app.onOpen = () => {
    page('/saved');
    app.fire('send-analytics', {
      type: 'event',
      category: 'Shortcats usage',
      action: 'Called',
      label: 'Open'
    });
  };
  // Current "height" of the top header.
  app.mainHeaderTop = '64px';
  // Called when ctrl/command + F combination has been pressed.
  app.onSearch = () => {
    if (app.route !== 'request') {
      return;
    }
    var searchBar = document.getElementById('content-search-bar');
    if (searchBar.opened) {
      searchBar.focusInput();
    } else {
      searchBar.style.top = app.mainHeaderTop;
      searchBar.opened = true;
      app.fire('send-analytics', {
        type: 'event',
        category: 'Shortcats usage',
        action: 'Called',
        label: 'Search'
      });
    }
  };
  // Called when ctrl/command + n called to open new window.
  app.onNewWindow = () => {
    chrome.runtime.getBackgroundPage(function(bg) {
      bg.arc.bg.openWindow();
    });
  };

  app.onSend = () => {
    if (app.route !== 'request') {
      return;
    }
    var panel = document.querySelector('arc-request-panel');
    if (!panel) {
      console.warn('The request panel is undefined');
      return;
    }
    panel.sendRequest();
  };

  app.textSearchBarOpened = () => {
    var searchBar = document.getElementById('content-search-bar');
    if (!searchBar) {
      console.warn('Search bar was not available in document.');
      return;
    }
    searchBar.style.top = app.mainHeaderTop;
  };

  window.addEventListener('paper-header-transform', function(e) {
    var searchBar = document.getElementById('content-search-bar');
    if (!searchBar.opened) {
      return;
    }
    var detail = e.detail;
    var top = detail.height - detail.y;
    if (top < 0) {
      top = 0;
    }
    if (searchBar.style.top === top + 'px') {
      return;
    }
    app.mainHeaderTop = top + 'px';
    searchBar.style.top = top;
  });
  /**
   * Updates body class depending on a channel release.
   * TODO: update dev and beta branding.
   */
  app.updateBranding = () => {
    if (!chrome.runtime.getManifest) {
      //tests
      return;
    }
    var channel = arc.app.utils.releaseChannel;
    var cls = null;
    if (channel === 'canary') {
      cls = 'canary-channel';
    } else if (channel === 'dev') {
      cls = 'dev-channel';
    } else if (channel === 'beta') {
      cls = 'beta-channel';
    }
    if (cls) {
      document.body.classList.add(cls);
      Polymer.updateStyles();
    }
  };
  /**
   * Used by elements to open a browser window/tab.
   * Element must have data-href attribute set with value of the URL to open.
   *
   * @param {ClickEvent} e A click event.
   */
  app.followLink = (e) => {
    if (e.target.dataset.href) {
      window.open(e.target.dataset.href);
    }
  };
  /**
   * Handler called to network state change event.
   * This will display toase then the device is offline and close the message when it
   * comes back online.
   */
  app._networkStateChanged = (e) => {
    var online = e.detail.online;
    if (online) {
      app.$.offlineToast.opened = false;
    } else {
      app.$.offlineToast.opened = true;
    }
  };

  window.addEventListener('error', (e) => {
    if (!e.detail || !e.detail.message) {
      return;
    }
    var message = '[Window]' + e.detail.message;
    app.fire('send-analytics', {
      type: 'exception',
      description: message,
      fatal: false
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    let reason = event.reason;
    console.error('Unhandled promise rejection: ' + (reason && (reason.stack || reason)));
    app.fire('send-analytics', {
      type: 'exception',
      description: (reason && (reason.stack || reason)),
      fatal: false
    });
  });

  app._computeA11yButtons = (key, hasShift) => {
    var isMac = navigator.platform.indexOf('Mac') !== -1;
    var cmd = '';
    if (isMac) {
      cmd += 'meta+';
    } else {
      cmd += 'ctrl+';
    }
    if (hasShift) {
      cmd += 'shift+';
    }
    cmd += key;
    return cmd;
  };

  function openDriveSelector() {
    if (!app.chromeSignedIn) {
      return app.openChromeSigninInfo();
    }
    page('/drive');
  }
  window.addEventListener('open-drive-selector', openDriveSelector);
  window.addEventListener('pick-google-drive-item', openDriveSelector);

  app.initAnalytics = function() {
    app.push('gaCustomDimensions', {
      index: 1,
      value: arc.app.utils.chromeVersion
    });
    app.push('gaCustomDimensions', {
      index: 2,
      value: arc.app.utils.appVer
    });
    app.push('gaCustomDimensions', {
      index: 5,
      value: arc.app.utils.releaseChannel
    });
  };

  window.addEventListener('analytics-permitted-changed', (e) => {
    var permitted = e.detail.permitted;
    app.set('analyticsDisabled', !permitted);
  });

  window.addEventListener('app-new-window', function() {
    chrome.runtime.getBackgroundPage(function(bg) {
      bg.arc.bg.openWindow();
    });
  });

  window.addEventListener('app-version', function(e) {
    e.detail.version = arc.app.utils.appVer;
  });

  app.notifyError = function(message) {
    app.$.errorToast.text = message;
    app.$.errorToast.opened = true;
  };

  function isSingleRequest(data) {
    if (!data.requests || !data.requests.length) {
      return false;
    }
    if (data.requests.length !== 1) {
      return false;
    }
    if (data.projects && data.projects.length === 0) {
      delete data.projects;
    }
    if (Object.keys(data).length === 4) {
      return true;
    }
    return false;
  }

  function processIcomingData(data, opts) {
    opts = opts || {};
    var event = app.fire('import-normalize', {
      content: data
    }, {
      cancelable: true
    });
    event.detail.result.then((data) => {
      if (isSingleRequest(data)) {
        let obj = data.requests[0];
        if (opts.diveId) {
          obj.type = 'google-drive';
          obj.driveId = opts.diveId;
        }
        document.body.querySelector('arc-request-panel').request = obj;
        page('/request/current');
      } else {
        let panel = document.body.querySelector('data-import-export-panel');
        panel.importObject = data;
        panel.importPage = 3;
        app.openImportExport();
      }
    })
    .catch(cause => app.notifyError(cause.message));
  }

  window.addEventListener('on-process-incoming-data', function(e) {
    processIcomingData(e.detail.data);
  });

  app.openChromeSigninInfo = function() {
    var node = document.querySelector('chrome-not-signedin-view');
    if (!node) {
      node = document.createElement('chrome-not-signedin-view');
      document.body.appendChild(node);
    }
    node.opened = true;
  };

  /**
   * Opens a request from the Google Drive.
   * This action support integration with Drive UI, action "open with".
   */
  app.openDriveItem = function(id) {
    if (!app.chromeSignedIn) {
      return app.openChromeSigninInfo();
    }
    Polymer.RenderStatus.afterNextRender(app, function() {
      app.fire('navigate', {
        base: 'drive'
      });
      var picker = document.querySelector('google-drive-browser');
      picker._isOpened = true;
      picker._downloadFile(id);
    });
  };

  /**
   * Handles opening a file from Google Drive.
   * Normalizes content to the import object and opens import panel
   * if the data is import data or a request if import data contains single
   * request.
   */
  app._openDriveRequest = function(e) {
    var opts = {
      diveId: e.detail.diveId
    };
    processIcomingData(e.detail.content, opts);
  };

  app._chromeSignin = function(e) {
    app.fire('google-signin-success', {
      scope: e.target.scope,
      token: e.detail.token
    });
  };
  app._chromeSignout = function(e) {
    app.fire('google-signout', {
      scope: e.target.scope
    });
  };
  window.addEventListener('google-autorize', function(e) {
    var aware = app.$.signInAware;
    var scope = e.detail.scope;
    if (!aware.signedIn) {
      app.fire('google-signout', {
        scope: scope
      });
      return app.openChromeSigninInfo();
    }
    aware.scope = scope;
    if (aware.needAdditionalAuth) {
      aware.signIn();
    } else {
      app.fire('google-signin-success', {
        scope: scope,
        token: aware.accessToken
      });
    }
  });

  /* Navigation from main app chrome */
  app.openLogs = function() {
    var logViewer = document.querySelector('app-log-viewer');
    if (!logViewer) {
      throw new Error('Log viewer not available.');
    }
    logViewer.open();
  };
  document.body.addEventListener('logs-requested', app.openLogs);
  /**
   * Opens about app page
   */
  app.openAbout = function() {
    app.fire('navigate', {
      base: 'about'
    });
  };

  /**
   * Opens an issue tracker - new issue report.
   */
  app.openIssueReport = function() {
    var appVersion = arc.app.utils.appVer;
    var message = 'Your description here\n\n';
    message += '## Expected outcome\nWhat should happen?\n\n';
    message += '## Actual outcome\nWhat happened?\n\n';
    message += `## Versions\nApp: ${appVersion}\n`;
    message += `Platform: ${navigator.appVersion}\n\n`;
    message += '## Steps to reproduce\n1. \n2. \n3. ';
    message = encodeURIComponent(message);
    window.open('https://github.com/jarrodek/ChromeRestClient/issues/new?body=' + message);
  };
  /**
   * Opens the import / export panel
   */
  app.openImportExport = function() {
    app.fire('navigate', {
      base: 'dataimport'
    });
  };
  /**
   * Opens the settings panel.
   */
  app.openSettings = function() {
    app.fire('navigate', {
      base: 'settings'
    });
  };

  app.openLicense = function() {
    var dialog = document.querySelector('arc-license-dialog');
    dialog.opened = true;
  };
  document.body.addEventListener('display-license', app.openLicense);

  app._unreadMessagesChanged = function(e) {
    var state = !!(e.detail.value && e.detail.value.length > 0);
    app.set('newMessages', state);
  };

  app._openInfoCenter = function() {
    var service = document.querySelector('arc-messages-service');
    service.readMessages();
    app.fire('navigate', {
      base: 'messages'
    });
    window.setTimeout(function() {
      service.unread.forEach((item, i) => {
        service.set(['unread', i, 'read'], 1);
      });
    }, 5000);
  };

  app._closeInfoCenter = function() {
    app.fire('navigate', {
      base: 'default'
    });
  };

  app._openTerminationMessage = function() {
    window.open('https://restforchrome.blogspot.com/2017/10/termination-of-chrome-apps-arc-native.html');
  };

})(document, window);
