(function() {
  'use strict';
  Polymer({
    is: 'response-history-saver',

    behaviors: [FileBehaviors.WebFilesystemBehavior],
    /**
     * 1) Check if object exissts as a history object. If identical object exists,
     * override it (update time). If not create new hostory object.
     *
     * 2) Insert new hostory data object to the datastore.
     */
    saveHistory: function(request, response) {
      return this._preparePayload(request)
      .catch(() => '')
      .then((payload) => {
        request.payload = payload;
      })
      .then(() => this._saveHistoryData(request, response))
      .then(() => this._updateHistory(request, response));
    },

    _preparePayload: function(request) {
      if (request.payload instanceof MultipartFormData) {
        return request.payload.generateMessage();
      } else if (request.payload instanceof Blob) {
        return this._readBlob(request.payload);
      }
      return Promise.resolve(request.payload);
    },

    _readBlob: function(blob) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function(e) {
          resolve(e.target.result);
        };
        reader.onerror = function() {
          reject(new Error('Unable to read blob.'));
        };
        reader.readAsArrayBuffer(blob);
      });
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
      // ID generation, see arc.app.importer._processHar for details.
      let url;
      try {
        url = new URL(req.url);
        url.search = '';
        url.hash = '';
        url = url.toString();
      } catch (e) {
        let i = req.url.indexOf('?');
        if (i !== -1) {
          url = req.url.substr(0, i);
        } else {
          url = req.url;
        }
      }

      let payload = req.payload;
      let requestPayloadSize;

      if (payload instanceof ArrayBuffer) {
        requestPayloadSize = payload.byteLength;
        let enc = new TextDecoder();
        payload = enc.decode(payload);
      } else if (payload instanceof Blob) {
        requestPayloadSize = payload.size;
        payload = '[file data]';
      } else {
        requestPayloadSize = arc.app.utils.calculateBytes(req.payload);
      }

      let id = encodeURIComponent(url) + '/' + req.method + '/' + this.$.uuid.generate();
      // Add some data size calculations
      let responseHeadersSize = arc.app.utils.calculateBytes(responseHeaders);
      let responsePayloadSize = arc.app.utils.calculateBytes(res.rawBody);
      let requestHeadersSize = arc.app.utils.calculateBytes(req.headers);
      var _doc = {
        _id: id,
        timings: timings,
        totalTime: totalTime,
        created: new Date(res.stats.startTime).getTime(),
        request: {
          headers: req.headers,
          payload: req.payload,
          url: req.url,
          method: req.method,
        },
        response: {
          statusCode: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
          payload: res.rawBody
        },
        stats: {
          request: {
            headersSize: requestHeadersSize,
            payloadSize: requestPayloadSize
          },
          response: {
            headersSize: responseHeadersSize,
            payloadSize: responsePayloadSize
          }
        }
      };
      var db = new PouchDB('history-data');
      return db.put(_doc)
      .then(() => console.info('History data saved'))
      .catch((e) => {
        console.error('Response history saver error (data)', e);
      });
    },

    _updateHistory: function(req, res) {
      if (!res.stats.startTime) {
        res.stats.startTime = Date.now();
      }
      var rTime = new Date(res.stats.startTime).getTime();
      var today = this._getDayToday(rTime);
      var k = today + '/' + encodeURIComponent(req.url) + '/' + req.method;

      var formData;
      if (req.formData && req.formData.length) {
        formData = req.formData.map((item) => {
          if (item.file) {
            item.value = [];
          }
          return item;
        });
      }

      var file;
      if (req.payload instanceof ArrayBuffer) {
        file = new Blob([req.payload]);
        req.payload = '';
      } else if (req.payload instanceof Blob) {
        file = req.payload;
        req.payload = '';
      }

      if (file) {
        req.bodyFile = this.$.uuid.generate();
      }

      return this._writeHistoryItem(k, req, rTime, formData)
      .then(() => {
        if (!file) {
          return;
        }
        this.filename = req.bodyFile;
        this.content = file;
        this.write();
      });
    },

    _writeHistoryItem: function(key, request, time, formData) {
      var db = new PouchDB('history-requests');
      return db.get(key)
      .then((r) => {
        //cookie: test=${authToken}
        r.headers = request.headers;
        r.method = request.method;
        r.payload = request.payload;
        r.formData = formData;
        r.bodyFile = request.bodyFile;
        r.url = request.url;
        r.updated = time;
        return db.put(r)
        .then((insertResult) => {
          r._rev = insertResult.rev;
          this.fire('history-object-changed', {
            id: r._id,
            rev: r._rev,
            item: r
          });
        });
      }).catch((e) => {
        if (e.status !== 404) {
          throw e;
        }
        let _doc = {
          _id: key,
          created: time,
          updated: time,
          headers: request.headers,
          method: request.method,
          payload: request.payload,
          url: request.url,
          formData: formData,
          bodyFile: request.bodyFile
        };
        return db.put(_doc)
        .then((insertResult) => {
          _doc._rev = insertResult.rev;
          this.fire('history-object-changed', {
            id: _doc._id,
            rev: _doc._rev,
            item: _doc
          });
        });
      })
      .catch((e) => {
        console.error('Response history saver error (history)', e);
      });
    },

    /**
     * Setss hours, minutes, seconds and ms to 0 and returns timestamp.
     *
     * @return {Number} Timestamp to the day.
     */
    _getDayToday: function(timestamp) {
      var d = new Date(timestamp);
      var tCheck = d.getTime();
      if (tCheck !== tCheck) {
        throw new Error('Invalid timestamp: ' + timestamp);
      }
      d.setMilliseconds(0);
      d.setSeconds(0);
      d.setMinutes(0);
      d.setHours(0);
      return d.getTime();
    }
  });
})();
