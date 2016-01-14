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
      beforeRequest: opts.cache.beforeRequest ? new CacheEntry(opts.cache.beforeRequest) : null,
      afterRequest: opts.cache.afterRequest ? new CacheEntry(opts.cache.afterRequest) : null,
      comment: opts.cache.comment
    }
  });

  Object.defineProperty(this, 'request', {
    enumerable: true,

    get: function() {
      return this._request;
    },

    set: function(value) {
      this._request = (value instanceof Request) ? value : new Request(value);
    }
  });

  Object.defineProperty(this, 'response', {
    enumerable: true,

    get: function() {
      return this._response;
    },

    set: function(value) {
      this._response = (value instanceof Response) ? value : new Response(value);
    }
  });

  this.request = opts.request;
  this.response = opts.response;
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
