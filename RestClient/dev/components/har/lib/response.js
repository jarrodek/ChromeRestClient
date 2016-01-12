'use strict';

import {Comment} from './comment';
import {Content} from './content';
import {Cookie} from './cookie';
import * as Header from './pair';
import {util} from './util';

/* global Content, util, Header, Cookie */
// jshint unused:false
export function Response(opts = {}) {
  if (!opts.status || !opts.statusText) {
    throw new Error('missing required fields');
  }

  // internal properties
  Object.defineProperties(this, {
    _headers: {
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

    _content: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new Content()
    }
  });

  Comment.call(this, opts.comment);

  Object.defineProperty(this, 'status', {
    enumerable: true,
    value: opts.status
  });

  Object.defineProperty(this, 'statusText', {
    enumerable: true,
    value: opts.statusText
  });

  Object.defineProperty(this, 'httpVersion', {
    enumerable: true,
    value: opts.httpVersion || 'HTTP/1.1'
  });

  Object.defineProperty(this, 'redirectURL', {
    enumerable: true,
    value: opts.redirectURL || ''
  });

  Object.defineProperty(this, 'headersSize', {
    enumerable: true,

    get: function() {
      var headers = util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map((key) => {
        return headers[key];
      });

      var headersString = keys.join() + values.join();

      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return util.str2ab(headersString).byteLength + (keys.length * 2) + 2 + 2;
    },

    set: function() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function() {
      return this._content.size;
    },

    set: function() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'content', {
    enumerable: true,

    get: function() {
      return this._content;
    },

    set: function(content) {
      this._content = new Content(content);
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

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  }

  if (opts.content) {
    this.content = opts.content;
  }
}

Response.prototype.addHeader = function(header) {
  this._headers.push(new Header.Pair(header));

  return this;
};

Response.prototype.addCookie = function(options) {
  this._cookies.push(new Cookie(options));

  return this;
};
