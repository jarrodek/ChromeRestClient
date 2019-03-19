import {RequestOptions} from './request-options.js';
import {ArcHeaders} from './arc-headers.js';
import {HostRulesEval} from './hosts-eval.js';
import {HttpErrorCodes} from './error-codes.js';
import {RequestUtils} from './utils.js';
// import {ArcEventSource} from './utils.js';
/* global EventTarget */
export class RequestBase extends EventTarget {
  constructor(request, options) {
    super();
    if (!(options instanceof RequestOptions)) {
      options = new RequestOptions(options);
    }
    this.opts = options;
    this.logger = this.__setupLogger(options);
    this._printValidationWarnings();
    this.arcRequest = Object.assign({}, request);
    /**
     * When true the request has been aborted.
     * @type {Boolean}
     */
    this.aborted = false;
    /**
     * The ID of the request to be report back with events.
     * @type {String}
     */
    this.id = request.id;
    /**
     * Stats object to compute request statistics
     * @type {Object}
     */
    this.stats = {};
    /**
     * Hosts table. See options class for description.
     * @type {Array<Object>}
     */
    this.hosts = options.hosts;
    this.uri = request.url;
    this.socket = undefined;
    /**
     * Host header can be different than registered URL because of
     * `hosts` rules.
     * If a rule changes host value of the URL the original URL's host value
     * is used when generating the request and not overriden one.
     * This way virual hosts can be tested using hosts.
     *
     * @type {String}
     */
    this.hostHeader = RequestUtils.getHostHeader(request.url);
    this._hostTestReg = /^\s*host\s*:/im;
  }
  /**
   * @return {Number|undefined} Request timeout.
   */
  get timeout() {
    if (this.arcRequest.config && typeof this.arcRequest.config.timeout === 'number') {
      return this.arcRequest.config.timeout;
    }
    if (typeof this.opts.timeout === 'number') {
      return this.opts.timeout;
    }
  }

