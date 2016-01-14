'use strict';

import {Comment} from './comment';

// jshint unused:false
export function Param(opts = {}) {
  Comment.call(this, opts.comment);

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
