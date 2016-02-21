'use strict';
/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
/* global chrome, Request, Headers, ArcEventSource, ArcRequest, ArcResponse */
/**
 * A SocketFetch class is similar to fetch API but it uses chrome.socket as a transport.
 *
 * This library require Zlib to run.
 *
 * @example
 * <code>
 * let request = SocketFetch('http://domain.com').fetch().then((response) => {
 *   if (response.ok) {
 *     return response.json();
 *   }
 * });
 * </code>
 */
class SocketFetch extends ArcEventSource {
  /**
   * Partially based on
   * https://github.com/ahmadnassri/chrome.sockets.tcp.xhr/
   *
   *
   *
   * @constructor
   * @property {String} url Defines the resource that you wish to fetch. This can either be:
   * A USVString containing the direct URL of the resource you want to fetch.
   * 
   * @param {String|ArcRequest|Request} url An URL, {@link Request} or {@link ArcRequest} object.
   * @property {Object} opts (Optional) An options object containing any custom settings that you
   * want to apply to the request. The possible options are:
   * - method: The request method, e.g., GET, POST.
   * - headers: Any headers you want to add to your request, contained within a Headers object or
   *   an object literal with ByteString values.
   * - body: Any body that you want to add to your request: this can be a Blob, BufferSource,
   *   FormData, URLSearchParams, or USVString object. Note that a request using the GET or HEAD
   *   method cannot have a body.
   * - redirect: The redirect mode to use: follow or error. If follow is set the result will
   *   contain redairect information.
   */
  constructor(url, opts) {
    super();
    /**
     * A original request object.
     * This will contain data passed to the constructor.
     *
     * @type {Request}
     */
    this._request = this._createRequest(url, opts);
    /**
     * The Response interface of the Fetch API represents the response to a request.
     *
     * @type {Response}
     */
    this._response = undefined;

    this.debug = true;

    this._connection = {
      /**
       * True if current connection has been aborted
       */
      aborted: false,
      /**
       * Socket ID the instance is operating on
       */
      socketId: undefined,
      /** True when connection is timed out */
      timeout: false,
      /**
       * A reference to main resolve function
       */
      resolve: undefined,
      /**
       * A reference to main reject function.
       */
      reject: undefined,
      /**
       * A connection can be made only once in one instance. It fthe flag state is true then
       * the implementation will throw an error
       */
      started: false,
      host: undefined,
      post: 80
    };
    /**
     * A boolean property state represents the socket read status. It can be either:
     * STATUS (0) - expecting the message is contain a status line
     * HEADERS (1) - expecting the message is containing headers part of the message (headers are
     * optional)
     * BODY (2) - expecting to read a message body
     * DONE (3) - message has been fully read. This status can be set by readSocketError function
     * when server closes the connection.
     */
    this.state = 0;

    /**
     * A integer representing status code of the response.
     *
     * @type {Number}
     */
    this.status = undefined;
    /**
     * An optional string representing response status message
     *
     * @type {String}
     */
    this.statusMessage = undefined;
    /**
     * A read headers string. It may be incomplete if state equals HEADERS or STATUS.
     *
     * @type {String}
     */
    this.headers = undefined;
    /**
     * A read response body. It may be incomplete if readyState does not equals DONE.
     *
     * @type {Uint8Array}
     */
    this.body = undefined;
    /**
     * A shortcut for finding content-type header in a headers list. It can be either a getter
     * function that is looking for a Content-Type header or a value set after headers are parsed.
     *
     * @type {String}
     */
    this.contentType = undefined;
    /**
     * As a shortcut for finding Content-Length header in a headers list. It can be either a
     * getter function that is looking for a Content-Length header or a value set after headers
     * are parsed.
     *
     * @type {Number}
     */
    this.contentLength = undefined;
    /**
     * A shortcut for finding Content-Length header in a headers list. It can be either a getter
     * function that is looking for a Content-Length header or a value set after headers are parsed
     *
     * @type {Boolean}
     */
    this.chunked = undefined;
    /**
     * A flag determining that the response is chunked Transfer-Encoding. When Transfer-Encoding
     * header is set to "chunked" then the response will be split in chunks. Every chunk starts
     * with hex number of length in chunk followed by new line character (\r\n or CR or 13|10).
     * Because message received by the socket most probably will have different buffer size, the
     * `readSocketData()` function may contain more than one part of chunk or incomplete part of
     * chunk.
     *
     * @type {Number}
     */
    this.chunkSize = undefined;
    /**
     * A set of redirects.
     * 
     * @type {Set}
     */
    this.redirects = undefined;

    this._setupUrlData();
  }
  /**
   * Get a Request object.
   *
   * @type {Request}
   */
  get request() {
    return this._request;
  }
  /**
   * Get a Response object.
   *
   * @type {Response}
   */
  get response() {
    return this._response;
  }
  get protocol2port() {
    return {
      'http': 80,
      'https': 443,
      'ftp': 21
    };
  }
  get STATUS() {
    return 0;
  }
  get HEADERS() {
    return 1;
  }
  get BODY() {
    return 2;
  }
  get DONE() {
    return 3;
  }
  /**
   * Returns new promise and perform a request.
   *
   * @return {Promise} Fulfilled promise will result with Resposne object.
   */
  fetch() {
    return new Promise((resolve, reject) => {
      if (this._connection.aborted) {
        this._createResponse(true);
        resolve(this._response);
        return;
      }
      if (this._connection.started) {
        throw new Error('This connection has been made. Create a new class and use it instead.');
      }
      this._connection.started = true;
      this._connection._readFn = this.readSocketData.bind(this);
      this._connection._errorFn = this.readSocketError.bind(this);
      this._connection.reject = reject;
      this._connection.resolve = resolve;
      chrome.sockets.tcp.onReceive.addListener(this._connection._readFn);
      chrome.sockets.tcp.onReceiveError.addListener(this._connection._errorFn);
      this._createConnection();
    });
  }
  _createConnection() {
    var socketProperties = {
      name: 'arc'
    };
    chrome.sockets.tcp.create(socketProperties, (createInfo) => {
      this.log('Created socket', createInfo.socketId);
      this._connection.socketId = createInfo.socketId;
      this.log('Connecting to %s:%d', this._connection.host, this._connection.port);
      let promise;
      if (this._connection.port === 443) {
        promise = this._connectSecure(createInfo.socketId, this._connection.host, 
          this._connection.port);
      } else {
        promise = this._connect(createInfo.socketId, this._connection.host, this._connection.port);
      }
      promise.then(() => {
        this.log('Connected to socked for host: ', this._connection.host, ' and port ', 
          this._connection.port);
        this._readyState = 1;
        this._onConnected();
      }).catch((cause) => {
        this._readyState = 0;
        this._connection.reject(cause);
        this._cleanUp();
      });
    });
  }
  /**
   * Connect to a socket using secure connection.
   * Note that ths function will result with paused socket.
   * It must be unpaused after sending a data to remote host to receive a response.
   *
   * This method will throw an error when connection can't be made or was unable to secure the
   * conection.
   *
   * @param {Number} socketId ID of the socket that the instance is operating on.
   * @param {String} host A host name to connect to
   * @param {Number} port A port number to connect to.
   *
   * @return {Promise} Fulfilled promise when connection has been made. Rejected promise will
   * contain an Error object with description message.
   */
  _connectSecure(socketId, host, port) {
    return new Promise((resolve) => {
      chrome.sockets.tcp.setPaused(socketId, true, () => {
        chrome.sockets.tcp.connect(socketId, host, port, (connectResult) => {
          if (chrome.runtime.lastError) {
            this.log(chrome.runtime.lastError);
            throw new Error('Connection error.');
          }
          if (connectResult !== 0) {
            throw new Error('Connection to host ' + host + ' on port ' + port + ' unsuccessful');
          }
          chrome.sockets.tcp.secure(socketId, (secureResult) => {
            if (secureResult !== 0) {
              throw new Error('Unable to secure a connection to host ' + host + ' on port ' + port);
            }
            resolve();
          });
        });
      });
    });
  }

