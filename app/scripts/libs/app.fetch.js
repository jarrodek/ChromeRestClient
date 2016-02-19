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
/**
 * EventTarget is an interface implemented by objects that can receive events and may have
 * listeners for them.
 */
class ArcEventTarget {
  /**
   *
   * @constructor
   */
  constructor() {
    /**
     * A list of events registered by this {@link ArcEventTarget}
     */
    this.events = new Map();
  }
  /**
   * Register an event handler of a specific event type on the {@link ArcEventTarget}.
   *
   * @property {String} type A string representing the event type to listen for.
   * @property {Function} listener The object that receives a notification when an event of the
   * specified type occurs. This must be a JavaScript function.
   */
  addEventListener(type, listener) {
    if (typeof type !== 'string') {
      throw new TypeError('Type must be a string.');
    }
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function.');
    }
    if (!this.events.has(type)) {
      this.events.set(type, new Set());
    }
    var set = this.events.get(type);
    if (set.has(listener)) {
      console.warn('Listener for type %s is already registered.', type);
      return;
    }
    set.add(listener);
  }
  /**
   * Removes the event listener previously registered with
   * {@link EventTarget.addEventListener()}.
   *
   * @property {String} type A string representing the event type to remove.
   * @property {Function} listener The EventListener function to remove from the event target.
   */
  removeEventListener(type, listener) {
    if (typeof type !== 'string') {
      throw new TypeError('Type must be a string.');
    }
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function.');
    }
    if (!this.events.has(type)) {
      console.warn('Type %s is not registered.', type);
      return;
    }
    var set = this.events.get(type);
    if (!set.has(listener)) {
      console.warn('Listener for type %s wasn\'t registered.', type);
      return;
    }
    set.delete(listener);
  }
  /**
   * Dispatches an Event at the specified EventTarget, invoking the affected EventListeners
   * in the appropriate order.
   *
   * @type {Event} event An event to be dispatched.
   */
  dispatchEvent(event) {
    var type = event.type;
    if (!type) {
      throw new TypeError('Argument is not a valid event.');
    }
    if (!this.events.has(type)) {
      return;
    }
    var set = this.events.get(type);
    for (let listener of set) {
      let canceled = listener(event);
      if (event.cancelable && canceled) {
        break;
      }
    }
  }
}

class ArcEventSource extends ArcEventTarget {
  constructor () {
    super();
    /**
     * A DOMString representing the URL of the source.
     *
     * @type {String}
     */
    this._url = undefined;
    /**
     * An unsigned short representing the state of the connection.
     * Possible values are CONNECTING (0), OPEN (1), or CLOSED (2).
     *
     * @type {Number}
     */
    this._readyState = undefined;
  }
  /**
   * A DOMString representing the URL of the source.
   *
   * @type {String}
   */
  get url() {
    return this._url;
  }
  /**
   * An unsigned short representing the state of the connection.
   *
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }
  /**
   * Sets a listener for open event.
   *
   * @param {Function} listener A function to be called
   */
  set onopen(listener) {
    this._onopen = listener;
    if (this._onopen) {
      this.removeEventListener('open', this._onopen);
    }
    this.addEventListener('open', listener);
  }
  /**
   * Is an EventHandler being called when an open event is received, that is when the
   * connection was just opened.
   *
   * @type {Function}
   */
  get onopen() {
    return this._onopen;
  }
  /**
   * Sets a listener for message event.
   *
   * @param {Function} listener A function to be called
   */
  set onmessage(listener) {
    this._onmessage = listener;
    if (this._onmessage) {
      this.removeEventListener('message', this._onmessage);
    }
    this.addEventListener('message', listener);
  }
  /**
   * Is an EventHandler being called when a message event is received, that is when a message
   * is coming from the source.
   *
   * @type {Function}
   */
  get onmessage() {
    return this._onmessage;
  }
  /**
   * Sets a listener for error event.
   *
   * @param {Function} listener A function to be called
   */
  set onerror(listener) {
    this._onerror = listener;
    if (this._onerror) {
      this.removeEventListener('error', this._onerror);
    }
    this.addEventListener('error', listener);
  }
  /**
   * Is an EventHandler being called when an error occurs and the error event is dispatched
   * on this object.
   *
   * @type {Function}
   */
  get onerror() {
    return this._onerror;
  }
}



/**
 * A SocketFetch class is similar to fetch API but it uses chrome.socket as a transport.
 *
 * This library require https://github.com/medialize/URI.js to run.
 *
 * @example
 * let request = SocketFetch('http://domain.com').fetch().then((response) => {
 *   if (response.ok) {
 *     return response.json();
 *   }
 * });
 */
