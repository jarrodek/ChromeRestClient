
Polymer({
  is: 'drive-error-message',
  properties: {
    message: String
  },
  _back: function() {
    this.fire('restore-view');
  }
});
