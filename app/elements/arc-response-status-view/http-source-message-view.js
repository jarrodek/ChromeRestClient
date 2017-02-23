Polymer({
  is: 'http-source-message-view',

  properties: {
    // A HTTP message to display.
    message: String,
    // True if the message is visible.
    opened: Boolean
  },

  toggle: function() {
    this.$.collapse.toggle();
  },

  _computeIcon: function(opened) {
    return opened ? 'arc:expand-less' : 'arc:expand-more';
  }
});
