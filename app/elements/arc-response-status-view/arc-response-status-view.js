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
    httpMessage: String,
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
    timings: Object,
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

    requestTotalTime: {
      type: Number,
      value: 0,
      readOnly: true
    }
  },

  observers: [
    '_selectedTabChanged(selectedTab)',
    '_redirectsChanged(redirectData, redirectTimings)',
    '_computeRequestTime(redirectTimings, timings)'
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
  },

  _redirectsChanged: function(redirectData) {
    var has =  !!(redirectData && redirectData.length);
    this._setHasRedirects(has);
  },

  _computeRequestTime: function(redirectTimings, timings) {
    var time = 0;
    if (!!redirectTimings && redirectTimings.length) {
      redirectTimings.forEach((timing) => time += this._computeHarTime(timing));
    }
    time += this._computeHarTime(timings);
    time = Math.round(time * 1000) / 1000;
    this._setRequestTotalTime(time);
  },

  _computeHarTime: function(har) {
    var fullTime = 0;
    var connect = Number(har.connect);
    var receive = Number(har.receive);
    var send = Number(har.send);
    var wait = Number(har.wait);
    if (connect !== connect || connect < 0) {
      connect = 0;
    }
    if (receive !== receive || receive < 0) {
      receive = 0;
    }
    if (send !== send || send < 0) {
      send = 0;
    }
    if (wait !== wait || wait < 0) {
      wait = 0;
    }
    fullTime += connect + receive + send + wait;
    return fullTime;
  }
});
})();
