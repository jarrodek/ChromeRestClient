(function() {
  'use strict';
  Polymer({
    is: 'ntlm-dialog',
    behaviors: [
      Polymer.PaperDialogBehavior
    ],

    properties: {
      // User login
      login: {
        type: String,
        value: ''
      },
      // User password
      password: {
        type: String,
        value: ''
      },
      // User login domain
      domain: {
        type: String,
        value: 'workgroup'
      },
      // Current URL.
      url: String,
      usePouchDb: Boolean,
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

    _computeCredentialsPath: function(url) {
      var path = 'ntlm/';
      if (url) {
        path += encodeURIComponent(url);
      }
      return path;
    },

    _savedAuthChanged: function() {
      var a = this.savedAuth;
      if (!a || !a.uid || !this.url) {
        return;
      }
      this.login = a.uid;
      this.password = a.passwd;
      this.domain = a.domain;
    },

    _setValue: function() {
      this.fire('auth-data', {
        uid: this.login,
        passwd: this.password,
        domain: this.domain
      });
      if (this.usePouchDb) {
        if (!this.savedAuth || this.savedAuth.uid !== this.login ||
          this.savedAuth.passwd !== this.password || this.savedAuth.domain !== this.domain) {
          this._updateData();
        }
      }
    },

    _updateData: function() {
      if (!this.usePouchDb || !this.url) {
        return;
      }
      if (!this.savedAuth) {
        this.savedAuth = {
          _id: 'ntlm/' + encodeURIComponent(this.url)
        };
      }
      this.savedAuth.uid = this.login;
      this.savedAuth.passwd = this.password;
      this.savedAuth.domain = this.domain;
      this.$$('#doc').save();
    }

  });
})();
