(function(document, window) {
  'use strict';

  let app = document.querySelector('#app');
  app.pageTitle = '';
  /**
   * Selected request database ID
   */
  app.selectedRequest = null;
  app.selectedProject = null;
  app.gaCustomDimensions = [];
  app.appVersion = arc.app.utils.appVer;
  app.appId = chrome.runtime && chrome.runtime.id ? chrome.runtime.id : 'not-in-chrome-app';
  app.analyticsDisabled = false;
  app.upgrading = false;
  app.initialized = false;

  app.observers = [
    '_routeChanged(route, params.*)'
  ];

  app._routeChanged = function(route, paramsRecord) {
    var params = paramsRecord && paramsRecord.base;
    switch (route) {
      case 'request':
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
          default:
            app.selectedRequest = undefined;
            console.error('ID not handled!', params);
            throw new Error('ID not handled!');
        }
        if (params.type === 'history') {
          id = params.historyId;
        } else if (params.type === 'saved') {
          id = params.savedId;
        } else if (params.type === 'restore') {
          return;
        } else {

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
  /**
   * Returns true when both parameteres are trully.
   *
   * The `template` will always render `arc-request-controller` and it's children even if in a
   * moment it should be turned off.
   * The app will wait until upgrade script finish and the set up the `initialized` flag.
   */
  app.canRender = (status, elementIsRequestPanel) => {
    return status && elementIsRequestPanel === 'true';
  };
  // Open current project details page
  app.openProjectDetails = () => {
    page(`/project/${app.selectedProject}/edit`);
  };
  app._computeHideProjectLink = (selectedProject, route) =>
    !(selectedProject && route === 'request');
  app._canShowProjectSelector = (route, count) => route === 'request' && count > 0;
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
  window.addEventListener('selected-project-changed', (e) => {
    app.selectedProject = e.detail.value;
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

  document.body.addEventListener('page-title-changed', (e) => {
    app.pageTitle = e.detail.title;
  });

  /**
   * Read more about requesting features in ArcHasToolbarBehavior behavior file.
   * Also change main.css in features section.
   */
  app.featuresMapping = new Map();
  document.body.addEventListener('request-toolbar-features', (e) => {
    app.featuresMapping.clear();
    var list = e.detail.features;
    var bar = document.querySelector('#mainToolbar');
    list.forEach((feature) => {
      bar.setAttribute(feature, true);
      app.featuresMapping.set(feature, e.target);
    });
  });
  document.body.addEventListener('release-toolbar-features', () => {
    var bar = document.querySelector('#mainToolbar');
    var keys = app.featuresMapping.keys();
    for (let feature of keys) {
      bar.removeAttribute(feature);
    }
    app.featuresMapping.clear();
  });
  app._featureCalled = (feature, event) => {
    if (!app.featuresMapping.has(feature)) {
      console.warn('Feature "%s" has been called without the mapping', feature);
      return;
    }
    var src = app.featuresMapping.get(feature);
    var name = feature[0].toUpperCase() + feature.substr(1);
    var fnName = 'on' + name;
    if (!(fnName in src)) {
      console.warn(`Function ${fnName} is undefined for ${src.nodeName}`);
    } else {
      src[fnName]({
        detail: event,
        source: 'feature'
      });
    }
  };
  app._onFeatureSave = (e) => {
    app._featureCalled('save', e);
  };
  app._onFeatureClearAll = (e) => {
    app._featureCalled('clearAll', e);
  };
  app._onFeatureXhrToggle = (e) => {
    app._featureCalled('xhrtoggle', e);
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
    page('/drive');
  }
  window.addEventListener('open-drive-selector', openDriveSelector);
  window.addEventListener('pick-google-drive-item', openDriveSelector);

  app.initAnalytics = () => {
    chrome.storage.local.get({
      'google-analytics.analytics.tracking-permitted': true,
      'google-analytics.analytics.settings-transferred': false
    }, (data) => {
      if (data['google-analytics.analytics.settings-transferred']) {
        return;
      }
      app.async(() => {
        if (data['google-analytics.analytics.tracking-permitted'] === 'false' ||
          data['google-analytics.analytics.tracking-permitted'] === false) {
          app.analyticsDisabled = true;
        } else {
          app.analyticsDisabled = false;
        }
      }, 2000);
      chrome.storage.local.set({'google-analytics.analytics.settings-transferred': true}, () => {});
    });
    var appVersion = arc.app.utils.appVer;
    var chromeVer = arc.app.utils.chromeVersion;
    var manifest = (chrome.runtime && chrome.runtime.getManifest) ?
      chrome.runtime.getManifest() : null;
    // jscs:disable
    var manifestName = manifest ? manifest.version_name : '(not set)';
    // jscs:enable
    var channel = null;
    if (manifestName === '(not set)') {
      channel = 'not a chrome env';
    } else if (manifestName.indexOf('canary') !== -1) {
      channel = 'canary';
    } else if (manifestName.indexOf('dev') !== -1) {
      channel = 'dev';
    } else if (manifestName.indexOf('beta') !== -1) {
      channel = 'beta';
    } else {
      channel = 'stable';
    }

    app.push('gaCustomDimensions', {
      index: 1,
      value: chromeVer
    });
    app.push('gaCustomDimensions', {
      index: 2,
      value: appVersion
    });
    app.push('gaCustomDimensions', {
      index: 5,
      value: channel
    });
  };

  window.addEventListener('analytics-permitted-changed', (e) => {
    var permitted = e.detail.permitted;
    app.set('analyticsDisabled', !permitted);
  });

  window.addEventListener('logs-requested', function() {
    var logViewer = document.querySelector('arc-log-viewer');
    if (!logViewer) {
      throw new Error('Log viewer not available.');
    }
    logViewer.open();
  });

  window.addEventListener('app-new-window', function() {
    chrome.runtime.getBackgroundPage(function(bg) {
      bg.arc.bg.openWindow();
    });
  });

  window.addEventListener('app-version', function(e) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    e.detail.version = chrome.runtime.getManifest().version_name;
    //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
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
        page('/dataimport');
      }
    })
    .catch(cause => app.notifyError(cause.message));
  }

  window.addEventListener('on-process-incoming-data', function(e) {
    processIcomingData(e.detail.data);
  });

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
    var scope = e.detail.scope;
    app.$.signInAware.scope = scope;
    if (app.$.signInAware.needAdditionalAuth) {
      app.$.signInAware.signIn();
    } else {
      app.fire('google-signin-success', {
        scope: scope,
        token: app.$.signInAware.accessToken
      });
    }
  });
})(document, window);
