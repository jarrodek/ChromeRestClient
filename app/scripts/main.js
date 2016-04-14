(function(document, window) {
  'use strict';
  arc.app.analytics.init();

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
  // Event fired when all components has been initialized.
  app.addEventListener('dom-change', function() {
    arc.app.logger.initConsole();
    app.updateBranding();
  });

  // event fired when the app is initialized and can remove loader.
  window.addEventListener('ArcInitialized', function() {
    document.querySelector('arc-loader-screen').close();
  });
  window.addEventListener('WebComponentsReady', function() {
    // console.log('Components are ready');
    //event will be handled in elements/routing.html
    let event = new Event('initializeRouting');
    window.dispatchEvent(event);
    arc.app.logger.initDbLogger();
  });
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
      src[fnName](event);
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
  app._onFeatureProjectEndpoints = (e) => {
    app._featureCalled('projectEndpoints', e.detail.item.dataset.id);
  };
  // called when any component want to change request link.
  document.body.addEventListener('action-link-change', (e) => {
    var url = e.detail.url;
    if (app.request.url && url.indexOf('/') === 0) {
      /* global URLParser */
      let p = new URLParser(app.request.url);
      url = p.protocol + '://' + p.authority + url;
      app.set('request.url', url);
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

  app.onSave = () => {
    var ctrl = document.querySelector('arc-request-controller');
    ctrl.onSave();
    arc.app.analytics.sendEvent('Shortcats usage', 'Called', 'Save');
  };

  app.onOpen = () => {
    page('/saved');
    arc.app.analytics.sendEvent('Shortcats usage', 'Called', 'Open');
  };

  app.onSearch = () => {
    var searchBar = document.querySelector('#content-search-bar');
    if (!searchBar) {
      console.warn('Search bar was not available in document.');
      return;
    }
    searchBar.open();
    arc.app.analytics.sendEvent('Shortcats usage', 'Called', 'Search');
  };

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
      if (cls === 'canary') {
        app.$.canaryInfo.open();
      }
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
    console.log('Window error event,', e);
  });
  window.onerror = function(error, url, line) {
    console.log({
      acc: 'error',
      data: 'ERR:' + error + ' URL:' + url + ' L:' + line
    });
  };
})(document, window);
