/**
 * Copyright 2016 Pawel Psztyc, The ARC team
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
 */
import {RequestBase} from './request-base.js';
import {ArcHeaders} from './arc-headers.js';
import {RequestUtils} from './utils.js';
import {PayloadSupport} from './payload-support.js';
import {NtlmAuth} from './auth/ntlm.js';
import {BasicAuth} from './auth/basic.js';
// import {DigestAuth} from './auth/digest.js';
/**
 * A RequestSocket class is similar to fetch API but it uses chrome.socket as a transport.
 *
 * This library require Zlib to run.
 *
 * ```
 * let request = RequestSocket('http://domain.com').fetch().then((response) => {
 *   if (response.ok) {
 *     return response.json();
 *   }
 * });
 * ```
 */
export class RequestSocket extends RequestBase {
  /* global chrome */
  /**
   * Constructs the request from ARC's request object
   *
   * @param {Object} request ARC's request object
   * @param {Object} options Optional. Request configuration options
   * - `timeout` {Number} Request timeout. Default to 0 (no timeout)
   * - `followRedirects` {Boolean} Fllow request redirects. Default `true`.
   * - `hosts` {Array} List of host rules to apply to the connection. Each
   * rule must contain `from` and `to` properties to be applied.
   */
  constructor(request, options) {
    super(request, options);
    this.state = 0;
    this.dataReceived = false;

    this._onSocketData = this._onSocketData.bind(this);
    this._onSocketError = this._onSocketError.bind(this);
  }
  /**
   * Status indicating thet expecting a ststus message.
   *
   * @default 0
   */
  static get STATUS() {
    return 0;
  }
  /**
   * Status indicating thet expecting headers.
   *
   * @default 1
   */
  static get HEADERS() {
    return 1;
  }
  /**
   * Status indicating thet expecting a body message.
   *
   * @default 2
   */
  static get BODY() {
    return 2;
  }
  /**
   * Status indicating thet the message has been read and
   * connection is closing or closed.
   *
   * @default 0
   */
  static get DONE() {
    return 3;
  }
  /**
   * Cleans the state after finished.
   */
  _cleanUp() {
    super._cleanUp();
    this.state = RequestSocket.STATUS;
    this._rawHeaders = undefined;
    this.dataReceived = false;
  }
  /**
   * Cleans up the state for redirect.
   */
  _cleanUpRedirect() {
    super._cleanUpRedirect();
    this.state = RequestSocket.STATUS;
    this._rawHeaders = undefined;
    this.dataReceived = false;
  }
  /**
   * Sends the request.
   *
   * @return {Promise}
   */
  send() {
    this.abort();
    this.aborted = false;
    this.state = RequestSocket.STATUS;
    return this.connect()
    .then(() => this.prepareMessage())
    .then((message) => this.writeMessage(message))
    .catch((cause) => {
      this.abort();
      this._errorRequest({message: cause.message});
      // throw cause;
    });
  }

  /**
   * Prepares a HTTP message from ARC's request object.
   *
   * @return {Promise} Resolved promise to an `ArrayBuffer`.
   */
  prepareMessage() {
    let payload = this.arcRequest.payload;
    if (['get', 'head'].indexOf(this.arcRequest.method.toLowerCase()) !== -1) {
      payload = undefined;
    }
    const headers = new ArcHeaders(this.arcRequest.headers);
    return PayloadSupport.payloadToBuffer(payload, headers)
    .then((buffer) => {
      RequestUtils.addContentLength(this.arcRequest.method, buffer, headers);
      this._handleAuthorization(headers);
      this.arcRequest.headers = headers.toString();
      return this._prepareMessage(buffer);
    })
    .then((message) => {
      if (this.auth) {
        // This restores altered by authorization original headers
        // so it can be safe to use when redirecting
        if (this.auth.headers) {
          this.arcRequest.headers = this.auth.headers;
          delete this.auth.headers;
        }
      }
      return message;
    });
  }
  /**
   * Sends a data to a socket.
   *
   * @param {Buffer} buffer HTTP message to send
   * @return {Promise}
   */
  writeMessage(buffer) {
    let msg = PayloadSupport.arrayBufferToString(buffer);
    const limit = this.opts.sentMessageLimit;
    if (limit && limit > 0 && msg.length >= limit) {
      msg = msg.substr(0, limit) + ' ...';
    }
    this.arcRequest.sentHttpMessage = msg;
    this.stats.messageStart = performance.now();
    return new Promise((resolve) => {
      chrome.sockets.tcp.send(this.socketId, buffer, () => {
        this.stats.sentTime = performance.now();
        try {
          this.dispatchEvent(new CustomEvent('loadstart', {
            detail: {
              id: this.id
            }
          }));
        } catch (_) {}
        resolve();
      });
    });
  }

