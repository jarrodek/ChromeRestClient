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
  constructor() {
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
   * Partially based on
   * https://github.com/ahmadnassri/chrome.sockets.tcp.xhr/
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
      uri: new URI(url),
      /**
       * A connection can be made only once in one instance. It fthe flag state is true then
       * the implementation will throw an error
       */
      started: false
    };
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
      if (this._connection.started) {
        throw new Error('This connection has been made. Create a new class and use it instead.');
      }
      this._connection.started = true;
      chrome.sockets.tcp.onReceive.addListener(this.readSocketData.bind(this));
      chrome.sockets.tcp.onReceiveError.addListener(this.readSocketError.bind(this));
      var socketProperties = {
        name: 'arc'
      };
      chrome.sockets.tcp.create(socketProperties, (createInfo) => {
        this._connection.socketId = createInfo.socketId;
        let port = parseInt(this._connection.uri.port());
        let host = this._connection.uri.host().replace(':' + port, '');
        this.log('Connecting to %s:%d', host, port);
        let promise;
        if (port === 443) {
          promise = this._connectSecure(createInfo.socketId, host, port);
        } else {
          promise = this._connect(createInfo.socketId, host, port);
        }
        promise.then(() => {
          this.log('Connected to socked for host: ', host, ' and port ', port);
          this.readyState = 1;
          this._connection.connected = true;
          this._connection.reject = reject;
          this._connection.resolve = resolve;
          this._onConnected();
        }).catch((cause) => {
          this.readyState = 0;
          reject(cause);
        });
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
    return new Promise((resolve, reject) => {
      chrome.sockets.tcp.setPaused(socketId, true, () => {
        chrome.sockets.tcp.connect(socketId, host, port, (connectResult) => {
          if (chrome.runtime.lastError) {
            this.log(chrome.runtime.lastError);
            throw new Error('Connection error.');
            return;
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
    return new Promise((resolve, reject) => {
      chrome.sockets.tcp.setPaused(socketId, true, () => {
        chrome.sockets.tcp.connect(socketId, host, port, (connectResult) => {
          if (chrome.runtime.lastError) {
            this.log(chrome.runtime.lastError);
            throw new Error('Connection error.');
            return;
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
    chrome.sockets.tcp.disconnect(this._connection.socketId, () => {
      this.readyState = 0;
      this._connection.connected = false;
      chrome.sockets.tcp.close(this._connection.socketId, () => {
        this._connection.socketId = undefined;
      });
    });
  }

  log(...entry) {
    if (this.debug) {
      console.log.apply(console, entry);
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
    headers.push('HOST: ' + this._connection.uri.host());
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
    if (sendInfo.bytesWritten < 0) {
      this.log('Error writing to socket. Bytes sent: ' + sendInfo.bytesSent);
      this.disconnect();
      this._connection.reject(new Error('Couldn\'t find host.'));
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
      this.log('has message', readInfo);
    }
    //chrome.socket.read(this.socketId, null, this._readSocketData.bind(this));
  }

  readSocketError(info) {
    if (info.socketId !== this._connection.socketId) {
      return;
    }
    var code = info.resultCode;
    var message = this.getCodeMessage(code);
    this.log('readSocketError:', message, code);
    chrome.sockets.tcp.setPaused(this._connection.socketId, false);
  }

  /**
   * Convert ArrayBuffer to readable form
   * @param {ArrayBuffer} buff
   * @returns {String} Converted string
   */
  arrayBufferToString(buff) {
    if (this.aborted) {
      return;
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
    if (this.aborted) {
      return;
    }
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
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
