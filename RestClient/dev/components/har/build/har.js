(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheEntry = CacheEntry;

var _comment = require('./comment');

var _dateTime = require('./date-time');

function CacheEntry() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'expires', opts.expires, true);
  _dateTime.DateTime.call(this, 'lastAccess', opts.expires, true);

  Object.defineProperty(this, 'eTag', {
    enumerable: true,
    writable: true,
    value: opts.eTag
  });

  Object.defineProperty(this, 'hitCount', {
    enumerable: true,
    writable: true,
    value: opts.hitCount
  });
}

},{"./comment":2,"./date-time":6}],2:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Comment = Comment;
function Comment(comment) {
  Object.defineProperty(this, 'comment', {
    enumerable: true,
    writable: true,
    value: comment
  });
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Content = Content;

var _comment = require('./comment');

var _util = require('./util');

// jshint unused:false
function Content() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'size', {
    enumerable: true,

    get: function get() {
      if (this.text) {
        return _util.util.str2ab(this.text).byteLength;
      }

      return 0;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'compression', {
    enumerable: true,
    writable: true,
    value: opts.compression
  });

  Object.defineProperty(this, 'mimeType', {
    enumerable: true,
    writable: true,
    value: opts.mimeType || 'application/octet-stream'
  });

  Object.defineProperty(this, 'encoding', {
    enumerable: true,
    writable: true,
    value: opts.encoding
  });

  Object.defineProperty(this, 'text', {
    enumerable: true,
    writable: true,
    value: opts.text
  });
}

},{"./comment":2,"./util":16}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cookie = Cookie;

var _comment = require('./comment');

var _dateTime = require('./date-time');

// jshint unused:false
function Cookie() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.name || !opts.value) {
    throw new Error('missing required fields');
  }

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'expires', opts.expires, true);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value
  });

  Object.defineProperty(this, 'path', {
    enumerable: true,
    writable: true,
    value: opts.path
  });

  Object.defineProperty(this, 'domain', {
    enumerable: true,
    writable: true,
    value: opts.domain
  });

  Object.defineProperty(this, 'httpOnly', {
    enumerable: true,
    writable: true,
    value: typeof opts.httpOnly === 'boolean' ? opts.httpOnly : false
  });

  Object.defineProperty(this, 'secure', {
    enumerable: true,
    writable: true,
    value: typeof opts.secure === 'boolean' ? opts.secure : false
  });
}

},{"./comment":2,"./date-time":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Creator = Creator;

var _comment = require('./comment');

var _version = require('./version');

// jshint unused:false
function Creator() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.name) {
    throw new Error('name required');
  }

  _comment.Comment.call(this, opts.comment);
  _version.Version.call(this, opts.version);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name
  });
}

},{"./comment":2,"./version":17}],6:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTime = DateTime;
function DateTime(name, value) {
  var date = new Date();

  switch (Object.prototype.toString.call(value)) {
    case '[object Undefined]':
      date = undefined;
      break;

    case '[object Date]':
      date = value;
      break;

    case '[object String]':
      date.setTime(Date.parse(value));
      break;

    case '[object Number]':
      date.setTime(value);
      break;
  }

  Object.defineProperty(this, name || 'dateTime', {
    enumerable: true,
    writable: true,
    value: date ? date.toISOString() : undefined
  });
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entry = Entry;

var _cacheEntry = require('./cache-entry');

var _comment = require('./comment');

var _dateTime = require('./date-time');

var _request = require('./request');

var _response = require('./response');

// jshint unused:false
function Entry() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!opts.startedDateTime || !opts.request || !opts.response) {
    throw new Error('missing required fields');
  }

  opts.cache = opts.cache || {};
  opts.timings = opts.timings || {};

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'startedDateTime', opts.startedDateTime);

  Object.defineProperty(this, 'pageref', {
    enumerable: true,
    writable: true,
    value: opts.pageref
  });

  Object.defineProperty(this, 'time', {
    enumerable: true,
    writable: true,
    value: opts.time !== undefined ? opts.time : -1
  });

  Object.defineProperty(this, 'connection', {
    enumerable: true,
    writable: true,
    value: opts.connection
  });

  Object.defineProperty(this, 'serverIPAddress', {
    enumerable: true,
    writable: true,
    value: opts.serverIPAddress
  });

  Object.defineProperty(this, 'timings', {
    enumerable: true,
    writable: true,
    value: {
      blocked: opts.timings.blocked !== undefined ? opts.timings.blocked : -1,
      connect: opts.timings.connect !== undefined ? opts.timings.connect : -1,
      dns: opts.timings.dns !== undefined ? opts.timings.dns : -1,
      receive: opts.timings.receive !== undefined ? opts.timings.receive : -1,
      send: opts.timings.send !== undefined ? opts.timings.send : -1,
      wait: opts.timings.wait !== undefined ? opts.timings.wait : -1,
      comment: opts.timings.comment
    }
  });

  Object.defineProperty(this, 'cache', {
    enumerable: true,
    writable: true,
    value: {
      beforeRequest: opts.cache.beforeRequest ? opts.cache.beforeRequest instanceof _cacheEntry.CacheEntry ? opts.cache.beforeRequest : new _cacheEntry.CacheEntry(opts.cache.beforeRequest) : null,
      afterRequest: opts.cache.afterRequest ? opts.cache.afterRequest instanceof _cacheEntry.CacheEntry ? opts.cache.afterRequest : new _cacheEntry.CacheEntry(opts.cache.afterRequest) : null,
      comment: opts.cache.comment
    }
  });

  Object.defineProperty(this, 'request', {
    enumerable: true,

    get: function get() {
      return this._request;
    },

    set: function set(value) {
      value = value instanceof _request.Request ? value : new _request.Request(value);
      this._request = value;
    }
  });

  Object.defineProperty(this, 'response', {
    enumerable: true,

    get: function get() {
      return this._response;
    },

    set: function set(value) {
      value = value instanceof _response.Response ? value : new _response.Response(value);
      this._response = value;
    }
  });
  if (opts.request) {
    this.request = opts.request;
  } else if (opts._request) {
    this.request = opts._request;
  }
  if (opts.response) {
    this.response = opts.response;
  } else if (opts._response) {
    this.response = opts._response;
  }
}
/**
 * Associate existing page with this Entry object.
 */
