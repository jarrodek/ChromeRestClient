(function() {
  'use strict';

  Polymer({
    is: 'js-max-number-error',
    properties: {
      expectedNumber: {
        type: String,
        value: '[unknown]'
      }
    },

    toggle: function() {
      this.$.collapse.toggle();
    }
  });
})();