  /**
   * Connects to a server and sends the message.
   *
   * @return {Promise} Promise resolved when socket is connected.
   */
  connect() {
    const port = RequestUtils.getPort(this.uri.port, this.uri.protocol);
    const host = this.uri.hostname;
    return this._createConnection()
    .then(() => {
      if (port === 443 || this.uri.protocol === 'https:') {
        return this._connectTls(port, host);
      } else {
        return this._connect(port, host);
      }
    })
    .then(() => {
      if (this.timeout && this.timeout > 0) {
        this.setTimeout(this.timeout);
      }
      this._addSocketListeners();
      chrome.sockets.tcp.setPaused(this.socketId, false);
    });
  }
  /**
   * Creates a socket and sets `socketId` property.
   * @return {Promise} Promise resolved when socket is created.
   */
  _createConnection() {
    if (this.socketId) {
      this.logger.log('Reusing last socket and connection');
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const socketProperties = {
        name: 'arc-request-' + this.id
      };
      chrome.sockets.tcp.create(socketProperties, (createInfo) => {
        this.socketId = createInfo.socketId;
        resolve();
      });
    });
  }

  /**
   * Connects to a server and writtes a message using insecured connection.
   *
   * @param {Number} port A port number to connect to.
   * @param {String} host A host name to connect to
   * @return {Promise} A promise resolved when the message was sent to a server
   */
  _connect(port, host) {
    return new Promise((resolve, reject) => {
      this.stats.connectionTime = performance.now();
      chrome.sockets.tcp.setPaused(this.socketId, true, () => {
        chrome.sockets.tcp.connect(this.socketId, host, port, (connectResult) => {
          if (chrome.runtime.lastError) {
            this.logger.log(chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (connectResult !== 0) {
            reject(new Error('Connection to host ' + host + ' on port ' + port + ' unsuccessful'));
            return;
          }
          this.stats.lookupTime = performance.now();
          this.stats.connectedTime = performance.now();
          resolve();
        });
      });
    });
  }
  /**
   * Connects to a server using secured connection.
   *
   * @param {Number} port A port number to connect to.
   * @param {String} host A host name to connect to
   * @return {Promise} A promise resolved when the message was sent to a server
   */
  _connectTls(port, host) {
    return this._connect(port, host)
    .then(() => this._secureConnection(port, host));
  }
  /**
   * Uses Chrome APIs to secure the socket.
   *
   * @param {Number} port A port number to connect to.
   * @param {String} host A host name to connect to
   * @return {Promise} A promise resolved when the socket uses TLS tunnel.
   */
  _secureConnection(port, host) {
    return new Promise((resolve, reject) => {
      this.stats.secureStartTime = performance.now();
      chrome.sockets.tcp.secure(this.socketId, (secureResult) => {
        if (chrome.runtime.lastError) {
          this.logger.log(chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (secureResult !== 0) {
          reject(new Error('Unable to secure a connection to host ' + host + ' on port ' + port));
          return;
        }
        this.stats.secureConnectedTime = performance.now();
        resolve();
      });
    });
  }
  /**
   * Chrome sockets API do not allows to set socket timeout.
   * This imitates this behavior by setting window timeout to disconnect the socket
   * after set timeout. Call `clearTimeout()` to cancel the timer.
   * @param {Number} timeout Timeout in ms.
   */
  setTimeout(timeout) {
    this._socketTimeout = setTimeout(() => {
      this.abort();
    }, timeout);
  }
  /**
   * Clears socket timeout.
   */
  clearTimeout() {
    if (this._socketTimeout === undefined) {
      return;
    }
    clearTimeout(this._socketTimeout);
    this._socketTimeout = undefined;
  }
  /**
   * Prepares a full HTTP message body
   *
   * @param {?Buffer} buffer Optional, body `Buffer`
   * @return {Buffer} `Buffer` of a HTTP message
   */
  _prepareMessage(buffer) {
    const headers = [];
    const search = this.uri.search;
    let path = this.uri.pathname;
    if (search) {
      path += search;
    }
    headers.push(this.arcRequest.method + ' ' + path + ' HTTP/1.1');
    if (this._hostRequired()) {
      headers.push('Host: ' + this.hostHeader);
    }
    let str = headers.join('\r\n');
    if (this.arcRequest.headers) {
      str += '\r\n';
      str += PayloadSupport.normalizeString(this.arcRequest.headers);
    }
    const startbuffer = PayloadSupport.stringToArrayBuffer(str);
    const endBuffer = new Uint8Array([13, 10, 13, 10]).buffer;
    let body;
    if (buffer) {
      body = PayloadSupport.concatBuffers(startbuffer, endBuffer, buffer);
    } else {
      body = PayloadSupport.concatBuffers(startbuffer, endBuffer);
    }
    return body;
  }
  /**
   * Tests if current connection is required to add `host` header.
   * It returns `false` only if `host` header has been already provided.
   *
   * @return {Boolean} True when the `host` header should be added to the
   * headers list.
   */
  _hostRequired() {
    const headers = this.arcRequest.headers;
    if (typeof headers !== 'string') {
      return true;
    }
    return !this._hostTestReg.test(headers);
  }
  /**
   * Alters authorization header depending on the `auth` object
   * @param {ArcHeaders} headers A headers object where to append headers if
   * needed
   */
  _handleAuthorization(headers) {
    const auth = this.arcRequest.auth;
    if (!auth) {
      return;
    }
    switch (auth.method) {
      case 'ntlm':
        this._authorizeNtlm(auth, headers);
        return;
      case 'basic':
        this._authorizeBasic(auth, headers);
        return;
      // case 'digest':
      //   this._authorizeDigest(auth, headers);
      //   return;
    }
  }
  /**
   * Authorize the request with NTLM
   * @param {Object} authData Credentials to use
   * @param {ArcHeaders} headers A headers object where to append headers if
   * needed
   */
  _authorizeNtlm(authData, headers) {
    authData.url = this.arcRequest.url;
    const auth = new NtlmAuth(authData);
    if (!this.auth) {
      this.auth = {
        method: 'ntlm',
        state: 0,
        headers: headers.toString()
      };
      const msg = auth.createMessage1(this.uri.host);
      headers.set('Authorization', 'NTLM ' + msg.toBase64());
    } else if (this.auth && this.auth.state === 1) {
      const msg = auth.createMessage3(this.auth.challengeHeader, this.uri.host);
      this.auth.state = 2;
      headers.set('Authorization', 'NTLM ' + msg.toBase64());
    }
  }
  /**
   * Authorize the request with Basic method
   * @param {Object} authData Credentials to use
   * @param {ArcHeaders} headers A headers object where to append headers if
   * needed
   */
  _authorizeBasic(authData, headers) {
    const auth = new BasicAuth(authData);
    headers.set('Authorization', 'Basic ' + auth.getHash());
  }

  // _authorizeDigest(authData, headers) {
  //   const auth = new DigestAuth(authData, headers);
  // }

  /**
   * Add event listeners to existing socket.
   */
  _addSocketListeners() {
    chrome.sockets.tcp.onReceive.addListener(this._onSocketData);
    chrome.sockets.tcp.onReceiveError.addListener(this._onSocketError);
  }

  _removeSocketListeners() {
    chrome.sockets.tcp.onReceive.removeListener(this._onSocketData);
    chrome.sockets.tcp.onReceiveError.removeListener(this._onSocketError);
  }
  /**
   * Reports response after processing it.
   */
  _reportResponse() {
    this._removeSocketListeners();
    if (this.aborted) {
      return;
    }
    this.stats.lastReceivedTime = performance.now();
    const status = this._response.status;
    if (status >= 300 && status < 400) {
      if (this.followRedirects && this._reportRedirect(status)) {
        return;
      }
    } else if (status === 401 && this.auth) {
      switch (this.auth.method) {
        case 'ntlm':
          this.handleNtlmResponse();
          return;
      }
    }
    this._endRequest();
  }

  /**
   * Handles the response with NTLM authorization
   */
  handleNtlmResponse() {
    if (this.auth.state === 0) {
      if (this._response._headers.has('www-authenticate')) {
        this.auth.state = 1;
        this.auth.challengeHeader =
          this._response._headers.get('www-authenticate');
        this._cleanUpRedirect();
        this.prepareMessage()
        .then((message) => this.writeMessage(message));
        return;
      }
    }
    delete this.auth;
    this._endRequest();
  }

  _endRequest() {
    this.dispatchEvent(new CustomEvent('loadend', {
      detail: {
        id: this.id
      }
    }));
    this._publishResponse({
      includeRedirects: true
    });
  }

  _onSocketData(readInfo) {
    if (readInfo.socketId !== this.socketId) {
      return;
    }
    if (!this.dataReceived) {
      this.dataReceived = true;
      const now = performance.now();
      this.stats.firstReceiveTime = now;
      this.dispatchEvent(new CustomEvent('firstbyte', {
        id: this.id
      }));
    } else {
      this.stats.lastReceivedTime = performance.now();
    }
    if (this.aborted) {
      return;
    }

    if (readInfo) {
      this.logger.log('Has socket data');
      chrome.sockets.tcp.setPaused(this.socketId, true);
      try {
        this._processSocketMessage(readInfo.data);
      } catch (e) {
        if (this.state === RequestSocket.STATUS ||
          this.state === RequestSocket.HEADERS) {
          // The response is totally wrong!
          this._errorRequest({
            'message': e.message || 'Unknown error occurred'
          });
          return;
        }
        console.error('Error occured reading part of the message', e);
      }
      chrome.sockets.tcp.setPaused(this.socketId, false);
    }
  }

  _onSocketError(info) {
    if (info.socketId !== this.socketId) {
      return;
    }
    this._removeSocketListeners();
    if (this.aborted) {
      return;
    }
    const code = Math.abs(info.resultCode);
    this.logger.log('Exit code: ', code);
    if (code === 100) {
      // connection has been closed by the remote server.
      // this.onResponseReady();
      console.error('FIX ME!');
      return;
    }
    if (this.state !== RequestSocket.DONE) {
      this._errorRequest({code});
    }
  }

  /**
   * Process received message.
   *
   * @param {ArrayBuffer} data Received message.
   */
  _processSocketMessage(data) {
    if (this.aborted) {
      return;
    }
    if (this.state === RequestSocket.DONE) {
      return;
    }
    data = new Uint8Array(data);
    if (this.state === RequestSocket.STATUS) {
      data = this._processStatus(data);
      if (!data) {
        return;
      }
    }
    if (this.state === RequestSocket.HEADERS) {
      data = this._processHeaders(data);
      if (!data) {
        return;
      }
    }
    if (this.state === RequestSocket.BODY) {
      this._processBody(data);
      return;
    }
  }

  /**
   * Read status line from the response.
   * This function will set `status` and `statusText` fields
   * and then will set `state` to HEADERS.
   *
   * @param {ArrayBuffer} data Received data
   * @return {ArrayBuffer}
   */
  _processStatus(data) {
    if (this.aborted) {
      return;
    }
    this._response = {
      status: 0,
      statusText: ''
    };

    if (!data) {
      return;
    }

    this.logger.info('Processing status');
    const index = RequestUtils.indexOfSubarray(data, [13, 10]);
    if (index === -1) {
      this._errorRequest({
        'message': 'Unknown server response.'
      });
      return;
    }
    const statusArray = data.subarray(0, index);
    data = data.subarray(index + 2);
    let statusLine = PayloadSupport.arrayBufferToString(statusArray);
    statusLine = statusLine.replace(/HTTP\/\d(\.\d)?\s/, '');
    const delimPos = statusLine.indexOf(' ');
    let status;
    let msg = '';
    if (delimPos === -1) {
      status = statusLine;
    } else {
      status = statusLine.substr(0, delimPos);
      msg = statusLine.substr(delimPos + 1);
    }
    status = Number(status);
    if (status !== status) {
      status = 0;
    }
    if (msg && msg.indexOf('\n') !== -1) {
      msg = msg.split('\n')[0];
    }
    this._response.status = status;
    this._response.statusText = msg;
    this.logger.info('Received status',
      this._response.status,
      this._response.statusText);
    this.state = RequestSocket.HEADERS;
    return data;
  }

  /**
   * Read headers from the received data.
   *
   * @param {ArrayBuffer} data Received data
   * @return {ArrayBuffer} Remaining data in the buffer.
   */
  _processHeaders(data) {
    if (this.aborted) {
      return;
    }
    if (!data) {
      this._parseHeaders();
      return;
    }
    this.logger.info('Processing headers');
    // Looking for end of headers section
    let index = RequestUtils.indexOfSubarray(data, [13, 10, 13, 10]);
    let padding = 4;
    if (index === -1) {
      // It can also be 2x ASCII 10
      const _index = RequestUtils.indexOfSubarray(data, [10, 10]);
      if (_index !== -1) {
        index = _index;
        padding = 2;
      }
    }

    // https://github.com/jarrodek/socket-fetch/issues/3
    const enterIndex = RequestUtils.indexOfSubarray(data, [13, 10]);
    if (index === -1 && enterIndex !== 0) {
      // end in next chunk
      if (!this._rawHeaders) {
        this._rawHeaders = data;
      } else {
        this._rawHeaders = PayloadSupport.concatBuffers(this._rawHeaders, data);
      }
      return;
    }
    if (enterIndex !== 0) {
      let headersArray = data.subarray(0, index);
      if (!this._rawHeaders) {
        this._rawHeaders = headersArray;
      } else {
        this._rawHeaders = PayloadSupport.concatBuffers(this._rawHeaders, headersArray);
      }
    }
    this._parseHeaders(this._rawHeaders);
    delete this._rawHeaders;
    this.state = RequestSocket.BODY;
    const start = index === -1 ? 0 : index;
    const move = (enterIndex === 0) ? 2 : padding;
    data = data.subarray(start + move);
    return this._postHeaders(data);
  }
  /**
   * Check the response headers and end the request if nescesary.
   * @param {ArrayBuffer} data Current response data buffer
   * @return {ArrayBuffer}
   */
  _postHeaders(data) {
    if (this.arcRequest.method === 'HEAD') {
      this._reportResponse();
      return;
    }
    if (data.length === 0) {
      if (this._response._headers.has('Content-Length')) {
        // If the server do not close the connection and clearly indicate that
        // there are no further data to receive the app can close the connection
        // and prepare the response.
        let length = Number(this._response._headers.get('Content-Length'));
        // NaN never equals NaN. This is faster.
        if (length === length && length === 0) {
          this._reportResponse();
          return;
        }
      } else if (!this._response._headers.has('Transfer-Encoding') ||
        !this._response._headers.get('Transfer-Encoding')) {
        // Fix for https://github.com/jarrodek/socket-fetch/issues/6
        // There is no body in the response.
        this._reportResponse();
        return;
      }
      return;
    }
    return data;
  }
  /**
   * This function assumes that all headers has been read and it's
   * just before changing the ststaus to BODY.
   *
   * @param {ArrayBuffer} array
   */
  _parseHeaders(array) {
    let raw = '';
    if (array) {
      raw = PayloadSupport.arrayBufferToString(array);
    }
    this._response.headers = raw;
    this.logger.info('Received headers list', raw);
    const headers = new ArcHeaders(raw);
    this._response._headers = headers;
    if (headers.has('Content-Length')) {
      this._contentLength = Number(headers.get('Content-Length'));
    }
    if (headers.has('Transfer-Encoding')) {
      let tr = headers.get('Transfer-Encoding');
      if (tr === 'chunked') {
        this._chunked = true;
      }
    }
    const detail = {
      value: this._response.headers,
      id: this.id
    };
    const e = new CustomEvent('headersreceived', {detail});
    this.dispatchEvent(e);
    if (detail.defaultPrevented) {
      this.abort();
    }
  }
  /**
   * Sets the `_rawBody` property.
   *
   * @param {Buffer} data A data to process
   */
  _processBody(data) {
    if (this.aborted) {
      return;
    }
    if (this._chunked) {
      this._processBodyChunked(data);
      return;
    }
    if (!this._rawBody) {
      this._rawBody = data;
    } else {
      this._rawBody = PayloadSupport.concatBuffers(this._rawBody, data);
    }
    if (this._rawBody.length >= this._contentLength) {
      this._reportResponse();
    }
  }
  /**
   * Sets the `_rawBody` property for a chunked response.
   *
   * @param {Buffer} data A latest data to process
   */
  _processBodyChunked(data) {
    if (this.__bodyChunk) {
      data = PayloadSupport.concatBuffers(this.__bodyChunk, data);
      this.__bodyChunk = undefined;
    }
    while (true) {
      const index = RequestUtils.indexOfSubarray(data, [13, 10, 13, 10]);
      if (this._chunkSize === 0 && index === 0) {
        this._reportResponse();
        return;
      }
      if (!this._chunkSize) {
        data = this.readChunkSize(data);
        if (!this._chunkSize && this._chunkSize !== 0) {
          // It may happen that node's buffer cuts the data
          // just before the chunk size.
          // It should proceed it in next portion of the data.
          this.__bodyChunk = data;
          return;
        }
        if (this._chunkSize === 0) {
          data = data.subarray(2);
          if (data.byteLength === 0) {
            this._reportResponse();
            return;
          }
          continue;
        }
        if (!this._chunkSize) {
          this._reportResponse();
          return;
        }
      }
      let size = Math.min(this._chunkSize, data.length);
      let sliced = data.subarray(0, size);
      if (!this._rawBody) {
        this._rawBody = sliced;
      } else {
        this._rawBody = PayloadSupport.concatBuffers(this._rawBody, sliced);
      }
      this._chunkSize -= size;
      if (data.length === 0) {
        // this.logger.warn('Next chunk will start with CRLF!');
        return;
      }
      data = data.subarray(size + 2); // + CR
      // if (data.length === 0) {
      //   // this.logger.info('No more data here. Waiting for new chunk');
      //   return;
      // }
    }
  }
  /**
   * If response's Transfer-Encoding is 'chunked' read until next CR.
   * Everything before it is a chunk size.
   *
   * @param {Buffer} array
   * @return {Buffer}
   */
  readChunkSize(array) {
    if (this.aborted) {
      return;
    }
    let index = RequestUtils.indexOfSubarray(array, [13, 10]);
    if (index === -1) {
      // not found in this portion of data.
      return array;
    }
    if (index === 0) {
      // Chrome's buffer cut CRLF after the end of chunk data, without last CLCR, here's to fix it.
      // It can be either new line from the last chunk or end of the message where
      // the rest of the array is [13, 10, 48, 13, 10, 13, 10]
      if (RequestUtils.indexOfSubarray(array, [13, 10, 13, 10]) === 0) {
        this._chunkSize = 0;
        return new Uint8Array();
      } else {
        array = array.subarray(index + 2);
        index = RequestUtils.indexOfSubarray(array, [13, 10]);
      }
    }
    // this.logger.info('Size index: ', index);
    const sizeArray = array.subarray(0, index);
    const sizeHex = PayloadSupport.arrayBufferToString(sizeArray);
    const chunkSize = parseInt(sizeHex, 16);
    if (isNaN(chunkSize)) {
      this._chunkSize = undefined;
      return array.subarray(index + 2);
    }
    this._chunkSize = chunkSize;
    return array.subarray(index + 2);
  }
  /**
   * Generate response object and publish it to the listeners.
   *
   * @param {Object} opts See #_createResponse for more info.
   * @return {Promise}
   */
  _publishResponse(opts) {
    this.state = RequestSocket.DONE;
    return super._publishResponse(opts);
  }

  abort() {
    super.abort();
    this.state = RequestSocket.DONE;
    if (this.socketId) {
      this._disconnect();
    }
    this.clearTimeout();
    this._removeSocketListeners();
  }

  _disconnect() {
    return new Promise((resolve) => {
      chrome.sockets.tcp.disconnect(this.socketId, () => {
        this.socketId = undefined;
        resolve();
      });
    });
  }
}
