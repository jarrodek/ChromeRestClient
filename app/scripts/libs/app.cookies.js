(function() {
'use strict';
/*******************************************************************************
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
 ******************************************************************************/

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * A Cookie object.
 * It is based on https://github.com/pillarjs/cookies/blob/master/lib/cookies.js
 */
class Cookie {
  /**
   * Constructs a new cookie.
   *
   * @param {Stirng} name Cookie name
   * @param {Stirng} value Cookie value
   * @param {Object} attrs Additional cookie attributes.
   */
  constructor(name, value, attrs) {
    if (!fieldContentRegExp.test(name)) {
      throw new TypeError('Argument `name` is invalid');
    }
    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError('Argument `value` is invalid');
    }

    if (this.path && !fieldContentRegExp.test(this.path)) {
      throw new TypeError('Option `path` is invalid');
    }

    if (this.domain && !fieldContentRegExp.test(this.domain)) {
      throw new TypeError('Option `domain` is invalid');
    }

    if (!value) {
      this.expires = new Date(0);
    }

    this.name = name;
    this.value = value || '';
    for (let key in attrs) {
      this[key] = attrs[key];
    }
  }

  toString() {
    return this.name + '=' + this.value;
  }
  /**
   * Returns a Cookie as a HTTP header string.
   */
  toHeader() {
    var header = this.toString();
    if (this.expires && !(this.expires instanceof Date)) {
      this.expires = new Date(this.expires);
      if (this.expires.toString() === 'Invalid Date') {
        this.expires = new Date(0);
      }
    }

    if (this.path) {
      header += '; path=' + this.path;
    }
    if (this.expires) {
      header += '; expires=' + this.expires.toUTCString();
    }
    if (this.domain) {
      header += '; domain=' + this.domain;
    }
    if (this.httpOnly) {
      header += '; httpOnly=' + this.httpOnly;
    }
    return header;
  }
}

/**
 * A library to handle Cookie parsing.
 * It is based on https://github.com/pillarjs/cookies/blob/master/lib/cookies.js
 */
class Cookies {
  /**
   * Consteructs an object.
   *
   * @param {String?} cookie A HTTP cookie strig to parse.
   */
  constructor(cookie) {
    if (!cookie) {
      cookie = '';
    }
    /**
     * A HTTP cookie string.
     *
     * @type String
     */
    this.cookie = cookie;
    this.cookies = this.parse(cookie);
    /**
     * Cached RegExp objects.
     *
     * @type RegExp
     */
    this.cache = {};
  }

  parse(cookies) {
    var cookieParts = ['path', 'domain', 'max-age', 'expires', 'secure', 'httponly'];
    var list = [];
    if (!cookies || !cookies.trim()) {
      return list;
    }
    cookies.split(/;/).map((cookie) => {
      let parts = cookie.split(/=/, 2);
      if (parts.length === 0) {
        return;
      }
      let name = decodeURIComponent(parts[0].trim()).toLowerCase();
      if (!name) {
        return;
      }
      let value = parts.length > 1 ? decodeURIComponent(parts[1].trim()) : null;
      if (cookieParts.indexOf(name.toLowerCase()) !== -1) {
        if (list.length - 1 >= 0) {
          list[list.length - 1][name] = value;
        }
      } else {
        list.push(new Cookie(name, value));
      }
    });
    return list;
  }

  /**
   * Get a cookie by name.
   *
   * @param {String} name Cookie name
   * @return {Cookie} A Cookie object or null.
   */
  get(name) {
    if (!name || !this.cookie) {
      return null;
    }
    var match = this.cookie.match(this.getPattern(name));
    if (!match) {
      return null;
    }
    var value = match[1];

    return value;
  }

  set(name, value, opts) {
    var cookie = new Cookie(name, value, opts);
    var cookies = this.cookies.filter((c) => c.indexOf(cookie.name + '=') !== 0);
    cookies.push(cookie.toHeader());
    this.cookies = cookies;
    this.cookie = cookies.join('; ');
  }

  getPattern(name) {
    if (this.cache[name]) {
      return this.cache[name];
    }
    this.cache[name] = new RegExp('(?:^|;) *' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') +
      '=([^;]*)');
    return this.cache[name];
  }

  toHeader() {
    return this.cookies.join('; ');
  }
}

// window.Cookies = Cookies;
// window.Cookie = Cookie;
}());
