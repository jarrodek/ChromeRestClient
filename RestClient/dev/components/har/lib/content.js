'use strict';

import {Comment} from './comment';
import {util} from './util';

// jshint unused:false
export function Content(opts = {}) {
  Comment.call(this, opts.comment);

  Object.defineProperty(this, 'size', {
    enumerable: true,

    get: function() {
      if (this.text) {
        return util.str2ab(this.text).byteLength;
      }

      return 0;
    },

    set: function() {
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
