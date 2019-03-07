import {RequestOptions} from '../socket-fetch/request-options.js';
import {RequestSocket} from '../socket-fetch/request-socket.js';
export class SocketTransport {
  constructor(request) {
    this.request = request;
    this.requestId = request.id;

    // Socket handlers
    this._loadStartHandler = this._loadStartHandler.bind(this);
    this._firstByteHandler = this._firstByteHandler.bind(this);
    this._loadEndHandler = this._loadEndHandler.bind(this);
    this._beforeRedirectHandler = this._beforeRedirectHandler.bind(this);
    this._headersReceivedHandler = this._headersReceivedHandler.bind(this);
    this._loadHandler = this._loadHandler.bind(this);
    this._errorHandler = this._errorHandler.bind(this);
  }

  run(appConfig, hosts) {
    const opts = this._prepareRequestOptions(appConfig, hosts);
    const connection = this._prepareRequest(opts);
    return connection.send()
    .catch((cause) => this._errorHandler(cause));
  }

  _prepareRequestOptions(opts, hosts) {
    const rConfig = Object.assign({}, this.request.config || {});
    opts = Object.assign({}, opts || {});
    opts = Object.assign(rConfig, opts);
    if (opts.timeout) {
      if (opts.timeout < 120) {
        opts.timeout = opts.timeout * 1000;
      }
    } else {
      opts.timeout = 0;
    }
    if (hosts) {
      opts.hosts = hosts;
    }
    return new RequestOptions(opts);
  }

  _prepareRequest(opts) {
    const conn = new RequestSocket(this.request, opts);
    conn.addEventListener('loadstart', this._loadStartHandler);
    conn.addEventListener('firstbyte', this._firstByteHandler);
    conn.addEventListener('loadend', this._loadEndHandler);
    conn.addEventListener('beforeredirect', this._beforeRedirectHandler);
    conn.addEventListener('headersreceived', this._headersReceivedHandler);
    conn.addEventListener('load', this._loadHandler);
    conn.addEventListener('error', this._errorHandler);
    this.connection = conn;
    return conn;
  }

  _removeConnectionHandlers() {
    const conn = this.connection;
    conn.removeEventListener('loadstart', this._loadStartHandler);
    conn.removeEventListener('firstbyte', this._firstByteHandler);
    conn.removeEventListener('loadend', this._loadEndHandler);
    conn.removeEventListener('beforeredirect', this._beforeRedirectHandler);
    conn.removeEventListener('headersreceived', this._headersReceivedHandler);
    conn.removeEventListener('load', this._loadHandler);
    conn.removeEventListener('error', this._errorHandler);
  }

  _informStatus(type) {
    document.body.dispatchEvent(new CustomEvent(type, {
      composed: true,
      bubbles: true,
      detail: {
        id: this.requestId
      }
    }));
  }

  _loadStartHandler(id) {
    this._informStatus('request-load-start', id);
  }

  _firstByteHandler(id) {
    this._informStatus('request-first-byte-received', id);
  }

  _loadEndHandler(id) {
    this._informStatus('request-load-end', id);
  }

  _beforeRedirectHandler(e) {
    if (this.connection.aborted) {
      return;
    }
    const {location, id} = e.detail;
    const ev = new CustomEvent('before-redirect', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        id,
        url: location
      }
    });
    document.body.dispatchEvent(ev);
    if (ev.defaultPrevented) {
      e.preventDefault();
    }
  }

  _headersReceivedHandler(e) {
    if (this.connection.aborted) {
      return;
    }
    const {value, id} = e.detail;
    const ev = new CustomEvent('headers-received', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        id,
        value
      }
    });
    document.body.dispatchEvent(ev);
    if (ev.defaultPrevented) {
      e.preventDefault();
    }
  }

  _loadHandler(e) {
    this._removeConnectionHandlers();
    if (this.connection.aborted) {
      return;
    }
    this._processResponse(e.detail);
  }

  _errorHandler(cause, id, request, response) {
    debugger;
    this._removeConnectionHandlers();
    if (this.connection.aborted) {
      return;
    }
    if (!response) {
      response = {};
    }
    const data = Object.assign({}, response, {
      isError: true,
      error: cause
    });
    this._processResponse(id, data, request);
  }
}
