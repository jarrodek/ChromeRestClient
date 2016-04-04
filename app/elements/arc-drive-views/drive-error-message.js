
Polymer({
  is: 'drive-error-message',
  properties: {
    // Error message to display
    message: String,
    // If true there will be "close" button instead of "back"
    isClose: Boolean,
    // Label for action button
    _buttonLabel: {
      type: String,
      computed: '_computeButtonLabel(isClose)',
      value: 'Back'
    }
  },
  _back: function() {
    if (this.isClose) {
      this.fire('cancel');
    } else {
      this.fire('restore-view');
    }
  },

  _computeButtonLabel: function(isClose) {
    return isClose ? 'Close' : 'Back';
  }
});
