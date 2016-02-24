'use strict';

Polymer({
  is: 'method-selector',
  properties: {
    method: {
      type: String,
      value: 'GET',
      notify: true
    },
    isPayload: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true,
      reflectToAttribute: true,
      computed: '_computeIsPayload(method)'
    },

    contentType: {
      type: String,
      notify: true
    }
  },

  _computeIsPayload: function(method) {
    return ['GET', 'HEAD'].indexOf(method) === -1;
  }

});
