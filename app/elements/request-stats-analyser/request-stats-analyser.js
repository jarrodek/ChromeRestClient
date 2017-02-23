(function() {
  'use strict';
  /**
   * The request history analyser.
   * It takes all available history data for given URL and HTTP method and computes
   * stats for this request.
   */
  Polymer({
    is: 'request-stats-analyser',

    properties: {
      url: String,
      method: String,
      request: Object,
      response: Object,
      analysing: {
        type: Boolean,
        readOnly: true,
        notify: true
      },
      /**
       * A map of calculated medians.
       * - totalTime - Median for request total time
       * - sentTime - Median for sending time
       * - ttfb
       * - receivingTime
       * - connectTime
       * - requestBody - Median for request body size
       * - requestHeaders - Median for request headers size
       * - responseBody - Median for response body size
       * - responseHeaders - Median for response headers size
       */
      medians: {
        type: Object,
        notify: true,
        value: function() {
          return {};
        }
      },
      /**
       * Map of time related data.
       * Data are sorted according to object's created property.
       * - totals - List of total load times
       * - ttfb - List of time to first byte times
       * - sents - List of sent message times
       * - receiveds - List of time to receive message times
       * - connects - List of connection times
       * - labels - chart labels for data. Labets are dates and time strings.
       */
      times: {
        type: Object,
        notify: true,
        value: function() {
          return {};
        }
      },
      /**
       * Map of calculated data sizes transmited from / to client.
       * It contains two properties: request and response.
       * Both properties contains:
       * - body - List of sizes of payload
       * - headers - List of sizes of headers
       * - bLabels - Payload lables for charts
       * - hLabels - Headers lables for charts
       */
      sizes: {
        type: Object,
        notify: true,
        value: function() {
          return {
            request: {},
            response: {}
          };
        }
      },
      // Status codes in `labels` array and number of occurence in `values` array
      statuses: {
        type: Object,
        notify: true,
        value: function() {
          return {
            labels: [],
            values: []
          };
        }
      },
      /**
       * Flags to tell if data has values.
       * Object structure is combined `times` and `sizes` into one object (with this
       * property names as keys) but value is a Boolean determinig if given position has data.
       */
      presence: {
        type: Object,
        notify: true,
        value: function() {
          return {
            times: {
              totals: false
            },
            sizes: {
              request: {
                body: false,
                headers: false
              },
              response: {
                body: false,
                headers: false
              }
            }
          };
        }
      },
      // True if after computation any data are set.
      hasAnyData: {
        type: Boolean,
        notify: true,
        value: false,
        computed: '_hasAnyData(presence.times.totals, presence.sizes.request.body, ' +
          'presence.sizes.request.headers, presence.sizes.response.body, ' +
          'presence.sizes.response.headers)'
      },

      /**
       * A handler for a storage change event.
       *
       * @type {Function}
       */
      _storageObserver: {
        type: Function,
        value: function() {
          return this._onStorageChanged.bind(this);
        }
      },
      // True if the API assistant is enabled, false otherwise. If disabled this element do nothing
      enabled: {
        type: Boolean,
        notify: true,
        observer: '_enabledChanged'
      }
    },

    observers: [
      '_autoAnalyseData(enabled, url, method)',
      '_responseChanged(enabled, response.*)'
    ],

    ready: function() {
      arc.app.settings.getConfig()
      .then((values) => {
        this.set('enabled', values.apiAssistant);
      });
      chrome.storage.onChanged.addListener(this._storageObserver);
    },

    /**
     * A callback called when the value of any storage change.
     * This view should handle external changes to the store.
     */
    _onStorageChanged: function(changes) {
      if (!('apiAssistant' in changes)) {
        return;
      }
      this.set('enabled', changes.apiAssistant.newValue);
    },

    _enabledChanged: function(enabled) {
      if (!enabled) {
        this.clear();
      }
    },

    _hasArrayData: function(arr) {
      return !!(arr.base && arr.base.length);
    },

    _hasAnyData: function() {
      var t = Array.from(arguments);
      return t.some((i) => i === true);
    },

    _autoAnalyseData: function(enabled, a, b) {
      if (!enabled) {
        return;
      }
      this.debounce('history-analyser', () => {
        this.analyseData(a, b);
      }, 1000);
    },

    clear: function() {
      this.set('medians', {});
      this.set('times', {});
      this.set('sizes', {
        request: {},
        response: {}
      });
      this.set('statuses', {
        labels: [],
        values: []
      });
      this.set('presence', {
        times: {
          totals: false
        },
        sizes: {
          request: {
            body: false,
            headers: false
          },
          response: {
            body: false,
            headers: false
          }
        }
      });
    },

    analyseData: function(url, method) {
      url = url || this.url;
      method = method || this.method;
      if (!url || !method) {
        this.clear();
        return;
      }
      this._setAnalysing(true);
      let uri;
      try {
        uri = new URL(url);
        uri.search = '';
        uri.hash = '';
        uri = uri.toString();
      } catch (e) {
        let i = url.indexOf('?');
        if (i !== -1) {
          uri = url.substr(0, i);
        } else {
          uri = url;
        }
      }
      // if (uri[uri.length - 1] === '/') {
      //   uri = uri.substr(0, uri.length - 1);
      // }
      // console.log('Running worker for ', url, method);
      this.startTime = performance.now();
      this._getHistoryData(uri, method);
    },
    // Creates a worker (if needed) and gets data from the indexedDB.
    _getHistoryData: function(url, method) {

      var post = {
        url: url,
        method: method
      };
      if (this._collectorWorker) {
        return this._collectorWorker.postMessage(post);
      }
      var blob = new Blob([this.$.dataCollectionWorker.textContent]);
      this._collectorWorkerUrl = window.URL.createObjectURL(blob);
      this._collectorWorker = new Worker(this._collectorWorkerUrl);
      this._collectorWorker.onmessage = this._processCollectorData.bind(this);
      this._collectorWorker.onerror = this._processCollectorError.bind(this);
      this._collectorWorker.postMessage(post);
    },
    // Process data returned from the collector worker.
    _processCollectorData: function(e) {
      // console.info('Data collection time: ', e.data.time);
      var list = e.data.data;
      if (!list || !list.length) {
        this._setAnalysing(false);
        this.clear();
        // console.info('No data found');
        return;
      }
      this._processRawData(list);
    },
    // Collector worker error ocurred.
    _processCollectorError: function(e) {
      this.fire('app-log', {
        level: 'error',
        message: ['Collecting history data error', e]
      });
      this._setAnalysing(false);
      this.fire('send-analytics', {
        type: 'exception',
        description: e.message,
        fatal: false
      });
      this.clear();
    },
    // Process raw history data
    _processRawData: function(docs) {
      if (this._worker) {
        return this._worker.postMessage(docs);
      }
      var blob = new Blob([this.$.worker.textContent]);
      this._workerUrl = window.URL.createObjectURL(blob);
      this._worker = new Worker(this._workerUrl);
      this._worker.onmessage = this._processAnalysedData.bind(this);
      this._worker.onerror = this._processAnalyserError.bind(this);
      this._worker.postMessage(docs);
    },
    // Process data that has been already analysed
    _processAnalysedData: function(e) {
      var data = e.data;
      this.set('medians', data.medians);
      this.set('times', data.times);
      this.set('sizes', data.sizes);
      this.set('statuses', data.statuses);
      this.set('presence', data.presence);
      this._setAnalysing(false);
      this.fire('request-stats-analysed');

      var execTime = performance.now() - this.startTime;
      // console.info('Processing history data time', execTime);

      this.fire('send-analytics', {
        type: 'timing',
        category: 'History assistant',
        variable: 'Analysing history',
        value: execTime
      });
    },
    // There was an error in data analyser.
    _processAnalyserError: function(e) {
      this.fire('app-log', {
        level: 'error',
        message: ['Analysing history data error', e]
      });
      this._setAnalysing(false);
      this.clear();
    },
    /**
     * Calculate a median from the array of numbers.
     */
    calculateMedian: function(arr) {
      if (!arr || arr.length === 0) {
        return 0;
      }
      if (arr.length === 1) {
        return Math.round(arr[0]);
      }
      var copy = arr.slice(0).sort(function(a, b) {
        return a - b;
      });
      var half = Math.floor(copy.length / 2);
      if (copy.length % 2 === 0) {
        // If there is an even number of results,
        // the median will be the mean of the two central numbers.
        return Math.round((copy[half - 1] + copy[half]) / 2.0);
      }
      // If there is an odd number of results, the median is the middle number.
      return Math.round(copy[half]);
    },

    _responseChanged: function(enabled) {
      if (!enabled) {
        return;
      }
      if (!this.response || !this.response.stats) {
        // not ready.
        return;
      }
      this._setAnalysing(true);
      var cp = Object.assign({}, this.response);
      delete cp._headers;
      delete cp._body;
      delete cp.ok;
      delete cp.redirects;
      delete cp.statusText;
      var post = {
        request: {
          headers: this.request.headers,
          payload: this.request.payload
        },
        response: cp
      };
      if (this._responseWorker) {
        return this._responseWorker.postMessage(post);
      }
      var blob = new Blob([this.$.responseProcess.textContent]);
      this._responseWorkerUrl = window.URL.createObjectURL(blob);
      this._responseWorker = new Worker(this._responseWorkerUrl);
      this._responseWorker.onmessage = this._processResponseWorkerData.bind(this);
      this._responseWorker.postMessage(post);
    },

    _processResponseWorkerData: function(e) {
      var data = e.data;
      window.requestAnimationFrame(() => {
        try {
          this._computeWorkerData(data);
        } catch (e) {
          this.fire('app-log', {
            message: ['stats-analyser', e]
          });
        }
      });
    },

    _computeWorkerData: function(data) {
      var times = {
        labels: this.times.labels || [],
        totals: this.times.totals || [],
        ttfb: this.times.ttfb || [],
        connects: this.times.connects || [],
        receiveds: this.times.receiveds || [],
        sents: this.times.sents || []
      };
      times.labels.push(data.times.label);
      times.totals.push(data.times.total);
      times.ttfb.push(data.times.ttfb);
      times.connects.push(data.times.connect);
      times.receiveds.push(data.times.received);
      times.sents.push(data.times.sent);

      if (data.times.ssl && (data.times.ssl > -1 || (this.time.ssl && this.time.ssl.length))) {
        if (data.times.ssl === -1) {
          data.times.ssl = 0;
        }
        times.ssl = this.times.ssl || [];
        times.ssl.push(data.times.ssl);
      }

      var medians = {
        total: this.calculateMedian(this.times.totals),
        ttfb: this.calculateMedian(this.times.ttfb),
        sent: this.calculateMedian(this.times.sents),
        receiving: this.calculateMedian(this.times.receiveds),
        connect: this.calculateMedian(this.times.connects),
        ssl: this.calculateMedian(this.times.connects),
        requestBody: this.calculateMedian(this.sizes.request.body),
        requestHeaders: this.calculateMedian(this.sizes.request.headers),
        responseBody: this.calculateMedian(this.sizes.response.body),
        responseHeaders: this.calculateMedian(this.sizes.response.headers)
      };

      this.set('times', times);
      this.set('medians', medians);

      var sizes = {
        request: {
          hLabels: this.sizes.request.hLabels || [],
          headers: this.sizes.request.headers || [],
          bLabels: this.sizes.request.bLabels || [],
          body: this.sizes.request.body || []
        },
        response: {
          hLabels: this.sizes.response.hLabels || [],
          headers: this.sizes.response.headers || [],
          bLabels: this.sizes.response.bLabels || [],
          body: this.sizes.response.body || []
        }
      };
      var hasChanged = false;
      if (data.sizes.request.headers) {
        sizes.request.hLabels.push(data.sizes.request.hLabel);
        sizes.request.headers.push(data.sizes.request.headers);
        hasChanged = true;
      }
      if (data.sizes.request.body) {
        sizes.request.bLabels.push(data.sizes.request.bLabel);
        sizes.request.body.push(data.sizes.request.body);
        hasChanged = true;
      }
      if (data.sizes.response.headers) {
        sizes.response.hLabels.push(data.sizes.response.hLabel);
        sizes.response.headers.push(data.sizes.response.headers);
        hasChanged = true;
      }
      if (data.sizes.response.body) {
        sizes.response.bLabels.push(data.sizes.response.bLabel);
        sizes.response.body.push(data.sizes.response.body);
        hasChanged = true;
      }
      if (hasChanged) {
        this.set('sizes', sizes);
      }

      if (!this.statuses.labels || !this.statuses.labels.length) {
        this.statuses = {
          labels: [],
          values: []
        };
      }
      if (!this.statuses) {
        this.statuses = {
          labels: [],
          values: []
        };
      }
      var currentCode = String(this.response.status);
      var statusIndex = this.statuses.labels.findIndex((i) => i === currentCode);
      if (statusIndex === -1) {
        this.push('statuses.labels', currentCode);
        this.push('statuses.values', 1);
      } else {
        let cnt = this.statuses.values[statusIndex];
        this.set('statuses.values.' + statusIndex, ++cnt);
      }

      this.set('presence', {
        times: {
          totals: !!(this.times.totals && this.times.totals.length),
          ttfb: !!(this.times.ttfb && this.times.ttfb.length),
          sents: !!(this.times.sents && this.times.sents.length),
          receiveds: !!(this.times.receiveds && this.times.receiveds.length),
          connects: !!(this.times.connects && this.times.connects.length),
          labels: !!(this.times.labels && this.times.labels.length),
          ssl: !!(this.times.ssl && this.times.ssl.length),
        },
        sizes: {
          request: {
            body: !!(this.sizes.request.body && this.sizes.request.body.length),
            headers: !!(this.sizes.request.headers && this.sizes.request.headers.length)
          },
          response: {
            body: !!(this.sizes.response.body && this.sizes.response.body.length),
            headers: !!(this.sizes.response.headers && this.sizes.response.headers.length)
          }
        },
        statuses: !!(this.statuses.labels && this.statuses.labels.length)
      });

      this._setAnalysing(false);
      this.fire('request-stats-analysed');
    }
  });
})();
