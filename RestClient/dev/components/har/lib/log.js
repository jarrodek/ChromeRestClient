'use strict';

import {Comment} from './comment';
import {Creator} from './creator';
import {Entry} from './entry';
import {Page} from './page';
import {Version} from './version';

export function Log(opts={}) {
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

  Comment.call(this, opts.comment);
  Version.call(this, opts.version);

  Object.defineProperty(this, 'creator', {
    enumerable: true,
    value: new Creator(opts.creator)
  });

  Object.defineProperty(this, 'browser', {
    enumerable: true,
    value: opts.browser ? new Creator(opts.browser) : undefined
  });

  Object.defineProperty(this, 'pages', {
    enumerable: true,

    get: function() {
      return this._pages;
    },

    set: function(pages) {
      this._pages = [];
      pages.forEach(this.addPage, this);
    }
  });

  Object.defineProperty(this, 'entries', {
    enumerable: true,

    get: function() {
      return this._entries;
    },

    set: function(entries) {
      this._entries = [];
      entries.forEach(this.addEntry, this);
    }
  });

  if (opts.pages) {
    opts.pages.forEach(this.addPage, this);
  }

  if (opts.entries) {
    opts.entries.forEach(this.addEntry, this);
  }
}

Log.prototype.addPage = function(page) {
  this._pages.push(new Page(page));

  return this;
};

Log.prototype.addEntry = function(entry, pageref) {
  entry.pageref = pageref || entry.pageref;

  this._entries.push(new Entry(entry));

  return this;
};
