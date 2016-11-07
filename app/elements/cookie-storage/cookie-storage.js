(function() {
'use strict';
/* global Cookies, URI */

Polymer({
  is: 'cookie-storage',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  properies: {
    // A request URL
    url: String,
    /**
     * A `cookie` HTTP string for given URL.
     * It will be only set when calling `getCookies()` method on this element and if there are
     * existing cookies maching `this.url`.
     */
    cookie: {
      type: String,
      notify: true
    },
    /**
     * A response object received from socket-fetch library.
     */
    response: Object,
    // List of Cookies found in the `this.responseHeaders` attribute.
    cookies: {
      type: Array,
      notify: true,
      value: function() {
        return [];
      }
    },
    // List of expired Cookies (as per server response) that should be removed
    expired: {
      type: Array,
      value: function() {
        return [];
      }
    },

    usePouchDb: Boolean
  },

  _getDb: function() {
    // jscs:disable
    return new PouchDB('cookies', {revs_limit: 10});
    // jscs:enable
  },

  /**
   * Extracts cookies from `this.responseHeaders` and if any cookies are there it stores them
   * in the datastore.
   *
   * TODO: support cookie deletion.
   */
  store: function() {
    var response = this.response;
    if (!response || !this.url) {
      return;
    }
    this.uri = new URI(this.url);
    var usePouchDb = document.createElement('iron-meta').byKey('usePouchDb');
    this.extract();
    if (usePouchDb) {
      this._storePouchDb()
      .then(() => this._removeExpiredPouchDb());
    } else {
      this._store();
      this._removeExpired();
    }
  },
  /**
   * Get cookies that should be send with given request for given URL.
   */
  getCookies: function() {
    var usePouchDb = document.createElement('iron-meta').byKey('usePouchDb');
    if (!usePouchDb) {
      return this._getCookiesOld();
    }
    this.uri = new URI(this.url);
    return this._findDomainCookiesPouchDb()
    .then((cookies) => this._clearExpired(cookies))
    .then((cookies) => {
      if (!cookies) {
        cookies = [];
      }
      var strs = [];
      cookies.forEach((c) => strs[strs.length] = c.name + '=' + c.value);
      this.set('cookie', strs.join('; '));
      return cookies;
    });
  },

  _getCookiesOld: function() {
    this.uri = new URI(this.url);
    return this._findDomainCookies()
    .then((cookies) => this._clearExpired(cookies))
    .then((cookies) => {
      if (!cookies) {
        cookies = [];
      }
      var strs = [];
      cookies.forEach((c) => strs[strs.length] = c.toString());
      this.set('cookie', strs.join('; '));
      return cookies;
    });
  },

  /**
   * Store cookies in storage.
   * It assumes that all cookies set in the `this.cookies` attribute are ready to be stored.
   */
  _store: function() {
    var cookies = this.cookies;
    if (!cookies || cookies.length === 0) {
      return Dexie.Promise.resolve();
    }
    var cookiesDomains = [];
    var toStore = {};
    cookies.forEach((c) => {
      if (!c.domain) {
        return;
      }
      cookiesDomains.push(c.domain);
      if (!(c.domain in toStore)) {
        toStore[c.domain] = new Cookies('', 'http://' + c.domain + '/');
      }
      toStore[c.domain].cookies.push(c);
    });
    return arc.app.db.idb.open()
    .then((db) => {
      return db.transaction('rw', db.cookies, function() {
        return db.cookies.where('_domain').anyOfIgnoreCase(cookiesDomains)
        .toArray()
        .then((stored) => {
          let parsers = {};
          stored.forEach((c) => {
            if (!(c.domain in parsers)) {
              // the protocol is not imaportant here
              parsers[c.domain] = new Cookies('', 'http://' + c.domain + '/');
            }
            parsers[c.domain].cookies.push(c);
          });
          let save = [];
          for (let domain in parsers) {
            parsers[domain].merge(toStore[domain], 'uuid');
            save = save.concat(parsers[domain].cookies);
            delete toStore[domain];
          }
          // add new ones
          for (let domain in toStore) {
            save = save.concat(toStore[domain].cookies);
          }
          db.cookies.bulkPut(save)
          .catch(Dexie.BulkError, (e) => {
            var message = 'Some cookies did not succeed. However, ' +
              (save.length - e.failures.length) + ' cookies (out of ' +  save.length +
              ') was added successfully';
            this.fire('app-log', {
              'message': [message, e],
              'level': 'warn'
            });
          });
        });
      })
      .finally(() => {
        db.close();
      });
    });
  },

  _thisMakeCookieId: function(c) {
    return c.domain + '/' + encodeURIComponent(c.name) + '/' + encodeURIComponent(c.path);
  },

  _storePouchDb: function() {
    var cookies = this.cookies;
    if (!cookies || cookies.length === 0) {
      return Promise.resolve();
    }
    var keys = [];
    cookies = cookies.map((i) => {
      i._id = this._thisMakeCookieId(i);
      keys[keys.length] = i._id;
      return i;
    });
    var db = this._getDb();
    return db.allDocs({keys: keys})
    .then((r) => {
      // Update cookies
      let toInsert = [];
      let toUpdate = [];
      let toRestore = [];
      r.rows.forEach((item, index) => {
        if (item.error) {
          // Cookie don't exist in the store.
          toInsert[toInsert.length] = cookies[index];
        } else if (item.value.deleted) {
          let p = db.get(item.id, {rev: item.value.rev})
          .then((r) => {
            r._deleted = false;
            return db.put(r);
          })
          .catch((e) => console.error(e));
          toRestore[toRestore.length] = {
            p: p,
            cookie: cookies[index]
          };
        } else {
          toUpdate[toUpdate.length] = {
            dbItem: item,
            cookie: cookies[index]
          };
        }
      });
      var p;
      if (toRestore.length) {
        p = Promise.all(toRestore.map((i) => i.p))
        .then((resp) => {
          return resp.map((item, index) => {

            return {
              dbItem: item,
              cookie: toRestore[index].cookie
            };
          });
        })
        .then((data) => {
          toUpdate = toUpdate.concat(data);
        });
      } else {
        p = Promise.resolve();
      }
      return p.then(() => Promise.all(toUpdate.map((i) => db.get(i.dbItem.id))))
      .then((saved) => {
        saved = saved.map((item, index) => Object.assign(item, toUpdate[index].cookie));
        return [toInsert, saved];
      });
    })
    .then((data) => {
      data = data[0].concat(data[1]);
      // Cleanup
      data = data.map((i) => {
        if (i instanceof Cookie) {
          i = Object.assign({}, i);
        }
        delete i.uuid; //old db system
        if (i._domain) {
          i.domain = i._domain;
        }
        delete i._domain;
        if (i._expires) {
          i.expires = i._expires;
        }
        delete i._expires;
        if (i._maxAge) {
          i.maxAge = i._maxAge;
        }
        delete i._maxAge;
        return i;
      });
      return db.bulkDocs(data);
    });
  },

  // Removed cookies identified as to be removed per server request.
  _removeExpired: function() {
    var exp = this.expired;
    if (!exp || !exp.length) {
      return;
    }
    var cookiesDomains = [];
    var toRemove = {};
    exp.forEach((c) => {
      if (!c.domain) {
        return;
      }
      cookiesDomains.push(c.domain);
      if (!(c.domain in toRemove)) {
        toRemove[c.domain] = [c];
      } else {
        toRemove[c.domain].push(c);
      }
    });
    return arc.app.db.idb.open()
    .then((db) => {
      return db.transaction('rw', db.cookies, function() {
        return db.cookies.where('_domain').anyOfIgnoreCase(cookiesDomains)
        .toArray()
        .then((stored) => {
          var removeObjects = []; // DB object's keys
          stored.forEach((c) => {
            var cookies = toRemove[c.domain];
            for (let i = 0, len = cookies.length; i < len; i++) {
              if (cookies[i].name === c.name) {
                removeObjects.push(c.uuid);
                break;
              }
            }
          });
          return db.cookies.where(':id').anyOf(removeObjects).delete();
        });
      })
      .finally(() => {
        db.close();
      });
    });
  },

  _removeExpiredPouchDb: function() {
    var exp = this.expired;
    if (!exp || !exp.length) {
      return;
    }
    var keys = exp.map((c) => {
      return c.domain + '/' + encodeURIComponent(c.name) + '/' + encodeURIComponent(c.path);
    });

    var db = this._getDb();
    db.allDocs({keys: keys})
    .then((r) => {
      let cookies = r.rows.filter((i) => {
        if (i.error) {
          return false;
        }
        if (i.value.deleted) {
          return false;
        }
        return true;
      });
      return Promise.all(cookies.map((i) => db.remove(i.id, i.value.rev)));
    })
    .then((r) => {
      console.info('Expired cookies deleted', r);
    })
    .catch((e) => {
      this.fire('app-log', {
        'message': ['Unable delete expired cookies.', e, keys],
        'level': 'warn'
      });
    });
    // key is [DOMAIN]/[NAME]/[PATH]
  },

  /**
   * Extracts cookies from `this.response` and set them to the `cookies` array.
   */
  extract: function() {
    var result = [];
    var response = this.response;
    var expired = [];
    if (!response) {
      this.set('cookies', result);
      return;
    }
    var parsers = [];
    if (response.redirects && response.redirects.length) {
      response.redirects.forEach((r) => {
        if (r.headers.has && r.headers.has('set-cookie')) {
          let parser = new Cookies(r.headers.get('set-cookie'), r.requestUrl);
          parser.filter();
          let exp = parser.clearExpired();
          if (exp && exp.length) {
            expired = expired.concat(exp);
          }
          parsers.push(parser);
        }
      });
    }
    if (response._headers && response._headers.has && response._headers.has('set-cookie')) {
      let parser = new Cookies(response._headers.get('set-cookie'), this.url);
      parser.filter();
      let exp = parser.clearExpired();
      if (exp && exp.length) {
        expired = expired.concat(exp);
      }
      parsers.push(parser);
    }
    if (parsers.length === 0) {
      this.set('cookies', result);
      return;
    }
    var mainParser = null;
    parsers.forEach((parser) => {
      if (!mainParser) {
        mainParser = parser;
        return;
      }
      mainParser.merge(parser);
    });
    result = mainParser.cookies;
    this.set('cookies', result);
    this.set('expired', expired);
  },

  // Finds cookies that matches current domain and path
  _findDomainCookies: function() {
    return arc.app.db.idb.open()
    .then((db) => {
      let path = this._getPath(this.url);
      let domain = this.uri.domain();
      return db.cookies.toCollection()
        .filter((item) => {
          return this._matchDomain(domain, item._domain) && this._matchPath(path, item.path);
        })
        .toArray()
        .finally(() => {
          db.close();
        });
    })
    .then((existing) => {
      if (!existing || existing.length === 0) {
        return [];
      }
      return existing;
    });
  },

  _findDomainCookiesPouchDb: function() {
    let path = this._getPath(this.url);
    let domain = this.uri.domain();

    var db = this._getDb();
    return db.allDocs()
    .then((r) => r.rows.filter((item) => {
      let parts = item.id.split('/');
      return this._matchDomain(domain, parts[0]) &&
        this._matchPath(path, decodeURIComponent(parts[2]));
    }))
    .then((refs) => {
      var p = refs.map((i) => db.get(i.id));
      return Promise.all(p);
    });
  },

  _clearExpired: function(cookies) {
    var now = Date.now();
    cookies = cookies.filter((cookie) => {
      if (!cookie.expires) {
        return true;
      }
      if (now >= cookie.expires) {
        return false;
      }
      return true;
    });
    return cookies;
  },

  /**
   * Checks if `domain` matched domain defined in a cookie.
   * This follows algoritm defined in https://tools.ietf.org/html/rfc6265#section-5.1.3
   *
   * Note that if `cookieDomain` is not set it returns false, while it should be set to `domain`.
   * Because this function only check if domains matches it will not override domain.
   *
   * @param {String} domain A host domain
   * @param {String} cookieDomain A domain received in the cookie.
   * @return {Boolean} True if domains matches.
   */
  _matchDomain: function(domain, cookieDomain) {
    domain = domain && domain.toLowerCase && domain.toLowerCase();
    cookieDomain = cookieDomain && cookieDomain.toLowerCase && cookieDomain.toLowerCase();
    if (!cookieDomain) {
      return false;
    }
    if (domain === cookieDomain) {
      return true;
    }
    let index = cookieDomain.indexOf(domain);
    if (index === -1) {
      return false;
    }
    if (cookieDomain.substr(index - 1, index) !== '.') {
      return false;
    }
    return true;
  },
  /**
   * Gets the path for a domain as defined in
   * https://tools.ietf.org/html/rfc6265#section-5.1.4
   *
   * @param {String} url A url to extract path from.
   */
  _getPath: function(url) {
    if (!url) {
      return '/';
    }
    var index = url.indexOf('/', 8); //after `http(s)://` string
    if (index === -1) {
      return '/';
    }
    url = url.substr(index);
    if (!url || url[0] !== '/') {
      return [];
    }
    // removed query string
    index = url.indexOf('?');
    if (index !== -1) {
      url = url.substr(0, index);
    }
    // removes hash string
    index = url.indexOf('#');
    if (index !== -1) {
      url = url.substr(0, index);
    }
    index = url.indexOf('/', 1);
    if (index === -1) {
      return '/';
    }
    index = url.lastIndexOf('/');
    if (index !== 0) {
      url = url.substr(0, index);
    }
    return url;
  },
  /**
   * Checks if paths mach as defined in
   * https://tools.ietf.org/html/rfc6265#section-5.1.4
   *
   * @param {String} hostPath A host paths
   * @param {String} cookiePath Path from the cookie.
   * @return {Boolean} True when paths matches.
   */
  _matchPath: function(hostPath, cookiePath) {
    if (!cookiePath || !hostPath) {
      return true;
    }
    if (hostPath === cookiePath) {
      return true;
    }
    // var index = cookiePath.indexOf(hostPath);
    var index = hostPath.indexOf(cookiePath);
    if (index === 0 && cookiePath[cookiePath.length - 1] === '/') {
      return true;
    } else if (index === 0 && cookiePath.indexOf('/', 1) === -1) {
      return true;
    }

    if (index === 0) {
      for (var i = 0, len = hostPath.length; i < len; i++) {
        if (cookiePath.indexOf(hostPath[i]) === -1 && hostPath[i] === '/') {
          return true;
        }
      }
    }
    return false;
  }
});
})();
