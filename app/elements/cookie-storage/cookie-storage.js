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
    }
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

    this.extract();
    this._store();
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
            console.error('Come cookies did not succeed. However, ' +
              (save.length - e.failures.length) + ' cookies (out of ' +  save.length +
              ') was added successfully');
          });
        });
      })
      .finally(() => {
        db.close();
      });
    });
  },

  /**
   * Extracts cookies from `this.response` and set them to the `cookies` array.
   */
  extract: function() {
    var result = [];
    var response = this.response;
    if (!response) {
      this.set('cookies', result);
      return;
    }
    var parsers = [];
    if (this.response.redirects && this.response.redirects.length) {
      this.response.redirects.forEach((r) => {
        if (r.headers.has && r.headers.has('set-cookie')) {
          let parser = new Cookies(r.headers.get('set-cookie'), r.requestUrl);
          parser.filter();
          parser.clearExpired();
          parsers.push(parser);
        }
      });
    }
    if (response.headers.has && response.headers.has('set-cookie')) {
      let parser = new Cookies(response.headers.get('set-cookie'), this.url);
      parser.filter();
      parser.clearExpired();
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