Entry.prototype.setPage = function (page) {
  if (!page || !page.id) {
    throw new Error('The page does not have id property.');
  }
  this.pageref = page.id;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Entry.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./cache-entry":1,"./comment":2,"./date-time":6,"./request":14,"./response":15}],8:[function(require,module,exports){
'use strict';

var _cacheEntry = require('./cache-entry');

var _comment = require('./comment');

var _content = require('./content');

var _cookie = require('./cookie');

var _creator = require('./creator');

var _dateTime = require('./date-time');

var _entry = require('./entry');

var _log = require('./log');

var _page = require('./page');

var _pair = require('./pair');

var _param = require('./param');

var _postData = require('./post-data');

var _request = require('./request');

var _response = require('./response');

var _version = require('./version');

// jshint unused:false
var HAR = {
  Browser: _creator.Creator,
  CacheEntry: _cacheEntry.CacheEntry,
  Comment: _comment.Comment,
  Content: _content.Content,
  Cookie: _cookie.Cookie,
  Creator: _creator.Creator,
  DateTime: _dateTime.DateTime,
  Entry: _entry.Entry,
  Header: _pair.Pair,
  Log: _log.Log,
  Page: _page.Page,
  Param: _param.Param,
  PostData: _postData.PostData,
  Query: _pair.Pair,
  Request: _request.Request,
  Response: _response.Response,
  Version: _version.Version
};
module.exports = HAR;
window.HAR = HAR;

},{"./cache-entry":1,"./comment":2,"./content":3,"./cookie":4,"./creator":5,"./date-time":6,"./entry":7,"./log":9,"./page":10,"./pair":11,"./param":12,"./post-data":13,"./request":14,"./response":15,"./version":17}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = Log;

