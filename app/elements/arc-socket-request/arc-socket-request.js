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
    if (this.request.method) {
      init.method = this.request.method;
    }
    if (this.request.headers) {
      let headers = arc.app.headers.toJSON(this.request.headers);
      let obj = new Headers();
      headers.forEach((item) => obj.append(item.name, item.value));
      init.headers = obj;
    }

    if (this.request.files && this.request.files.length > 0) {
      // create FormData from the form
      let fd = new FormData();
      this.request.files.forEach((field) => {
        field.files.forEach((file) => {
          fd.append(field.name, file);
        });
      });
      let params = PayloadParser.stringToArray(this.request.payload);
      params.forEach((pair) => {
        fd.append(pair.name, pair.value);
      });
      init.body = fd;
    } else if (this.request.payload) {
      init.body = this.request.payload;
    }
    init.debug = true;
    init.timeout = 20000;
    this.connection = new SocketFetch(this.request.url, init);
    this.connection.fetch().then((response) => {
      this._processResponse(response);
    }).catch((cause) => {
      console.error('Error during fetch', cause);
      this.fire('error', {
        message: cause
      });
    });
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
    if (ct && ct.indexOf('image') !== -1 &&
      ct.indexOf('xml') === -1) {
      response.blob()
      .then((blob) => {
        result.body = blob;
        return this._finishRequest(this.connection.request, result);
      });
    } else if (ct && ct.indexOf('json') !== -1) {
      response.json()
      .then((json) => {
        result.body = json;
        return this._finishRequest(this.connection.request, result);
      });
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
