Polymer({
      is: 'platinum-https-redirect',

      _isLocalhost: function(hostname) {
        // !! coerces the logical expression to evaluate to the values true or false.
        return !!(hostname === 'localhost' ||
                  // [::1] is the IPv6 localhost address.
                  hostname === '[::1]' ||
                  // 127.0.0.1/8 is considered localhost for IPv4.
                  hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
      },

      attached: function() {
        if (window.location.protocol === 'http:' && !this._isLocalhost(window.location.hostname)) {
          // Redirect to https: if we're currently using http: and we're not on localhost.
          window.location.protocol = 'https:';
        }
      }
    });