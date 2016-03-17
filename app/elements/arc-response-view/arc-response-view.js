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
  }
});