var _comment = require('./comment');

var _creator = require('./creator');

var _entry = require('./entry');

var _page = require('./page');

var _version = require('./version');

function Log() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // internal properties
  Object.defineProperties(this, {
    _pages: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    },

    _entries: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    }
  });

  _comment.Comment.call(this, opts.comment);
  _version.Version.call(this, opts.version);

  Object.defineProperty(this, 'creator', {
    enumerable: true,
    value: opts.creator instanceof _creator.Creator ? opts.creator : new _creator.Creator(opts.creator)
  });

  Object.defineProperty(this, 'browser', {
    enumerable: true,
    value: opts.browser ? opts.browser instanceof _creator.Creator ? opts.browser : new _creator.Creator(opts.browser) : undefined
  });

  Object.defineProperty(this, 'pages', {
    enumerable: true,

    get: function get() {
      return this._pages;
    },

    set: function set(pages) {
      this._pages = [];
      pages.forEach(this.addPage, this);
    }
  });

  Object.defineProperty(this, 'entries', {
    enumerable: true,

    get: function get() {
      return this._entries;
    },

    set: function set(entries) {
      this._entries = [];
      entries.forEach(this.addEntry, this);
    }
  });

  if (opts.pages) {
    opts.pages.forEach(this.addPage, this);
  } else if (opts._pages) {
    opts._pages.forEach(this.addPage, this);
  }

  if (opts.entries) {
    opts.entries.forEach(this.addEntry, this);
  } else if (opts._entries) {
    opts._entries.forEach(this.addEntry, this);
  }
}

Log.prototype.addPage = function (page) {
  page = page instanceof _page.Page ? page : new _page.Page(page);
  this._pages.push(page);
  return this;
};

Log.prototype.addEntry = function (entry, pageref) {
  entry.pageref = pageref || entry.pageref;
  entry = entry instanceof _entry.Entry ? entry : new _entry.Entry(entry);
  this._entries.push(entry);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Log.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./creator":5,"./entry":7,"./page":10,"./version":17}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = Page;

var _comment = require('./comment');

var _dateTime = require('./date-time');

var _util = require('./util');

// jshint unused:false
function Page(options) {
  var opts = options || {};

  opts.pageTimings = opts.pageTimings || {};

  _comment.Comment.call(this, opts.comment);
  _dateTime.DateTime.call(this, 'startedDateTime', opts.startedDateTime);

  Object.defineProperty(this, 'id', {
    enumerable: true,
    writable: true,
    value: opts.id || _util.util.makeid(Math.ceil(10 / 2)).toString('hex').slice(0, 10)
  });

  Object.defineProperty(this, 'title', {
    enumerable: true,
    writable: true,
    value: opts.title || ''
  });

  Object.defineProperty(this, 'pageTimings', {
    enumerable: true,
    writable: true,
    value: {
      onLoad: opts.pageTimings.onLoad !== undefined ? opts.pageTimings.onLoad : -1,
      onContentLoad: opts.pageTimings.onContentLoad !== undefined ? opts.pageTimings.onContentLoad : -1
    }
  });
}

},{"./comment":2,"./date-time":6,"./util":16}],11:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pair = Pair;

var _comment = require('./comment');

// jshint unused:false
function Pair(name, value, comment) {
  var opts = {
    name: name,
    value: value,
    comment: comment
  };

  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
    opts = name;
  }

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name || ''
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value || ''
  });
}

},{"./comment":2}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Param = Param;

var _comment = require('./comment');

// jshint unused:false
function Param() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name || ''
  });

  Object.defineProperty(this, 'value', {
    enumerable: true,
    writable: true,
    value: opts.value || ''
  });

  Object.defineProperty(this, 'contentType', {
    enumerable: true,
    writable: true,
    value: opts.contentType || undefined
  });

  Object.defineProperty(this, 'fileName', {
    enumerable: true,
    writable: true,
    value: opts.fileName || undefined
  });
}

},{"./comment":2}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostData = PostData;

var _comment = require('./comment');

