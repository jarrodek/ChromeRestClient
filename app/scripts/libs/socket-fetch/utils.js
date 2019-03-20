/**
 * A class containing only static members to contain multi-module
 * helper methods.
 */
export class RequestUtils {
  /**
   * Reads a port number for a connection.
   *
   * @param {?Number} port Existing information abour port.
   * @param {?String} protocol Request protocol. Only used if `port` is not set.
   * @return {Number} A port number. Default to 80.
   */
  static getPort(port, protocol) {
    if (port) {
      port = Number(port);
      if (port === port) {
        return port;
      }
    }
    if (protocol === 'https:') {
      return 443;
    }
    return 80;
  }
  /**
   * Creates a value for host header.
   *
   * @param {String} value An url to get the information from.
   * @return {String} Value of the host header
   */
  static getHostHeader(value) {
    let uri;
    try {
      uri = new URL(value);
    } catch (e) {
      return;
    }
    let hostValue = uri.hostname;
    const defaultPorts = [80, 443];
    const port = RequestUtils.getPort(uri.port, uri.protocol);
    if (defaultPorts.indexOf(port) === -1) {
      hostValue += ':' + port;
    }
    return hostValue;
  }
  /**
   * Adds the `content-length` header to current request headers list if
   * it's required.
   * This function will do nothing if the request do not carry a payload or
   * when the content length header is already set.
   *
   * @param {String} method HTTP request method
   * @param {ArrayBuffer} buffer Generated message buffer.
   * @param {ArcHeaders} headers A headers object where to append headers if
   * needed
   */
  static addContentLength(method, buffer, headers) {
    if (method === 'GET') {
      return;
    }
    const size = buffer ? buffer.length : 0;
    headers.set('content-length', size);
  }
  /**
   * Checks if redirect is required.
   * @param {Number} status Response status code
   * @param {String} method Request HTTP method
   * @param {?String} location Location header value, if any
   * @return {Object} Redirect options:
   * - `redirect` Boolean - true if reqirect is required.
   * - `forceGet` Boolean - true if reqirect must be GET
   */
  static redirectOptions(status, method, location) {
    const result = {
      redirect: false,
      forceGet: false
    };
    switch (status) {
      case 300:
      case 304:
      case 305:
        // do nothing;
        break;
      case 301:
      case 302:
      case 307:
        if (['GET', 'HEAD'].indexOf(method) !== -1) {
          result.redirect = true;
        }
        break;
      case 303:
        result.redirect = true;
        result.forceGet = true;
        break;
    }
    if (!result.redirect) {
      return result;
    }
    if (location) {
      result.location = location;
    }
    return result;
  }
  /**
   * Checks if requrect is an infinite loop.
   * @param {String} location Redirect location
   * @param {?Array<Array>} redirects List of response objects
   * @return {Boolean} True if redirect is into the same plase as already visited.
   */
  static isRedirectLoop(location, redirects) {
    if (redirects) {
      let index = -1;
      let i = 0;
      for (let item of redirects) {
        if (item.url === location) {
          index = i;
          break;
        }
        i++;
      }
      if (index !== -1) {
        return true;
      }
    }
    return false;
  }
  /**
   * Processes redirection location
   * @param {String} location Redirect location
   * @param {String} requestUrl Request url
   * @return {String|undefined} Redirect location
   */
  static getRedirectLocation(location, requestUrl) {
    // https://github.com/jarrodek/socket-fetch/issues/5
    try {
      new URL(location);
    } catch (e) {
      try {
        location = new URL(location, requestUrl).toString();
      } catch (_) {
        return;
      }
    }
    return location;
  }

  /**
   * @param {ArrayBuffer} inputArray
   * @param {ArrayBuffer} subArray
   * @return {Number} Returns an index of first occurance of subArray sequence in
   * inputArray or -1 if not found.
   */
  static indexOfSubarray(inputArray, subArray) {
    if (this.aborted) {
      return -1;
    }
    let result = -1;
    if (inputArray.byteLength) {
      inputArray = new Uint8Array(inputArray);
    }
    const len = inputArray.length;
    const subLen = subArray.length;
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
}
