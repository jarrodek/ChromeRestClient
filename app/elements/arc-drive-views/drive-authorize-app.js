
Polymer({
  is: 'drive-authorize-app',
  properties: {
    authorizing: {
      type: Boolean,
      value: false
    }
  },
  listeners: {
    'chrome-signin-aware-canceled': '_authCanceled',
    'chrome-signin-aware-error': '_authError',
    'chrome-signin-aware-success': '_authSuccess'
  },
  _back: function() {
    this.fire('cancel');
  },
  _authorizing: function() {
    this.authorizing = true;
  },
  _authCanceled: function() {
    this.authorizing = false;
  },
  _authError: function() {
    this.authorizing = false;
  },
  _authSuccess: function() {
    this.authorizing = false;
  },
});
