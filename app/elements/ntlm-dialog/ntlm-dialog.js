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
      url: String
    },

    // Toggle password visibility
    togglePassword: function(e) {
      var input = this.$.password;
      var icon = e.target;
      if (input.type === 'password') {
        input.type = 'text';
        icon.icon = 'visibility-off';
      } else {
        input.type = 'password';
        icon.icon = 'visibility';
      }
    },

    _setValue: function() {
      this.fire('auth-data', {
        uid: this.login,
        passwd: this.password,
        domain: this.domain
      });
    }

  });
})();
