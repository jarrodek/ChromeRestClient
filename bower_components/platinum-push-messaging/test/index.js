if ('serviceWorker' in navigator && 'PushManager' in window  && 'Notification' in window) {
        WCT.loadSuites([
          'supported.html',
        ]);
      } else {
        WCT.loadSuites([
          'unsupported.html'
        ]);
      };