'use strict';
/* global self */

var SafeHtmlUtils = {
  AMP_RE: new RegExp(/&/g),
  GT_RE: new RegExp(/>/g),
  LT_RE: new RegExp(/</g),
  SQUOT_RE: new RegExp(/'/g),
  QUOT_RE: new RegExp(/"/g),

  htmlEscape: function(s) {
    if (s.indexOf('&') !== -1) {
      s = s.replace(SafeHtmlUtils.AMP_RE, '&amp;');
    }
    if (s.indexOf('<') !== -1) {
      s = s.replace(SafeHtmlUtils.LT_RE, '&lt;');
    }
    if (s.indexOf('>') !== -1) {
      s = s.replace(SafeHtmlUtils.GT_RE, '&gt;');
    }
    if (s.indexOf('"') !== -1) {
      s = s.replace(SafeHtmlUtils.QUOT_RE, '&quot;');
    }
    if (s.indexOf('\'') !== -1) {
      s = s.replace(SafeHtmlUtils.SQUOT_RE, '&#39;');
    }
    return s;
  }
};

class JSONViewer {
  constructor(data) {
    var jsonData = data.json;
    this.rawData = data.raw || '';
    this._numberIndexes = {}; // Regexp number indexes
    this.linkRegExp = /([^"\s&;<>]*:\/\/[^"\s<>]*)(&quot;|&lt;|&gt;)?/gim;
    this.jsonValue = null;
    this.latestError = null;
    this.elementsCounter = 0;
    if (typeof jsonData === 'string') {
      try {
        this.jsonValue = JSON.parse(jsonData);
      } catch (e) {
        this.latestError = e.message;
      }
    } else {
      this.jsonValue = jsonData;
    }
  }
  /**
   * Get created HTML content.
   */
  getHTML() {
    var parsedData = '<div class="prettyPrint">';
    parsedData += this.parse(this.jsonValue);
    parsedData += '</div>';

    var replace = '<a title="Click to insert into URL field" response-anchor href="$1">$1</a>';
    var match = parsedData.match(this.linkRegExp);
    replace = replace.replace(/\$0/, match);
    parsedData = parsedData.replace(this.linkRegExp, replace);

    return parsedData;
  }
  /**
   * Parse JSON data
   */
  parse(data, opts) {
    opts = opts || {};

    var result = '';
    if (data === null) {
      result += this.parseNullValue();
    } else if (typeof data === 'number') {
      result += this.parseNumericValue(data);
    } else if (typeof data === 'boolean') {
      result += this.parseBooleanValue(data);
    } else if (typeof data === 'string') {
      result += this.parseStringValue(data);
    } else if (data instanceof Array) {
      result += this.parseArray(data);
    } else {
      result += this.parseObject(data);
    }
    if (opts.hasNextSibling && !opts.holdComa) {
      result += '<span class="punctuation hidden">,</span>';
    }
    return result;
  }

  parseNullValue() {
    var result = '';
    result += '<span class="nullValue">';
    result += 'null';
    result += '</span>';
    return result;
  }

  parseNumericValue(number) {
    var expectedNumber;
    if (number > Number.MAX_SAFE_INTEGER) {
      let comp = String(number);
      comp = comp.substr(0, 15);
      let r = new RegExp(comp + '(\\d+),', 'gim');
      if (comp in this._numberIndexes) {
        r.lastIndex = this._numberIndexes[comp];
      }
      let result = r.exec(this.rawData);
      if (result) {
        this._numberIndexes[comp] = result.index;
        expectedNumber = comp + result[1];
      }
    }

    var result = '';
    result += '<span class="numeric">';
    if (expectedNumber) {
      result += '<js-max-number-error class="number-error" expected-number="' + expectedNumber +
        '">';
    }
    result += number + '';
    if (expectedNumber) {
      result += '</js-max-number-error>';
    }
    result += '</span>';
    return result;
  }

  parseBooleanValue(bool) {
    var result = '';
    result += '<span class="booleanValue">';
    if (bool !== null && bool !== undefined) {
      result += bool + '';
    } else {
      result += 'null';
    }
    result += '</span>';
    return result;
  }

  parseStringValue(str) {
    var result = '';
    var value = str || '';
    if (value !== null && value !== undefined) {
      value = SafeHtmlUtils.htmlEscape(value);
      if (value.slice(0, 1) === '/') {
        value = '<a title="Click to insert into URL field" response-anchor add-root-url href="' +
          value + '">' + value + '</a>';
      }
    } else {
      value = 'null';
    }
    result += '<span class="punctuation">&quot;</span>';
    result += '<span class="stringValue">';
    result += value;
    result += '</span>';
    result += '<span class="punctuation">&quot;</span>';
    return result;
  }

  parseObject(object) {

    var result = '';
    result += '<div class="punctuation brace">{</div>';
    result += '<div collapse-indicator class="info-row">...</div>';

    Object.getOwnPropertyNames(object).forEach((key, i, arr) => {
      let value = object[key];

      let lastSibling = (i + 1) === arr.length;
      let parseOpts = {
        hasNextSibling: !lastSibling
      };
      if (value instanceof Array) {
        parseOpts.holdComa = true;
      }
      var elementNo = this.elementsCounter++;
      var data = this.parse(value, parseOpts);
      var hasManyChildren = this.elementsCounter - elementNo > 1;
      result += '<div data-element="' + elementNo + '" style="margin-left: 24px" class="node">';
      var _nan = isNaN(key);
      if (_nan) {
        result += '"';
      }
      result += this.parseKey(key);
      if (_nan) {
        result += '"';
      }
      result += ': ' + data;
      if (hasManyChildren) {
        result += '<div data-toggle="' + elementNo + '" class="rootElementToggleButton"></div>';
      }
      result += '</div>';
    });
    result += '<div class="punctuation brace">}</div>';
    return result;
  }

  parseArray(array) {
    var cnt = array.length;
    var result = '';
    result += '<span class="punctuation hidden">[</span>';
    result += '<span class="array-counter brace punctuation" count="' + cnt + '"></span>';
    for (let i = 0; i < cnt; i++) {
      var elementNo = this.elementsCounter++;

      let lastSibling = (i + 1) === cnt;
      var data = this.parse(array[i], {hasNextSibling: !lastSibling});
      var hasManyChildren = this.elementsCounter - elementNo > 1;
      result += '<div data-element="' + elementNo + '" style="margin-left: 24px" class="node">';
      result += '<span class="array-key-number" index="' + i + '"> &nbsp;</span>';
      result += data;
      if (hasManyChildren) {
        result += '<div data-toggle="' + elementNo + '" class="rootElementToggleButton"></div>';
      }
      result += '</div>';
    }
    result += '<span class="punctuation hidden">],</span>';
    return result;
  }

  parseKey(key) {
    var result = '';
    result += '<span class="key-name">' + key + '</span>';
    return result;
  }
}

self.onmessage = function(e) {
  var parser = new JSONViewer(e.data);
  if (parser.latestError !== null) {
    self.postMessage({
      message: parser.latestError,
      error: true
    });
    return;
  }
  var result = parser.getHTML();
  parser = null;
  self.postMessage({
    message: result,
    error: false
  });
};
