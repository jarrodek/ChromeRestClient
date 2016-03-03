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
  }
});
