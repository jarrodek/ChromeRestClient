'use strict';

import {Comment} from './comment';
import {Cookie} from './cookie';
import * as Header from './pair';
import * as Query from './pair';
import {PostData} from './post-data';
import {util} from './util';

// jshint unused:false
export function Request(opts = {}) {
  if (!opts.url) {
    throw new Error('url required');
  }

  // internal properties
  Object.defineProperties(this, {
    _headers: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _queryString: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _cookies: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _postData: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new PostData()
    }
  });

  Comment.call(this, opts.comment);

  Object.defineProperty(this, 'method', {
    enumerable: true,
    value: opts.method || ''
  });

  Object.defineProperty(this, 'url', {
    enumerable: true,
    value: opts.url
  });

  Object.defineProperty(this, 'httpVersion', {
    enumerable: true,
    value: opts.httpVersion || ''
  });

  Object.defineProperty(this, 'headersSize', {
    enumerable: true,

    get: function() {
      var headers = util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map((key) => {
        return headers[key];
      });

      var headersString = this.method + this.url + keys.join() + values.join();

      // startline: [method] [url] HTTP/1.1\r\n = 12
      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return util.str2ab(headersString).byteLength + (keys.length * 2) + 2 + 12 + 2;
    },

    set: function() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function() {
      if (this._postData && this._postData.text) {
        return util.str2ab(this._postData.text).byteLength;
      }

      return 0;
    },

    set: function() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'postData', {
    enumerable: true,

    get: function() {
      return this._postData;
    },

    set: function(postData) {
      this._postData = new PostData(postData);
    }
  });

  Object.defineProperty(this, 'headers', {
    enumerable: true,

    get: function() {
      return this._headers;
    },

    set: function(headers) {
      this._headers = [];
      headers.forEach(this.addHeader, this);
    }
  });

  Object.defineProperty(this, 'queryString', {
    enumerable: true,

    get: function() {
      return this._queryString;
    },

    set: function(queryString) {
      this._queryString = [];
      queryString.forEach(this.addQuery, this);
    }
  });

  Object.defineProperty(this, 'cookies', {
    enumerable: true,

    get: function() {
      return this._cookies;
    },

    set: function(cookies) {
      this._cookies = [];
      cookies.forEach(this.addCookie, this);
    }
  });

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  }

  if (opts.queryString) {
    opts.queryString.forEach(this.addQuery, this);
  }

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  }

  if (opts.postData) {
    this.postData = opts.postData;
  }
}

Request.prototype.addHeader = function(header) {
  this._headers.push(new Header.Pair(header));

  return this;
};

Request.prototype.addQuery = function(query) {
  this._queryString.push(new Query.Pair(query));

  return this;
};

Request.prototype.addCookie = function(options) {
  this._cookies.push(new Cookie(options));

  return this;
};
