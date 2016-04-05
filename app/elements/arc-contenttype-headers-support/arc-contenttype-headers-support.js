(function() {
'use strict';

Polymer({
  is: 'arc-contenttype-headers-support',
  /**
   * Fired when the user selects the value and accepts it.
   *
   * @event value-selected
   * @property {String} value A value of the selected content type.
   */
  properties: {
    // Current value of the header
    value: {
      type: String,
      overver: '_valueChanged'
    },
    // Index of the selected element.
    selected: {
      type: Number,
      value: -1
    },
    // List of values to display to the user.
    defaults: {
      type: Array,
      value: function() {
        return [
          'multipart-form-data',
          'application/x-www-form-urlencoded',
          'application/json',
          'application/xml',
          'application/base64',
          'application/octet-stream',
          'text/plain',
          'text/css',
          'text/html',
          'application/javascript'
        ];
      }
    }
  },
  // Open the dialog.
  open: function() {
    this.$.dialog.open();
  },
  // Called the the dialog has been closed
  _onClosed: function(e, detail) {
    if (typeof detail.confirmed !== 'undefined' || this.selected === -1) {
      return;
    }
    this.fire('value-selected', {
      value: this.defaults[this.selected]
    });
  },
  // Handler for change in the Content-Type value. Set's selected index of the default list.
  _valueChanged: function() {
    this.set('selected', this.defaults.indexOf(this.value));
  }
});
})();
