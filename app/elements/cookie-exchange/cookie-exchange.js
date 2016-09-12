(function() {
  'use strict';
  /**
   * The cookie exchange is an element that collaborate with external Chrome extension to get a
   * list of cookies stored in Chrome.
   *
   * If the user do not have external extension installed, the `connected` flag will be set to false.
   */
  Polymer({
    is: 'cookie-exchange',

    properties: {
      // An id of the extension to connect to.
      externalId: {
        type: String
      },
      // True if the app is connected to the external extension.
      connected: {
        type: Boolean,
        notify: true
      }
    },

    observers: [
      '_setCookieCache(connected)'
    ],

    // When connected, refresh cookie cache.
    _setCookieCache: function(connected) {
      if (!connected) {
        this._cache = undefined;
        return;
      }

      this.$.sync.postMessage({
        payload: 'get-cookies'
      });
    },
    // Process a message returned by the port.
    _processMessage: function(msg) {
      if (!msg || !msg.payload) {
        return;
      }
      switch (msg.payload) {
        case 'cookie-changed':
          this.$.sync.postMessage({
            payload: 'get-cookies'
          });
          break;
        case 'get-cookies':
          this.cookies = msg.cookies;
          break;
      }
    },
    // Applies cached cookies to the request.
    applyCookies: function(request) {
      if (!this.cookies) {
        return request;
      }
      var u = new URL(request.url);
      var host = u.hostname;
      if (!host) {
        return request;
      }
      host = host.toLowerCase();
      var c = this.cookies;
      var str = '';
      var cookieFn = (cookie) => {
        if (str) {
          str += '; ';
        }
        str += cookie.name + '=' + cookie.value;
      };
      for (let domain in c) {
        if (domain.toLowerCase().indexOf(host) !== -1) {
          c[domain].forEach(cookieFn);
          break;
        }
      }
      if (str) {
        let headers = arc.app.headers.toJSON(request.headers);
        let found = false;
        headers.forEach((header) => {
          if (header.name.toLowerCase() === 'cookie') {
            found = true;
            header.value = header.value + '; ' + str;
          }
        });
        if (!found) {
          headers.push({
            name: 'cookie',
            value: str
          });
        }
        request.headers = arc.app.headers.toString(headers);
      }
      return request;
    }
  });
})();
