'use strict';

import {
  CacheEntry
}
from './cache-entry';
import {
  Comment
}
from './comment';
import {
  DateTime
}
from './date-time';
import {
  Request
}
from './request';
import {
  Response
}
from './response';

// jshint unused:false
export function Entry(opts = {}) {
  if (!opts.startedDateTime || !opts.request || !opts.response) {
    throw new Error('missing required fields');
  }

  opts.cache = opts.cache || {};
  opts.timings = opts.timings || {};

  Comment.call(this, opts.comment);
  DateTime.call(this, 'startedDateTime', opts.startedDateTime);

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
      beforeRequest: opts.cache.beforeRequest ?
        (opts.cache.beforeRequest instanceof CacheEntry) ? opts.cache.beforeRequest :
        new CacheEntry(opts.cache.beforeRequest) : null,
      afterRequest: opts.cache.afterRequest ?
        (opts.cache.afterRequest instanceof CacheEntry) ? opts.cache.afterRequest :
        new CacheEntry(opts.cache.afterRequest) : null,
      comment: opts.cache.comment
    }
  });

  Object.defineProperty(this, 'request', {
    enumerable: true,

    get: function() {
      return this._request;
    },

    set: function(value) {
      value = (value instanceof Request) ? value : new Request(value);
      this._request = value;
    }
  });

  Object.defineProperty(this, 'response', {
    enumerable: true,

    get: function() {
      return this._response;
    },

    set: function(value) {
      value = (value instanceof Response) ? value : new Response(value);
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
Entry.prototype.setPage = function(page) {
  if (!page || !page.id) {
    throw new Error('The page does not have id property.');
  }
  this.pageref = page.id;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Entry.prototype.toJSON = function() {
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
