(function() {
'use strict';

Polymer({
  is: 'arc-response-status-view',
  properties: {
    // A status code part of the status header.
    statusCode: {
      type: Number,
      observer: '_statusCodeChanged'
    },
    // A status message part of the status header.
    statusMessage: String,
    // Calculated loading time.
    loadingTime: Number,
    // An array of the response headers.
    responseHeaders: Array,
    // A headers object of tge request headers
    requestHeaders: Headers,
    // Raw HTTP message sent to the server.
    httpMessage: {
      type: String,
      value: function() {
        return 'Message wasn\'t sent';
      }
    },
    responseError: Object,
    // Calculated to be true if responseError object is set.
    isError: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // Array of the request headers.
    requestHeadersArray: {
      type: Array,
      computed: '_computeRequestHeaders(requestHeaders)'
    },
    // An array of redirect responses.
    redirectData: {
      type: Array,
      value: []
    },
    _scdTitle: String,
    _scdBody: String,
    // Currently selected tab.
    selectedTab: {
      type: Number,
      value: 0
    },
    // HAR timings object to display
    requestTimings: {
      type: Object,
      notify: true
    },
    // Timing of the final response (excluding redirects).
    redirectTimings: {
      type: Array,
      value: function() {
        return [];
      }
    },
    // True if there are redirects data available.
    hasRedirects: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // True if there was a response headers. False when error.
    hasResponseHeaders: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // If true, some tabs are hidden because some data are unavailable in XHR request.
    isXhr: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_selectedTabChanged(selectedTab)',
    '_redirectsChanged(redirectData, redirectTimings)',
    '_computeError(responseError.*)',
    '_checkHttpMessage(httpMessage.*)',
    '_computeHasResponseHeaders(responseHeaders)',
    '_errorChanged(isError)',
    '_errorChanged(isXhr)'
  ],

  attached: function() {
    this._checkHttpMessage();
  },

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

  _errorChanged: function() {
    this.$.tabs.notifyResize();
    this.selectedTab = 0;
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
    var reqErr = this.statusMessage === 'Request error';
    if (!this.statusCode || reqErr) {
      this._scdTitle = 'No response';
      this._scdBody = 'The response was empty';
      if (reqErr) {
        this.statusCode = 0;
      }
      return;
    }
    this.$.statusModel.objectId = this.statusCode;
    this.$.statusModel.query();
  },

  _onStatusInfoReady: function(e) {
    var result = e.detail.data;
    // console.log(result);
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
  },

  _redirectsChanged: function(redirectData) {
    var has =  !!(redirectData && redirectData.length);
    this._setHasRedirects(has);
  },

  _computeError: function() {
    var re = this.responseError;
    if (typeof re === 'function') {
      // Regular Response object has error() function.
      this._setIsError(false);
      return;
    }
    this._setIsError(!!re);
  },

  _checkHttpMessage: function() {
    // console.log('aaaaaaaaaaaaaaaaaaaaaa');
    if (!!this.httpMessage) {
      return;
    }
    this.set('httpMessage', 'Message wasn\'t sent');
  },

  _computeHasResponseHeaders: function(responseHeaders) {
    var res = responseHeaders && responseHeaders.length;
    this._setHasResponseHeaders(res);
  },

  _computeBageClass: function(cnt) {
    return cnt === 0 ? 'empty' : '';
  }
});
})();
