(function() {
  'use strict';
  Polymer({
    is: 'basic-auth-dialog',
    behaviors: [
      Polymer.PaperDialogBehavior
    ],

    properties: {
      // User login
      username: {
        type: String,
        value: ''
      },
      // User password
      password: {
        type: String,
        value: ''
      },
      // Current URL.
      url: String,
      entryAnimation: {
        type: String,
        value: 'slide-from-top-animation'
      },
      exitAnimation: {
        type: String,
        value: 'slide-up-animation'
      },
      savedAuth: Object,
      credentialsPath: {
        type: String,
        computed: '_computeCredentialsPath(url)'
      }
    },

    observers: [
      '_savedAuthChanged(savedAuth.*)'
    ],

    _setValue: function() {
      this.fire('basic-auth-data-ready', {
        encoded: btoa(this.username + ':' + this.password)
      });
      if (!this.savedAuth || !this.savedAuth.encoded ||
        this.decoded[0] !== this.username || this.decoded[1] !== this.password) {
        this._updateData();
      }
    },

    _computeCredentialsPath: function(url) {
      var path = 'basic/';
      if (url) {
        path += encodeURIComponent(url);
      }
      return path;
    },

    _savedAuthChanged: function() {
      if (!this.savedAuth || !this.savedAuth.encoded || !this.url) {
        return;
      }
      let authData = atob(this.savedAuth.encoded).split(':');
      if (authData[0]) {
        this.set('username', authData[0]);
      }
      if (authData[1]) {
        this.set('password', authData[1]);
      }
      this.decoded = authData;
    },

    _updateData: function() {
      if (!this.url) {
        return;
      }
      var encoded = btoa(this.username + ':' + this.password);
      if (!this.savedAuth) {
        this.savedAuth = {
          _id: 'basic/' + encodeURIComponent(this.url)
        };
      }
      this.savedAuth.encoded = encoded;
      this.$.doc.save();
    }

  });
})();
