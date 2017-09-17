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
  // Selected environment for magic variables.
  app.variablesEnvironment = 'default';
  app.narrowLayout = false;
  app.forceNarrowLayout = false;
  app.upgrading = false;
  app.initialized = false;
  app.listeners = {
    'drawerResizer.track': '_drawerTrack'
  };
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
        if (params.type === 'history') {
          id = params.historyId;
        } else if (params.type === 'saved') {
          id = params.savedId;
        } else {
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
        break;
      case 'socket':
        app.pageTitle = 'Socket';
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
  /**
   * Open search bar and notify opener about changes.
   */
  app.openSearch = () => {
    var bar = document.querySelector('#search-bar');
    bar.setAttribute('show', true);
    bar.parentNode.setAttribute('mode', 'search');
    var input = document.querySelector('#mainSearchInput');
    var searchFn = function(e) {
      //inform controller about search action
      app._featureCalled('search', e);
    };
    var blurFn = function(e) {
      let input = document.querySelector('#mainSearchInput');
      input.removeEventListener('blur', blurFn);
      input.removeEventListener('search', searchFn);
      let bar = e.target.parentNode;
      bar.removeAttribute('show', true);
      bar.parentNode.removeAttribute('mode', 'search');
    };

    input.addEventListener('search', searchFn);
    input.addEventListener('blur', blurFn);
    input.focus();
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
  app._onFeatureOpen = (e) => {
    app._featureCalled('open', e);
  };
  app._onFeatureSave = (e) => {
    app._featureCalled('save', e);
  };
  app._onFeatureExport = (e) => {
    app._featureCalled('export', e);
  };
  app._onFeatureClearAll = (e) => {
    app._featureCalled('clearAll', e);
  };
  app._onFeatureDrive = (e) => {
    app._featureCalled('drive', e);
  };
  app._onFeatureBack = (e) => {
    app._featureCalled('back', e);
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
  document.body.addEventListener('project-saved', () => {
    document.querySelector('arc-menu-controller').refreshProjects();
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
      app.openSearch();
      return;
    }
    var searchBar = document.querySelector('#content-search-bar');
    if (!searchBar) {
      console.warn('Search bar was not available in document.');
      return;
    }
    if (searchBar.opened) {
      searchBar.focusInput();
    } else {
      searchBar.style.top = app.mainHeaderTop;
      searchBar.open();
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
    var panel = document.querySelector('request-panel');
    if (!panel) {
      console.warn('The request panel is undefined');
      return;
    }
    panel.sendRequest();
  };

  app.textSearchBarOpened = () => {
    var searchBar = document.querySelector('#content-search-bar');
    if (!searchBar) {
      console.warn('Search bar was not available in document.');
      return;
    }
    searchBar.style.top = app.mainHeaderTop;
  };

  window.addEventListener('paper-header-transform', function(e) {
    var searchBar = Polymer.dom(document).querySelector('#content-search-bar');
    if (!searchBar) {
      console.warn('Search bar was not available in document.');
      return;
    }
    // if (!searchBar.opened) {
    //   return;
    // }
    var detail = e.detail;
    var top = detail.height - detail.y;
    if (top < 0) {
      top = 0;
    }
    // top = top + 'px';
    if (searchBar.style.top === top + 'px') {
      return;
    }
    app.mainHeaderTop = top + 'px';
    app.fire('iron-signal', {name: 'main-header-transform', data: {
      top: top
    }});
    if (!searchBar.opened) {
      return;
    }
    searchBar.style.top = top;
    // console.log('paper-header-transform', top);
  });

  app._cancelEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };
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
    if (channel === 'stable') {
      var elm = app.$.onboardingNotifications;
      elm.parentNode.removeChild(elm);
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
   * Enable desktop notifications permission for the app.
   * This function can't use promise since a notification request must be made as a result
   * of user gesture (like click).
   *
   * @param {Function} callback A callback function with the result.
   */
  app.enableNotifications = (callback) => {
    chrome.permissions.request({permissions: ['notifications']}, (granted) => {
      if (callback && typeof callback === 'function') {
        callback(granted);
      } else {
        // from tutorial.
        if (granted) {
          app.$.enableNotify.setAttribute('hidden', true);
        }
      }
    });
  };
  /**
   * Handler called to network state change event.
   * This will display toase then the device is offline and close the message when it
   * comes back online.
   */
  app._networkStateChanged = (e) => {
    var online = e.detail.online;
    if (online) {
      app.$.offlineToast.close();
    } else {
      app.$.offlineToast.open();
    }
  };
  /**
   * Force close offline message.
   */
  app.closeOfflineMessage = () => {
    app.$.offlineToast.close();
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

  // app.runTutorials = () => {
  //   /// XHR toggle tutorial
  //   chrome.storage.sync.get({'tutorials': []}, (r) => {
  //     if (r.tutorials.indexOf('xhrElementTutorial') !== -1) {
  //       app.$.xhrProxyTutorial.parentNode.removeChild(app.$.xhrProxyTutorial);
  //       delete app.$.xhrProxyTutorial;
  //       return;
  //     }
  //     app.$.xhrProxyTutorial.target = app.$.xhrToggle;
  //   });
  // };

  app._closeXhrTutorial = () => {
    app.$.xhrProxyTutorial.hide();
    chrome.storage.sync.get({'tutorials': []}, (r) => {
      if (r.tutorials.indexOf('xhrElementTutorial') !== -1) {
        return;
      }
      r.tutorials.push('xhrElementTutorial');
      chrome.storage.sync.set(r);
    });
  };

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

  app._requestPanelInitiallized = () => {
    if (app.route !== 'request') {
      return;
    }
    var elm = document.querySelector('request-panel');
    if (!elm) {
      return;
    }
    elm.opened = true;
  };
  app._mainPageSelected = (e) => {
    if (app.route !== 'request') {
      return;
    }
    var elm = e.detail.item.querySelector('*:not(template)');
    if (!elm) {
      elm = document.querySelector('request-panel');
    }
    if (!elm) {
      return;
    }
    if (!elm.opened) {
      elm.opened = true;
    }
  };
  app._mainPageDeselected = (e) => {
    var elm = e.detail.item.querySelector('*:not(template)');
    if (!elm || elm.nodeName !== 'REQUEST-PANEL') {
      return;
    }
    elm.opened = false;
  };
  window.addEventListener('open-drive-selector', () => {
    let ctrl = document.body.querySelector('arc-drive-controller');
    if (!ctrl) {
      StatusNotification.notify({
        message: 'Drive controller not found.'
      });
      return;
    }
    ctrl.opened = true;
  });

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

  window.addEventListener('analytics-permitted-change', (e) => {
    var permitted = e.detail.permitted;
    app.set('analyticsDisabled', !permitted);
  });

  window.addEventListener('variables-environment-changed', (e) => {
    app.variablesEnvironment = e.detail.env;
  });
  /* File import by drag'n'drop */
  document.body.addEventListener('dragenter', (e) => {
    e.stopPropagation();
    e.preventDefault();
    var element = document.querySelector('drop-file-importer');
    if (!element) {
      return;
    }
    if (element.opened) {
      element.opened = false;
    } else {
      element.opened = true;
    }
  });

  /* Drawer width support */
  app.drawerWidth = '360px';
  app._drawerTrack = function(e) {
    var newWidth;
    switch (e.detail.state) {
      case 'start':
        app.$.paperDrawerPanel.$.drawer.classList.remove('transition-drawer');
        app._drawerInitTransition = getComputedStyle(app.$.paperDrawerPanel.$.main)
          .getPropertyValue('transition');
        app.$.paperDrawerPanel.$.main.style.transition = 'left ease-in-out 0.01s';
        app._drawerInitTrackWidth = Number(app.drawerWidth.replace('px', ''));
        break;
      case 'track':
        newWidth = app._drawerInitTrackWidth + e.detail.dx;
        if (newWidth <= 10) {
          newWidth = 10;
        }
        app.drawerWidth = newWidth + 'px';
        app.$.paperDrawerPanel.$.main.style.transition = 'left ease-in-out 0.01s';
        break;
      case 'end':
        app.$.paperDrawerPanel.$.drawer.classList.add('transition-drawer');
        app.$.paperDrawerPanel.$.main.style.transition = app._drawerInitTransition;
        newWidth = app._drawerInitTrackWidth + e.detail.dx;
        if (newWidth <= 10) {
          newWidth = 10;
        }
        app._drawerWidth = newWidth;
        delete app._drawerInitTrackWidth;
        delete app._drawerInitTransition;
        break;
    }
  };
  app._drawerWidthRead = function(e) {
    if (e.detail.value) {
      app.set('drawerWidth', (e.detail.value + 'px'));
    }
  };

  app._drawerToggle = function() {
    if (app.narrowLayout) {
      return;
    }
    app.forceNarrowLayout = !app.forceNarrowLayout;
    app.async(function() {
      app.$.paperDrawerPanel.closeDrawer();
    }, 1);
  };
  // Pin drawer back to the app.
  app._pinDrawer = function() {
    app.forceNarrowLayout = false;
  };

  app._computePinDrawerClass = function(forceNarrowLayout, narrowLayout) {
    var clazz = 'drawer-pin';
    if (forceNarrowLayout && narrowLayout) {
      clazz += ' visible';
    }
    return clazz;
  };
  // Computes `active` flag for the legacy project related requests
  app._processProjectRequests = (route) => route === 'request';

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
})(document, window);
