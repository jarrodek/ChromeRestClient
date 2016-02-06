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
<<<<<<< HEAD
      this._content = new Content(content);
=======
      content = (content instanceof Content) ? content : new Content(content);
      this._content = content;
>>>>>>> hotfix-db
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
<<<<<<< HEAD

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  }

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  }

  if (opts.content) {
    this.content = opts.content;
=======
  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  } else if (opts._headers) {
    opts._headers.forEach(this.addHeader, this);
  }
  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  } else if (opts._cookies) {
    opts._cookies.forEach(this.addCookie, this);
  }
  if (opts.content) {
    this.content = opts.content;
  } else if (opts._content) {
    this.content = opts._content;
>>>>>>> hotfix-db
  }
}

Response.prototype.addHeader = function(header) {
<<<<<<< HEAD
  this._headers.push(new Header.Pair(header));

=======
  header = (header instanceof Header.Pair) ? header : new Header.Pair(header);
  this._headers.push(header);
>>>>>>> hotfix-db
  return this;
};

Response.prototype.addCookie = function(options) {
<<<<<<< HEAD
  this._cookies.push(new Cookie(options));

  return this;
};
=======
  options = (options instanceof Cookie) ? options : new Cookie(options);
  this._cookies.push(options);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Response.prototype.toJSON = function() {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter((key) => key.indexOf('_') === 0);
  under.forEach((key) => {
    let realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};
>>>>>>> hotfix-db
