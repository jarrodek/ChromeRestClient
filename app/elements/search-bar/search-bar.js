(function() {
  'use strict';
  Polymer({
    is: 'search-bar',
    behaviors: [
      Polymer.IronOverlayBehavior,
      Polymer.IronResizableBehavior
    ],
    properties: {
      noCancelOnOutsideClick: {
        type: Boolean,
        value: true
      },
      // Current text search value
      value: {
        type: String,
        value: '',
        notify: true
      }
    },

    observers: [
      '_searchOpened(opened)',
      '_valueChanged(value)'
    ],

    _searchOpened: function(opened) {
      var value = null;
      if (opened) {
        value = this.value;
      }
      this.fire('iron-signal', {
        name: 'text-search-opened-changed',
        data: value
      });
    },

    _valueChanged: function(value) {
      this.fire('iron-signal', {
        name: 'text-search',
        data: value
      });
    }
  });
})();
