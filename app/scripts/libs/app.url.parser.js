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

/**
 * Parses URL to get some information about it.
 *
 * <p>Script found at http://blog.stevenlevithan.com/archives/parseuri</p>
 *
 * URL like:
 * http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * parses to:
 *
 * anchor:	top
 * query:	q1=0&&test1&test2=value&a[]=1&a[]=2
 * file:	index.htm
 * directory:	/dir/dir.2/
 * path:	/dir/dir.2/index.htm
 * relative:	/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * port:	81
 * host:	www.test.com
 * password:	pwd
 * user:	usr
 * userInfo:	usr:pwd
 * authority:	usr:pwd@www.test.com:81
 * protocol:	http
 * source:http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value&a[]=1&a[]=2#top
 * queryKey: {
 *   q1:	0,
 *   test1:	[empty string]
 *   test2:	value
 *   a[]:	2
 * }
 *
 * @see http://blog.stevenlevithan.com/archives/parseuri
 */
/*jshint unused:false*/
class URLParser {
  /**
   * Creates an instance of the parser and parse the url
   *
   * @param {String} input The URL to parse
   */
  constructor(input) {
      var regStr = '^(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?(?:\\/\\/)?((?:(([^:@]*)(?::([^:@]*' +
        '))?)?@)?([^:\\/?#]*)(?::(\\d*))?)(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*' +
        '\\/?)?([^?#\\/]*))(?:\\?([^#]*))?(?:#(.*))?)';
      this.mainRegexp = new RegExp(regStr, 'gim');
      /**
       * The full url. Oryginal value of the source.
       * Source can't be changed via any setters.
       *
       * @type {String}
       */
      this.source = input;
      /**
       * Protocol used in URL. It's null by default.
       *
       * @type {String|null}
       */
      this.protocol = null;
      /**
       * Authority used in URL.
       * Authotity is: [USER:PASSWORD@]HOST[:PORT]
       * @example
       * usr:pwd@www.test.com:81
       *
       * @type {String|null}
       */
      this.authority = null;
      /**
       * User Info used in the URL.
       * User info is: USER:PASSWORD.
       * @example
       * usr:pwd
       *
       * @type {String|null}
       */
      this.userInfo = null;
      /**
       * User used in the URL
       *
       * @type {String|null}
       */
      this.user = null;
      /**
       * Password used in the URL
       *
       * @type {String|null}
       */
      this.password = null;
      /**
       * HOST used in the URL
       *
       * @example www.test.com
       *
       * @type {String|null}
       */
      this.host = null;
      /**
       * Port used in the url.
       *
       * @type {String|null}
       */
      this._port = null;
      /**
       * All data after host value in the url
       *
       * @type {String|null}
       */
      this.relative = null;
      /**
       * Path value used in the url.
       *
	     * @example /dir/dir.2/index.htm
       *
       * @type {String|null}
       */
      this.path = null;
      /**
       * Directory value used in the url.
       *
       * @example /dir/dir.2/
       *
       * @type {String|null}
       */
      this.directory = null;
      /**
       * File value used in the url.
       *
       * @example index.htm
       *
       * @type {String|null}
       */
      this.file = null;
      /**
       * Query value used in the url.
       *
       * @example q1=0&&test1&test2=value&a[]=1&a[]=2
       *
       * @type {String|null}
       */
      this._query = null;
      /**
       * Anchor value used in the url without the '#' character
       *
       * @type {String|null}
       */
      this.anchor = null;
      /**
       * List of http parameters.
       *
       * @type {Set}
       */
      this._paramsList = new Set();
      /**
       * A character to be used when parsing query parameters list.
       *
       * @type {String}
       */
      this.queryDelimiter = '&';
      this.parse(input);
    }
    /**
     * Parse the url
     *
     * @param {String} url The URL to parse
     */
  parse(url) {
    var i = 14;
    var results = this.mainRegexp.exec(url);
    while (i--) {
      let value = results[i];
      if (!value) {
        continue;
      }
      switch (i) {
        case 13:
          this.anchor = value;
          break;
        case 12:
          this._query = value;
          break;
        case 11:
          this.file = value;
          break;
        case 10:
          this.directory = value;
          break;
        case 9:
          this.path = value;
          break;
        case 8:
          this.relative = value;
          break;
        case 7:
          this._port = value;
          break;
        case 6:
          this.host = value;
          break;
        case 5:
          this.password = value;
          break;
        case 4:
          this.user = value;
          break;
        case 3:
          this.userInfo = value;
          break;
        case 2:
          this.authority = value;
          break;
        case 1:
          this.protocol = value;
          break;
        case 0:
          this.source = value;
          break;
      }
    }
    if (this._query) {
      this._paramsList = this._parseParams(this._query);
    }
  }
  set port(port) {
    this._port = port;
  }

