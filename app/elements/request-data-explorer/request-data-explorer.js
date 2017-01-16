(function() {
  'use strict';
  /* global Chart */
  Polymer({
    is: 'request-data-explorer',

    properties: {
      // Sets API assistant state. If false it will display "enable assistant" message.
      assistantEnabled: Boolean,
      opened: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true
      },
      analysing: Boolean,
      // Map of calculated medians.
      medians: Object,
      // Map of time related data.
      times: Object,
      // Map of calculated data sizes transmited from / to client.
      sizes: Object,
      // Flags to tell if data has values.
      presence: Object,
      // Status codes for bar chart.
      statuses: Object,
      // True if after computation any data are set.
      hasAnyData: {
        type: Boolean,
        value: false
      },
      // Common charts options
      commonOptions: {
        type: Object,
        value: function() {
          return {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false,
                gridLines: {
                  display: true
                }
              }]
            },
            // tooltips: {
            //   enabled: false
            // },
            elements: {
              point: {
                radius: 1
              }
            }
          };
        }
      }
    },

    observers: [
      '_hasTotals(opened, presence.times.totals, times.labels, times.totals.length)',
      '_hasTtfb(opened, presence.times.ttfb, times.labels, times.ttfb.length)',
      '_hasConnects(opened, presence.times.connects, times.labels, times.connects.length)',
      '_hasSsl(opened, presence.times.ssl, times.labels, times.ssl.length)',
      '_hasSents(opened, presence.times.sents, times.labels, times.sents.length)',
      '_hasReceivings(opened, presence.times.receiveds, times.labels, times.receiveds.length)',
      '_hasRequestBody(opened, presence.sizes.request.body, sizes.request.bLabels, ' +
        'sizes.request.body.length)',
      '_hasResponseBody(opened, presence.sizes.response.body, sizes.response.bLabels, ' +
        'sizes.response.body.length)',
      '_hasRequestHeaders(opened, presence.sizes.request.headers, sizes.request.hLabels, ' +
        'sizes.request.headers.length)',
      '_hasResponseHeaders(opened, presence.sizes.response.headers, sizes.response.hLabels, ' +
        'sizes.response.headers.length)',
      '_hasStatuses(opened, presence.statuses, statuses.labels.length)'
    ],

    _hasTotals: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('totalTimes', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('totalTimes', hasData, labels, this.times.totals);
      }, 400);
    },
    _hasTtfb: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('timeToFirstByte', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('timeToFirstByte', hasData, labels, this.times.ttfb);
      }, 700);
    },
    _hasConnects: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('connectTime', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('connectTime', hasData, labels, this.times.connects);
      }, 1000);
    },
    _hasSsl: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('sslTime', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('sslTime', hasData, labels, this.times.ssl);
      }, 1300);
    },
    _hasSents: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('sendTime', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('sendTime', hasData, labels, this.times.sents);
      }, 1600);
    },
    _hasReceivings: function(opened, hasData, labels) {
      if (!opened) {
        this._updateTimeChart('receivingTime', true, [], []);
        return;
      }
      this.async(function() {
        this._updateTimeChart('receivingTime', hasData, labels, this.times.receiveds);
      }, 1900);
    },

    _hasRequestBody: function(opened, hasData, labels) {
      if (!opened) {
        this._updateSizeChart('requestPayloadSizes', true, [], [], true);
        return;
      }
      this.async(function() {
        this._updateSizeChart('requestPayloadSizes', hasData, labels, this.sizes.request.body,
          true);
      }, 2200);
    },

    _hasResponseBody: function(opened, hasData, labels) {
      if (!opened) {
        this._updateSizeChart('responsePayloadSizes', true, [], [], true);
        return;
      }
      this.async(function() {
        this._updateSizeChart('responsePayloadSizes', hasData, labels, this.sizes.response.body,
          false);
      }, 2500);

    },

    _hasRequestHeaders: function(opened, hasData, labels) {
      if (!opened) {
        this._updateSizeChart('requestHeaderSizes', true, [], [], true);
        return;
      }
      this.async(function() {
        this._updateSizeChart('requestHeaderSizes', hasData, labels, this.sizes.request.headers,
          true);
      }, 2800);
    },

    _hasResponseHeaders: function(opened, hasData, labels) {
      if (!opened) {
        this._updateSizeChart('responseHeaderSizes', true, [], [], true);
        return;
      }
      this.async(function() {
        this._updateSizeChart('responseHeaderSizes', hasData, labels, this.sizes.response.headers,
          false);
      }, 3100);
    },

    _updateTimeChart: function(name, hasData, labels, arr) {
      if (!hasData || !labels || !labels.length || !arr || !arr.length) {
        return;
      }
      var chartName = name + 'Chart';
      var chart = this[chartName];
      if (chart) {
        chart.data.datasets[0].data = arr;
        chart.data.labels = labels;
        chart.update();
        return;
      }
      this[chartName] = new Chart(this.$[name], {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            lineTension: 0.1,
            backgroundColor: 'rgba(33, 150, 243,0.4)',
            borderColor: 'rgba(33, 150, 243,1)',
            borderCapStyle: 'butt',
            data: arr
          }]
        },
        options: this.commonOptions
      });
    },

    _updateSizeChart: function(name, hasData, labels, arr, request) {
      if (!hasData || !labels || !labels.length || !arr || !arr.length) {
        return;
      }
      var chartName = name + 'Chart';
      var chart = this[chartName];
      if (chart) {
        chart.data.datasets[0].data = arr;
        chart.data.labels = labels;
        chart.update();
        return;
      }

      this[chartName] = new Chart(this.$[name], {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            lineTension: 0.1,
            backgroundColor: request ? 'rgba(56, 142, 60, 0.4)' : 'rgba(230, 74, 25, 0.4)',
            borderColor: request ? 'rgba(56, 142, 60, 1)' : 'rgba(230, 74, 25, 1)',
            borderCapStyle: 'butt',
            data: arr
          }]
        },
        options: this.commonOptions
      });
    },

    _hasStatuses: function(hasStatuses, length) {
      if (!hasStatuses || !length) {
        return;
      }
      var labels = this.statuses.labels.map((i) => String(i));
      var chartName = 'statusesChart';
      var chart = this[chartName];
      if (chart) {
        chart.data.datasets[0].data = this.statuses.values;
        chart.data.labels = labels;
        chart.update();
        return;
      }

      var bgs = [];
      var borders = [];
      labels.forEach((i) => {
        let _i = Number(i);
        if (_i < 200) {
          bgs[bgs.length] = 'rgba(97, 97, 97, 0.4)';
          borders[borders.length] = 'rgba(97, 97, 97, 1)';
        } else if (_i >= 200 && _i < 300) {
          bgs[bgs.length] = 'rgba(56, 142, 60, 0.4)';
          borders[borders.length] = 'rgba(56, 142, 60, 1)';
        } else if (_i >= 300 && _i < 400) {
          bgs[bgs.length] = 'rgba(25, 118, 210, 0.4)';
          borders[borders.length] = 'rgba(25, 118, 210, 1)';
        } else if (_i >= 400 && _i < 500) {
          bgs[bgs.length] = 'rgba(245, 124, 0, 0.4)';
          borders[borders.length] = 'rgba(245, 124, 0, 1)';
        } else {
          bgs[bgs.length] = 'rgba(211, 47, 47, 0.4)';
          borders[borders.length] = 'rgba(211, 47, 47, 1)';
        }
      });
      var data = {
        labels: labels,
        datasets: [{
          label: 'Status codes',
          backgroundColor: bgs,
          borderColor: borders,
          borderWidth: 1,
          data: this.statuses.values
        }]
      };

      this[chartName] = new Chart(this.$.statusesChart, {
        type: 'bar',
        data: data,
        options: {
          legend: {
            display: false
          }
        }
      });
    },

    _headerTransformed: function(e) {
      var value = e.detail.top + 'px';
      var style = Polymer.dom(this).node.style;
      style.setProperty('top', value);
      this.$.bottomMargin.style.height = (32 + e.detail.top) + 'px';
    },

    _close: function() {
      this.opened = false;
    },

    _enableAssistant: function() {
      arc.app.settings.saveConfig('apiAssistant', true);
    }
  });
})();
