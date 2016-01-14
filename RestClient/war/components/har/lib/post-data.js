'use strict';

import {Comment} from './comment';
import {Param} from './param';

export function PostData(opts = {}) {
  // internal properties
  Object.defineProperties(this, {
    _params: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: []
    }
  });

  Comment.call(this, opts.comment);

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

    get: function() {
      return this._params;
    },

    set: function(params) {
      this._params = [];
      params.forEach(this.addParam, this);
    }
  });

  if (opts.params) {
    opts.params.forEach(this.addParam, this);
  }
}

PostData.prototype.addParam = function(param) {
  this._params.push(new Param(param));

  return this;
};
