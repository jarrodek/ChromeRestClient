(function() {
  'use strict';
  Polymer({
    is: 'response-history-saver',
    /**
     * 1) Check if object exissts as a history object. If identical object exists,
     * override it (update time). If not create new hostory object.
     *
     * 2) Insert new hostory data object to the datastore.
     */
    saveHistory: function(request, response) {
      return this._saveHistoryData(request, response)
      .then(() => this._updateHistory(request, response));
    },

    _saveHistoryData: function(req, res) {
      var responseHeaders = '';
      if (res.headers && res.headers.length) {
        responseHeaders = res.headers.map((i) => i.name + ': ' + i.value).join('\n');
      }
      var timings = {
        connect: res.stats.connect || -1,
        receive: res.stats.receive || -1,
        send: res.stats.send || -1,
        ssl: res.stats.ssl || -1,
        wait: res.stats.wait || -1
      };
      var totalTime = 0;
      Object.getOwnPropertyNames(timings).forEach((i) => {
        let t = timings[i];
        if (t !== -1) {
          totalTime += t;
        }
      });
      var _doc = {
        _id: this.$.uuid.generate(),
        headers: req.headers,
        payload: req.payload,
        url: req.url,
        method: req.method,
        timings: timings,
        totalTime: totalTime,
        created: new Date(res.stats.startTime).getTime(),
        response: {
          statusCode: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          payload: res.rawBody
        }
      };
      var db = new PouchDB('history-data');
      return db.put(_doc).then(() => db.close());
    },

    _updateHistory: function(req, res) {
      var rTime = new Date(res.stats.startTime).getTime();
      var k = encodeURIComponent(req.url) + '/' + req.method + '/' + rTime;
      var _doc = {
        _id: k,
        created: rTime,
        headers: req.headers,
        method: req.method,
        payload: req.payload,
        url: req.url
      };
      var db = new PouchDB('history-requests');
      return db.put(_doc).then(() => db.close());
    }
  });
})();
