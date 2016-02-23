'use strict';

Polymer({
  is: 'arc-request-view',
  properties: {
    opened: {
      type: Boolean,
      observer: '_requestChanged'
    },
    request: {
      type: Object
    },
    /**
     * A value used by the URL editor widget.
     * It will not directly assign url value to the request object.
     * It must be done via observer.
     */
    masterUrl: {
      type: String,
      observer: '_masterUrlChanged'
    }
  },

  observers: [
    '_requestChanged(request.*)'
  ],

  _requestChanged: function() {
    if (!this.opened) {
      return;
    }
    var value = this.request ? this.request.url : undefined;
    this.set('masterUrl', value);
    console.log('_requestChanged');
  },

  _masterUrlChanged: function() {
    if (!this.opened) {
      return;
    }
    if (this.request.url === this.masterUrl) {
      return;
    }
    if (this.request.har) {
      this.request.har.entries[0].request.url = this.masterUrl;
    }
    this.set('request.url', this.masterUrl);
    console.log('_masterUrlChanged', this.masterUrl);
  }
});
