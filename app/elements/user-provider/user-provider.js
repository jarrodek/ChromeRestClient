'use strict';

Polymer({
  is: 'user-provider',

  properties: {
    /**
     * Scopes for access token.
     * The app will use scopes to retreive access token.
     * After scopes list change the app will request for new access token automatically.
     * If silent authorization fails the user will be logged out and the user
     * will need to re-athorize the app again before use of the API.
     */
    scopes: {
      type: Array,
      readOnly: true,
      notify: true,
      value: []
    },
    /**
     * User profile image. The information will be retreived from the Google API
     * after successfoul authorization.
     * It can be use by different element to display user image.
     */
    profileImage: {
      type: String,
      notify: true
    },
    /**
     * True if the user has authorized this app.
     */
    authorized: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      observer: '_authorizedChanged'
    },
    /**
     * User info from Google Account.
     */
    userInfo: {
      type: Object,
      value: {},
      notify: true
    },
    /**
     * Authorization headers for Google services.
     */
    authHeaders: Object,
    /**
     * Current access token.
     */
    accessToken: String
  },

  ready: function() {
    this._setScopes(chrome.runtime.getManifest().oauth2.scopes);
    this._restore();
  },

  _restore: function() {
    this.authorize(false).then(function(accessToken) {
      if (!accessToken) {
        this._setAuthorized(false);
        return;
      }
      this.authHeaders = {
        'Authorization': 'Bearer ' + accessToken
      };
      this.accessToken = accessToken;
      this._setAuthorized(true);
    }.bind(this)).catch(function(e) {
      console.error('user-provider::restore', e);
    });
  },

  _authorizedChanged: function() {
    if (this.authorized) {
      this.$.profileRequest.generateRequest();
    } else {
      this.accessToken = null;
      this.authHeaders = null;
    }
  },

  /**
   * Authorize the user using Chrome Identity API for Google Accounts.
   *
   * @param {Bool} interactive
   *    if true user will see confirmation dialog if the user is not logged in.
   *    If false dialog will never show and function will result with token == null.
   */
  authorize: function(interactive) {
    return new Promise(function(resolve, reject) {
      try {
        let options = this._authOptions(interactive);
        chrome.identity.getAuthToken(options, function(token) {
          resolve(token);
        }.bind(this));
      } catch (e) {
        console.error(e);
        reject(e.message);
      }
    }.bind(this));
  },
  /**
   * Construct an options for chrome.identity.getAuthToken function.
   */
  _authOptions: function(interactive) {
    if (typeof interactive !== 'boolean') {
      interactive = true;
    }
    var options = {
      interactive: interactive
    };
    if (this.scopes !== null) {
      options.scopes = this.scopes;
    }
    return options;
  },
  /**
   * Revoke access token. The token will not work after this operation.
   */
  revokeToken: function() {
    this.authorize(false).then(function(accessToken) {
      if (!accessToken) {
        this._setAuthorized(false);
        return;
      }
      this.set('accessToken'.accessToken);
      this.$.revokeRequest.generateRequest();
    }.bind(this)).catch(function(e) {
      console.error('user-provider::restore', e);
    });
  },
  /**
   * A function to be called when the token has been revoked.
   */
  _tokenRevokedHandler: function() {
    this._clearCache().then(function() {
      this._setAuthorized(false);
    }.bind(this));
  },
  /**
   * Revoke error handler.
   */
  _tokenRevokeError: function() {
    console.warn('Token revoke failed.');
  },
  /**
   * Clear auth data.
   */
  _clearCache: function() {
    return this.authorize(false)
      .then(function(accessToken) {
        if (!accessToken) {
          return Promise.resolve(true);
        }
        return new Promise(function(resolve) {
          chrome.identity.removeCachedAuthToken({
            token: this.accessToken
          }, function() {
            resolve();
          });
        });
      }.bind(this));
  },
  /**
   * A success handler for token info request.
   */
  _tokenInfoHandler: function(e) {
    var tokenInfo = e.detail.response;
    if (!tokenInfo) {
      return;
    }
    //jscs: disable
    if (tokenInfo.expires_in <= 0) {
      //jscs: enable
      this._setAuthorized(false);
    }
  },
  /**
   * An error handler for token info request.
   */
  _tokenInfoError: function(e) {
    switch (e.detail.xhr.status) {
      case 400:
        //bad request - accessToken not ready.
        break;
      default:
        console.log('tokenInfoError', e);
    }
  },

  _userDataResponse: function(e) {
    var resp = e.detail;
    if (resp && resp.response) {
      this.userInfo = resp.response;
      this.profileImage = resp.response.picture;
    }
  },

  _userDataError: function(error) {
    //TODO: error handling
    console.error('user-account::userDataError:', error);
  }
});
