'use strict';

import {Comment} from './comment';
import {DateTime} from './date-time';
import {util} from './util';

// jshint unused:false
export function Page(options) {
  var opts = options || {};

  opts.pageTimings = opts.pageTimings || {};

  Comment.call(this, opts.comment);
  DateTime.call(this, 'startedDateTime', opts.startedDateTime);

  Object.defineProperty(this, 'id', {
    enumerable: true,
    writable: true,
    value: opts.id || util.makeid(Math.ceil(10 / 2)).toString('hex').slice(0, 10)
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
      onContentLoad: opts.pageTimings.onContentLoad !== undefined ?
        opts.pageTimings.onContentLoad : -1
    }
  });
}
