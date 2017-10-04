(function(app) {
  /**
   * Drawer width support in main layout
   * @author Pawel Psztyc
   */
  // Default width.
  app.drawerWidth = '360px';
  app.forceNarrowLayout = false;
  app.narrowLayout = false;
  app.listeners = {
    'drawerResizer.track': '_drawerTrack'
  };

  var drawerInitTrackWidth;
  var drawerInitTransition;

  function start() {
    var main = app.$.paperDrawerPanel.$.main;
    app.$.paperDrawerPanel.$.drawer.classList.remove('transition-drawer');
    drawerInitTransition = getComputedStyle(main).getPropertyValue('transition');
    main.style.transition = 'left ease-in-out 0.01s';
    drawerInitTrackWidth = Number(app.drawerWidth.replace('px', ''));
  }

  function track(detail) {
    var newWidth = drawerInitTrackWidth + detail.dx;
    if (newWidth <= 10) {
      newWidth = 10;
    }
    app.drawerWidth = newWidth + 'px';
    app.$.paperDrawerPanel.$.main.style.transition = 'left ease-in-out 0.01s';
  }

  function end(detail) {
    app.$.paperDrawerPanel.$.drawer.classList.add('transition-drawer');
    app.$.paperDrawerPanel.$.main.style.transition = drawerInitTransition;
    var newWidth = drawerInitTrackWidth + detail.dx;
    if (newWidth <= 10) {
      newWidth = 10;
    }
    app._drawerWidth = newWidth;
    drawerInitTrackWidth = undefined;
    drawerInitTransition = undefined;
  }

  app._drawerTrack = function(e) {
    switch (e.detail.state) {
      case 'start': start(); break;
      case 'track': track(e.detail); break;
      case 'end': end(e.detail); break;
    }
  };
  // from local storage
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
})(document.getElementById('app'));
