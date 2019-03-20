export class CookieStore {
  get db() {
    /* global PouchDB */
    return new PouchDB('cookies', {
      revs_limit: 10
    });
  }

  constructor() {
    this._listAllHandler = this._listAllHandler.bind(this);
    this._updateHandler = this._updateHandler.bind(this);
    this._listDomainHandler = this._listDomainHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._cleanupHandler = this._cleanupHandler.bind(this);
  }

  observe() {
    window.addEventListener('session-cookie-list-all', this._listAllHandler);
    window.addEventListener('session-cookie-update', this._updateHandler);
    window.addEventListener('session-cookie-list-domain', this._listDomainHandler);
    window.addEventListener('session-cookie-remove', this._deleteHandler);
    // Clears non-persistant cookies
    window.addEventListener('session-cookie-cleanup', this._cleanupHandler);
  }

  _listAllHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.listAll();
  }

  _updateHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.storeCookie(e.detail.cookie);
  }

  _deleteHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.deleteCookies(e.detail.cookies);
  }

  _cleanupHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.clearNonPersistantCookies();
  }

  listAll() {
    const db = this.db;
    return db.allDocs({
      include_docs: true
    })
    .then((response) => {
      const now = Date.now();
      const result = [];
      for (let i = 0, len = response.rows.length; i < len; i++) {
        const cookie = response.rows[i].doc;
        if (!cookie.expires || now < cookie.expires) {
          result[result.length] = cookie;
        }
      }
      return result;
    });
  }

  storeCookie(cookie) {
    const id = this._makeCookieId(cookie);
    const db = this.db;
    return db.get(id)
    .catch(() => {
      return {};
    })
    .then((restored) => {
      cookie = Object.assign(restored, cookie);
      cookie._id = id;
      if (cookie._deleted) {
        delete cookie._deleted;
      }
      return db.put(cookie);
    })
    .then((result) => {
      cookie._rev = result.rev;
      const e = new CustomEvent('session-cookie-changed', {
        bubbles: true,
        detail: cookie
      });
      document.body.dispatchEvent(e);
    });
  }

  /**
   * Creates a Database ID for a cookie.
   *
   * @param {Object} c Cookie description.
   * @return {String} Generated database entry ID.
   */
  _makeCookieId(c) {
    return c.domain + '/' + encodeURIComponent(c.name) + '/' + encodeURIComponent(c.path);
  }

  _listDomainHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.getDomainCookies(e.detail.url);
  }
  /**
   * Finds in the datastore matched cookies for the path and the domain
   * as defined in the spec.
   *
   * @param {String} url Request URL
   * @return {Promise<Array>} A promise resolved to a list of cookies
   * that maches filter.
   */
  getDomainCookies(url) {
    let uri;
    try {
      uri = new URL(url);
    } catch (_) {
      return Promise.resolve([]);
    }
    const path = this._getPath(url);
    const domain = uri.hostname;
    const db = this.db;
    return db.allDocs()
    .then((r) => {
      return r.rows.filter((item) => {
        const parts = item.id.split('/');
        return this._matchDomain(domain, parts[0]) &&
          this._matchPath(path, decodeURIComponent(parts[2]));
      });
    })
    .then((refs) => {
      const promises = refs.map((i) => db.get(i.id));
      return Promise.all(promises);
    })
    .then((cookies) => this._clearExpired(cookies));
  }
  /**
   * Gets the path for a domain as defined in
   * https://tools.ietf.org/html/rfc6265#section-5.1.4
   *
   * @param {String} url A url to extract path from.
   * @return {String}
   */
  _getPath(url) {
    if (!url) {
      return '/';
    }
    let index = url.indexOf('/', 8); // after `http(s)://` string
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
  }
  /**
   * Checks if paths mach as defined in
   * https://tools.ietf.org/html/rfc6265#section-5.1.4
   *
   * @param {String} hostPath A host paths
   * @param {String} cookiePath Path from the cookie.
   * @return {Boolean} True when paths matches.
   */
  _matchPath(hostPath, cookiePath) {
    if (!cookiePath || !hostPath) {
      return true;
    }
    if (hostPath === cookiePath) {
      return true;
    }
    // var index = cookiePath.indexOf(hostPath);
    const index = hostPath.indexOf(cookiePath);
    if (index === 0 && cookiePath[cookiePath.length - 1] === '/') {
      return true;
    } else if (index === 0 && cookiePath.indexOf('/', 1) === -1) {
      return true;
    }
    if (index === 0) {
      for (let i = 0, len = hostPath.length; i < len; i++) {
        if (cookiePath.indexOf(hostPath[i]) === -1 && hostPath[i] === '/') {
          return true;
        }
      }
    }
    return false;
  }
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
  _matchDomain(domain, cookieDomain) {
    domain = domain && domain.toLowerCase && domain.toLowerCase();
    cookieDomain = cookieDomain && cookieDomain.toLowerCase && cookieDomain.toLowerCase();
    if (!cookieDomain) {
      return false;
    }
    if (domain === cookieDomain) {
      return true;
    }
    if (cookieDomain[0] === '.') {
      const parts = domain.split('.');
      if (parts.length > 1) {
        parts.shift();
        domain = parts.join('.');
      }
    }
    const index = cookieDomain.indexOf(domain);
    if (index === -1) {
      return false;
    }
    if (cookieDomain.substr(index - 1, 1) !== '.') {
      return false;
    }
    return true;
  }
  /**
   * Clears cookies that are expired from the list of cookies.
   *
   * @param {Array<Object>} cookies List of cookies. It can be database object
   * or a `Cookie` instance.
   * @return {Array<Object>} Filtered list of cookies without expired items.
   */
  _clearExpired(cookies) {
    const now = Date.now();
    return cookies.filter((cookie) => {
      if (!cookie.expires) {
        return true;
      }
      if (now >= cookie.expires) {
        return false;
      }
      return true;
    });
  }

  deleteCookies(cookies) {
    for (let i = 0, len = cookies.length; i < len; i++) {
      cookies[i]._deleted = true;
    }
    return this.db.bulkDocs(cookies)
    .then(() => {
      for (let i = 0, len = cookies.length; i < len; i++) {
        const e = new CustomEvent('session-cookie-removed', {
          bubbles: true,
          detail: cookies[i]
        });
        document.body.dispatchEvent(e);
      }
    });
  }

  /**
   * According to the spec, cookies that are not persistent have to be removed
   * when the session over. Session time is defined by user agent.
   *
   * This element clears non-persistent cookis before new session begins,
   * meaning, when the element is attached to the DOM and DOM is ready.
   *
   * This will also remove expired cookies.
   *
   * @return {Promise}
   */
  clearNonPersistantCookies() {
    const db = this.db;
    return db.allDocs({
      include_docs: true
    })
    .then(function(response) {
      const now = Date.now();
      return response.rows.filter(function(cookie) {
        if (!cookie.persistent) {
          return true;
        }
        if (!cookie.expires) {
          return false;
        }
        if (now >= cookie.expires) {
          return true;
        }
        return false;
      });
    })
    .then((docs) => {
      if (!docs.length) {
        return Promise.resolve();
      }
      return this.deleteCookies(docs);
    });
  }
}
