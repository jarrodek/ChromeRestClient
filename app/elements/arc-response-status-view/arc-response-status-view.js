'use strict';
/* global arc */
Polymer({
  is: 'arc-response-status-view',
  properties: {
    statusCode: {
      type: Number,
      observer: '_statusCodeChanged'
    },
    statusMessage: String,
    loadingTime: Number,
    requestHeaders: {
      type: Array,
      observer: '_requestHeadersChanged'
    },
    responseHeaders: {
      type: Array,
      observer: '_responseHeadersChanged'
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
  computeStatusClass: function(code) {
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
    if (this.statusCode === 0) {
      this._scdTitle = 'No response';
      this._scdBody = 'The response was empty';
      return;
    }
    arc.app.db.websql.getStatusCode(this.statusCode)
      .then(function(result) {
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
      }.bind(this), function() {
        this._scdTitle = 'Status code: ' + this.statusCode;
        this._scdBody = 'There is no definition for this status code in the application :(';
      }.bind(this));
  },

  showStatusInfo: function() {
    this.$.statusCodeInfo.open();
  },

  _requestHeadersChanged: function() {
    this.requestHeaders.forEach(function(item) {
      item.type = 'request';
    });
  },

  _responseHeadersChanged: function() {
    this.responseHeaders.forEach(function(item) {
      item.type = 'response';
    });
  },
  computeIndexName: function(index) {
    return index + 1;
  },
  _handleLink: function(e) {
    var e2 = Polymer.dom(e);
    e.preventDefault();
    if (e2.rootTarget.nodeName === 'A') {
      this.fire('action-link', {
        link: e2.rootTarget.href
      });
    }
  }
});
