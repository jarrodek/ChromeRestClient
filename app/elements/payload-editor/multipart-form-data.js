(function() {
'use strict';

/**
 * A class representing a single message part entry.
 */
class MultipartMessagePart {
  constructor(name, value, opts) {
    if (!name) {
      throw new TypeError('Argument name is required.');
    }
    opts = opts || {};
    // Flag that determined if the entry represents a file entry
    this._isFile = false;
    this.name = name;
    this.value = value;
    // A filename to be send to the server.
    this.filename = opts.filename;
    // Content's mime type. If the value is a File then the content type will be read from the
    // File instance. It may be not set.
    this.mime = opts.mime;
  }

  set value(value) {
    var isFile = false;
    if (value instanceof Array) {
      isFile = value[0] instanceof Blob;
    } else {
      isFile = value instanceof Blob;
    }
    this._isFile = isFile;
    this._value = value;
  }

  get value() {
    return this._value;
  }

  // Check if the entry is a file entry.
  get isFile() {
    return this._isFile;
  }
  /**
   * If the message part contains an array of entries
   * this function will return an array of `MultipartMessagePart` associated with each entry.
   * Each entry will have the same name as this entry as defined in the spec.
   *
   * @return {Array<MultipartMessagePart>} List of message parts.
   */
  getParts() {
    var result = [];
    if (!(this.value instanceof Array)) {
      return [this];
    }

    this._value.forEach((value) => {
      var opts = {
        mime: value.type || this.mime,
        filename: value.filename || this.filename
      };
      let part = new MultipartMessagePart(this.name, value, opts);
      result.push(part);
    });
    return result;
  }
}

/**
 * The `MultipartFormData` class is really close to the `FormData` interface but has additional
 * methods to generate multipart message body as ArrayBuffer or preview of it.
 *
 * This class is acceptable by the `SocektFetch` class as a file transpot option in the multipart
 * request.
 */
class MultipartFormData {

  constructor(opts) {
    opts = opts || {};
    /**
     * Currently generated boundary for this multipart form
     */
    this._boundary = opts.boundary || undefined;
    // Items added to the form.
    this._items = new Map();
    /**
     * Event dispatch source for the `fire()` function.
     * Defaults to `window`. It can be set when initializing the class to set an event source
     * (target property of the event).
     */
    this._eventNode = opts.eventNode || window;
  }

  get boundary() {
    return this._boundary;
  }

  set boundary(boundary) {
    this._boundary = boundary;
    this.fire('multipart-boundary-chnaged', {
      value: boundary
    });
  }

  /**
   * Fires a custom event.
   *
   * @param {String} type Event type (name)
   * @param {any} detail The detail object attached to the custom event
   * @param {Object} opts Event options. Can be one of:
   * - bubbles (default to true) A Boolean indicating whether the event bubbles.
   * - cancelable (default to false) A Boolean indicating whether the event can be canceled.
   * @return {Event} An event.
   */
  fire(type, detail, opts) {
    opts = opts || {};
    if (!('bubbles' in opts)) {
      opts.bubbles = true;
    }
    if (!('cancelable' in opts)) {
      opts.cancelable = false;
    }
    var event = new CustomEvent(type, {
      detail: detail || undefined,
      bubbles: opts.bubbles,
      cancelable: opts.cancelable
    });
    this._eventNode.dispatchEvent(event);
    return event;
  }

  /**
   * Generates a new boundary and sets the correspondin value in the properties.
   */
  updateBoundary() {
    var boundary = '-------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this.boundary = boundary;
  }

  /**
   * Sets a form value.
   *
   * @param {String} name The name of the field whose data is contained in value.
   * @param {any} value The field's value. It can be String or Blob (File).
   * @param {Object} options Additional options where:
   * - mime: is the content type of the value. If not set, if the value is type of Blob
   * it will be set to Blob's content type, otherwise it will be set to `application/octet-stream`
   * - filename: The file name if the `value` is type of Blob. If not set it will be read from
   * file metadata
   */
  set(name, value, options) {
    options = options || {};
    var opts = {
      mime: options.mime,
      filename: options.filename
    };
    var part = new MultipartMessagePart(name, value, opts);
    this._items.set(name, part);
  }
  /**
   * Gets a value for the name.
   *
   * @param {String} name Name of the entry
   * @return {any} Returns the value associated with the specified name
   * or undefined if the name can't be found in the object.
   */
  get(name) {
    var part = this._items.get(name);
    if (!part) {
      return undefined;
    }
    return part.value;
  }

  /**
   * Removes field from the form.
   *
   * @name {String} name Name of the field.
   */
  delete(name) {
    this._items.delete(name);
  }
  // The clear() method removes all elements from the object.
  clear() {
    this._items.clear();
  }
  /**
   * The entries() method returns a new Iterator object that contains the [key, value] pairs for
   * each element in the Map object in insertion order.
   *
   * @return A new Map iterator object.
   */
  entries() {
    return this._items.entries();
  }
  /**
   * The forEach() method executes a provided function once per each key/value pair
   * in the Map object, in insertion order.
   *
   * @param {Function} callback Function to execute for each element.
   * @param {Object} thisArg Value to use as this when executing callback.
   */
  forEach(callback, thisArg) {
    this._items.forEach(callback, thisArg);
  }
  /**
   * The has() method returns a boolean indicating whether a part with the specified name
   * exists or not.
   *
   * @param {String} name The name of the element to test for presence in the Map object.
   * @return {Boolean} Returns true if a part with the specified name exists in the Map object;
   * otherwise false.
   */
  has(name) {
    return this._items.has(name);
  }
  /**
   * The keys() method returns a new Iterator object that contains the names for each part
   * in the Map object in insertion order.
   *
   * @return A new Map iterator object.
   */
  keys() {
    return this._items.keys();
  }
  /**
   * The values() method returns a new Iterator object that contains the values for each part
   * in the Map object in insertion order.
   *
   * @return A new Map iterator object.
   */
  values() {
    return this._items.values();
  }

  /**
   * Generates a message to send as a body.
   *
   * @return {Promise<ArrayBuffer>|undefined} Generated message as an ArrayBuffer or undefined if
   * the form was empty.
   */
  generateMessage() {
    if (!this._items.size) {
      return Promise.resolve();
    }
    if (!this.boundary) {
      this.updateBoundary();
    }
    var parts = [];
    for (var value of this._items.values()) {
      parts.push(this._getMessage(value));
    }
    parts.push(Promise.resolve(this._stringToArrayBuffer(this.boundary + '--')));
    return Promise.all(parts)
    .then((buffers) => {
      return this._bufferConcat(buffers);
    });
  }
  /**
   * Generate message body preview.
   * The preview will contain text data only.
   *
   */
  generateMessagePreview() {
    if (!this._items.size) {
      return Promise.resolve();
    }
    if (!this.boundary) {
      this.updateBoundary();
    }
    var parts = [];
    for (var value of this._items.values()) {
      parts.push(this._getMessagePreview(value));
    }
    parts.push(this.boundary + '--');
    return parts.join('');
  }

  /**
   * Gets a single part of body message.
   * Each part is consistent with message header containg field name, content type and file name,
   * body which is actuall content and hooter which is the boundary.
   *
   * @param {MultipartMessagePart} part A message part.
   * @return {Promise<ArrayBuffer>} A promise that resolve itself when the buffer is ready.
   * The buffer is whe part message buffer. Each part should be concatenated into one message
   * buffer to be passed to the transport.
   */
  _getMessage(part) {
    if (part.value instanceof Array) {
      return this._getMessageArray(part);
    }
    var header = this._stringToArrayBuffer(this._getHeader(part));
    var message = this._getPartBody(part);
    return message.then((buffer) => {
      return Promise.resolve(this._bufferConcat(header, buffer));
    });
  }
  /**
   * Similar to the `_getMessage()` function but it will generate a string message part without
   * binnary data for message preview.
   */
  _getMessagePreview(part) {
    if (part.value instanceof Array) {
      return this._getMessagePreviewArray(part);
    }
    var header = this._getHeader(part);
    var message = this._getPartBodyPreview(part);
    return header + message;
  }
  /**
   * It's a case of creating message when the value is an array.
   * This function will create a list of message parts as described in
   * https://tools.ietf.org/html/rfc7578#section-4.3
   *
   * @param {MultipartMessagePart} part A message part where the value is an array.
   * @return {Promise<ArrayBuffer>} A promise that resolve itself when the buffer is ready.
   */
  _getMessageArray(part) {
    var promises = [];
    part.getParts().forEach((_part) => {
      promises.push(this._getMessage(_part));
    });
    return Promise.all(promises)
    .then((buffers) => {
      return this._bufferConcat(buffers);
    });
  }
  /**
   * Similar to `_getMessageArray()` function but returns only string data for preview.
   *
   * @param {Object} part A message part where the value is an array.
   * @return {String} Message represented as string. Note that not string data will be removed.
   */
  _getMessagePreviewArray(part) {
    var parts = [];
    part.getParts().forEach((_part) => {
      parts.push(this._getMessagePreview(_part));
    });
    return parts.join('');
  }
  /**
   * Returns a message part header as defined in rfc 2388.
   * The header always contains a Content-Disposition header whcih value is `form-data`.
   * Then in contains the name of corresponding form field.
   * It may contain Content-Type header but this is optional.
   *
   * If the value is a file, then the file's content type will be used as a Content-Type header.
   * Otherwise the default `application/octet-stream` value will be used if the header value can't
   * be determined.
   * If the value is an Array of files, then the content type of the message part
   * is multipart/mixed.
   *
   * @return {String} The header string. Note that then header will always end with new line.
   */
  _getHeader(part) {
    var header = this.boundary + '\r\n';
    header += 'Content-Disposition: form-data; ';
    header += 'name="' + part.name + '"';

    var filename = part.filename;
    if (part.isFile && part.value.name) {
      filename = part.value.name;
    }
    if (filename) {
      header += '; filename="' + filename + '"';
    }
    header += '\r\n';

    var contentType = this._getValueContentType(part.value, part.mime);
    if (contentType) {
      header += 'Content-Type: ' + contentType + '\r\n';
    }
    return header;
  }
  /**
   * Gets value's Content-Type header value for the message part header.
   *
   * If the value is string then if will be empty if part's content type hasn't been specified.
   * If the value is type of blob then it will try to detect blob's mime type and if it's not
   * able to do so it will use `partContentType`. If the `partContentType` argument is not set
   * then default for multipart `application/octet-stream` will be used.
   *
   * Multipart supports list of files to be send in one part. In this case the part's multipart
   * will be set to `multipart/mixed`.
   *
   * @param {String|Blob} value Value of the field.
   * @param {String} partContentType Optional, message part Content-Type.
   * @return {String|undefined} A content type header or undefined if unable to determine.
   */
  _getValueContentType(value, partContentType) {
    var contentType;
    if (value instanceof Blob) {
      if (value.type) {
        contentType = value.type;
      } else if (partContentType) {
        contentType = partContentType;
      } else {
        contentType = 'application/octet-stream';
      }
    } else {
      if (partContentType) {
        contentType = partContentType;
      }
    }
    return contentType;
  }

  /**
   * Convert a string to an ArrayBuffer.
   * @param {string} string The string to convert.
   * @return {ArrayBuffer} An array buffer whose bytes correspond to the string.
   * @returns {ArrayBuffer}
   */
  _stringToArrayBuffer(string) {
    var encoder = new TextEncoder();
    var encoded = encoder.encode(string);
    return encoded.buffer;
  }
  /**
   * Returns the body of the part message.
   *
   * @param {MultipartMessagePart} part A message part where the value is an array.
   * @return {Promise<ArrayBuffer>} A promise that resolves to the ArrayBuffer with the message.
   */
  _getPartBody(part) {
    return new Promise((resolve, reject) => {
      var str = '\r\n';
      var value = part.value;
      if (part.isFile) {
        var reader = new FileReader();
        reader.onload = (e) => {
          var header = this._stringToArrayBuffer(str);
          var value = e.target.result;
          resolve(this._bufferConcat(header, value, header));
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(value);
      } else {
        str += String(value) + '\r\n';
        resolve(this._stringToArrayBuffer(str));
      }
    });
  }

  /**
   * Similar to `_getPartBody()` function but it retirns a string for preview.
   *
   */
  _getPartBodyPreview(part) {
    var str = '\r\n';
    var value = part.value;
    if (value instanceof Blob) {
      str += '[Binnary data]\r\n';
    } else {
      str += String(value) + '\r\n';
    }
    return str;
  }

  /**
   * Concatenates tweo buffers and creates new buffer containg first buffer and then second buffer.
   *
   * @return {ArrayBuffer} concatenated new ArrayBuffer from the arguments.
   */
  _bufferConcat(...buffers) {
    if (buffers[0] instanceof Array) {
      buffers = buffers[0];
    }
    var length = 0;
    buffers.forEach((b) => {
      return length += b.byteLength;
    });
    var tmp = new Uint8Array(length);
    var pos = 0;
    buffers.forEach((buffer) => {
      tmp.set(new Uint8Array(buffer), pos);
      pos += buffer.byteLength;
    });
    return tmp.buffer;
  }
}

window.MultipartFormData = MultipartFormData;
})();
