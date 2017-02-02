(function() {
'use strict';

Polymer({
  is: 'arc-socket-request',
  properties: {
    request: Object,
    connection: Object
  },

  clear: function() {
    this.connection = undefined;
    this.request = undefined;
  },

  run: function() {
    this._getRequestTimeout()
    .then((timeout) => {
      return this._prepareRequest({
        timeout: timeout
      });
    })
    .catch((e) => {
      this.fire('error', {
        message: e.message
      });
      return null;
    })
    .then((init) => {
      if (!init) {
        this.fire('error', {
          message: 'The request object could not be initialized'
        });
        return null;
      }
      this.connection = new SocketFetch(this.request.url, init);
      this.connection.addEventListener('firstbyte', (e) => {
        this.fire('request-first-byte-received', e.detail);
      });
      this.connection.addEventListener('loadend', (e) => {
        this.fire('request-load-end', e.detail);
      });
      this.connection.addEventListener('sendheaders', (e) => {
        this.fire('request-headers-sent', e.detail);
      });
      try {
        return this.connection.fetch()
        .then((response) => {
          window.requestAnimationFrame(() => {
            this._processResponse(response);
          });

        });
      } catch (e) {
        this.fire('app-log', {
          'message': ['Error during fetch.', e],
          'level': 'error'
        });
        this.fire('error', {
          message: e.message
        });
        return null;
      }
    })
    .catch((cause) => {
      this.fire('app-log', {
        'message': ['Error during fetch.', cause],
        'level': 'error'
      });
      this.fire('error', {
        message: cause
      });
    });
  },
  // Get default timeout for the request from sync storage.
  _getRequestTimeout: function() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({'requestDefaultTimeout': 30}, (r) => {
        let t = Number(r.requestDefaultTimeout);
        if (t !== t) {
          t = 0;
        }
        let result = t * 1000; //to miliseconds.
        resolve(result);
      });
    });
  },

  _prepareRequest: function(opts) {
    var init = {};
    if (this.request.method) {
      init.method = this.request.method;
    }
    if (this.request.headers) {
      let headers = arc.app.headers.toJSON(this.request.headers);
      let obj = new Headers();
      headers.forEach((item) => {
        var name = item.name && item.name.trim();
        if (!name) {
          this.fire('app-log', {
            'message': new Error('Header name is invalid'),
            'level': 'error'
          });
        } else {
          try {
            obj.append(item.name, item.value);
          } catch (e) {
            this.fire('app-log', {
              'message': e,
              'level': 'error'
            });
          }
        }
      });
      init.headers = obj;
    }

    let promise;
    if (['GET', 'HEAD'].indexOf(init.method) === -1) {
      if (this.request.bodySource === 'multipart') {
        this.$.formData._items = this.request.formData;
        promise = this.$.formData.generateMessage()
        .then((buffer) => {
          init.body = buffer;
        });
      } else {
        init.body = this.request.payload;
        promise = Promise.resolve();
      }
    } else {
      promise = Promise.resolve();
    }
    return promise.then(() => {
      init.debug = false;
      if (this.request.auth) {
        init.auth = this.request.auth;
      }
      if ('timeout' in opts) {
        var tm = opts.timeout;
        if (tm > 0) {
          init.timeout = tm;
        }
      }
      return init;
    });
  },

  _processResponse: function(response) {
    var result = {};
    // this.async(() => {
    //   this.processLogs(response.logs);
    // }, 1);
    delete response.logs;
    if (response.error && typeof response.error !== 'function') {
      result.redirects = Array.from(response.redirects);
      result.error = response.error;
      this._finishRequest(this.connection.request, result);
      return;
    }

    result._headers = response.headers;
    result.headers = arc.app.headers.toJSON(response.headers);
    result.status = response.status;
    result.statusText = response.statusText;
    result.redirects = Array.from(response.redirects);
    result.stats = response.stats;
    result.ok = response.ok;
    result.auth = response.auth;
    var decoder = new TextDecoder();
    result.rawBody = decoder.decode(response.rawResponse);

    var ct = (response.headers && response.headers.get) ?
      response.headers.get('content-type') : null;
    var cl = (response.headers && response.headers.get) ?
      Number(response.headers.get('content-length')) : null;
    if (cl && cl === 0) {
      result.body = '';
      return this._finishRequest(this.connection.request, result);
    } else if (ct && ct.indexOf('image') !== -1 &&
      ct.indexOf('xml') === -1) {
      response.blob()
      .then((blob) => {
        result.body = blob;
        return this._finishRequest(this.connection.request, result);
      });
    } else if (ct && ct.indexOf('json') !== -1) {
      try {
        response.json()
        .then((json) => {
          result.body = json;
          return this._finishRequest(this.connection.request, result);
        })
        .catch((e) => {
          this.fire('app-log', {
            'message': ['Something is wrong with the response.', e],
            'level': 'error'
          });
          try {
            result.body = decoder.decode(response.rawResponse);
          } catch (e) {
            result.body = '';
          }
          return this._finishRequest(this.connection.request, result);
        });
      } catch (e) {
        try {
          result.body = decoder.decode(response.rawResponse);
        } catch (e) {
          result.body = '';
        }
        return this._finishRequest(this.connection.request, result);
      }
    } else if (ct && ct.indexOf('application/octet-stream') === 0) {
      try {
        response.blob()
        .then((blob) => {
          result.body = blob;
          return this._finishRequest(this.connection.request, result);
        })
        .catch((e) => {
          this.fire('app-log', {
            'message': ['Something is wrong with the response.', e],
            'level': 'error'
          });
          try {
            result.body = decoder.decode(response.rawResponse);
          } catch (e) {
            result.body = '';
          }
          return this._finishRequest(this.connection.request, result);
        });
      } catch (e) {
        try {
          result.body = decoder.decode(response.rawResponse);
        } catch (e) {
          result.body = '';
        }
        return this._finishRequest(this.connection.request, result);
      }
    } else {
      response.text()
      .then((text) => {
        result.body = text;
        return this._finishRequest(this.connection.request, result);
      });
    }
  },

  _finishRequest: function(request, response) {
    request.xhr = false;
    var detail = {
      request: request,
      response: response
    };
    if (response.auth) {
      detail.auth = response.auth;
    }
    window.requestAnimationFrame(() => {
      this.fire('ready', detail);
      this.clear();
    });
  },

  abort: function() {
    if (!this.connection) {
      return;
    }
    try {
      this.connection.abort();
    } catch (e) {}
    this.clear();
  },

  processLogs(logs) {
    logs = logs.map((item) => {
      if (item instanceof Array) {
        return item.join(' ');
      }
      return String(item);
    });
    this.fire('app-log', {
      'message': logs.join('\n'),
      'stack': 'arc-socket-request.js\nsocket-fetch.js',
      'level': 'debug'
    });
  }
});
})();