var _param = require('./param');

function PostData() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // internal properties
  Object.defineProperties(this, {
    _params: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    }
  });

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'mimeType', {
    enumerable: true,
    writable: true,
    value: opts.mimeType || 'application/octet-stream'
  });

  Object.defineProperty(this, 'text', {
    enumerable: true,
    writable: true,
    value: opts.text || ''
  });

  Object.defineProperty(this, 'params', {
    enumerable: true,

    get: function get() {
      return this._params;
    },

    set: function set(params) {
      this._params = [];
      params.forEach(this.addParam, this);
    }
  });

  if (opts.params) {
    opts.params.forEach(this.addParam, this);
  }
}

PostData.prototype.addParam = function (param) {
  this._params.push(new _param.Param(param));

  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
PostData.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./param":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = Request;

var _comment = require('./comment');

var _cookie = require('./cookie');

var _pair = require('./pair');

var Header = _interopRequireWildcard(_pair);

var Query = _interopRequireWildcard(_pair);

var _postData = require('./post-data');

var _util = require('./util');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

// jshint unused:false
function Request() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
      value: new _postData.PostData()
    },

    _url: {
      enumerable: true,
      configurable: false,
      writable: true,
      value: ''
    }
  });

  _comment.Comment.call(this, opts.comment);

  Object.defineProperty(this, 'method', {
    enumerable: true,
    value: opts.method || ''
  });

  Object.defineProperty(this, 'url', {
    enumerable: true,

    get: function get() {
      return this._url;
    },

    set: function set(url) {
      var _this = this;

      this._url = url;
      var parser = document.createElement('a');
      parser.href = url;
      if (parser.search.length > 0) {
        var params = parser.search.substr(1).split(/[&|;]/gi);
        params.forEach(function (param) {
          var parts = param.split('=');
          _this.addQuery({
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

    get: function get() {
      var headers = _util.util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map(function (key) {
        return headers[key];
      });

      var headersString = this.method + this.url + keys.join() + values.join();

      // startline: [method] [url] HTTP/1.1\r\n = 12
      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return _util.util.str2ab(headersString).byteLength + keys.length * 2 + 2 + 12 + 2;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function get() {
      if (this._postData && this._postData.text) {
        return _util.util.str2ab(this._postData.text).byteLength;
      }

      return 0;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'postData', {
    enumerable: true,

    get: function get() {
      return this._postData;
    },

    set: function set(postData) {
      postData = postData instanceof _postData.PostData ? postData : new _postData.PostData(postData);
      this._postData = postData;
    }
  });

  Object.defineProperty(this, 'headers', {
    enumerable: true,

    get: function get() {
      return this._headers;
    },

    set: function set(headers) {
      this._headers = [];
      headers.forEach(this.addHeader, this);
    }
  });

  Object.defineProperty(this, 'queryString', {
    enumerable: true,

    get: function get() {
      return this._queryString;
    },

    set: function set(queryString) {
      this._queryString = [];
      queryString.forEach(this.addQuery, this);
    }
  });

  Object.defineProperty(this, 'cookies', {
    enumerable: true,

    get: function get() {
      return this._cookies;
    },

    set: function set(cookies) {
      this._cookies = [];
      cookies.forEach(this.addCookie, this);
    }
  });

  if (opts.url) {
    this.url = opts.url;
  } else if (opts._url) {
    this.url = opts._url;
  }

  if (opts.headers) {
    opts.headers.forEach(this.addHeader, this);
  } else if (opts._headers) {
    opts._headers.forEach(this.addHeader, this);
  }

  if (opts.queryString) {
    opts.queryString.forEach(this.addQuery, this);
  } else if (opts._queryString) {
    opts._queryString.forEach(this.addQuery, this);
  }

  if (opts.cookies) {
    opts.cookies.forEach(this.addCookie, this);
  } else if (opts._cookies) {
    opts._cookies.forEach(this.addCookie, this);
  }

  if (opts.postData) {
    this.postData = opts.postData;
  } else if (opts._postData) {
    this.postData = opts._postData;
  }
}

Request.prototype.addHeader = function (header) {
  header = header instanceof Header.Pair ? header : new Header.Pair(header);
  this._headers.push(header);
  return this;
};

Request.prototype.addQuery = function (query) {
  query = query instanceof Query.Pair ? query : new Query.Pair(query);
  this._queryString.push(query);
  return this;
};

Request.prototype.addCookie = function (options) {
  options = options instanceof _cookie.Cookie ? options : new _cookie.Cookie(options);
  this._cookies.push(options);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Request.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./cookie":4,"./pair":11,"./post-data":13,"./util":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Response = Response;

var _comment = require('./comment');

var _content = require('./content');

var _cookie = require('./cookie');

var _pair = require('./pair');

var Header = _interopRequireWildcard(_pair);

var _util = require('./util');

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

/* global Content, util, Header, Cookie */
// jshint unused:false
function Response() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
      value: new _content.Content()
    }
  });

  _comment.Comment.call(this, opts.comment);

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

    get: function get() {
      var headers = _util.util.toObject(this._headers);
      var keys = Object.keys(headers);

      var values = keys.map(function (key) {
        return headers[key];
      });

      var headersString = keys.join() + values.join();

      // endline: \r\n = 2
      // every header + \r\n = * 2
      // add 2 for each combined header
      return _util.util.str2ab(headersString).byteLength + keys.length * 2 + 2 + 2;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'bodySize', {
    enumerable: true,

    get: function get() {
      return this._content.size;
    },

    set: function set() {
      throw Error('not allowed');
    }
  });

  Object.defineProperty(this, 'content', {
    enumerable: true,

    get: function get() {
      return this._content;
    },

    set: function set(content) {
      content = content instanceof _content.Content ? content : new _content.Content(content);
      this._content = content;
    }
  });

  Object.defineProperty(this, 'headers', {
    enumerable: true,

    get: function get() {
      return this._headers;
    },

    set: function set(headers) {
      this._headers = [];
      headers.forEach(this.addHeader, this);
    }
  });

  Object.defineProperty(this, 'cookies', {
    enumerable: true,

    get: function get() {
      return this._cookies;
    },

    set: function set(cookies) {
      this._cookies = [];
      cookies.forEach(this.addCookie, this);
    }
  });
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
  }
}

Response.prototype.addHeader = function (header) {
  header = header instanceof Header.Pair ? header : new Header.Pair(header);
  this._headers.push(header);
  return this;
};

Response.prototype.addCookie = function (options) {
  options = options instanceof _cookie.Cookie ? options : new _cookie.Cookie(options);
  this._cookies.push(options);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Response.prototype.toJSON = function () {
  var copy = Object.assign({}, this);
  var keys = Object.keys(copy);
  var under = keys.filter(function (key) {
    return key.indexOf('_') === 0;
  });
  under.forEach(function (key) {
    var realKey = key.substr(1);
    copy[realKey] = copy[key];
    delete copy[key];
  });
  return copy;
};

},{"./comment":2,"./content":3,"./cookie":4,"./pair":11,"./util":16}],16:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
var util = exports.util = {
  toObject: function toObject(array) {
    return array.reduce(function (obj, pair) {
      if (obj[pair.name] === undefined) {
        obj[pair.name] = pair.value;
        return obj;
      }

      // convert to array
      var arr = [obj[pair.name], pair.value];

      obj[pair.name] = arr;

      return obj;
    }, {});
  },

  toArray: function toArray(obj) {
    return Object.keys(obj).map(function (name) {
      return {
        name: name,
        value: obj[name]
      };
    });
  },

  str2ab: function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

  makeid: function makeid(size) {
    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < size; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
};

},{}],17:[function(require,module,exports){
'use strict';

// jshint unused:false

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Version = Version;
function Version(version) {
  if (!version) {
    throw new Error('version required');
  }

  Object.defineProperty(this, 'version', {
    enumerable: true,
    writable: true,
    value: version.toString()
  });
}

},{}]},{},[8])