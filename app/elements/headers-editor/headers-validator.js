Polymer({
  is: 'headers-validator',

  behaviors: [ArcBehaviors.HeadersParserBehavior],

  properties: {
    // True when the headers are valid HTTP headers
    valid: {
      type: Boolean,
      value: true,
      notify: true,
      readOnly: true
    },
    // Error message to diplay when the headers are not valid.
    errorMessage: {
      type: String,
      notify: true,
      readOnly: true
    },
    /**
     * A HTTP headers message part as defined in HTTP spec.
     */
    headers: String
  },

  observers: [
    '_headersChanged(headers, isPayload)'
  ],

  _headersChanged: function(headers) {
    var error = this.getHeaderError(headers);
    if (error) {
      this._setValid(false);
      this._setErrorMessage(error);
    } else {
      this._setValid(true);
      this._setErrorMessage(undefined);
    }
  }
});