  get port() {
    if (isNaN(this._port)) {
      return this._port;
    }
    return parseInt(this._port);
  }
  /**
   * Set query value .
   * Note: It will not change source value
   *
   * @param {String} query
   */
  set query(query) {
    if (query) {
      this._query = query;
      this._paramsList = this._parseParams(query);
    } else {
      this._query = null;
      this._paramsList = new Set();
    }
  }
  /**
   * Current query value;
   */
  get query() {
    return this._query;
  }

  set paramsList(paramsList) {
    if (!(paramsList instanceof Set)) {
      try {
        paramsList = new Set(paramsList);
      } catch (e) {
        throw new TypeError('paramsList must be type of set');
      }
    }
    this._paramsList = paramsList;
    this.setQueryFromCurrentParams();
  }

  get paramsList() {
    return this._paramsList;
  }
  /**
   * Parse a query params value and return a set of parsed parameters.
   *
   * @param {String} query A query string from the url.
   * @return {Set} A set of objects where param name has key `name` and param value has key
   * `value`.
   */
  _parseParams(query) {
    var reg = /(?:^|&|;)([^&;=]*)=?([^&;]*)/g;
    var result = new Set();
    query.replace(reg, ($0, $1, $2) => {
      if ($1) {
        let obj = {
          name: $1,
          value: $2
        };
        result.add(obj);
      }
    });
    return result;
  }

  setQueryFromCurrentParams() {
    var result = '';
    for (let param of this._paramsList) {
      if (!param) {
        continue;
      }
      if (result) {
        result += this.queryDelimiter;
      }
      result += param.name + '=' + param.value;
    }
    this._query = result;
  }

  toString() {
    var result = '';
    var hasUser = false;
    var hasPassword = false;
    if (this.protocol) {
      result += this.protocol;
      result += '://';
    }

    if (this.user && this.user.trim() !== '') {
      hasUser = true;
      result += this.user;
    }
    if (this.password && this.password.trim() !== '') {
      hasPassword = true;
      if (hasUser) {
        result += ':';
      }
      result += this.password;
    }
    if (hasPassword || hasUser) {
      result += '@';
    }
    result += this.host;

    if (this._port) {
      result += ':' + this._port;
    }
    result += this.path;
    if (this._query && this._query.trim() !== '') {
      result += '?' + this._query;
    }
    if (this.anchor && this.anchor.trim() !== '') {
      result += '#' + this.anchor;
    }
    return result;
  }
  /**
   * Returns a string where all characters that are not valid for a URL
   * component have been escaped. The escaping of a character is done by
   * converting it into its UTF-8 encoding and then encoding each of the
   * resulting bytes as a %xx hexadecimal escape sequence.
   * <p>
   * Note: this method will convert any the space character into its escape
   * short form, '+' rather than %20. It should therefore only be used for
   * query-string parts.
   *
   * <p>
   * The following character sets are <em>not</em> escaped by this method:
   * <ul>
   * <li>ASCII digits or letters</li>
   * <li>ASCII punctuation characters:
   *
   * <pre>- _ . ! ~ * ' ( )</pre>
   * </li>
   * </ul>
   * </p>
   *
   * <p>
   * Notice that this method <em>does</em> encode the URL component delimiter
   * characters:<blockquote>
   *
   * <pre>
   * ; / ? : &amp; = + $ , #
   * </pre>
   *
   * </blockquote>
   * </p>
   *
   * @param {String} str A string containing invalid URL characters
   * @return {String} a string with all invalid URL characters escaped
   */
  static encodeQueryString(str) {
    if (!str) {
      return str;
    }
    var regexp = /%20/g;
    return encodeURIComponent(str).replace(regexp, '+');
  }
  /**
   * Returns a string where all URL component escape sequences have been
   * converted back to their original character representations.
   *
   * Note: this method will convert the space character escape short form, '+',
   * into a space. It should therefore only be used for query-string parts.
   *
   * @param {String} str string containing encoded URL component sequences
   * @return {String} string with no encoded URL component encoded sequences
   */
  static decodeQueryString(str) {
    if (!str) {
      return str;
    }
    var regexp = /\+/g;
    return decodeURIComponent(str.replace(regexp, '%20'));
  }
}
