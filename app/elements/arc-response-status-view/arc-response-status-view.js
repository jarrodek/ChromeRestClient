(function() {
'use strict';

Polymer({
  is: 'arc-response-status-view',
  properties: {
    statusCode: {
      type: Number,
      observer: '_statusCodeChanged'
    },
    statusMessage: String,
    loadingTime: Number,
    responseHeaders: Array,
    requestHeaders: Headers,
    requestHeadersArray: {
      type: Array,
      computed: '_computeRequestHeaders(requestHeaders)'
    },
    redirectData: {
      type: Array,
      value: []
    },
    _scdTitle: String,
    _scdBody: String,
    selectedTab: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_selectedTabChanged(selectedTab)'
  ],

  _selectedTabChanged: function(selectedTab) {
    var tabName;
    switch (selectedTab) {
      case 0:
        tabName = 'Response headers';
        break;
      case 1:
        tabName = 'Request headers';
        break;
      case 2:
        tabName = 'Redirects';
        break;
    }
    if (this.isAttached) {
      arc.app.analytics.sendEvent('Response status', 'Tab switched', tabName);
    }
  },

  _computeStatusClass: function(code) {
    var cls = 'status-color';
    if (code >= 500 || code === 0) {
      cls += ' error';
    }
    if (code >= 400 && code < 500) {
      cls += ' warning';
    }
    return cls;
  },
  _statusCodeChanged: function() {
    if (!this.statusCode) {
      this._scdTitle = 'No response';
      this._scdBody = 'The response was empty';
      return;
    }
    this.$.statusModel.objectId = this.statusCode;
    this.$.statusModel.query();
  },

  _onStatusInfoReady: function(e) {
    var result = e.detail.data;
    console.log(result);
    if (result && result.label) {
      this._scdTitle = this.statusCode + ': ' + result.label;
    } else {
      this._scdTitle = 'Status code: ' + this.statusCode;
    }
    if (result && result.desc) {
      this._scdBody = result.desc;
    } else {
      this._scdBody = 'There is no definition for this status code in the application :(';
    }
  },

  _onStatusInfoError: function() {
    this._scdTitle = 'Status code: ' + this.statusCode;
    this._scdBody = 'There is no definition for this status code in the application :(';
  },

  showStatusInfo: function() {
    this.$.statusCodeInfo.open();
    arc.app.analytics.sendEvent('Response status', 'Display status info', this.statusCode);
  },
  /** Compute index to 1-based index. */
  _computeIndexName: function(index) {
    return index + 1;
  },
  /** Catch headers link click and send proper event to the listeners. */
  _handleLink: function(e) {
    var e2 = Polymer.dom(e);
    e.preventDefault();
    if (e2.rootTarget.nodeName === 'A') {
      this.fire('action-link-change', {
        url: e2.rootTarget.href
      });
      arc.app.analytics.sendEvent('Response status', 'Link change', 'From response headers');
    }
  },

  _computeRedirectLocation: function(headers) {
    if (!headers) {
      return 'unknown';
    }
    return headers.get('location') || 'unknown';
  },

  _computeRedirectHeaders: function(headers) {
    if (!headers) {
      return [];
    }
    var result = [];
    if (!headers) {
      return result;
    }
    for (let header of headers) {
      result.push({
        name: header[0],
        value: header[1]
      });
    }
    return result;
  },

  _computeRequestHeaders: function(requestHeaders) {
    // console.log(requestHeaders);
    // return [];
    return arc.app.headers.toJSON(requestHeaders);
  }
});
})();
