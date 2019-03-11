/* global ArcBehaviors */
class CookieJar extends ArcBehaviors.HeadersParserBehavior(Polymer.Element) {
  /* global PouchDB, Cookie, Cookies */
  /**
   * Returns handler to the Pouch DB.
   *
   * @return {PouchDB} Instance of PouchDB.
   */
  get _db() {
    return new PouchDB('cookies', {
      revs_limit: 10
    });
  }

  constructor() {
    super();
    this._beforeRequestHandler = this._beforeRequestHandler.bind(this);
    this._afterRequestHandler = this._afterRequestHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('before-request', this._beforeRequestHandler);
    window.addEventListener('response-ready', this._afterRequestHandler);
    this.clearNonPersistantCookies();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('before-request', this._beforeRequestHandler);
    window.removeEventListener('response-ready', this._afterRequestHandler);
  }

  /**
   * Dispatches `session-cookie-cleanup` event handled by `CookieStore`
   * class.
   *
   * @return {Promise}
   */
  clearNonPersistantCookies() {
    const e = new CustomEvent('session-cookie-cleanup', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(e);
    return e.detail.result;
  }
  /**
   * Handler for the ARC's event `before-request`.
   * The event is handled asynchronously.
   * @param {CustomEvent} e
   */
  _beforeRequestHandler(e) {
    const promise = this._processBeforeRequest(e.detail);
    e.detail.promises.push(promise);
  }
  /**
   * Processes request before it's send to the transport library.
   * It sets cookie header string for current URL.
   * @param {Object} request ARC request object
   * @return {Promise}
   */
  _processBeforeRequest(request) {
    return this.getCookiesHeaderValue(request.url)
    .then((cookie) => {
      this._applyCookieHeader(cookie, request);
      return request;
    })
    .catch(() => request);
  }
  /**
   * Applies cookie header value to current request headers.
   * If header to be applied is computed then it will alter headers string.
   *
   * Note, this element do not sends `request-headers-changed` event.
   *
   * @param {String} header Computed headers string
   * @param {Object} request The request object from the event.
   */
  _applyCookieHeader(header, request) {
    header = header.trim();
    if (!header) {
      return;
    }
    console.info('Cookies to send with the request:', header);
    const headers = this.headersToJSON(request.headers);
    let found = false;
    for (let i = 0, len = headers.length; i < len; i++) {
      if (headers[i].name.toLowerCase() === 'cookie') {
        found = true;
        // TODO: should it check for duplicates?
        headers[i].value = headers[i].value + '; ' + header;
        break;
      }
    }
    if (!found) {
      headers.push({
        name: 'cookie',
        value: header
      });
    }
    request.headers = this.headersToString(headers);
  }
  /**
   * Get cookies header value for given URL.
   *
   * @param {String} url An URL for cookies.
   * @return {Promise<String>} Promise that resolves to header value string.
   */
  getCookiesHeaderValue(url) {
    return this.getCookies(url)
    .then(function(cookies) {
      if (!cookies) {
        cookies = [];
      }
      const strs = cookies.map(function(c) {
        return c.name + '=' + c.value;
      }).join('; ');
      return strs;
    });
  }
  /**
   * Gets a list of cookies for given URL (matching domain and path as defined
   * in Cookie spec) from  the datastore.
   *
   * @param {String} url An URL to match cookies.
   * @return {Promise<Array>} List of database objects that matches cookies.
   */
  getCookies(url) {
    // Implemented in cookie-store
    const e = new CustomEvent('session-cookie-list-domain', {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        url
      }
    });
    this.dispatchEvent(e);
    return e.detail.result;
  }
  /**
   * Handler to the `response-ready` event.
   * Stores cookies in the datastore.
   * @param {CustomEvent} e
   */
  _afterRequestHandler(e) {
    const {request, response, redirects, isError} = e.detail;
    if (isError) {
      return;
    }
    // Async so the response can be rendered to the user.
    setTimeout(() => this._processResponse(request, response, redirects));
  }
  /**
   * Extracts cookies from `this.responseHeaders` and if any cookies are there it stores them
   * in the datastore.
   *
   * TODO: support cookie deletion.
   *
   * @param {Object} request
   * @param {Object} response
   * @param {Array<Object>} redirects
   * @return {Promise}
   */
  _processResponse(request, response, redirects) {
    if (!response || !request || !request.url) {
      return;
    }
    const result = this.extract(response, request.url, redirects);
    return this._store(result.cookies)
    .then(() => this._removeExpired(result.expired));
  }
  /**
   * Extracts cookies from the `response` object and returns an object with
   * `cookies` and `expired` properties containing array of cookies, each.
   *
   * @param {Response} response The response object. This chould be altered
   * request object
   * @param {String} url The request URL.
   * @param {?Array<Object>} redirects List of redirect responses (Response
   * type). Each object is expected to have `headers` and `requestUrl`
   * properties.
   * @return {Object<String, Array>} An object with `cookies` and `expired`
   * arrays of cookies.
   */
  extract(response, url, redirects) {
    const expired = [];
    const parsers = [];
    if (redirects && redirects.length) {
      for (let i = 0; i < redirects.length; i++) {
        this._getResponseParsers(redirects[i], url, parsers, expired);
      }
    }
    this._getResponseParsers(response, url, parsers, expired);
    let mainParser;
    parsers.forEach(function(parser) {
      if (!mainParser) {
        mainParser = parser;
        return;
      }
      mainParser.merge(parser);
    });
    return {
      cookies: mainParser ? mainParser.cookies : [],
      expired: expired
    };
  }