  /**
   * Connect to a socket. To use a secure connection call `_connectSecure` method.
   * Note that ths function will result with paused socket.
   * It must be unpaused after sending a data to remote host to receive a response.
   *
   * @param {Number} socketId ID of the socket that the instance is operating on.
   * @param {String} host A host name to connect to
   * @param {Number} port A port number to connect to.
   *
   * @return {Promise} Fulfilled promise when connection has been made. Rejected promise will
   * contain an Error object with description message.
   */
  _connect(socketId, host, port) {
    return new Promise((resolve) => {
      chrome.sockets.tcp.setPaused(socketId, true, () => {
        chrome.sockets.tcp.connect(socketId, host, port, (connectResult) => {
          if (chrome.runtime.lastError) {
            this.log(chrome.runtime.lastError);
            throw new Error('Connection error.');
          }
          if (connectResult !== 0) {
            throw new Error('Connection to host ' + host + ' on port ' + port + ' unsuccessful');
          }
          resolve();
        });
      });
    });
  }

  disconnect() {
    console.log('Disconnect');
    if (!this._connection.socketId) {
      return;
    }
    return new Promise((resolve) => {
      chrome.sockets.tcp.disconnect(this._connection.socketId, () => {
        if (chrome.runtime.lastError) {
          console.warn(chrome.runtime.lastError);
        }
        this._readyState = 0;
        chrome.sockets.tcp.close(this._connection.socketId, () => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError);
          }
          this._connection.socketId = undefined;
          resolve();
        });
      });
    });
  }

  log(...entry) {
    if (this.debug) {
      console.log.apply(console, entry);
    }
  }
  /**
   * Calling abort function will immidietly result with Promise rejection.
   * It will close the connection and clean up the resources.
   */
  abort() {
    this._connection.aborted = true;
    this._connection.reject(new Error('Couldn\'t find host.'));
    this._cleanUp();
  }
  /**
   * Create a request object.
   */
  _createRequest(url, opts) {
    if (this._connection.aborted) {
      return;
    }
    if (url instanceof Request ||
      url instanceof ArcRequest) {
      return new ArcRequest(url);
    }
    if (opts.headers) {
      opts.headers = new Headers(opts.headers);
    }
    var defaults = {
      'method': 'GET',
      'redirect': 'follow'
    };
    opts = Object.assign(defaults, opts);
    if (['GET', 'HEADER'].indexOf(opts.method.toUpperCase()) !== -1) {
      delete opts.body;
    }
    return new ArcRequest(url, opts);
  }
  /**
   * Create a response object.
   * 
   * @param {Boolean} includeRedirects If true the response will have information about redirects.
   * @return {ArcResponse} A response object.
   */
  _createResponse(includeRedirects) {
    if (this._connection.aborted) {
      return;
    }
    var options = {
      status: this.status,
      statusText: this.statusMessage,
      headers: this.headers
    };
    if (this.body) {
      this.body = this.decompressData(this.body);
    }
    this._response = new ArcResponse(this.body, options);
    this._response.setOriginalHeaders(this.headers);
    if (includeRedirects && this.redirects && this.redirects.size) {
      this._response.setRedirects(this.redirects);
    }
  }

  _onConnected() {
    if (this._connection.aborted) {
      return;
    }
    var buffer = this.generateMessage();
    this.log('Sending message.', buffer);
    chrome.sockets.tcp.send(this._connection.socketId, buffer, this.onSend.bind(this));
  }
  /**
   * Generate a message for socket.
   */
  generateMessage() {
    if (this._connection.aborted) {
      return;
    }
    var headers = [];
    headers.push(this._request.method + ' ' + this._request.uri.path() + ' HTTP/1.1');
    headers.push('HOST: ' + this._connection.host);
    this._request.headers.forEach((value, key) => headers.push(key + ': ' + value));
    var str = headers.join('\r\n') + '\r\n\r\n';
    this.log('Generated message to send', str);
    //this._request.arrayBuffer().then(function(file) {});
    return this.stringToArrayBuffer(str);
  }
  /**
   * Called when the message has been send to the remote host.
   */
  onSend(sendInfo) {
    if (this._connection.aborted) {
      return;
    }
    if (sendInfo.bytesWritten < 0) {
      this.log('Error writing to socket. Bytes sent: ' + sendInfo.bytesSent);
      this._connection.reject(new Error('Couldn\'t find host.'));
      this._cleanUp();
      return;
    }
    chrome.sockets.tcp.setPaused(this._connection.socketId, false);
    this.log('Written message. Bytes sent: ' + sendInfo.bytesSent);
  }

  readSocketData(readInfo) {
    if (this._connection.aborted) {
      return;
    }
    if (readInfo) {
      chrome.sockets.tcp.setPaused(this._connection.socketId, true);
      try {
        this._processSocketMessage(readInfo.data);
      } catch (e) {
        console.error('Fix me please', e);
      }
      chrome.sockets.tcp.setPaused(this._connection.socketId, false);
    }
  }

  readSocketError(info) {
    if (this._connection.aborted) {
      return;
    }
    console.log('readSocketError');
    if (info.socketId !== this._connection.socketId) {
      return;
    }
    var code = Math.abs(info.resultCode);
    if (code === 100) {
      //connection has been closed by the remote server.
      this.onResponseReady();
      return;
    }
    var message = this.getCodeMessage(code);
    this.log('readSocketError:', message, code);
    if (this.state !== this.DONE && this._connection.reject) {
      this._connection.reject(new Error(message));
    }
  }

  /**
   * Process received message.
   *
   * @param {ArrayBuffer} data Received message.
   */
  _processSocketMessage(data) {
    if (this._connection.aborted) {
      return;
    }
    data = new Uint8Array(data);
    //this.log('has message', data);
    if (this.state === this.DONE) {
      return;
    }
    if (this.state === this.STATUS) {
      data = this._processStatus(data);
      if (data === null) {
        return;
      }
    }
    if (this.state === this.HEADERS) {
      data = this._processHeaders(data);
      if (data === null) {
        return;
      }
    }
    if (this.state === this.BODY) {
      this._processBody(data);
      return;
    }
    throw new Error('Unknown state: ' + this.state);
  }
  /**
   * Read status line from the response.
   * This function will set `status` and `statusMessage` fields
   * and then will set `state` to HEADERS.
   */
  _processStatus(data) {
    if (this._connection.aborted) {
      return;
    }
    var index = this.indexOfSubarray(data, [13, 10]);
    var statusArray = data.subarray(0, index);
    data = data.subarray(index + 2);
    var statusLine = this.arrayBufferToString(statusArray);
    statusLine = statusLine.replace(/HTTP\/\d(\.\d)?\s/, '');
    var status = statusLine.substr(0, statusLine.indexOf(' '));
    try {
      this.status = parseInt(status);
    } catch (e) {
      this.status = 0;
    }
    this.statusMessage = statusLine.substr(statusLine.indexOf(' ') + 1);
    this.state = this.HEADERS;
    return data;
  }
  _processHeaders(data) {
    if (this._connection.aborted) {
      return;
    }
    if (!this.headers) {
      this.headers = '';
    }
    var index = this.indexOfSubarray(data, [13, 10, 13, 10]);
    if (index === -1) {
      //end in next chunk
      this.headers += this.arrayBufferToString(data);
      return null;
    }
    var headersArray = data.subarray(0, index);
    this.headers += this.arrayBufferToString(headersArray);
    this._parseHeaders();
    this.state = this.BODY;
    data = data.subarray(index + 4);
    if (data.length === 0) {
      return null;
    }
    return data;
  }
  /**
   * Process data.
   * 
   * @param {Uint8Array} data A data to process
   */
  _processBody(data) {
    if (this._connection.aborted) {
      return;
    }
    if (this.chunked) {
      while (true) {
        if (!this.chunkSize) {
          data = this.readChunkSize(data);
          console.log('Chunk size: ', this.chunkSize);
          if (!this.chunkSize) {
            this.onResponseReady();
            return;
          }
        }
        let size = Math.min(this.chunkSize, data.length);
        console.log('Part size: ', size);
        if (!this.body) {
          console.log('Creating new body');
          this.body = new Uint8Array(data.subarray(0, size));
        } else {
          console.log('Appending to the body');
          let bodySize = size + this.body.length;
          let body = new Uint8Array(bodySize);
          body.set(this.body);
          body.set(data.subarray(0, size), this.body.length);
          this.body = body;
        }
        this.chunkSize -= size;
        console.log('Body size is: ', this.body.length, ' and chunk size is left is: ',
          this.chunkSize);
        data = data.subarray(size + 2); // + CR
        if (data.length === 0) {
          console.log('No more data here. Waiting for new chunk');
          return;
        }
      }
    } else {
      if (!this.body) {
        this.body = new Uint8Array(data.length);
        this.body.set(data);
      } else {
        let len = this.body.length;
        let sumLength = len + data.length;
        let newArray = new Uint8Array(sumLength);
        newArray.set(this.body);
        newArray.set(data, len);
        this.body = newArray;
        if (newArray.length >= this.contentLength) {
          this.onResponseReady();
        }
      }
    }
  }
  /**
   * This method is called when the response is ready to serve.
   * It the response contain an information about the redirection 
   * it will connect again to redirect URL if initial option `redirect` is set to `follow` 
   * (default) or it with throw an error if it is set to `error`.
   */
  onResponseReady() {
    if (this._connection.aborted) {
      return;
    }
    if (this.state === this.DONE) {
      return;
    }
    this.state = this.DONE;
    
    if (this.status >= 300 && this.status < 400) {
      if (this.redirect === 'error') {
        this._connection.reject({
          'message': 'Redirects are not allowed',
          'redirect': true
        });
        this._cleanUp();
        return;
      }
      let location = null;
      if (this.headers && this.headers.has('Location')) {
        location = this.headers.get('Location');
      }
      // this is a redirect;
      this.dispatchEvent(new CustomEvent('beforeredirect', {
        detail: {
          location: location
        }
      }));
      if (!this.redirects) {
        this.redirects = new Set();
      }
      this._createResponse(false);
      this.redirects.add(this._response);
      this._cleanUpRedirect()
      .then(() => {
        this._request.url = location;
        this._setupUrlData();
        this._createConnection();
      });
    } else {
      this.dispatchEvent(new CustomEvent('load', {
        detail: {
          resutl: this.response
        }
      }));
      this._createResponse(true);
      this._connection.resolve(this._response);
      this._cleanUp();
    }
  }
  /**
   * After the connection is closed an result returned this method will release resources.
   */
  _cleanUp() {
    this._cleanUpRedirect();
    this._connection.reject = undefined;
    this._connection.resolve = undefined;
    chrome.sockets.tcp.onReceive.removeListener(this._connection._readFn);
    chrome.sockets.tcp.onReceiveError.removeListener(this._connection._errorFn);
    this._connection._readFn = undefined;
    this._connection._errorFn = undefined;
    this.redirects = undefined;
  }
  /** Clean up for redirect */
  _cleanUpRedirect() {
    return this.disconnect()
    .then(() => {
      this.body = undefined;
      this.headers = undefined;
      this.chunkSize = undefined;
      this.chunked = undefined;
      this.contentLength = undefined;
      this.contentType = undefined;
      this.statusMessage = undefined;
      this.status = undefined;
      this.state = this.STATUS;
      this._connection.host = undefined;
      this._connection.port = undefined;
      this._response = undefined;
    });
  }
  /**
   * If response's Transfer-Encoding is 'chunked' read until next CR. Everything before it is a 
   * chunk size.
   * This method will set {@link #chunkSize} to read value.
   * 
   * @param {Uint8Array} array
   * @returns {Uint8Array} Truncated response without chunk size line
   */
  readChunkSize(array) {
    if (this._connection.aborted) {
      return;
    }
    var index = this.indexOfSubarray(array, [13, 10]);
    if (index === -1) {
      //not found in this portion of data.
      return array;
    }
    var sizeArray = array.subarray(0, index);
    var sizeHex = this.arrayBufferToString(sizeArray);
    this.chunkSize = parseInt(sizeHex, 16);
    return array.subarray(index + 2);
  }
  /**
   * This function assumes that all the headers has been read and it's just before changing
   * the ststaus to BODY.
   */
  _parseHeaders() {
    if (this._connection.aborted) {
      return;
    }
    var list = this.headersToObject(this.headers);
    this.log('Received headers list', this.headers, list);
    this.headers = new Headers(list);
    if (this.headers.has('Content-Type')) {
      this.contentType = this.headers.get('Content-Type');
    }
    if (this.headers.has('Content-Length')) {
      this.contentLength = this.headers.get('Content-Length');
    }
    if (this.headers.has('Transfer-Encoding')) {
      let tr = this.headers.get('Transfer-Encoding');
      if (tr === 'chunked') {
        this.chunked = true;
      }
    }
  }
  /**
   * After the message is received check if the response has been compressed.
   * If so, decompress the data.
   * 
   * @param {Uint8Array} data Received data
   * @return {Uint8Array} Decompressed data.
   */
  decompressData(data) {
    if (this._connection.aborted) {
      return data;
    }
    if (this._connection.aborted) {
      return data;
    }
    if (!this.headers || !this.headers.has('Content-Encoding')) {
      return data;
    }
    var ce = this.headers.get('Content-Encoding');
    if (ce.indexOf('gzip') !== -1) {
      let inflate = new Zlib.Gunzip(data);
      data = inflate.decompress();
    } else if (ce.indexOf('deflate') !== -1) {
      var inflate = new Zlib.Inflate(data);
      data = inflate.decompress();
    }
    return data;
  }
  /**
   * Parse headers string and receive an object.
   *
   * @param {String} headersString A headers string as defined in the spec
   * @return {Object} And object of key-value pairs where key is a
   */
  headersToObject(headersString) {
    if (this._connection.aborted) {
      return [];
    }
    if (headersString === null || headersString.trim() === '') {
      return [];
    }
    if (typeof headersString !== 'string') {
      throw new Error('Headers must be a String.');
    }
    const result = {};
    const headers = headersString.split(/\n/gim);

    for (let i = 0, len = headers.length; i < len; i++) {
      let line = headers[i].trim();
      if (line === '') {
        continue;
      }
      let sepPosition = line.indexOf(':');
      if (sepPosition === -1) {
        result[line] = '';
        continue;
      }
      let name = line.substr(0, sepPosition);
      let value = line.substr(sepPosition + 1).trim();
      if (name in result) {
        result[name] += '; ' + value;
      } else {
        result[name] = value;
      }
    }
    return result;
  }
  /**
   * @return Returns an index of first occurance of subArray sequence in inputArray or -1 if not
   * found.
   */
  indexOfSubarray(inputArray, subArray) {
    if (this._connection.aborted) {
      return -1;
    }
    var result = -1;
    var len = inputArray.length;
    var subLen = subArray.length;
    for (let i = 0; i < len; ++i) {
      if (result !== -1) {
        return result;
      }
      if (inputArray[i] !== subArray[0]) {
        continue;
      }
      result = i;
      for (let j = 1; j < subLen; j++) {
        if (inputArray[i + j] === subArray[j]) {
          result = i;
        } else {
          result = -1;
          break;
        }
      }
    }
    return result;
  }
  /**
   * Convert ArrayBuffer to readable form
   * @param {ArrayBuffer} buff
   * @returns {String} Converted string
   */
  arrayBufferToString(buff) {
    if (this._connection.aborted) {
      return '';
    }
    var array = new Uint8Array(buff);
    var str = '';
    for (var i = 0; i < array.length; ++i) {
      str += String.fromCharCode(array[i]);
    }
    return str;
  }
  /**
   * Convert a string to an ArrayBuffer.
   * @param {string} string The string to convert.
   * @return {ArrayBuffer} An array buffer whose bytes correspond to the string.
   * @returns {ArrayBuffer}
   */
  stringToArrayBuffer(string) {
    if (this._connection.aborted) {
      return new ArrayBuffer();
    }
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }

  _setupUrlData() {
    let port = this._request.uri.port();
    if (!port) {
      let protocol = this._request.uri.protocol();
      if (protocol in this.protocol2port) {
        port = this.protocol2port[protocol];
      } else {
        port = 80;
      }
      this._request.uri.port(port);
    }
    this._connection.port = parseInt(port);
    this._connection.host = this._request.uri.host().replace(':' + port, '');
  }

  getCodeMessage(code) {
    var errorCodes = {
      1: 'An asynchronous IO operation is not yet complete.',
      2: 'A generic failure occurred.',
      3: 'An operation was aborted (due to user action)',
      4: 'An argument to the function is incorrect.',
      5: 'The handle or file descriptor is invalid',
      6: 'The file or directory cannot be found',
      7: 'An operation timed out',
      8: 'The file is too large',
      9: 'An unexpected error.  This may be caused by a programming mistake or an invalid ' +
      'assumption',
      10: 'Permission to access a resource, other than the network, was denied',
      11: 'The operation failed because of unimplemented functionality',
      12: 'There were not enough resources to complete the operation',
      13: 'Memory allocation failed',
      14: 'The file upload failed because the file\'s modification time was different from the ' +
      'expectation',
      15: 'The socket is not connected',
      16: 'The file already exists',
      17: 'The path or file name is too long',
      18: 'Not enough room left on the disk',
      19: 'The file has a virus',
      20: 'The client chose to block the request',
      21: 'The network changed',
      22: 'The request was blocked by the URL blacklist configured by the domain administrator',
      23: 'The socket is already connected',
      100: 'A connection was closed (corresponding to a TCP FIN)',
      101: 'A connection was reset (corresponding to a TCP RST)',
      102: 'A connection attempt was refused',
      103: 'A connection timed out as a result of not receiving an ACK for data sent. This can ' +
      'include a FIN packet that did not get ACK\'d',
      104: 'A connection attempt failed',
      105: 'The host name could not be resolved',
      106: 'The Internet connection has been lost',
      107: 'An SSL protocol error occurred',
      108: 'The IP address or port number is invalid (e.g., cannot connect to the IP address 0 ' +
      'or the port 0)',
      109: 'The IP address is unreachable.  This usually means that there is no route to the ' +
      'specified host or network',
      110: 'The server requested a client certificate for SSL client authentication',
      111: 'A tunnel connection through the proxy could not be established',
      112: 'No SSL protocol versions are enabled',
      113: 'The client and server don\'t support a common SSL protocol version or cipher suite',
      114: 'The server requested a renegotiation (rehandshake)',
      115: 'The proxy requested authentication (for tunnel establishment) with an unsupported ' +
      'method',
      116: 'During SSL renegotiation (rehandshake), the server sent a certificate with an error',
      117: 'The SSL handshake failed because of a bad or missing client certificate',
      118: 'A connection attempt timed out',
      119: 'There are too many pending DNS resolves, so a request in the queue was aborted',
      120: 'Failed establishing a connection to the SOCKS proxy server for a target host',
      121: 'The SOCKS proxy server failed establishing connection to the target host because ' +
      'that host is unreachable',
      122: 'The request to negotiate an alternate protocol failed',
      123: 'The peer sent an SSL no_renegotiation alert message',
      124: 'Winsock sometimes reports more data written than passed.  This is probably due to a ' +
      'broken LSP',
      125: 'An SSL peer sent us a fatal decompression_failure alert.',
      126: 'An SSL peer sent us a fatal bad_record_mac alert',
      127: 'The proxy requested authentication (for tunnel establishment)',
      128: 'A known TLS strict server didn\'t offer the renegotiation extension',
      129: 'The SSL server attempted to use a weak ephemeral Diffie-Hellman key',
      130: 'Could not create a connection to the proxy server.',
      131: 'A mandatory proxy configuration could not be used.',
      133: 'We\'ve hit the max socket limit for the socket pool while preconnecting.',
      134: 'The permission to use the SSL client certificate\'s private key was denied',
      135: 'The SSL client certificate has no private key',
      136: 'The certificate presented by the HTTPS Proxy was invalid',
      137: 'An error occurred when trying to do a name resolution (DNS)',
      138: 'Permission to access the network was denied.',
      139: 'The request throttler module cancelled this request to avoid DDOS',
      140: 'A request to create an SSL tunnel connection through the HTTPS proxy received a ' +
      'non-200 (OK) and non-407 (Proxy Auth) response.',
      141: 'We were unable to sign the CertificateVerify data of an SSL client auth handshake ' +
      'with the client certificate\'s private key',
      142: 'The message was too large for the transport',
      143: 'A SPDY session already exists, and should be used instead of this connection',
      145: 'Websocket protocol error.',
      146: 'Connection was aborted for switching to another ptotocol.',
      147: 'Returned when attempting to bind an address that is already in use',
      148: 'An operation failed because the SSL handshake has not completed',
      149: 'SSL peer\'s public key is invalid',
      150: 'The certificate didn\'t match the built-in public key pins for the host name',
      151: 'Server request for client certificate did not contain any types we support',
      152: 'Server requested one type of cert, then requested a different type while the first ' +
      'was still being generated',
      153: 'An SSL peer sent us a fatal decrypt_error alert. ',
      154: 'There are too many pending WebSocketJob instances, so the new job was not pushed ' +
      'to the queue',
      155: 'There are too many active SocketStream instances, so the new connect request was ' +
      'rejected',
      156: 'The SSL server certificate changed in a renegotiation',
      157: 'The SSL server indicated that an unnecessary TLS version fallback was performed',
      158: 'Certificate Transparency: All Signed Certificate Timestamps failed to verify',
      159: 'The SSL server sent us a fatal unrecognized_name alert',
      300: 'The URL is invalid',
      301: 'The scheme of the URL is disallowed',
      302: 'The scheme of the URL is unknown',
      310: 'Attempting to load an URL resulted in too many redirects',
      311: 'Attempting to load an URL resulted in an unsafe redirect (e.g., a redirect to file: ' +
      'is considered unsafe)',
      312: 'Attempting to load an URL with an unsafe port number.',
      320: 'The server\'s response was invalid',
      321: 'Error in chunked transfer encoding',
      322: 'The server did not support the request method',
      323: 'The response was 407 (Proxy Authentication Required), yet we did not send the ' +
      'request to a proxy',
      324: 'The server closed the connection without sending any data',
      325: 'The headers section of the response is too large',
      326: 'The PAC requested by HTTP did not have a valid status code (non-200)',
      327: 'The evaluation of the PAC script failed',
      328: 'The response was 416 (Requested range not satisfiable) and the server cannot ' +
      'satisfy the range requested',
      329: 'The identity used for authentication is invalid',
      330: 'Content decoding of the response body failed',
      331: 'An operation could not be completed because all network IO is suspended',
      332: 'FLIP data received without receiving a SYN_REPLY on the stream',
      333: 'Converting the response to target encoding failed',
      334: 'The server sent an FTP directory listing in a format we do not understand',
      335: 'Attempted use of an unknown SPDY stream id',
      336: 'There are no supported proxies in the provided list',
      337: 'There is a SPDY protocol error',
      338: 'Credentials could not be established during HTTP Authentication',
      339: 'An HTTP Authentication scheme was tried which is not supported on this machine',
      340: 'Detecting the encoding of the response failed',
      341: '(GSSAPI) No Kerberos credentials were available during HTTP Authentication',
      342: 'An unexpected, but documented, SSPI or GSSAPI status code was returned',
      343: 'The environment was not set up correctly for authentication',
      344: 'An undocumented SSPI or GSSAPI status code was returned',
      345: 'The HTTP response was too big to drain',
      346: 'The HTTP response contained multiple distinct Content-Length headers',
      347: 'SPDY Headers have been received, but not all of them - status or version headers ' +
      'are missing, so we\'re expecting additional frames to complete them',
      348: 'No PAC URL configuration could be retrieved from DHCP.',
      349: 'The HTTP response contained multiple Content-Disposition headers',
      350: 'The HTTP response contained multiple Location headers',
      351: 'SPDY server refused the stream. Client should retry. This should never be a ' +
      'user-visible error',
      352: 'SPDY server didn\'t respond to the PING message',
      353: 'The request couldn\'t be completed on an HTTP pipeline. Client should retry',
      354: 'The HTTP response body transferred fewer bytes than were advertised by the ' +
      'Content-Length header when the connection is closed',
      355: 'The HTTP response body is transferred with Chunked-Encoding, but the terminating ' +
      'zero-length chunk was never sent when the connection is closed',
      356: 'There is a QUIC protocol error',
      357: 'The HTTP headers were truncated by an EOF',
      358: 'The QUIC crytpo handshake failed.',
      359: 'An https resource was requested over an insecure QUIC connection',
      501: 'The server\'s response was insecure (e.g. there was a cert error)',
      502: 'The server responded to a <keygen> with a generated client cert that we don\'t ' +
      'have the matching private key for',
      503: 'An error adding to the OS certificate database (e.g. OS X Keychain)',
      800: 'DNS resolver received a malformed response',
      801: 'DNS server requires TCP',
      802: 'DNS server failed.',
      803: 'DNS transaction timed out',
      804: 'The entry was not found in cache, for cache-only lookups',
      805: 'Suffix search list rules prevent resolution of the given host name',
      806: 'Failed to sort addresses according to RFC3484'
    };
    if (code in errorCodes) {
      return errorCodes[code];
    } else {
      return 'Unknown error';
    }
  }
}