class SocketFetch {
  /**
   * Partially based on https://github.com/ahmadnassri/chrome.sockets.tcp.xhr/blob/master/src/chrome.sockets.tcp.xhr.js
   *
   *
   *
   * @constructor
   * @property {String} url Defines the resource that you wish to fetch. This can either be:
   * A USVString containing the direct URL of the resource you want to fetch.
   * A Request object.
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
      /** True when socket is connected */
      connected: false,
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
       * An URI object created from the URL.
       */
      uri: new URI(url)
    }
    let port = this._connection.uri.port();
    if (!port) {
      let protocol = this._connection.uri.protocol();
      if (protocol in this.protocol2port) {
        port = this.protocol2port[protocol];
      } else {
        port = 80;
      }
      this._connection.uri.port(port);
    }
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
  /**
   * Returns new promise and perform a request.
   *
   * @return {Promise} Fulfilled promise will result with Resposne object.
   */
  fetch() {
    return new Promise((resolve, reject) => {
      if (this._connection.aborted) {
        resolve(this._createResponse());
        return;
      }
      var socketProperties = {
        name: 'arc'
      };
      chrome.sockets.tcp.create(socketProperties, (createInfo) => {
        this._connection.socketId = createInfo.socketId;
        let port = parseInt(this._connection.uri.port());
        let host = this._connection.uri.host().replace(':' + port, '');
        this.log('Connecting to %s:%d', host, port);
        chrome.sockets.tcp.connect(createInfo.socketId, host, port, (connectInfo) => {
          if (chrome.runtime.lastError) {
            this.readyState = 0;
            this.log(chrome.runtime.lastError);
            reject(new Error('Connection error. '));
            return;
          }
          if (connectInfo >= 0) {
            this.log('Connected to socked for host: ', host, ' and port ', port);
            this.readyState = 1;
            this._connection.connected = true;
            this._connection.reject = reject;
            this._connection.resolve = resolve;
            this._onConnected();
          } else {
            this.readyState = 0;
            reject(new Error('Couldn\'t find host.'));
          }
        });
      });
    });
  }

  disconnect() {
    throw 'Not yet implemented';
  }

  log(...entry) {
    if (this.debug) {
      console.log(entry);
    }
  }

  abort() {
    throw 'Not yet implemented';
  }
  /**
   * Create a request object.
   */
  _createRequest(url, opts) {
    if (url instanceof Request) {
      return url;
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
    return new Request(url, opts);
  }

  _createResponse() {
    throw 'Not yet implemented';
  }

  _onConnected() {
    chrome.sockets.tcp.onReceive.addListener(this.readSocketData.bind(this));
    var buffer = this.generateMessage();
    this.log('Sending message.', buffer);
    chrome.sockets.tcp.send(this._connection.socketId, buffer, this.onSend.bind(this));
  }
  /**
   * Generate a message for socket.
   */
  generateMessage() {
    var headers = [];
    headers.push(this._request.method + ' ' + this._connection.uri.path() + ' HTTP/1.1');
    //this.message += 'Host: ' + this.host + this.CR;
    this._request.headers.forEach((value, key) => headers.push(key + ': ' + value));
    var str = headers.join('\r\n') + '\r\n\r\n';
    this.log('Generated message to send', str);
    return this.stringToArrayBuffer(str);
  }
  /**
   * Called when the message has been send to the remote host.
   */
  onSend(sendInfo) {
    debugger;
    if (sendInfo.bytesWritten < 0) {
      this.log('Error writing to socket. Bytes sent: ' + sendInfo.bytesSent);
      this.disconnect();
      this._connection.reject(new Error('Couldn\'t find host.'));
      return;
    }
    this.log('Written message. Bytes sent: ' + sendInfo.bytesSent);
  }

  readSocketData(readInfo) {
    if (this._connection.aborted) {
      return;
    }
    if (readInfo) {
      this.log('has message', readInfo);
    }
    chrome.socket.read(this.socketId, null, this._readSocketData.bind(this));
  }

  /**
   * Convert ArrayBuffer to readable form
   * @param {ArrayBuffer} buff
   * @returns {String} Converted string
   */
  arrayBufferToString(buff) {
      if(this.aborted) return;
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
      if(this.aborted) return;
      var buffer = new ArrayBuffer(string.length);
      var bufferView = new Uint8Array(buffer);
      for (var i = 0; i < string.length; i++) {
          bufferView[i] = string.charCodeAt(i);
      }
      return buffer;
  }
}
