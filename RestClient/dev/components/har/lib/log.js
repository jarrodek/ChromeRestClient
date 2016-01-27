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
    value: (opts.creator instanceof Creator) ? opts.creator : new Creator(opts.creator)
  });

  Object.defineProperty(this, 'browser', {
    enumerable: true,
    value: opts.browser ? (opts.browser instanceof Creator) ? opts.browser :
      new Creator(opts.browser) : undefined
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
  } else if (opts._pages) {
    opts._pages.forEach(this.addPage, this);
  }

  if (opts.entries) {
    opts.entries.forEach(this.addEntry, this);
  } else if (opts._entries) {
    opts._entries.forEach(this.addEntry, this);
  }
}

Log.prototype.addPage = function(page) {
  page = (page instanceof Page) ? page : new Page(page);
  this._pages.push(page);
  return this;
};

Log.prototype.addEntry = function(entry, pageref) {
  entry.pageref = pageref || entry.pageref;
  entry = (entry instanceof Entry) ? entry : new Entry(entry);
  this._entries.push(entry);
  return this;
};
/**
 * Override toJSON behaviour so it will eliminate
 * all _* properies and replace it with a proper ones.
 */
Log.prototype.toJSON = function() {
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
