'use strict';

import {Comment} from './comment';
import {Version} from './version';

// jshint unused:false
export function Creator(opts = {}) {
  if (!opts.name) {
    throw new Error('name required');
  }

  Comment.call(this, opts.comment);
  Version.call(this, opts.version);

  Object.defineProperty(this, 'name', {
    enumerable: true,
    writable: true,
    value: opts.name
  });
}
