(function(document, window) {
  'use strict';
  arc.app.analytics.init();

  let app = document.querySelector('#app');
  app.baseUrl = '/app/';
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // event called when the app is initialized and can remove loader.
  window.addEventListener('ArcInitialized', function() {
    document.querySelector('arc-loader-screen').close();
  });

  window.addEventListener('WebComponentsReady', function() {
    console.log('Components are ready');
    //event will be handled in elements/routing.html
    let event = new Event('initializeRouting');
    window.dispatchEvent(event);
  });

  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

  // A handler called when data has been imported to the app.
  app._dataImportedHandler = function() {
    app.$.appMenu.refreshProjects();
  };

})(document, window);
