Polymer({
  is: 'request-timings-panel',
  properties: {
    // If true will show redirects details
    hasRedirects: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // True if filan request timings are available.
    hasTimings: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    /**
     * An array of HAR's timings object.
     * It should be ordered by redirection occurance.
     */
    redirectTimings: {
      type: Array,
      value: function() {
        return {};
      }
    },
    // The request / response HAR timings.
    requestTimings: {
      type: Object,
      value: function() {
        return {};
      }
    },
    /**
     * Calculated total request time.
     */
    requestTotalTime: {
      type: Number,
      value: 0,
      readOnly: true
    }
  },

  observers: [
    '_redirectsChanged(redirectTimings.*)',
    '_requestTimingsChanged(requestTimings.*)',
    '_computeRequestTime(redirectTimings)',
    '_computeRequestTime(requestTimings)'
  ],

  _redirectsChanged: function() {
    var rt = this.redirectTimings;
    if (!rt || !rt.length) {
      this._setHasRedirects(false);
    } else {
      this._setHasRedirects(true);
    }
  },

  _requestTimingsChanged: function() {
    var rt = this.requestTimings;
    if (!rt) {
      this._setHasTimings(false);
    } else {
      this._setHasTimings(true);
    }
  },

  _computeIndexName: function(index) {
    return index + 1;
  },

  _computeRequestTime: function() {
    var rt = this.redirectTimings;
    var timings = this.requestTimings;
    var time = 0;
    if (!!rt && rt.length) {
      rt.forEach((timing) => time += this._computeHarTime(timing));
    }
    var add = this._computeHarTime(timings);
    if (add) {
      time += add;
    }
    time = Math.round(time * 10000) / 10000;
    this._setRequestTotalTime(time);
  },

  _computeHarTime: function(har) {
    var fullTime = 0;
    if (!har) {
      return fullTime;
    }
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
