(function() {
'use strict';
Polymer({
  is: 'text-form-item',

  behaviors: [ArcBehaviors.ArcPayloadFormItemBehavior],

  properties: {
    /**
     * Reference to the mime type input
     */
    _mimeInput: {
      type: HTMLElement,
      value: function() {
        return this.$.mimeInput;
      }
    },
    // A content type of the form field to be presented in the Multipart request.
    contentType: {
      type: String,
      notify: true
    },
    // List of suggested mime types
    suggestions: {
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

  _getValidity: function() {
    return !!(this.name && this.value && this.mimeType);
  }
});
})();
