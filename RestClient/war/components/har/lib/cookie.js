'use strict';

import {Comment} from './comment';
import {DateTime} from './date-time';

// jshint unused:false
export function Cookie(opts = {}) {
  if (!opts.name || !opts.value) {
    throw new Error('missing required fields');
  }

  Comment.call(this, opts.comment);
  DateTime.call(this, 'expires', opts.expires, true);

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
