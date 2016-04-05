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
    this.linkRegExp = /([^"\s&;<>]*:\/\/[^"\s<>]*)(&quot;|&lt;|&gt;)?/gim;
    this.jsonValue = null;
    this.latestError = null;
    this.elementsCounter = 0;
    if (typeof data === 'string') {
      try {
        this.jsonValue = JSON.parse(data);
      } catch (e) {
        this.latestError = e.message;
      }
    } else {
      this.jsonValue = data;
    }
  }

  get STYLE() {
    if (this._styles) {
      return this._styles;
    }
    this._styles = {
      prettyPrint: 'prettyPrint',
      numeric: 'numeric',
      nullValue: 'nullValue',
      booleanValue: 'booleanValue',
      punctuation: 'punctuation',
      stringValue: 'stringValue',
      node: 'node',
      arrayCounter: 'arrayCounter',
      keyName: 'keyName',
      rootElementToggleButton: 'rootElementToggleButton',
      infoRow: 'infoRow',
      brace: 'brace',
      leftMargin: 25,
      arrayKeyNumber: 'arrayKeyNumber'
    };
    return this._styles;
  }
  /**
   * Get created HTML content.
   */
  getHTML() {
    var parsedData = '<div class="' + this.STYLE.prettyPrint + '">';
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
  parse(data) {
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
    return result;
  }

  parseNullValue() {
    var result = '';
    result += '<span class="' + this.STYLE.nullValue + '">';
    result += 'null';
    result += '</span>';
    return result;
  }

  parseNumericValue(number) {
    var result = '';
    result += '<span class="' + this.STYLE.numeric + '">';
    result += number + '';
    result += '</span>';
    return result;
  }

  parseBooleanValue(bool) {
    var result = '';
    result += '<span class="' + this.STYLE.booleanValue + '">';
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
    result += '<span class="' + this.STYLE.punctuation + '">&quot;</span>';
    result += '<span class="' + this.STYLE.stringValue + '">';
    result += value;
    result += '</span>';
    result += '<span class="' + this.STYLE.punctuation + '">&quot;</span>';
    return result;
  }

  parseObject(object) {
    var pairs = [];
    for (var key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      pairs[pairs.length] = key;
      pairs[pairs.length] = object[key];
    }
    var cnt = pairs.length;
    var result = '';
    result += '<div class="' + this.STYLE.punctuation + ' ' +
			this.STYLE.brace + '">{</div>';
    result += '<div collapse-indicator class="' + this.STYLE.infoRow + '">...</div>';
    for (var i = 0; i < cnt; i = i + 2) {
      var key = pairs[i];
      var value = pairs[i + 1];
      var elementNo = this.elementsCounter++;
      var data = this.parse(value);
      var hasManyChildren = this.elementsCounter - elementNo > 1;
      result += '<div data-element="' + elementNo + '" style="margin-left: ' +
				this.STYLE.leftMargin + 'px" class="' + this.STYLE.node + '">';
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
        result += '<div data-toggle="' + elementNo + '" class="' +
					this.STYLE.rootElementToggleButton + '">-</div>';
      }
      result += '</div>';
    }
    result += '<div class="' + this.STYLE.punctuation + ' ' +
			this.STYLE.brace + '">}</div>';
    return result;
  }

  parseArray(array) {
    var cnt = array.length;
    var result = '';
    result += '<div class="' + this.STYLE.punctuation + ' ' +
			this.STYLE.brace + '">[</div>';
    result += '<div collapse-indicator class="' + this.STYLE.infoRow + '">...</div>';
    result += '<span class="' + this.STYLE.arrayCounter + '">' + cnt + '</span>';
    result += '<span class="' + this.STYLE.punctuation + ' ' + this.STYLE.brace +
			'">]</span>';
    for (var i = 0; i < cnt; i++) {
      var elementNo = this.elementsCounter++;
      var data = this.parse(array[i]);
      var hasManyChildren = this.elementsCounter - elementNo > 1;
      result += '<div data-element="' + elementNo + '" style="margin-left: ' +
				this.STYLE.leftMargin + 'px" class="' + this.STYLE.node + '">';
      result += '<span class="' + this.STYLE.arrayKeyNumber + '">' + i + ': &nbsp;</span>';
      result += data;
      if (hasManyChildren) {
        result += '<div data-toggle="' + elementNo + '" class="' +
					this.STYLE.rootElementToggleButton + '">-</div>';
      }
      result += '</div>';
    }
    return result;
  }

  parseKey(key) {
    var result = '';
    result += '<span class="' + this.STYLE.keyName + '">' + key + '</span>';
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
