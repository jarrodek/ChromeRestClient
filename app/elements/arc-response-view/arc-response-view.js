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
    }
  },

  observers: [
    '_requestMethodChanged(request.method)'
  ],

  _requestMethodChanged: function(newMethod) {
    if (newMethod && newMethod === 'HEAD') {
      this._setHasResponse(false);
    } else {
      this._setHasResponse(true);
    }
  },

  _computeLoadingTime: function(response) {
    if (!response) {
      return 0;
    }
    var stats = response.stats;
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