  get followRedirects() {
    if (this.arcRequest.config && typeof this.arcRequest.config.followRedirects === 'boolean') {
      return this.arcRequest.config.followRedirects;
    }
    if (typeof this.opts.followRedirects === 'boolean') {
      return this.opts.followRedirects;
    }
  }
  /**
   * Sets the `uri` value from an URL.
   * @param {String} value
   */
  set uri(value) {
    value = HostRulesEval.applyHosts(value, this.hosts);
    this.__uri = new URL(value);
  }
  /**
   * @return {Object} Parsed value of the request URL.
   */
  get uri() {
    return this.__uri;
  }
  /**
   * Creates a logger object to log debug output.
   *
   * @param {Object} opts
   * @return {Object}
   */
  __setupLogger(opts) {
    if (opts.logger) {
      return opts.logger;
    }
    return console;
  }
  /**
   * Prints varning messages to the logger.
   */
  _printValidationWarnings() {
    const warnings = this.opts.validationWarnings;
    if (!warnings || !warnings.length) {
      return;
    }
    warnings.forEach((warning) => {
      this.logger.warn(warning);
    });
  }
  /**
   * Cleans the state after finished.
   */
  _cleanUp() {
    this.redirects = undefined;
    this._response = undefined;
    this._rawBody = undefined;
    this.redirecting = false;
    this.stats = {};
    this._clearSocketEventListeners();
  }
  /**
   * Cleans up the state for redirect.
   */
  _cleanUpRedirect() {
    this._response = undefined;
    this._rawBody = undefined;
    this.stats = {};
    this._clearSocketEventListeners();
  }
  /**
   * Aborts current request.
   * It emitts `error` event
   */
  abort() {
    this.aborted = true;
  }
  /**
   * Decompresses received body if `content-encoding` header is set.
   *
   * @param {Uint8Array} body A body buffer to decompress.
   * @return {Promise} Promise resilved to parsed body
   */
  _decompress(body) {
    if (this.aborted || !body) {
      return Promise.resolve();
    }
    const ceHeader = 'content-encoding';
    if (!this._response._headers.has(ceHeader)) {
      return Promise.resolve(body);
    }
    const ce = this._response._headers.get(ceHeader);
    if (ce.indexOf('deflate') !== -1) {
      return this._inflate(body);
    }
    if (ce.indexOf('gzip') !== -1) {
      return this._gunzip(body);
    }
    if (ce.indexOf('br') !== -1) {
      return this._brotli(body);
    }
    return Promise.resolve(body);
  }
  /**
   * Decompress body with Inflate.
   * @param {Buffer} body Received response payload
   * @return {Promise} Promise resolved to decompressed buffer.
   */
  _inflate(body) {
    /* global Zlib */
    const inflate = new Zlib.Inflate(body);
    return Promise.resolve(inflate.decompress());
  }
  /**
   * Decompress body with ZLib.
   * @param {Uint8Array} body Received response payload
   * @return {Promise} Promise resolved to decompressed buffer.
   */
  _gunzip(body) {
    const inflate = new Zlib.Gunzip(body);
    return Promise.resolve(inflate.decompress());
  }
  /**
   * Decompress Brotli.
   * @param {Buffer} body Received response payload
   * @return {Promise} Promise resolved to decompressed buffer.
   */
  _brotli(body) {
    /* global BrotliDecompress */
    return Promise.resolve(BrotliDecompress(body));
  }
  /**
   * Reports response when redirected.
   * @param {Number} status Received status code
   * @return {Boolean} True if the request has been redirected.
   */
  _reportRedirect(status) {
    // https://github.com/jarrodek/socket-fetch/issues/13
    const redirectOptions = RequestUtils.redirectOptions(status,
      this.arcRequest.method, this._response._headers.get('location'));
    if (!redirectOptions.redirect) {
      return false;
    }
    this.redirecting = true;
    if (typeof window !== 'undefined') {
      window.setTimeout(() => this._redirectRequest(redirectOptions));
    } else {
      process.nextTick(() => this._redirectRequest(redirectOptions));
    }
    return true;
  }
  /**
   * Creates a response and adds it to the redirects list and redirects
   * the request to the new location.
   *
   * @param {Object} options A redirection options:
   * forceGet {Boolean} - If true the redirected request will be GET request
   * location {String} - location of the resource (redirect uri)
   */
  _redirectRequest(options) {
    if (this.followRedirects === false) {
      this._publishResponse({
        includeRedirects: true
      });
      return;
    }
    const location = RequestUtils.getRedirectLocation(options.location, this.arcRequest.url);
    if (!location) {
      this._errorRequest({
        code: 302
      });
      return;
    }
    // check if this is infinite loop
    if (RequestUtils.isRedirectLoop(location, this.redirects)) {
      this._errorRequest({
        code: 310
      });
      return;
    }
    const detail = {
      id: this.id,
      location: location
    };
    const ev = new CustomEvent('beforeredirect', {detail});
    this.dispatchEvent(ev);
    if (ev.defaultPrevented) {
      this._publishResponse({
        includeRedirects: true
      });
      return;
    }
    if (!this.redirects) {
      this.redirects = new Set();
    }
    let responseCookies;
    if (this._response._headers.has('set-cookie')) {
      responseCookies = this._response._headers.get('set-cookie');
    }
    this._createResponse({
      includeRedirects: false
    })
    .then((response) => {
      this.redirects.add(response);
      return this._cleanUpRedirect();
    })
    .then(() => this._disconnect())
    .then(() => {
      if (!responseCookies) {
        return;
      }
      this._processRedirectCookies(responseCookies, location);
    })
    .then(() => {
      this.redirecting = false;
      this.arcRequest.url = location;
      if (options.forceGet) {
        this.arcRequest.method = 'GET';
      }
      this.uri = location;
      this.hostHeader = RequestUtils.getHostHeader(location);
      // No idea why but without setTimeout the program loses it's
      // scope after calling the function.
      if (typeof window !== 'undefined') {
        window.setTimeout(() => this.send());
      } else {
        process.nextTick(() => this.send());
      }
    })
    .catch((e) => {
      this._errorRequest({
        'message': e && e.message || 'Unknown error occurred'
      });
    });
  }

