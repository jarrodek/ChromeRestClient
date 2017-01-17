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
    },
    // True if the collapsable element is opened
    opened: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_redirectsChanged(redirectData, redirectTimings)',
    '_computeError(responseError.*)',
    '_checkHttpMessage(httpMessage.*)',
    '_computeHasResponseHeaders(responseHeaders)',
    '_errorChanged(isError)',
    '_errorChanged(isXhr)'
  ],

  attached: function() {
    this._checkHttpMessage();
    if (this.statusCode) {
      this._statusCodeChanged();
    }
  },

  _errorChanged: function() {
    this.selectedTab = 0;
  },

  _computeStatusClass: function(code) {
    var cls = 'status-code-value';
    if (code >= 500 || code === 0) {
      cls += ' error';
    }
    if (code >= 400 && code < 500) {
      cls += ' warning';
    }
    if (code >= 300 && code < 400) {
      cls += ' info';
    }
    return cls;
  },
  _statusCodeChanged: function() {
    var reqErr = this.statusMessage === 'Request error';
    if (!this.statusCode || reqErr) {
      if (reqErr) {
        this.statusCode = 0;
      }
      return;
    }
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
      this.fire('send-analytics', {
        type: 'event',
        category: 'Response status',
        action: 'Link change',
        label: 'From response headers'
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
  },

  _computeRequestHeaders: function(requestHeaders) {
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
    return cnt === 0 ? 'badge empty' : 'badge';
  },

  _roundTime: function(num) {
    num = Number(num);
    if (num !== num) {
      return '';
    }
    return num.toFixed(2);
  },
  // Toggles collapsable element.
  toggleCollapse: function() {
    this.opened = !this.opened;
  },
  // Computes class for the toggle's button icon.
  _computeToggleIconClass: function(opened) {
    var clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  }
});
})();
