'use strict';

import {
  Comment
}
from './comment';
import {
  Cookie
}
from './cookie';
import * as Header from './pair';
import * as Query from './pair';
import {
  PostData
}
from './post-data';
import {
  util
}
from './util';

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
    },

    _url: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: ''
    }
  });

  Comment.call(this, opts.comment);

  Object.defineProperty(this, 'method', {
    enumerable: true,
    value: opts.method || ''
  });

  Object.defineProperty(this, 'url', {
    enumerable: true,

    get: function() {
      return this._url;
    },

    set: function(url) {
<<<<<<< HEAD
=======

>>>>>>> hotfix-db
      this._url = url;
      var parser = document.createElement('a');
      parser.href = url;
      if (parser.search.length > 0) {
        let params = parser.search.substr(1).split(/[&|;]/gi);
        params.forEach((param) => {
          let parts = param.split('=');
          this.addQuery({
            name: parts[0],
            value: parts[1]
          });
        });
      }
    }
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
<<<<<<< HEAD
      this._postData = new PostData(postData);
=======
      postData = (postData instanceof PostData) ? postData : new PostData(postData);
      this._postData = postData;
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

<<<<<<< HEAD
  this.url = opts.url;

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
=======
  if (opts.url) {
    this.url = opts.url;
  } else if (opts._url) {
    this.url = opts._url;
  }

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  } else if (opts._headers) {
    opts._headers.forEach(this.addHeader, this);
>>>>>>> hotfix-db
  }

  if (opts.queryString) {
    opts.queryString.forEach(this.addQuery, this);
<<<<<<< HEAD
=======
  } else if (opts._queryString) {
    opts._queryString.forEach(this.addQuery, this);
>>>>>>> hotfix-db
  }

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
<<<<<<< HEAD
=======
  } else if (opts._cookies) {
    opts._cookies.forEach(this.addCookie, this);
>>>>>>> hotfix-db
  }

  if (opts.postData) {
    this.postData = opts.postData;
<<<<<<< HEAD
=======
  } else if (opts._postData) {
    this.postData = opts._postData;
>>>>>>> hotfix-db
  }
}

Request.prototype.addHeader = function(header) {
<<<<<<< HEAD
  this._headers.push(new Header.Pair(header));

=======
  header = (header instanceof Header.Pair) ? header : new Header.Pair(header);
  this._headers.push(header);
>>>>>>> hotfix-db
  return this;
};

Request.prototype.addQuery = function(query) {
<<<<<<< HEAD
  this._queryString.push(new Query.Pair(query));

=======
  query = (query instanceof Query.Pair) ? query : new Query.Pair(query);
  this._queryString.push(query);
>>>>>>> hotfix-db
  return this;
};

Request.prototype.addCookie = function(options) {
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
Request.prototype.toJSON = function() {
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
