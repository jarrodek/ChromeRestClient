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
/**
 * A class containing methods to parse request payload.
 */
class PayloadParser {

  static get AMP_RE() {
    return new RegExp(/&/g);
  }
  static get GT_RE() {
    return new RegExp(/>/g);
  }

  static get LT_RE() {
    return new RegExp(/</g);
  }
  static get SQUOT_RE() {
    return new RegExp(/'/g);
  }
  static get QUOT_RE() {
    return new RegExp(/"/g);
  }
  /**
   * Escape HTML to save HTML text.
   *
   * @param {String} s A HTML string to be escaped.
   */
  static htmlEscape(s) {
    if (s.indexOf('&') !== -1) {
      s = s.replace(PayloadParser.AMP_RE, '&amp;');
    }
    if (s.indexOf('<') !== -1) {
      s = s.replace(PayloadParser.LT_RE, '&lt;');
    }
    if (s.indexOf('>') !== -1) {
      s = s.replace(PayloadParser.GT_RE, '&gt;');
    }
    if (s.indexOf('"') !== -1) {
      s = s.replace(PayloadParser.QUOT_RE, '&quot;');
    }
    if (s.indexOf('\'') !== -1) {
      s = s.replace(PayloadParser.SQUOT_RE, '&#39;');
    }
    return s;
  }

  /**
   * Parse input array to string x-www-form-urlencoded
   *
   * @param {Array<Object>} arr Input array. Each element musct contain an object with
   * `name` and `value` keys.
   * @return {String} A parsed string of `name`=`value` pairs of the input objects.
   */
  static arrayToString(arr) {
    var result = '';
    if (!arr) {
      return result;
    }
    arr.forEach((item) => {
      let name = PayloadParser._paramValue(item.name);
      let value = PayloadParser._paramValue(item.value);
      if (!name && !value) {
        return;
      }
      if (result) {
        result += '&';
      }
      result += name + '=' + value;
    });
    return result;
  }

  /**
   * Parse input string to array of x-www-form-urlencoded form parameters.
   *
   * @param {String} input A string of HTTP x-www-form-urlencoded parameters
   * @return {Array<Object>} An array of params with `name` and `value` keys.
   */
  static stringToArray(input) {
    var result = [];
    if (!input || !input.trim()) {
      return result;
    }
    //Chrome inspector has FormData output in format: `param-name`:`param-value`
    //When copying from inspector the ':' must be replaced with '='
    var htmlInputCheck = /^([^\\=]{1,})=(.*)$/m;
    if (!htmlInputCheck.test(input)) {
      //replace chome inspector data.
      input = input.replace(/^([^\\:]{1,}):(.*)$/gm, '$1=$2&').replace(/\n/gm, '');
      input = input.substr(0, input.length - 1);
    }

    result = PayloadParser._createParamsArray(input);
    return result;
  }
  /**
   * Converts a string to an array with objects containing name and value keys
   * @param {String} input An input string
   * @return {Array.<Object>} An array of params with `name` and `value` keys.
   */
  static _createParamsArray(input) {
    var result = [];
    if (!input) {
      return result;
    }
    var state = 0; // 0 - reading name, 1 - reading value
    var i = 0;
    var _tmpName = '';
    var _tmpValue = '';
    while (true) {
      let ch = input[i++];
      if (ch === undefined) {
        if (_tmpValue || _tmpName) {
          result[result.length] = {
            name: _tmpName,
            value: _tmpValue
          };
        }
        break;
      }
      if (ch === '=') {
        if (state !== 1) {
          state = 1;
          continue;
        }
      }
      if (ch === '&') {
        state = 0;
        result[result.length] = {
          name: _tmpName,
          value: _tmpValue
        };
        _tmpName = '';
        _tmpValue = '';
        continue;
      }
      if (state === 0) {
        _tmpName += ch;
      } else if (state === 1) {
        _tmpValue += ch;
      }
    }
    return result;
  }

  /**
   * Encode payload to x-www-form-urlencoded string.
   *
   * @param {Array<object>|String} input An input data.
   */
  static encodeUrlEncoded(input) {
    if (!input || !input.length) {
      return input;
    }
    var isArray = true;
    if (!(input instanceof Array)) {
      isArray = false;
      input = PayloadParser.stringToArray(input);
    }
    input.forEach((obj) => {
      obj.name = PayloadParser.encodeQueryString(obj.name);
      obj.value = PayloadParser.encodeQueryString(obj.value);
    });
    if (isArray) {
      return input;
    }
    return PayloadParser.arrayToString(input);
  }

  /**
   * Decode x-www-form-urlencoded data.
   *
   * @param {Array<object>|String} input An input data.
   */
  static decodeUrlEncoded(input) {
    if (!input || !input.length) {
      return input;
    }
    var isArray = true;
    if (!(input instanceof Array)) {
      isArray = false;
      input = PayloadParser.stringToArray(input);
    }
    input.forEach((obj) => {
      obj.name = PayloadParser.decodeQueryString(obj.name);
      obj.value = PayloadParser.decodeQueryString(obj.value);
    });
    if (isArray) {
      return input;
    }
    return PayloadParser.arrayToString(input);
  }

  /**
   * Parse input string as a payload param key or value.
   *
   * @param {String} input An input to parse.
   */
  static _paramValue(input) {
    if (!input) {
      return String();
    }
    input = String(input);
    input = input.trim();
    return input;
  }
  /**
   * Parse a line of key=value http params into an object with `name` and `value` keys.
   *
   * @param {String} input A input line of x-www-form-urlencoded text tike `param=value`
   * @return {Object} A parsed object with `name` and `value` keys.
   * @deprecated It's old parser. Use `_createParamsArray` instead.
   */
  static _paramLineToFormObject(input) {
    if (!input) {
      return;
    }
    var _tmp = input.split('=');
    var name = _tmp[0].trim();
    if (!name && _tmp.length === 1) {
      return;
    }
    var value;
    if (_tmp.length === 1) {
      value = '';
    } else {
      value = _tmp[1].trim();
    }
    return {
      name: name,
      value: value
    };
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
window.PayloadParser = PayloadParser;
}());
