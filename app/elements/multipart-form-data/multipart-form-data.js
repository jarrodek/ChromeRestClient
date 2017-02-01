Polymer({
  is: 'multipart-form-data',

  properties: {
    /**
     * Currently generated boundary for this multipart form
     */
    boundary: {
      type: String,
      notify: true
    },
    // Items added to the form.
    _items: {
      type: Array,
      value: function() {
        return [];
      }
    }
  },
  /**
   * Generates a new boundary and sets the correspondin value in the properties.
   */
  updateBoundary: function() {
    var boundary = '-------------';
    for (var i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    this.set('boundary', boundary);
  },

  /**
   * Sets a form value.
   *
   * @param {String} name The name of the field whose data is contained in value.
   * @param {Strnig|Blob} value The field's value. It can be String or Blob (File).
   * @param {Object} options Additional options where:
   * - contentType: is the content type of the value. If not set, if the value is type of Blob
   * it will be set to Blob's content type, otherwise it will be set to `application/octet-stream`
   * - filename: The file name if the `value` is type of Blob. If not set it will be read from
   * file metadata
   */
  setField: function(name, value, options) {
    options = options || {};
    console.log('setField', name, value, options);
    var _item = {
      name: name,
      value: value,
      contentType: options.contentType,
      filename: options.filename
    };
    var i = this._itemIndexByName(name);
    if (i === -1) {
      this.push('_items', _item);
    } else {
      this.set(['_items', i], _item);
    }
  },
  /**
   * Gets a value for the name.
   *
   * @param {String} name Name of the entry
   * @return {String|Blob|undefined} Value for given name or undefined if not found.
   */
  getField: function(name) {
    var i = this._itemIndexByName(name);
    if (i === -1) {
      return;
    }
    return this.get(['_items', i, 'value']);
  },

  /**
   * Removes field from the form.
   *
   * @name {String} name Name of the field.
   */
  removeField: function(name) {
    var i = this._itemIndexByName(name);
    if (i !== -1) {
      this.splice('_items', i);
    }
  },
  // Clears the form data
  clear: function() {
    this.set('items', []);
  },
  /**
   * Get form item index in the array by its name.
   *
   * @param {String} name The name of the field.
   * @return {Number} Index of the field or -1 if not found.
   */
  _itemIndexByName: function(name) {
    var items = this._items;
    for (var i = 0, len = items.length; i < len; i++) {
      if (items[i].name === name) {
        return i;
      }
    }
    return -1;
  },
  /**
   * Generates a message to send as a body.
   *
   * @return {Promise<ArrayBuffer>|undefined} Generated message as an ArrayBuffer or undefined if
   * the form was empty.
   */
  generateMessage: function() {
    if (!this._items || !this._items.length) {
      return;
    }
    if (!this.boundary) {
      this.updateBoundary();
    }
    var parts = [];
    this._items.forEach(function(part) {
      parts.push(this._getMessage(part));
    }, this);

    return Promise.all(parts)
    .then((buffers) => {
      return this._bufferConcat(buffers);
    });
  },
  /**
   * Generate message body preview.
   * The preview will contain text data only.
   *
   */
  generateMessagePreview: function() {
    if (!this._items || !this._items.length) {
      return;
    }
    if (!this.boundary) {
      this.updateBoundary();
    }
    var parts = [];
    var items = this._items;
    for (let i = 0, len = items.length; i < len; i++) {
      parts.push(this._getMessagePreview(items[i], i === len - 1));
    }
    return parts.join('');
  },

  /**
   * Gets a single part of body message.
   * Each part is consistent with message header containg field name, content type and file name,
   * body which is actuall content and hooter which is the boundary.
   *
   * @param {Object} part A message part.
   * @return {Promise<ArrayBuffer>} A promise that resolve itself when the buffer is ready.
   * The buffer is whe part message buffer. Each part should be concatenated into one message
   * buffer to be passed to the transport.
   */
  _getMessage: function(part, lastPart) {
    if (part.value instanceof Array) {
      return this._getMessageArray(part, lastPart);
    }
    var header = this._stringToArrayBuffer(this._getHeader(part));
    var message = this._getPartBody(part);
    var footer = '';
    if (lastPart) {
      footer += this.boundary + '--';
    }
    footer = this._stringToArrayBuffer(footer);
    return message.then((buffer) => {
      return Promise.resolve(this._bufferConcat(header, buffer, footer));
    });
  },
  /**
   * Similar to the `_getMessage()` function but it will generate a string message part without
   * binnary data for message preview.
   */
  _getMessagePreview: function(part, lastPart) {
    if (part.value instanceof Array) {
      return this._getMessagePreviewArray(part, lastPart);
    }
    var header = this._getHeader(part);
    var message = this._getPartBodyPreview(part);
    var footer = '';
    if (lastPart) {
      footer = this.boundary + '--';
    }
    return header + message + footer;
  },
  /**
   * It's a case of creating message when the value is an array.
   * This function will create a list of message parts as described in
   * https://tools.ietf.org/html/rfc7578#section-4.3
   *
   * @param {Object} part A message part where the value is an array.
   * @return {Promise<ArrayBuffer>} A promise that resolve itself when the buffer is ready.
   */
  _getMessageArray: function(part, lastPart) {
    var promises = [];
    var size = part.value.length;
    part.value.forEach((_blob, i) => {
      let _part = {
        name: part.name,
        value: _blob,
        contentType: _blob.type || part.contentType,
        filename: _blob.fileName || part.filename
      };
      let last = lastPart && (size - 1 === i);
      promises.push(this._getMessage(_part, last));
    });
    return Promise.all(promises)
    .then((buffers) => {
      return this._bufferConcat(buffers);
    });
  },
  /**
   * Similar to `_getMessageArray()` function but returns only string data for preview.
   *
   * @param {Object} part A message part where the value is an array.
   * @return {String} Message represented as string. Note that not string data will be removed.
   */
  _getMessagePreviewArray: function(part, lastPart) {
    var parts = [];
    var size = part.value.length;
    part.value.forEach((_blob, i) => {
      let _part = {
        name: part.name,
        value: _blob,
        contentType: _blob.type || part.contentType,
        filename: _blob.fileName || part.filename
      };
      let last = lastPart && (size - 1 === i);
      parts.push(this._getMessagePreview(_part, last));
    });
    return parts.join('');
  },
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
  _getHeader: function(part) {
    var header = this.boundary + '\r\n';
    header += 'Content-Disposition: form-data; ';
    header += 'name="' + part.name + '"';

    var filename = part.filename;
    if (part.value instanceof Blob) {
      filename = part.value.name;
    }

    if (filename) {
      header += '; filename="' + filename + '"';
    }
    header += '\r\n';

    var contentType = this._getValueContentType(part.value, part.contentType);
    if (contentType) {
      header += 'Content-Type: ' + contentType + '\r\n';
    }
    return header;
  },
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
  _getValueContentType: function(value, partContentType) {
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
  },

  /**
   * Convert a string to an ArrayBuffer.
   * @param {string} string The string to convert.
   * @return {ArrayBuffer} An array buffer whose bytes correspond to the string.
   * @returns {ArrayBuffer}
   */
  _stringToArrayBuffer: function(string) {
    var encoder = new TextEncoder();
    var encoded = encoder.encode(string);
    return encoded.buffer;
  },
  /**
   * Returns the body of the part message.
   *
   * @param {Object} part A message part where the value is an array.
   * @return {Promise<ArrayBuffer>} A promise that resolves to the ArrayBuffer with the message.
   */
  _getPartBody: function(part) {
    return new Promise((resolve, reject) => {
      var str = '\r\n';
      var value = part.value;
      if (value instanceof Blob) {
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
  },
  /**
   * Similar to `_getPartBody()` function but it retirns a string for preview.
   *
   */
  _getPartBodyPreview: function(part) {
    var str = '\r\n';
    var value = part.value;
    if (value instanceof Blob) {
      str += '[Binnary data]\r\n';
    } else {
      str += String(value) + '\r\n';
    }
    return str;
  },
  /**
   * Concatenates tweo buffers and creates new buffer containg first buffer and then second buffer.
   *
   * @return {ArrayBuffer} concatenated new ArrayBuffer from the arguments.
   */
  _bufferConcat: function(...buffers) {
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
});
