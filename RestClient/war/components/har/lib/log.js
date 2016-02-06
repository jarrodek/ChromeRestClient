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
<<<<<<< HEAD
    value: new Creator(opts.creator)
=======
    value: (opts.creator instanceof Creator) ? opts.creator : new Creator(opts.creator)
>>>>>>> hotfix-db
  });

  Object.defineProperty(this, 'browser', {
    enumerable: true,
<<<<<<< HEAD
    value: opts.browser ? new Creator(opts.browser) : undefined
=======
    value: opts.browser ? (opts.browser instanceof Creator) ? opts.browser :
      new Creator(opts.browser) : undefined
>>>>>>> hotfix-db
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
<<<<<<< HEAD
=======
  } else if (opts._pages) {
    opts._pages.forEach(this.addPage, this);
>>>>>>> hotfix-db
  }

  if (opts.entries) {
    opts.entries.forEach(this.addEntry, this);
<<<<<<< HEAD
=======
  } else if (opts._entries) {
    opts._entries.forEach(this.addEntry, this);
>>>>>>> hotfix-db
  }
}

Log.prototype.addPage = function(page) {
<<<<<<< HEAD
  this._pages.push(new Page(page));

=======
  page = (page instanceof Page) ? page : new Page(page);
  this._pages.push(page);
>>>>>>> hotfix-db
  return this;
};

Log.prototype.addEntry = function(entry, pageref) {
  entry.pageref = pageref || entry.pageref;
<<<<<<< HEAD

  this._entries.push(new Entry(entry));

  return this;
};
=======
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
>>>>>>> hotfix-db
