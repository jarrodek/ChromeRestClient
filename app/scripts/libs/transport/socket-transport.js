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
    try {
      const opts = this._prepareRequestOptions(appConfig, hosts);
      const connection = this._prepareRequest(opts);
      return connection.send()
      .catch((cause) => this._onError(cause));
    } catch (e) {
      this._onError(e);
    }
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

  _onError(error) {
    const data = {
      id: this.requestId,
      request: this.request,
      response: {
        isError: true,
        error,
      }
    };
    this._processResponse(data);
  }

  _errorHandler(e) {
    let {id, request, response} = e.detail;
    const {error} = response;
    this._removeConnectionHandlers();
    if (this.connection.aborted) {
      return;
    }
    if (!response) {
      response = {};
    }
    response = Object.assign({}, response, {
      isError: true,
      error
    });
    const data = {
      id,
      request,
      response
    };
    this._processResponse(data);
  }

  _processResponse(data) {
    const {id, request, response} = data;
    const {sentHttpMessage, stats, error, redirects, auth} = response;
    const detail = {
      isXhr: false,
      request
    };
    const redirectsInfo = this._processRedirects(redirects);
    if (redirectsInfo.timings.length) {
      detail.redirectsTiming = redirectsInfo.timings;
      detail.redirects = redirectsInfo.redirects;
    }
    if (error && typeof error !== 'function') {
      detail.isError = true;
      detail.error = error;
    } else {
      const statsInfo = this._cleanTimings(stats);
      detail.isError = false;
      detail.response = response;
      detail.sentHttpMessage = sentHttpMessage;
      detail.loadingTime = this._computeLoadingTime(statsInfo);
      detail.timing = statsInfo;
      detail.auth = auth;
      delete detail.response.sentHttpMessage;
      delete detail.request.sentHttpMessage;
    }
    detail.id = id;
    this._beforeResponse(detail);
  }
  /**
   * Processes redirects data from the socket library.
   * @param {Set} set A set of redirects
   * @return {Object} Map of arrays of timings and redirects information.
   */
  _processRedirects(set) {
    const result = {
      timings: [],
      redirects: []
    };
    if (!set) {
      return result;
    }
    set.forEach((item) => {
      result.redirects.push(item);
      result.timings.push(item.stats);
      delete item.stats;
    });
    return result;
  }
  /**
   * Computes a request / response loading time from the stats object
   * @param {Objject} stats A stats property of the socket client response.
   * @return {Number} A time to full response in miliseconds. 0 if stats unavailable.
   */
  _computeLoadingTime(stats) {
    if (!stats) {
      return 0;
    }
    let value = 0;
    if (stats.dns && stats.dns > 0) {
      value += stats.dns;
    }
    if (stats.connect && stats.connect > 0) {
      value += stats.connect;
    }
    if (stats.receive && stats.receive > 0) {
      value += stats.receive;
    }
    if (stats.send && stats.send > 0) {
      value += stats.send;
    }
    if (stats.ssl && stats.ssl > 0) {
      value += stats.ssl;
    }
    if (stats.wait && stats.wait > 0) {
      value += stats.wait;
    }
    return value;
  }
  /**
   * Creates HAR 1.2 object from timing data
   * @param {Object} stats
   * @return {Object}
   */
  _cleanTimings(stats) {
    const result = {
      dns: stats.dns || -1,
      connect: stats.connect || -1,
      receive: stats.receive || -1,
      send: stats.send || -1,
      ssl: stats.ssl || -1,
      wait: stats.wait || -1
    };
    return result;
  }
  /**
   * Dispatches `response-ready` event with request data.
   * If the event is not caneled then it dispatches `report-response`
   * event.
   *
   * @param {Object} detail The request detail
   */
  _beforeResponse(detail) {
    const e = new CustomEvent('response-ready', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail
    });
    document.body.dispatchEvent(e);
    if (e.defaultPrevented) {
      return;
    }
    this._reportResponse(e.detail);
  }
  /**
   * Fires the `report-response` custom event with immutable response data.
   * @param {Object} detail The event detail object.
   */
  _reportResponse(detail) {
    detail = this._prepareTransportObject(detail);
    const e = new CustomEvent('report-response', {
      composed: true,
      bubbles: true,
      cancelable: false,
      detail
    });
    document.body.dispatchEvent(e);
  }

  /**
   * Creates an immutable `detail` object for the `report-response` custom
   * event.
   * @param {Object} detail
   * @return {Object} Immutable object.
   */
  _prepareTransportObject(detail) {
    const configuration = {};
    Object.keys(detail).forEach((key) => {
      configuration[key] = {
        value: detail[key],
        writable: false,
        enumerable: true
      };
    });
    return Object.create(Object.prototype, configuration);
  }
}
