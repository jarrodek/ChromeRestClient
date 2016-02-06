'use strict';

  Polymer({
    is: 'iron-page-url',
    properties: {
      /**
       * The pathname component of the URL.
       */
      path: {
        type: String,
        notify: true,
        value: function() {
          return window.location.pathname;
        }
      },
      /**
       * The query string portion of the URL.
       */
      query: {
        type: String,
        notify: true,
        value: function() {
          return window.location.search.slice(1);
        }
      },
      /**
       * The hash component of the URL.
       */
      hash: {
        type: String,
        notify: true,
        value: function() {
          return window.location.hash.slice(1);
        }
      },
      /**
       * If the user was on a URL for less than `dwellTime` milliseconds, it
       * won't be added to the browser's history, but instead will be replaced
       * by the next entry.
       *
       * This is to prevent large numbers of entries from clogging up the user's
       * browser history. Disable by setting to a negative number.
       */
      dwellTime: {
        type: Number,
        value: 2000
      },

      /**
       * A regexp that defines the set of URLs that should be considered part
       * of this web app.
       *
       * Clicking on a link that matches this regex won't result in a full page
       * navigation, but will instead just update the URL state in place.
       *
       * This regexp is given everything after the origin in an absolute
       * URL. So to match just URLs that start with /search/ do:
       *     url-space-regex="^/search/"
       *
       * @type {string|RegExp}
       */
      urlSpaceRegex: {
        type: String,
        value: ''
      },

      /**
       * urlSpaceRegex, but coerced into a regexp.
       *
       * @type {RegExp}
       */
      _urlFilterRegExp: {
        compute: '_makeRegExp(urlFilterExp)'
      },

      _lastChangedAtAt: {
        type: Number,
        value: -Infinity
      },

      _initialized: {
        type: Boolean,
        value: false
      }
    },
    hostAttributes: {
      hidden: true
    },
    observers: [
      '_updateUrl(path, query, hash)'
    ],
    attached: function() {
      this.listen(window, 'hashchange', '_hashChanged');
      this.listen(window, 'location-changed', '_urlChanged');
      this.listen(window, 'popstate', '_urlChanged');
      this.listen(document.body, 'click', '_globalOnClick');

      this._urlChanged();
      this._initialized = true;
    },
    detached: function() {
      this.unlisten(window, 'hashchange', '_hashChanged');
      this.unlisten(window, 'location-changed', '_urlChanged');
      this.unlisten(window, 'popstate', '_urlChanged');
      this.unlisten(document.body, 'click', '_globalOnClick');
      this._initialized = false;
    },
    /**
     * @return {number} the number of milliseconds since some point in the
     *     past. Only useful for comparing against other results from this
     *     function.
     */
    _now: function() {
      if (window.performance && window.performance.now) {
        return window.performance.now();
      }
      return +new Date();
    },
    _hashChanged: function() {
      this.hash = window.location.hash.substring(1);
    },
    _urlChanged: function() {
      // We want to extract all info out of the updated URL before we
      // try to write anything back into it.
      //
      // i.e. without _dontUpdateUrl we'd overwrite the new path with the old
      // one when we set this.hash. Likewise for query.
      this._dontUpdateUrl = true;
      this._hashChanged();
      this.path = window.location.pathname;
      this.query = window.location.search.substring(1);
      this._dontUpdateUrl = false;
      this._updateUrl();
    },
    _getUrl: function() {
      var url = this.path;
      var query = this.query;
      if (query) {
        url += '?' + query;
      }
      if (this.hash) {
        url += '#' + this.hash;
      }
      return url;
    },
    _updateUrl: function() {
      if (this._dontUpdateUrl || !this._initialized) {
        return;
      }
      var newUrl = this._getUrl();
      var currentUrl = (
          window.location.pathname +
          window.location.search +
          window.location.hash
      );
      if (newUrl == currentUrl) {
        // nothing to do, the URL didn't change
        return;
      }

      var shouldReplace =
          this._lastChangedAt + this.dwellTime > this._now();
      this._lastChangedAt = this._now();
      if (shouldReplace) {
        window.history.replaceState({}, '', newUrl);
      } else {
        window.history.pushState({}, '', newUrl);
      }
    },
    /**
     * A necessary evil so that links work as expected. Does its best to
     * bail out early if possible.
     *
     * @param {MouseEvent} event .
     */
    _globalOnClick: function(event) {
      var href = this._getSameOriginLinkHref(event);
      if (!href) {
        return;
      }

      window.history.pushState({}, '', href);
      this.fire('location-changed', {}, {node: window});
      event.preventDefault();
    },
    /**
     * Returns the absolute URL of the link (if any) that this click event
     * is clicking on, if we can and should override the resulting full
     * page navigation. Returns null otherwise.
     *
     * This method is separated away from _globalOnClick for testability,
     * as we can't test that a clicked link should have resulted in navigating
     * away from the test page.
     *
     * @param {MouseEvent} event .
     * @return {string?} .
     */
    _getSameOriginLinkHref: function(event) {
      // We only care about left-clicks.
      if (event.button !== 0) {
        return null;
      }
      // We don't want modified clicks, where the intent is to open the page
      // in a new tab.
      if (event.metaKey || event.ctrlKey) {
        return null;
      }
      var eventPath = Polymer.dom(event).path;
      var href = null;
      for (var i = 0; i < eventPath.length; i++) {
        var element = eventPath[i];
        if (element.tagName === 'A' && element.href) {
          href = element.href;
          break;
        }
      }
      // If there's no link there's nothing to do.
      if (!href) {
        return null;
      }

      // It only makes sense for us to intercept same-origin navigations.
      // pushState/replaceState don't work with cross-origin links.
      var url = new URL(href, document.baseURI);
      if (url.origin !== window.location.origin) {
        return null;
      }
      var normalizedHref = url.pathname + url.search + url.hash;

      // If we've been configured not to handle this url... don't handle it!
      if (this._urlFilterRegExp &&
          !this._urlFilterRegExp.test(normalizedHref)) {
        return null;
      }

      return normalizedHref;
    },
    _makeRegExp: function(urlFilterExp) {
      return RegExp(urlFilterExp);
    }
  });