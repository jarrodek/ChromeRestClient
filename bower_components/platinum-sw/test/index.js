if (navigator.serviceWorker) {
        WCT.loadSuites([
          // Keep each test suite in its own directory so that it gets a SW registered with a
          // limited scope, just in case the browser environment is not cleared in between each
          // test suite.
          'platinum-sw-register/index.html',
          'platinum-sw-cache/index.html',
          'platinum-sw-import-script/index.html',
          'platinum-sw-fetch/index.html'
        ]);
      } else {
        WCT.loadSuites([
          'platinum-sw-unsupported.html'
        ]);
      };