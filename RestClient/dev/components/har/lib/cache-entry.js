'use strict';

import {Comment} from './comment';
import {DateTime} from './date-time';

export function CacheEntry(opts = {}) {
  Comment.call(this, opts.comment);
  DateTime.call(this, 'expires', opts.expires, true);
  DateTime.call(this, 'lastAccess', opts.expires, true);

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
