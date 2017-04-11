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
      .then(() => this._saveHistoryData(request, response))
      .then(() => this._updateHistory(request, response));
    },

    _preparePayload: function(request) {
      if (request.payload instanceof MultipartFormData) {
        return request.payload.generateMessage()
        .then((buffer) => {
          return this._prepareMultipart(request.payload)
          .then((properties) => {
            request.multipart = properties;
            request.payload = buffer;
            return request;
          });
        });
      } else if (request.payload instanceof Blob) {
        return this._readBlob(request.payload)
        .then((blob) => {
          let file = request.payload;
          let fileProperties = {
            name: file.name,
            size: file.size,
            type: file.type
          };
          request.payload = blob;
          request.file = {
            name: this.$.uuid.generate(),
            properties: fileProperties
          };
          return request;
        });
      }
      return Promise.resolve(request);
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

      var file;
      if (!req.multipart && req.payload instanceof ArrayBuffer) {
        file = new Blob([req.payload]);
        req.payload = '';
      } else if (req.payload instanceof Blob) {
        file = req.payload;
        req.payload = '';
      } else if (req.multipart) {
        file = req.multipart.map((arr, i) => {
          let item = arr.data;
          if (!item.isFile) {
            return;
          }
          let buffer = item.buffer;
          delete req.multipart[i].data.buffer;
          return {
            name: item.cacheName,
            buffer: buffer
          };
        })
        .filter((i) => !!i);
        req.payload = '';
      }

      return this._writeHistoryItem(k, req, rTime)
      .then((doc) => {
        if (!file) {
          return;
        }
        if (file instanceof Array) {
          let promises = [];
          file.forEach((i) => {
            promises.push(this._writeCacheFile(i.buffer, i.name, doc._id));
          });
          return Promise.all(promises);
        } else {
          return this._writeCacheFile(file, req.file.name, doc._id);
        }
      });
    },

    _writeCacheFile: function(content, name, dbEntryId) {
      this.filename = name;
      this.content = content;
      this.write();
      return this.writeFileCacheInfo(name, dbEntryId);
    },

    _writeHistoryItem: function(key, request, time) {
      var db = new PouchDB('history-requests');
      return db.get(key)
      .then((_doc) => {
        _doc.headers = request.headers;
        _doc.method = request.method;
        _doc.payload = request.payload;
        _doc.multipart = request.multipart;
        _doc.url = request.url;
        _doc.updated = time;
        _doc.file = request.file;
        return db.put(_doc)
        .then((insertResult) => {
          _doc._rev = insertResult.rev;
          this.fire('history-object-changed', {
            id: _doc._id,
            rev: _doc._rev,
            item: _doc
          });
          return _doc;
        });
      })
      .catch((e) => {
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
          multipart: request.multipart,
          file: request.file
        };
        return db.put(_doc)
        .then((insertResult) => {
          _doc._rev = insertResult.rev;
          this.fire('history-object-changed', {
            id: _doc._id,
            rev: _doc._rev,
            item: _doc
          });
          return _doc;
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
    },

    writeFileCacheInfo: function(fileName, requestId) {
      var db = new PouchDB('file-history-cache');
      db.put({
        _id: encodeURIComponent(requestId) + fileName,
        source: 'history'
      });
    },

    _prepareMultipart: function(multipart) {
      var promises = [];
      for (let item of multipart.entries()) {
        let name = item[0];
        let itemValue = item[1];
        if (itemValue.isFile) {
          let fileValue = itemValue.value;
          if (fileValue instanceof Array) {
            for (let i = 0, len = fileValue.length; i < len; i++) {
              promises.push(this._blobFromMultipart(name, fileValue[i]));
            }
          } else {
            promises.push(this._blobFromMultipart(name, fileValue));
          }
        } else {
          promises.push([name, {
            isFile: false,
            mime: itemValue.mime,
            value: itemValue.value
          }]);
        }
      }
      return Promise.all(promises)
      .then((data) => {
        let result = [];
        data.forEach((item) => {
          result.push({
            name: item[0],
            data: item[1]
          });
        });
        return result;
      });
    },

    _blobFromMultipart: function(fieldName, blob) {
      var result = {
        name: blob.name,
        size: blob.size,
        type: blob.type,
        isFile: true,
        cacheName: this.$.uuid.generate(),
        buffer: blob
      };
      return Promise.resolve([
        fieldName,
        result
      ]);
      // return this._readBlob(blob).
      // then((buffer) => {
      //   result.buffer = buffer;
      //   return [
      //     fieldName,
      //     result
      //   ];
      // });
    }
  });
})();
