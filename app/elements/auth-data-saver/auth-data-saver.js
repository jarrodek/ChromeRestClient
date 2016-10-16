(function() {
  'use strict';

  Polymer({
    is: 'auth-data-saver',

    properties: {
      url: String,
      headers: {
        type: String,
        notify: true
      },
      /**
       * A list that holds auth data used in current session.
       * When the user pass an authentication data to the request (as a reaction to 401 response)
       * the auth data are in this list for further use in the same session and apply them to
       * the request automatically.
       */
      authDataList: {
        type: Array,
        value: function() {
          return [];
        }
      },
      auth: Object
    },

    // To be called before sending the request to apply an authorization header if required.
    applyAuthorization: function(request) {
      if (request.headers.match(/authorization:\s?basic\s[a-zA-Z0-9]+=/gim) !== null) {
        // Already has authorization.
        return Promise.resolve(request);
      }
      var rl = this.authDataList;
      if (!rl || !rl.length) {
        return Promise.resolve(request);
      }
      return new Promise((resolve) => {
        let url = request.url.toLowerCase();
        let auth = null;
        for (var i = 0, len = rl.length; i < len; i++) {
          let cn = rl[i].url.toLowerCase();
          if (cn[cn.length - 1] === '/') {
            cn = cn.substr(0, cn.length - 1);
          }
          if (url.indexOf(cn) === 0) {
            auth = rl[i];
            break;
          }
        }

        if (!auth) {
          resolve(request);
          return;
        }

        switch (auth.type) {
          case 'ntlm':
            this._setNtlmAuthData(auth.uid, auth.passwd, auth.domain);
            resolve(request);
            return;
          case 'basic':
            if (!auth.encoded) {
              resolve(request);
              return;
            }
            let authData = atob(auth.encoded).split(':');
            let login = null;
            let passwd = null;
            if (authData[0]) {
              login = authData[0];
            }
            if (authData[1]) {
              passwd = authData[1];
            }
            if (!login || !passwd) {
              resolve(request);
              return;
            }
            this._setBasicAuthData(auth.encoded, request);
            resolve(request);
            return;
        }
      });
    },

    _setNtlmAuthData: function(uid, passwd, domain) {
      this.auth = {};
      this.auth.uid = uid;
      this.auth.passwd = passwd;
      this.auth.domain = domain;
      this.auth.method = 'ntlm';
    },

    _setBasicAuthData: function(encoded, request) {
      var value = 'Basic ' + encoded;
      var src = request ? request.headers : this.headers;
      var headers = arc.app.headers.replace(src, 'authorization', value);

      if (request) {
        request.headers = headers;
      } else {
        this.set('headers', headers);
      }

      return encoded;
    },

    // Returns url without query parameters and fragment part.
    _computeUrlPath: function(url) {
      return new URI(url).fragment('').search('').toString();
    },

    // Called when NTLM auth dialog closes.
    _ntlmAuthDataReady: function(e) {
      var d = e.detail;
      this._setNtlmAuthData(d.uid, d.passwd, d.domain);
      this.sendRequest();
      var uri = this._computeUrlPath(this.url);
      var authData = {
        'url': uri,
        'uid': d.uid,
        'passwd': d.passwd,
        'domain': d.domain,
        'type': 'ntlm'
      };
      var index = this.authDataList.findIndex((i) => i.url === uri && i.type === 'ntlm');
      if (index !== -1) {
        this.authDataList.splice(index, 1);
      }
      this.authDataList.push(authData);
    },

    // A handler for closing basic auth dialog.
    _basicAuthDialogHandler: function(e) {
      var detail = e.detail;
      this._setBasicAuthData(detail.encoded);
      this.sendRequest();

      var uri = this._computeUrlPath(this.url);
      var authData = {
        'url': uri,
        'encoded': detail.encoded,
        'type': 'basic'
      };
      var index = this.authDataList.findIndex((i) => i.url === uri && i.type === 'basic');
      if (index !== -1) {
        this.authDataList.splice(index, 1);
      }
      this.authDataList.push(authData);
    },

    /**
     * This function mimics chrome basic auth dialog.
     * When the request return with 401 status and basic auth is required the app will open
     * auth dialog for basic authentication.
     *
     * Login data are stored locally in the app so it will be prefilled when calling the same URL
     * again.
     *
     * User can clear login and passwords in settings.
     */
    _openBasicAuthDialog: function() {
      this.$.basicAuthDialog.open();
      this.$.basicAuthDialog.url = this._computeUrlPath(this.url);
    },

    _openNtlmAuthDialog: function() {
      this.$.ntlmAuthDialog.open();
      this.$.ntlmAuthDialog.url = this._computeUrlPath(this.url);
    },
    /**
     * Check response object for any ayth required.
     * If authorization is required it will displays corresponding dialog.
     */
    processAuthResponse: function(auth) {
      switch (auth.method) {
        case 'basic':
          this._openBasicAuthDialog();
          break;
        case 'digest':
          this.auth = auth;
          this._openBasicAuthDialog();
          break;
        case 'ntlm':
          this._openNtlmAuthDialog();
          break;
      }
    },

    sendRequest: function() {
      this.fire('resend-auth-request');
    }

  });
})();