  _getResponseParsers(response, url, parsers, expired) {
    if (typeof response.headers !== 'string') {
      return parsers;
    }
    const headers = this.headersToJSON(response.headers);
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (!header || !header.name) {
        continue;
      }
      if (header.name.toLowerCase() !== 'set-cookie') {
        continue;
      }

      const parser = new Cookies(header.value, url);
      parser.filter();
      const exp = parser.clearExpired();
      if (exp && exp.length) {
        // This loop is to avoid return statement
        for (let j = 0; j < exp.length; j++) {
          expired.push(exp[j]);
        }
      }
      parsers.push(parser);
    }
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
  /**
   * Stores received cookies in the datastore.
   *
   * @param {Array} cookies List of cookies to store
   * @return {Promise} Resolved promise when all cookies are stored.
   */
  _store(cookies) {
    if (!cookies || cookies.length === 0) {
      return Promise.resolve();
    }
    const db = this._db;
    const keys = [];
    cookies = cookies.map((i) => {
      i._id = this._makeCookieId(i);
      keys[keys.length] = i._id;
      return i;
    });
    return db.allDocs({
      keys: keys
    })
    .then((r) => {
      return this._processExistingCookies(r, cookies, db)
      .then((data) => {
        return this._restoreObjectsAndUpdateValue(db, data.update)
        .then((saved) => data.insert.concat(saved));
      });
    })
    .then((data) => this._storeUpdatedValues(db, data));
  }
  /**
   * Processes incomming cookies to match them with restored cookie data from
   * the datastore.
   * Returning object contains keys for `insert` (new cookies) and `update`
   * (update value).
   *
   * If item was deleted it will be restored to it's previous state.
   *
   * @param {Object} dbResponse PouchDB response object for `allDocs`
   * @param {Array<Object>} cookies Incomming cookies
   * @param {PouchDB} db A pouchDB instance.
   * @return {Promise<Objec>} An object containing sorted lists of `insert` and
   * `update`.
   */
  _processExistingCookies(dbResponse, cookies, db) {
    const toInsert = [];
    let toUpdate = [];
    const toRestore = [];
    dbResponse.rows.forEach(function(item, index) {
      if (item.error) {
        // Cookie don't exist in the store.
        toInsert.push(cookies[index]);
      } else if (item.value.deleted) {
        toRestore[toRestore.length] = {
          promise: this._restoreDatabaseCookie(db, item),
          cookie: cookies[index]
        };
      } else {
        toUpdate[toUpdate.length] = {
          dbItem: item,
          cookie: cookies[index]
        };
      }
    }, this);
    let promise;
    if (toRestore.length) {
      promise = this._waitForRestore(toRestore);
    } else {
      promise = Promise.resolve();
    }
    return promise.then(function(updated) {
      if (updated && updated.length) {
        toUpdate = toUpdate.concat(updated);
      }
      return {
        insert: toInsert,
        update: toUpdate,
      };
    });
  }
  // Updates `item`'s deleted property in the `db`.
  _restoreDatabaseCookie(db, item) {
    return db.get(item.id, {
      rev: item.value.rev
    })
    .then(function(r) {
      r._deleted = false;
      return db.put(r);
    })
    .catch(function(e) {
      console.warn(e);
    });
  }
  /**
   * A function that waits until all restored items are ready.
   *
   * @param {Array} toRestore List of restoring items (in background)
   * @return {Promise<Array>} A list of the same objects as `toUpdate` in the
   * `_processExistingCookies` function.
   */
  _waitForRestore(toRestore) {
    return Promise.all(toRestore.map((i) => i.promise))
    .then(function(resp) {
      return resp.map(function(item, index) {
        return {
          dbItem: item,
          cookie: toRestore[index].cookie
        };
      });
    });
  }

  _restoreObjectsAndUpdateValue(db, toUpdate) {
    if (!toUpdate || !toUpdate.length) {
      return Promise.resolve([]);
    }
    const promises = toUpdate.map(function(i) {
      return db.get(i.dbItem.id);
    });
    return Promise.all(promises)
    .then(function(saved) {
      return saved.map(function(item, index) {
        return Object.assign(item, toUpdate[index].cookie);
      });
    });
  }

  _storeUpdatedValues(db, cookies) {
    if (!cookies || !cookies.length) {
      return Promise.resolve();
    }
    // Cleanup
    cookies = cookies.map(function(i) {
      if (i instanceof Cookie) {
        i = Object.assign({}, i);
      }
      if (i._domain) {
        i.domain = i._domain;
        delete i._domain;
      }
      if (i._expires) {
        i.expires = i._expires;
        delete i._expires;
      }
      if (i._maxAge) {
        i.maxAge = i._maxAge;
        delete i._maxAge;
      }
      return i;
    });
    return db.bulkDocs(cookies)
    .then((result) => {
      for (let i = 0, len = cookies.length; i < len; i++) {
        cookies[i]._rev = result[i].rev;
        const e = new CustomEvent('session-cookie-changed', {
          bubbles: true,
          composed: true,
          detail: cookies[i]
        });
        this.dispatchEvent(e);
      }
    });
  }

  _removeExpired(expired) {
    if (!expired || !expired.length) {
      return Promise.resolve();
    }
    const db = this._db;
    const keys = expired.map((i) => this._makeCookieId(i));
    return db.allDocs({keys: keys})
    .then(function(response) {
      return response.rows.filter(function(i) {
        if (i.error) {
          return false;
        }
        if (i.value.deleted) {
          return false;
        }
        return true;
      });
    })
    .then(function(cookies) {
      const promises = cookies.map((i) => db.remove(i.id, i.value.rev));
      return Promise.all(promises);
    })
    .catch((e) => {
      console.warn(e);
    });
  }
}
window.customElements.define('cookie-jar', CookieJar);
