(function(document, window) {
  'use strict';

  let app = document.querySelector('#app');
  app.baseUrl = '/';
  app.pageTitle = '';
  /**
   * Because controllers do not have direct access to the toolbar it must keep relevant data in
   * the main object if it must to be accessible to the toolbar.
   * This is an array of requests related to the currently opened project.
   *
   * TODO:50 In future releases controllers should not keep their data in the toolbar. New design
   * should keep all releted to the controller data in the main workspace window.
   */
  app.projectEndpoints = [];
  /**
   * The same as above.
   */
  app.selectedRequest = null;
  app.selectedProject = undefined;
  app.upgrading = false;
  app.usePouchDb = false;
  app.gaCustomDimensions = [];
  app.appVersion = arc.app.utils.appVer;
  app.appId = chrome.runtime && chrome.runtime.id ? chrome.runtime.id : 'not-in-chrome-app';
  app.analyticsDisabled = false;
  // Will be set to true when toas has been opened.
  app.withToast = false;
  // Selected environment for magic variables.
  app.variablesEnvironment = 'default';
  app.narrowLayout = false;
  // Event fired when all components has been initialized.
  app.addEventListener('dom-change', function() {
    app.updateBranding();
    app.runTutorials();
  });
  // Called when current request changed.
  window.addEventListener('selected-request', (e) => {
    app.selectedRequest = e.detail.id;
  });
  // Called when current project changed
  window.addEventListener('selected-project', (e) => {
    app.set('selectedProject', e.detail.id);
    if (!app.selectedProject) {
      app.projectEndpoints = [];
    }
  });
  // event fired when the app is initialized and can remove loader.
  window.addEventListener('ArcInitialized', function() {
    document.querySelector('arc-loader-screen').close();
  });
  window.addEventListener('WebComponentsReady', function() {
    // console.log('Components are ready');
    // event will be handled in elements/routing.html
    if (app.upgrading) {
      return;
    }
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

  // A handler called when data has been imported to the app.
  app._dataImportedHandler = function() {
    app.$.appMenu.refreshProjects();
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
      // Array.from(document.querySelectorAll('[search-query]')).forEach((ctrl) => {
      //   if (ctrl.onSearch) {
      //     ctrl.onSearch();
      //   }
      // });
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

  document.body.addEventListener('restore-request', (e) => {
    app.set('request', e.detail.request);
    page('/request/current');
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
    app.projectEndpoints = [];
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
  app._onFeatureProjectEndpoints = (e) => {
    app._featureCalled('projectEndpoints', e.detail.item.dataset.id);
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
    if (app.request.url && url.indexOf('/') === 0) {
      var parser;
      try {
        parser = new URL(app.request.url);
        url = parser.origin + url;
        app.set('request.url', url);
      } catch (e) {
        console.log('URL parse error', e);
        this.fire('app-log', {
          message: e
        });
        app.set('request.url', url);
      }
    } else {
      app.set('request.url', url);
    }
    app.scrollPageToTop();
  });
  // called when any component want to write to clipboard.
  document.body.addEventListener('clipboard-write', (e) => {
    var data = e.detail.data;
    arc.app.clipboard.write(data);
  });
  document.body.addEventListener('project-saved', () => {
    app.$.appMenu.refreshProjects();
  });

  app.onSave = (e, detail) => {
    var ctrl = document.querySelector('arc-request-controller, request-panel');
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
      if (channel === 'canary') {
        chrome.storage.local.get({'showCanaryWarning': true}, (r) => {
          if (r.showCanaryWarning) {
            app.$.canaryInfo.open();
          }
        });
      }
    }
    if (channel === 'stable') {
      var elm = app.$.onboardingNotifications;
      elm.parentNode.removeChild(elm);
    }
  };
  app._canaryInfoClosed = () => {
    if (app.$.canaryMemoDontShow.checked) {
      chrome.storage.local.set({'showCanaryWarning': false});
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

  app.runTutorials = () => {
    /// XHR toggle tutorial
    chrome.storage.sync.get({'tutorials': []}, (r) => {
      if (r.tutorials.indexOf('xhrElementTutorial') !== -1) {
        return;
      }
      app.$.xhrProxyTutorial.target = app.$.xhrToggle;
    });
  };

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

  // called when the database upgrade element request database upgrade.
  // It will register source int the app._dbUpgrades array
  // and run upgrade screen.
  window.addEventListener('database-upgrades-needed', (e) => app._onDatabaseUpgradeRequired(e));
  window.addEventListener('app-initialize-upgrade', () => app._initUpgrades());
  window.addEventListener('database-upgrades-ready', (e) => app._dbUpgradeReady(e));
  window.addEventListener('database-upgrades-status', (e) => app._upgradeStatus(e));
  window.addEventListener('database-upgrades-long-task', (e) => app._upgradeHeavyDuty(e));
  window.addEventListener('database-upgrade-error', (e) => app._upgradeStatus(e));
  window.addEventListener('app-upgrade-screen-coninue-errored', () => app._continueErrored());
  window.addEventListener('app-upgrade-screen-closed', () => {
    app.initRouting();
  });
  app._onDatabaseUpgradeRequired = (e) => {
    if (!app._dbUpgrades) {
      app._dbUpgrades = [];
      app.launchUpgradeScreen();
      app.upgrading = true;
    }
    app._dbUpgrades.push({
      target: e.target,
      id: e.value
    });
  };

  app.launchUpgradeScreen = () => {
    var el = document.createElement('app-upgrade-screen');
    document.body.appendChild(el);
    el.opened = true;
  };
  app._initUpgrades = () => {
    if (!app._dbUpgrades || !app._dbUpgrades.length) {
      document.querySelector('app-upgrade-screen').finished = true;
      return;
    }
    var target = app._dbUpgrades[0];
    if (!target) {
      document.querySelector('app-upgrade-screen').finished = true;
      return;
    }
    target.target.initScript();
  };
  app._dbUpgradeReady = (e) => {
    app.fire('use-pouch-db');
    app.set('usePouchDb', true);
    app._upgradeReady(e);
    app.push('gaCustomDimensions', {
      index: 4,
      value: 'PouchDb'
    });
  };
  app._upgradeReady = (e) => {
    if (!app._dbUpgrades || !app._dbUpgrades.length) {
      let elm = document.querySelector('app-upgrade-screen');
      if (elm) {
        elm.finished = true;
      }
      return;
    }
    var target = e.target;
    var index = app._dbUpgrades.findIndex((i) => i.target === target);
    if (index === -1) {
      return;
    }
    app._dbUpgrades.splice(index, 1);
    if (!app._dbUpgrades.length) {
      document.querySelector('app-upgrade-screen').finished = true;
      app.initRouting();
    } else {
      app._initUpgrades();
    }
  };
  app._upgradeHeavyDuty = () => {
    document.querySelector('app-upgrade-screen').heavyDuty = true;
  };
  app._continueErrored = () => {
    // Current updrage script errored.
    // continue with next or exit if there's no more upgrades.
    app._dbUpgrades.shift();
    app._initUpgrades();
  };
  app._upgradeStatus = (e) => {
    app.fire('app-upgrade-screen-log', e.detail);
  };

  app._mainPageSelected = (e) => {
    if (app.route !== 'request') {
      return;
    }
    var elm = e.detail.item.querySelector('*:not(template)');
    elm.opened = true;
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
    ctrl.selectFile();
  });

  app.initAnalytics = () => {
    chrome.storage.local.get({
      'google-analytics.analytics.tracking-permitted': true
    }, (data) => {
      app.analyticsDisabled = !Boolean(data['google-analytics.analytics.tracking-permitted']);
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

    arc.app.analytics.getChannelName().then((channel) => {
      app.push('gaCustomDimensions', {
        index: 3,
        value: channel
      });
    });
  };

  window.addEventListener('analytics-permitted-change', (e) => {
    var permitted = e.detail.permitted;
    app.set('analyticsDisabled', !permitted);
  });

  // Toast show UI animation.
  window.addEventListener('iron-announce', (e) => {
    var target = e.target;
    if (!target) {
      return;
    }
    if (target.nodeName === 'PAPER-TOAST') {
      app.currentToast = target;
      app.set('withToast', true);
    }
  });
  // Toast close UI animation.
  window.addEventListener('iron-overlay-closed', (e) => {
    if (!app.currentToast) {
      return;
    }
    if (app.currentToast !== e.target) {
      return;
    }
    app.set('withToast', false);
    app.currentToast = undefined;
  });
  window.addEventListener('variables-environment-changed', (e) => {
    app.variablesEnvironment = e.detail.env;
  });
})(document, window);
