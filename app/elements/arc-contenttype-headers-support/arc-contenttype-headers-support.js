(function() {
'use strict';

Polymer({
  is: 'arc-contenttype-headers-support',
  properties: {
    value: {
      type: String,
      overver: '_valueChanged'
    },
    selected: {
      type: Number,
      value: -1
    },
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

  open: function() {
    this.$.dialog.open();
  },

  _onClosed: function(e, detail) {
    if (typeof detail.confirmed !== 'undefined' || this.selected === -1) {
      return;
    }
    this.fire('value-selected', {
      value: this.defaults[this.selected]
    });
  },

  _valueChanged: function() {
    this.set('selected', this.defaults.indexOf(this.value));
  }
});
})();
