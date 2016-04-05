(function() {
'use strict';

Polymer({
  is: 'method-selector',
  properties: {
    // Currently selected HTTP method
    method: {
      type: String,
      value: 'GET',
      notify: true
    },
    // True if the request for selected HTTP method can carry a payload. It is defined in HTTP spec.
    isPayload: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true,
      reflectToAttribute: true,
      computed: '_computeIsPayload(method)'
    },
    // Current content type header.
    contentType: {
      type: String,
      notify: true
    }
  },

  // observers: [
  //   '_ensureContentType(isPayload)'
  // ],

  // _ensureContentType: function(isPayload) {
  //   if (isPayload && !this.contentType) {
  //     this.set('contentType', 'application/json');
  //   }
  // }

  // Compute if the tayload can carry a payload.
  _computeIsPayload: function(method) {
    return ['GET', 'HEAD'].indexOf(method) === -1;
  }
});
})();
