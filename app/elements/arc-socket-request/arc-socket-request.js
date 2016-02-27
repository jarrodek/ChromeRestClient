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
    //TODO: include files.
    if (this.request.payload) {
      init.body = this.request.payload;
    }
    this.connection = new SocketFetch(this.request.url, init);
    this.connection.fetch().then((response) => {
      if (response.ok) {
        this._processResponse(response);
      } else {
        this._processErrorResponse(response);
      }
    }).catch((cause) => {
      console.error('Error during fetch', cause);
    });
  },

  _processResponse: function(response) {
    var result = {};
    result.headers = this._translateHeaders(response.headers);
    result.status = response.status;
    result.statusText = response.statusText;
    result.redirects = Array.from(response.redirects);
    result.stats = response.stats;
    var ct = response.headers ? response.headers.get('content-type') : null;
    if (ct && ct.indexOf('image') !== -1) {
      response.blob()
      .then((blob) => {
        result.body = blob;
        this.fire('ready', {
          response: result
        });
      });
    } else if (ct && ct.indexOf('json') !== -1) {
      response.json()
      .then((json) => {
        result.body = json;
        this.fire('ready', {
          response: result
        });
      });
    } else {
      response.text()
      .then((text) => {
        result.body = text;
        this.fire('ready', {
          response: result
        });
      });
    }
  },

  _processErrorResponse: function(response) {
    console.log(response);
  },

  abort: function() {
    if (!this.connection) {
      return;
    }
    this.connection.abort();
  },

  _translateHeaders: function(headers) {
    var result = [];
    if (!headers) {
      return result;
    }
    for (let header of headers) {
      result.push({
        name: header[0],
        value: header[1]
      });
    }
    return result;
  }
});
