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
      input = a.replace(/^([^\\:]{1,}):(.*)$/gm, '$1=$2&').replace(/\n/gm,'');
      input = input.substr(0, input.length - 1);
    }
    var parts = input.split('&');
    parts.forEach((line) => {
      var obj = PayloadParser._paramLineToFormObject(line);
      if (!obj) {
        return;
      }
      result.push(obj);
    });
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
      obj.name = URLParser.encodeQueryString(obj.name);
      obj.value = URLParser.encodeQueryString(obj.value);
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
      obj.name = URLParser.decodeQueryString(obj.name);
      obj.value = URLParser.decodeQueryString(obj.value);
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
}
