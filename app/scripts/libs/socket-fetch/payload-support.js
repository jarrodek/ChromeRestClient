/**
 * A class containning static helper methods to deal with Payload
 * transformations
 */
export class PayloadSupport {
  /**
   * Transfers blob to `ArrayBuffer`.
   *
   * @param {Blob} blob A blob object to transform
   * @return {Promise} A promise resolved to a `Buffer`
   */
  static blob2buffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        resolve(e.target.result);
      });
      reader.addEventListener('error', (e) => {
        reject(e.message);
      });
      reader.readAsArrayBuffer(blob);
    });
  }
  /**
   * NormalizeLineEndingsToCRLF
   * https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/
   * platform/text/LineEnding.cpp&rcl=1458041387&l=101
   *
   * @param {String} string A string to be normalized.
   * @return {String} normalized string
   */
  static normalizeString(string) {
    let result = '';
    for (let i = 0; i < string.length; i++) {
      let c = string[i];
      let p = string[i + 1];
      if (c === '\r') {
        // Safe to look ahead because of trailing '\0'.
        if (p && p !== '\n') {
          // Turn CR into CRLF.
          result += '\r';
          result += '\n';
        }
      } else if (c === '\n') {
        result += '\r';
        result += '\n';
      } else {
        // Leave other characters alone.
        result += c;
      }
    }
    return result;
  }
  /**
   * Tranforms a payload message into `Buffer`
   *
   * @param {String|Blob|ArrayBuffer|FormData} payload A payload message
   * @param {ArcHeaders} headers A headers object where to append headers if
   * needed
   * @return {Promise} A promise resolved to a `Buffer`.
   */
  static payloadToBuffer(payload, headers) {
    if (!payload) {
      return Promise.resolve();
    }
    if (typeof payload === 'string') {
      payload = PayloadSupport.normalizeString(payload);
      return Promise.resolve(PayloadSupport.stringToArrayBuffer(payload));
    }
    if (payload instanceof ArrayBuffer) {
      return Promise.resolve(payload.slice(0));
    }
    if (payload instanceof FormData) {
      return PayloadSupport.formData2buffer(payload)
      .then((result) => {
        headers.set('Content-Type', result.type);
        return result.buffer;
      });
    }
    if (payload instanceof Blob) {
      if (!headers.has('content-type') && payload.type) {
        headers.set('content-type', payload.type);
      }
      return PayloadSupport.blob2buffer(payload);
    }
    return Promise.reject(new Error('Unsupported payload message'));
  }

  static formData2buffer(body) {
    const headers = new Headers();
    const request = new Request('/', {
      method: 'POST',
      headers,
      body
    });
    return request.arrayBuffer()
    .then((buffer) => {
      return {
        buffer,
        type: headers.get('content-type')
      };
    });
  }

  /**
   * Convert a string to an ArrayBuffer.
   * @param {string} string The string to convert.
   * @return {ArrayBuffer} An array buffer whose bytes correspond to the string.
   * @return {ArrayBuffer}
   */
  static stringToArrayBuffer(string) {
    if (this.aborted) {
      return new ArrayBuffer();
    }
    const encoder = new TextEncoder();
    const encoded = encoder.encode(string);
    return encoded.buffer;
  }

  /**
   * Convert ArrayBuffer to readable form
   * @param {ArrayBuffer} buff
   * @param {String} enc Buffer encoding, default to `utf-8`
   * @return {String} Converted string
   */
  static arrayBufferToString(buff, enc) {
    if (this.aborted) {
      return '';
    }
    if (!!buff.buffer) {
      // Not a ArrayBuffer, need and instance of AB
      // It can't just get buff.buffer because it will use original buffer if the buff is a slice
      // of it.
      let b = buff.slice(0);
      buff = b.buffer;
    }
    if (!enc) {
      enc = 'utf-8';
    }
    const decoder = new TextDecoder(enc);
    const view = new DataView(buff);
    return decoder.decode(view);
  }

  /**
   * Concatenates `ArrayBuffer`s into new Array buffer.
   * It can also be used to make a copy of an `ArrayBuffer`.
   * @param {...ArrayBuffer} buffers Buffers to concat.
   * @return {ArrayBuffer} Concatenated ArrayBuffer.
   */
  static concatBuffers(...buffers) {
    buffers = buffers.filter((item) => !!item);
    const size = buffers.reduce((accumulator, currentValue) => accumulator += currentValue.byteLength, 0);
    const tmp = new Uint8Array(size);
    let pointer = 0;
    buffers.forEach((buffer) => {
      tmp.set(new Uint8Array(buffer), pointer);
      pointer += buffer.byteLength;
    });
    return tmp.buffer;
  }
}