  _disconnect() {}
  /**
   * Create a `Response` object.
   *
   * The expected response object has the following properties:
   * - isError: {Boolean}
   * - error: {Object}
   * - isXhr: {Boolean}
   * - loadingTime: {Number}
   * - request: {Object} - The original request object
   * - response: {Object}
   *  - status {Number}
   *  - statusText: {String}
   *  - headers: {String}
   *  - payload: {String|Buffer}
   * - redirects: {Array<Object>} - List of response objects
   * - redirectsTiming: {Array<Object>} - List of timings for redirects in order
   * - timing: {Object} - HAR 1.2 timing object
   * - sentHttpMessage: {String} - The message sent to the server.
   *
   * @param {Object} opts An options to construct a response object:
   *  - {Boolean} includeRedirects If true the response will have
   *    information about redirects.
   *  - {Error} error An error object when the response is errored.
   * @return {Response} A response object.
   */
  _createResponse(opts) {
    opts = opts || {};
    if (opts.error) {
      const resp = {
        isError: true,
        error: new Error(opts.error.message || opts.error),
        sentHttpMessage: this.arcRequest.sentHttpMessage,
        stats: this._computeStats(this.stats)
      };
      if (opts.includeRedirects && this.redirects && this.redirects.size) {
        resp.redirects = Array.from(this.redirects);
      }
      return Promise.resolve(resp);
    }
    if (this.aborted) {
      return Promise.resolve();
    }
    const status = this._response.status;
    if (status < 100 || status > 599) {
      return Promise.reject(
        new Error(`The response status "${status}" is not allowed.
      See HTTP spec for more details: https://tools.ietf.org/html/rfc2616#section-6.1.1`));
    } else if (status === undefined) {
      return Promise.reject(
        new Error(`The response status is empty.
      It means that the successful connection wasn't made.
      Check your request parameters.`));
    }
    return this._decompress(this._rawBody)
    .then((body) => {
      const response = {
        status: status,
        statusText: this._response.statusText,
        headers: this._response.headers,
        url: this.arcRequest.url,
        payload: body,
        stats: this._computeStats(this.stats),
        sentHttpMessage: this.arcRequest.sentHttpMessage
      };
      if (opts.includeRedirects && this.redirects && this.redirects.size) {
        response.redirects = Array.from(this.redirects);
      }
      if (status === 401) {
        response.auth = this._getAuth();
      }
      return response;
    });
  }
  /**
   * Finishes the response with error message.
   * @param {Object} opts `code` and `message`
   */
  _errorRequest(opts) {
    this.aborted = true;
    let message;
    if (opts.code && !opts.message) {
      message = HttpErrorCodes.getCodeMessage(opts.code);
    } else if (opts.message) {
      message = opts.message;
    }
    message = message || 'Unknown error occurred';
    let response;
    if (this._response && this._response.status) {
      response = {
        status: this._response.status,
        statusText: this._response.statusText,
        headers: this._response.headers,
        url: this.arcRequest.url,
        stats: this._computeStats(this.stats),
        sentHttpMessage: this.arcRequest.sentHttpMessage
      };
    }
    const error = new Error(message);
    this.dispatchEvent(new CustomEvent('error', {
      detail: {
        id: this.id,
        error,
        response,
        request: this.arcRequest
      }
    }));
    this._cleanUp();
  }
  /**
   * Generates authorization info object from response.
   *
   * @return {Object}
   */
  _getAuth() {
    if (this.auth) {
      return this.auth;
    }
    let auth = this._response._headers.has('www-authenticate') ?
      this._response._headers.get('www-authenticate') : undefined;
    const result = {
      method: 'unknown'
    };
    if (auth) {
      auth = auth.toLowerCase();
      if (auth.indexOf('ntlm') !== -1) {
        result.method = 'ntlm';
      } else if (auth.indexOf('basic') !== -1) {
        result.method = 'basic';
      } else if (auth.indexOf('digest') !== -1) {
        result.method = 'digest';
      }
    }
    return result;
  }
  /**
   * Generate response object and publish it to the listeners.
   *
   * @param {Object} opts See #_createResponse for more info.
   * @return {Promise}
   */
  _publishResponse(opts) {
    if (this.aborted) {
      return;
    }
    return this._createResponse(opts)
    .then((response) => {
      this.dispatchEvent(new CustomEvent('load', {
        detail: {
          id: this.id,
          response,
          request: this.arcRequest
        }
      }));
      this._cleanUp();
      this.abort();
    })
    .catch((e) => {
      this._errorRequest({
        'message': e && e.message || 'Unknown error occurred'
      });
    });
  }
  /**
   * Creats HAR 1.2 timings object from stats.
   * @param {Object} stats Timings object
   * @return {Object}
   */
  _computeStats(stats) {
    let {sentTime, messageStart, connectionTime, lookupTime, connectedTime,
      secureStartTime, secureConnectedTime, lastReceivedTime, firstReceiveTime} = stats;
    const type = 'number';
    if (typeof lookupTime !== type) {
      lookupTime = 0;
    }
    let send = (sentTime && messageStart) ? sentTime - messageStart : -1;
    if (send < 0) {
      send = 0;
    }
    const dns = lookupTime ? lookupTime - connectionTime : -1;
    const connect = (connectedTime && lookupTime) ? connectedTime - lookupTime : -1;
    let receive = (lastReceivedTime && firstReceiveTime) ?
      lastReceivedTime - firstReceiveTime : -1;
    if (receive < 0) {
      receive = 0;
    }
    let wait = (firstReceiveTime && sentTime) ? firstReceiveTime - sentTime : -1;
    if (wait < 0) {
      wait = 0;
    }
    let ssl = -1;
    if (typeof secureStartTime === type && typeof secureConnectedTime === type) {
      ssl = secureConnectedTime - secureStartTime;
    }
    return {
      connect,
      receive,
      send,
      wait,
      dns,
      ssl
    };
  }
  /**
   * Handles cookie exchange when redirecting the request.
   * @param {String} responseCookies Cookies received in the resposne
   * @param {String} location Redirect destination
   */
  _processRedirectCookies(responseCookies, location) {
    let newParser = new Cookies(responseCookies, location);
    newParser.filter();
    const expired = newParser.clearExpired();
    const headers = new ArcHeaders(this.arcRequest.headers);
    const hasCookie = headers.has('cookie');
    if (hasCookie) {
      const oldCookies = headers.get('cookie');
      const oldParser = new Cookies(oldCookies, location);
      oldParser.filter();
      oldParser.clearExpired();
      oldParser.merge(newParser);
      newParser = oldParser;
      // remove expired from the new response.
      newParser.cookies = newParser.cookies.filter((c) => {
        for (let i = 0, len = expired.length; i < len; i++) {
          if (expired[i].name === c.name) {
            return false;
          }
        }
        return true;
      });
    }
    const str = newParser.toString(true);
    if (str) {
      headers.set('cookie', str);
    } else if (hasCookie) {
      headers.delete('cookie');
    }
    this.arcRequest.headers = headers.toString();
  }

  _clearSocketEventListeners() {
    if (!this.socket) {
      return;
    }
    this.socket.removeAllListeners('error');
    this.socket.removeAllListeners('timeout');
    this.socket.removeAllListeners('end');
  }
}
