(function() {
'use strict';

Polymer({
  is: 'arc-socket-request',
  properties: {
    request: Object,
    connection: Object
  },

  run: function() {
    var init = {};
    var error = [];
    if (this.request.method) {
      init.method = this.request.method;
    }
    if (this.request.headers) {
      let headers = arc.app.headers.toJSON(this.request.headers);
      let obj = new Headers();
      headers.forEach((item) => {
        var name = item.name && item.name.trim();
        if (!name) {
          error.push('Header name is invalid');
        } else {
          try {
            obj.append(item.name, item.value);
          } catch (e) {
            console.error(e.message);
            error.push(e.message);
          }
        }
      });
      init.headers = obj;
    }

    if (this.request.files && this.request.files.length > 0) {
      // create FormData from the form
      let fd = new FormData();
      this.request.files.forEach((field) => {
        field.files.forEach((file) => {
          try {
            fd.append(field.name, file);
          } catch (e) {
            console.error(e.message);
            error.push(e.message);
          }
        });
      });
      let params = PayloadParser.stringToArray(this.request.payload);
      params.forEach((pair) => {
        try {
          fd.append(pair.name, pair.value);
        } catch (e) {
          console.error(e.message);
          error.push(e.message);
        }
      });
      init.body = fd;
    } else if (this.request.payload) {
      init.body = this.request.payload;
    }
    if (error.length > 0) {
      this.fire('error', {
        message: error.join(' \n')
      });
      return;
    }
    init.debug = true;
    init.timeout = 20000;
    this.connection = new SocketFetch(this.request.url, init);
    try {
      this.connection.fetch().then((response) => {
        this._processResponse(response);
      }).catch((cause) => {
        console.error('Error during fetch', cause);
        this.fire('error', {
          message: cause
        });
      });
    } catch (e) {
      console.error('Error during fetch', e);
      this.fire('error', {
        message: e.message
      });
    }
  },

  _processResponse: function(response) {
    var result = {};
    result.headers = arc.app.headers.toJSON(response.headers);
    result.status = response.status;
    result.statusText = response.statusText;
    result.redirects = Array.from(response.redirects);
    result.stats = response.stats;
    result.ok = response.ok;
    var ct = (response.headers && response.headers.get) ?
      response.headers.get('content-type') : null;
    var cl = (response.headers && response.headers.get) ?
      Number(response.headers.get('content-length')) : null;
    if (cl && cl === 0) {
      result.body = '';
      this._finishRequest(this.connection.request, result);
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
          console.warn('Something is wrong with the response.', e);
          try {
            result.body = arc.app.utils.arrayBufferToString(this.connection.response.rawResponse);
          } catch (e) {
            result.body = '';
          }
          return this._finishRequest(this.connection.request, result);
        });
      } catch (e) {
        result.body = '';
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
    var isBasicAuth = false;
    if (response.headers && response.headers.length) {
      response.headers.forEach((header) => {
        if (header.name.toLowerCase() === 'www-authenticate') {
          if (header.value.toLowerCase().indexOf('basic ') === 0) {
            isBasicAuth = true;
          }
        }
      });
    }
    var detail = {
      request: request,
      response: response
    };
    if (isBasicAuth) {
      detail.basicAuth = true;
    }
    this.fire('ready', detail);
  },

  abort: function() {
    if (!this.connection) {
      return;
    }
    this.connection.abort();
  }
});
})();
