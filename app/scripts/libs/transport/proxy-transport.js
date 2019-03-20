export class ChromeProxyTransport {
  constructor(request, proxy) {
    this.aborted = false;
    this.connected = false;
    this.request = request;
    this.requestId = request.id;
    this.proxy = proxy;

    this._onMessage = this._onMessage.bind(this);
    proxy.addEventListener('message', this._onMessage);
  }

  set onend(callback) {
    this.__endHandler = callback;
  }

  get onend() {
    return this.__endHandler;
  }

  run(appConfig) {
    const opts = this._prepareRequestOptions(this.request, appConfig);
    return this._prepareRequest(this.request, opts)
    .then((request) => this._send(request));
  }

  abort() {
    this.aborted = true;
    this.__endHandler = undefined;
  }

  _send(request) {
    this.proxy.postMessage({
      payload: 'proxy-xhr',
      id: this.requestId,
      request
    });
  }

  _prepareRequestOptions(request, opts) {
    const rConfig = Object.assign({}, request.config || {});
    opts = Object.assign({}, opts || {});
    opts = Object.assign(rConfig, opts);
    if (opts.timeout) {
      if (opts.timeout < 120) {
        opts.timeout = opts.timeout * 1000;
      }
    } else {
      opts.timeout = 0;
    }
    return opts;
  }

  _prepareRequest(request, opts) {
    const init = {
      method: request.method,
      url: request.url,
      headers: this._processHeaders(request.headers),
      timeout: opts.timeout,
      version: 2
    };
    if (['get', 'head'].indexOf(request.method.toLowerCase()) !== -1) {
      delete request.payload;
    }
    if (request.payload === undefined) {
      return Promise.resolve(init);
    }
    init.payload = request.payload;
    const serialize = !!request.payload &&
      (request.payload instanceof Blob || request.payload instanceof FormData);
    if (!serialize) {
      return Promise.resolve(init);
    }
    return this._serializePayload(init);
  }

  _processHeaders(headersString) {
    const result = [];
    if (!headersString) {
      return result;
    }
    const headers = headersString.split(/\n(?=[^ \t]+)/gim);
    for (let i = 0, len = headers.length; i < len; i++) {
      const line = headers[i].trim();
      if (line === '') {
        continue;
      }
      const sepPosition = line.indexOf(':');
      if (sepPosition === -1) {
        result[result.length] = {
          name: line,
          value: ''
        };
        continue;
      }
      const name = line.substr(0, sepPosition);
      const value = line.substr(sepPosition + 1).trim();
      const obj = {
        name: name,
        value: value
      };
      result.push(obj);
    }
    return result;
  }
  /**
   * Serializes payload to a string.
   * It removed the `payload` property from the request object.
   * It adds `type` property to the request object describing what was the
   * original object. It can be either `file` or `formdata`.
   *
   * @param {Object} request The request object.
   * @return {Promise} Request object with transformed payload
   */
  _serializePayload(request) {
    const data = request.payload; // either File (Blob) or Multipart
    let promise;
    if (data instanceof Blob) {
      promise = this._transformFile(data)
      .then((result) => {
        request.payload = result;
        request.type = 'file';
        return request;
      });
    } else {
      promise = this._transformFormData(data)
      .then((list) => {
        request.payload = list;
        request.type = 'formdata';
        return request;
      });
    }
    return promise;
  }
  /**
   * Serializes File/Blob to the Base64 string.
   * @param {File|Blob} file A file to transform
   * @return {Promise} Promise resolved when file is transformed
   */
  _transformFile(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = function() {
        let result;
        try {
          result = btoa(this.result);
        } catch (e) {
          return reject(e);
        }
        resolve(result);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
  /**
   * Transforms a FormData instance into a list of Base64 representations of
   * files that can be transferred between extensions.
   * @param {FormData} formData A form data object to transform
   * @return {Promise} A promise resolved to a list of objects.
   * Each object represent a part of the message.
   * - name {String} Name of the part
   * - value {String} Base64 representation of the file or string value
   * - isFile {Boolean} If true then this is a serialized file data.
   */
  _transformFormData(formData) {
    const promises = [];
    for (let part of formData) {
      const promise = this._createFileObject(part[0], part[1]);
      promises.push(promise);
    }
    return Promise.all(promises);
  }
  /**
   * Creates a file object representation of prt of the message.
   * @param {String} name Name of the message part
   * @param {File|String} value Either
   * @return {[type]} [description]
   */
  _createFileObject(name, value) {
    let promise;
    if (typeof value === 'string') {
      promise = Promise.resolve({
        isFile: false,
        value: value,
        name: name
      });
    } else {
      promise = this._transformFile(value)
      .then((result) => {
        return {
          isFile: true,
          value: result,
          name: name
        };
      });
    }
    return promise;
  }

  _onMessage(e) {
    if (this.aborted) {
      return;
    }
    const {payload, response, id, error, message} = e.detail;
    if (payload !== 'proxy-xhr') {
      return;
    }
    if (this.requestId !== id) {
      return;
    }
    this.proxy.removeEventListener('message', this._onMessage);
    this.proxy = undefined;
    if (error) {
      this._processResponseError(message, e.detail.log);
    } else {
      this._processResponse(response);
    }
  }

  _processResponse(response) {
    const loadingTime = response.stats && response.stats.receive;
    const data = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      payload: response.response,
      url: response.responseURL
    };
    const detail = {
      isXhr: true,
      id: this.requestId,
      isError: false,
      request: this.request,
      response: data,
      loadingTime
    };
    this._beforeResponse(detail);
    if (this.onend) {
      this.onend();
      this.__endHandler = undefined;
    }
  }

  _processResponseError(message, log) {
    console.warn(log);
    const detail = {
      isXhr: true,
      id: this.requestId,
      isError: true,
      request: this.request,
      error: new Error(message)
    };
    this._beforeResponse(detail);
    if (this.onend) {
      this.onend();
      this.__endHandler = undefined;
    }
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
