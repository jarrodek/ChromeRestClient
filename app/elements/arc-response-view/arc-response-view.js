(function() {
Polymer({
  is: 'arc-response-view',
  properties: {
    response: Object,
    request: Object,
    loadingTime: {
      type: Number,
      readOnly: true,
      notify: true,
      computed: '_computeLoadingTime(response)'
    },
    // true if can show response payload editor
    hasResponse: {
      type: Boolean,
      value: true,
      readOnly: true
    },
    isError: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    _statusText: {
      type: String,
      computed: '_computeStatusText(response)'
    }
  },

  observers: [
    '_requestMethodChanged(request.method)',
    '_responseChanged(response)'
  ],

  _computeStatusText: function(response) {
    if (!response) {
      return;
    }
    if (!response.statusText) {
      return;
    }
    /* global escape */
    return decodeURIComponent(escape(response.statusText));
  },

  _requestMethodChanged: function(newMethod) {
    if (newMethod && newMethod === 'HEAD') {
      this._setHasResponse(false);
    } else {
      this._setHasResponse(true);
    }
  },

  _responseChanged: function(response) {
    if (response && response.error && typeof response.error !== 'function') {
      this._setIsError(true);
    } else {
      this._setIsError(false);
    }
  },

  _computeLoadingTime: function(response) {
    if (!response) {
      return 0;
    }
    var stats = response.stats;
    if (!stats) {
      return 0;
    }
    var value = 0;
    if (stats.connect) {
      value += stats.connect;
    }
    if (stats.receive) {
      value += stats.receive;
    }
    if (stats.send) {
      value += stats.send;
    }
    if (stats.ssl) {
      value += stats.ssl;
    }
    if (stats.wait) {
      value += stats.wait;
    }
    return Math.round(value);
  },

  _computeRedirectTimings: function(redirects) {
    if (!redirects || redirects.length === 0) {
      return [];
    }
    var timings = [];
    redirects.forEach((r) => timings.push(r.stats));
    return timings;
  }
});
})();
