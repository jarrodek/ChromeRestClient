'use strict';

Polymer({
  is: 'arc-header-value-display-view',
  properties: {
    /**
     * Header value to display
     */
    value: {
      type: String,
      observer: '_valueChanged'
    }
  },
  _valueChanged: function() {
    this.$.display.innerHTML = arc.app.utils.autoLink(arc.app.utils.encodeHtml(this.value));
  }
});
