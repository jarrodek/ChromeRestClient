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
     * A list of response headers to extract cookies from.
     */
    responseHeaders: Array,
    // List of Cookies found in the `this.responseHeaders` attribute.
    cookies: {
      type: Array,
      notify: true,
      value: function() {
        return [];
      }
    }
  },

  /**
   * Extracts cookies from `this.responseHeaders` and if any cookies are there it stores them
   * in the datastore.
   */
  store: function() {
    var headers = this.responseHeaders;
    if (!headers || headers.length === 0 || !this.url) {
      return;
    }
    this.uri = new URI(this.url);
    this.extract();
    return this._find()
    .then((existing) => this._store(existing));
  },
  /**
   * Get cookies that should be send with given request for given URL.
   */
  getCookies: function() {
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
   * Store cookies in storage
   *
   * @param {Array} existing A list of existing cookies from the store.
   */
  _store: function(existing) {
    var cookies = this.cookies;
    if (!cookies || cookies.length === 0) {
      return Dexie.Promise.resolve();
    }
    var existingSize = existing.length || 0;
    cookies.forEach((item) => {
      if (!item.name) {
        return;
      }
      let found = null;
      let itemName = item.name.toLowerCase();
      for (let i = 0; i < existingSize; i++) {
        if (existing[i].name.toLowerCase() === itemName) {
          found = existing[i];
          break;
        }
      }
      if (found) {
        item.created = found.created;
      }
    });

    return arc.app.db.idb.open()
    .then((db) => {
      return db.transaction('rw', db.cookies, () => {
        var promises = [];
        cookies.forEach((item) => promises.push(db.cookies.put(item)));
        existing.forEach((item) => promises.push(db.cookies.delete(item.uuid)));
        return Dexie.Promise.all(promises)
        .catch((e) => {
          console.error('--no-save', e);
        });
      })
      .finally(() => {
        db.close();
      });
    });
  },

  /**
   * Extracts cookies from `this.responseHeaders` and set in to the `cookies` array
   */
  extract: function() {
    var result = [];
    var headers = this.responseHeaders;
    if (!headers || headers.length === 0) {
      this.set('cookies', result);
      return;
    }
    var setCookie = null;
    for (let i = 0, len = headers.length; i < len; i++) {
      let header = headers[i];
      if (header.name && header.name.toLowerCase() === 'set-cookie') {
        setCookie = header.value;
        break;
      }
    }
    if (!setCookie) {
      this.set('cookies', result);
      return;
    }
    var c = new Cookies(setCookie).cookies;
    if (c) {
      result = c;
    }
    result = this._filter(result);
    result = result.map((item) => new CookieObject(item));
    this.set('cookies', result);
  },
  // Remove cookies that has been set for different domain.
  _filter: function(cookies) {
    var domain = this.uri.domain();
    // var secured = this.uri.protocol() === 'https';
    if (!domain) {
      return;
    } else {
      domain = domain.toLowerCase();
    }
    var path = this._getPath(this.url);
    var validCookies = cookies.filter((cookie) => {
      if (!cookie.path) {
        cookie.path = path;
      }
      let cDomain = cookie.domain;
      if (!cDomain) {
        cookie.domain = domain;
        // point 6. of https://tools.ietf.org/html/rfc6265#section-5.3
        cookie.hostOnly = true;
        return true;
      }
      return this._matchDomain(domain, cDomain);
    });
    return validCookies;
    // this.set('cookies', validCookies);
  },
  // find cookies in the datastore that matches received cookies.
  _find: function() {
    var cookies = this.cookies;
    if (!cookies || cookies.length === 0) {
      return Dexie.Promise.resolve([]);
    }
    return this._findDomainCookies()
    .then((existing) => {
      if (!existing || existing.length === 0) {
        return [];
      }
      var names = [];
      cookies.forEach((item) => {
        if (!item.name) {
          return;
        }
        names.push(item.name);
      });
      existing = existing.filter((item) => names.indexOf(item.name) !== -1);
      return existing;
    });
  },
  // Finds cookies that matches current domain and path
  _findDomainCookies: function() {
    return arc.app.db.idb.open()
    .then((db) => {
      let path = this._getPath(this.url);
      let domain = this.uri.domain();
      return db.cookies.toCollection()
        .filter((item) => {
          return this._matchDomain(domain, item.domain) && this._matchPath(path, item.path);
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
    var index = cookiePath.indexOf(hostPath);
    if (index === 0 && cookiePath[cookiePath.length - 1] === '/') {
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
