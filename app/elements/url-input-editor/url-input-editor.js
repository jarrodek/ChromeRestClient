(function() {
'use strict';
Polymer({
  is: 'url-input-editor',
  /**
   * Event called when the user press enter in any field in the editor.
   * The event will not be called if the suggestion box is opened.
   *
   * @event send
   */
  properties: {
    /**
     * The URL value to be displayed in the editor.
     */
    url: {
      type: String,
      notify: true
    },
    // True when detailed view is enabled.
    detailed: {
      type: Boolean,
      value: false
    },
    // value for host. Eg: https://google.com
    hostValue: {
      type: String,
      value: ''
    },
    // URL's path value
    pathValue: {
      type: String,
      value: ''
    },
    // URL's history hash.
    anchorValue: {
      type: String,
      value: ''
    },
    /**
     * A list of parameters used in detailed view form of parameters.
     */
    paramsList: {
      type: Array,
      value: []
    },
    /**
     * An input filed for the URL value.
     * It is used by `paper-autocomplete` element as an input target.
     */
    masterUrlElement: {
      readOnly: true,
      type: HTMLElement,
      value: function() {
        return this.$.masterUrl;
      }
    },
    // True when a suggestion box for the URL is opened.
    suggesionsOpened: {
      type: Boolean,
      notify: true
    },
    usePouchDb: {
      type: Boolean
    },
    // If true than the URL contains a variables. Some error checks will be disabled.
    hasVariables: Boolean
  },
  observers: [
    '_urlChanged(url)',
    '_detailedChanged(detailed)'
  ],
  listeners: {
    'blur': '_elementBlur',
    'keydown': '_keyDownHandler'
  },

  attached: function() {
    this.listen(document, 'use-pouch-db', '_setUsePouchDb');
  },

  detached: function() {
    this.unlisten(document, 'use-pouch-db', '_setUsePouchDb');
  },

  _setUsePouchDb: function() {
    this.set('usePouchDb', true);
  },
  /**
   * Called when the URL value change.
   *
   * @param {String} newVal New value of the URL.
   */
  _urlChanged: function(url) {
    if (/\$\{(.)+\}/.test(url)) {
      this.hasVariables = true;
    } else {
      this.hasVariables = false;
    }
    if (this.detailed && !this.internalUrlSet) {
      this.updateForm();
    }
    this.revalidate();
  },

  _urlChangedNotify: function() {
    this.fire('url-input-changed', {
      url: this.url
    });
  },
  /**
   * Toggle the view.
   * TODO: This should change only the `detailed` property value and change observer should
   * make a change.
   */
  toggle: function() {
    this.detailed = !this.detailed;
  },

  _detailedChanged: function(detailed) {
    var stateName;
    if (detailed) {
      this.async(() => {
        this.updateForm();
      }, 0);
      stateName = 'Details form';
    } else {
      this.async(() => {
        this.updateUrl();
      }, 0);
      stateName = 'Single line';
    }
    this.fire('send-analytics', {
      type: 'event',
      category: 'Request view',
      action: 'URL widget toggle',
      label: stateName
    });
  },
  /**
   * Update the URL from detailed form values.
   */
  updateUrl: function() {
    var url = this.hostValue;

    // Check if host is a variable.
    if (url.indexOf('${') === -1) {
      if (url.indexOf('://') === -1) {
        // no schema, adding "http" by default
        url = 'http://' + url;
      }
    } else {
      url += '/';
    }
    if (url.substr(-1) !== '/') {
      url += '/';
    }
    var path = this.pathValue;
    if (path) {
      if (path[0] === '/') {
        path = path.substr(1);
      }
      url += path;
    }
    var params = '';
    if (this.paramsList && this.paramsList.length > 0) {
      this.paramsList.forEach((item, index) => {
        if (!item.name) {
          return;
        }
        if (index > 0) {
          params += '&';
        }
        params += item.name;
        if (item.value) {
          params += '=' + item.value;
        }
      });
    }
    if (params) {
      url += '?' + params;
    }

    if (this.anchorValue) {
      url += '#' + this.anchorValue;
    }
    this._setUrl(url);
  },

  _setUrl: function(url) {
    this.internalUrlSet = true;
    this.set('url', url);
    this.internalUrlSet = false;
  },

  /**
   * Crerate / update form data from the URL.
   */
  updateForm: function() {
    var url = this.url;
    if (!this.hasVariables && url.indexOf('http') !== 0) {
      url = 'http://' + url;
    }
    var parser;
    try {
      parser = new URL(url);
    } catch (e) {
      if (this.hasVariables) {
        if (url.indexOf('${') === 0) {
          // host is a variable.
          var varPos = url.indexOf('}');
          this.set('hostValue', url.substr(0, varPos + 1));
          this.set('pathValue', url.substr(varPos + 1));
          return;
        }
      }
      this.set('hostValue', this.url);
      console.log('URL parse error', e);
      console.log('The url was', url);
      this.fire('app-log', {
        message: e
      });
      return;
    }
    var hash = '';
    if (parser.hash) {
      if (parser.hash[0] === '#') {
        hash = parser.hash.substr(1);
      } else {
        hash = parser.hash;
      }
    }
    this.set('hostValue', parser.origin);
    this.set('pathValue', parser.pathname);
    this.set('anchorValue', hash);
    if (parser.searchParams) {
      this.set('paramsList', Array.from(parser.searchParams).map((i) => {
        return {
          name: i[0],
          value: i[1]
        };
      }));
    }
  },
  /**
   * Adds empty line of URL params to the detailed form of URL parameters.
   */
  appendEmptyQueryParam: function() {
    var item = {
      name: '',
      value: ''
    };
    this.push('paramsList', item);
  },
  /**
   * Handler for click event when removing parameter line from the form.
   *
   * @param {ClickEvent} e A click event.
   */
  _removeParam: function(e) {
    var index = this.$.paramsList.indexForElement(e.target);
    this.splice('paramsList', index, 1);
    this.updateUrl();
  },
  /**
   * Handler for click action of any of context menu items.
   */
  _contextMenuAction: function(e) {
    var action = e.target.selectedItem.dataset.action;
    this.$.urlContextMenu.selected = -1;
    if (!action) {
      return;
    }
    var gaLabel = '';
    switch (action) {
      case 'encParamsAction':
        this.encodeParameters();
        gaLabel = 'Encode parameters';
        break;
      case 'decParamsAction':
        this.decodeParameters();
        gaLabel = 'Decode parameters';
        break;
      default:
        console.warn('Unknown action: %s', action);
        gaLabel = 'Unknown action';
    }

    if (gaLabel) {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Request view',
        action: 'URL widget context menu action',
        label: gaLabel
      });
    }
  },
  /**
   * HTTP encode query parameters
   */
  encodeParameters: function() {
    this._decodeEncode('encode');
  },
  /**
   * HTTP decode query parameters
   */
  decodeParameters: function() {
    this._decodeEncode('decode');
  },
  /**
   * HTTP encode or decode query parameters depending on [type].
   */
  _decodeEncode: function(type) {
    var url = this.url;
    if (!url) {
      return;
    }
    if (url.indexOf('http') !== 0) {
      url = 'http://' + url;
    }
    var parser;
    try {
      parser = new URL(url);
    } catch (e) {
      console.log('URL parse error', e);
      this.fire('app-log', {
        message: e
      });
      return;
    }
    if (type === 'decode') {
      let decoded = [];
      for (let p of parser.searchParams) {
        let k = this.decodeQueryString(p[0]);
        let v = this.decodeQueryString(p[1]);
        decoded[decoded.length] = k + '=' + v;
      }
      let path = parser.pathname;
      if (path) {
        path = this.decodeQueryString(path);
      }
      let finalUrl = parser.origin;
      if (path) {
        finalUrl += path;
      }
      if (decoded.length) {
        finalUrl += '?' + decoded.join('&');
      }
      let h = parser.hash;
      if (h) {
        finalUrl += h;
      }
      this.set('url', finalUrl);
    } else {
      // URL is a parser and toString return ready string.
      // this.set('url', parser.toString());
      let finalUrl = parser.origin;
      let path = parser.pathname;
      if (path) {
        finalUrl += path;
      }
      let sp = parser.searchParams.toString();
      if (sp) {
        finalUrl += '?' + sp;
      }
      let h = parser.hash;
      if (h) {
        finalUrl += h;
      }
      this.set('url', finalUrl);
    }
    this.revalidate();
  },
  /** Called when URL params form has been renederd. */
  _onParamsRender: function() {
    if (!this.root) {
      return;
    }
    var row = Polymer.dom(this.root).querySelectorAll('.params-list > .form-row');
    if (!row || !row.length) {
      return;
    }
    row = row.pop();
    try {
      row.children[0].children[0].focus();
    } catch (e) {

    }
  },
  /**
   * A handler called when the user press "enter" in any of the form fields.
   * This will send a `send` event.
   */
  _onEnter: function() {
    if (this.suggesionsOpened) {
      return;
    }
    var url = this.url;
    if (url && url.indexOf('://') === -1) {
      url = 'https://' + url;
      this._setUrl(url);
    }
    this.fire('send');
  },

  // Hanlder for suggestion selected event.
  _onSuggestionSelected: function(e) {
    var value = e.detail.value;
    this._setUrl(value);
  },

  // Handler called when the `paper-autocomplete` request a suggestions.
  _queryUrlHistory: function(e) {
    var value = e.detail.value;
    if (!value) {
      this.$.autocomplete.source = [];
      return;
    }
    var usePouchDb = this.$.meta.byKey('usePouchDb');

    if (!usePouchDb) {
      this.$.model.objectId = value;
      this.$.model.query();
    } else {
      let event = this.fire('url-history-object-query', {
        q: value
      });
      event.detail.result.then((data) => {
        var suggestions = data.map((item) => item._id);
        this.$.autocomplete.source = suggestions;
      })
      .catch(() => {
        this.$.autocomplete.source = [];
      });
    }
  },
  /**
   * Handler called when the suggestions data are ready and should be passed to the
   * `paper-autocomplete`
   */
  _setSuggestions: function(e) {
    var data = e.detail.data;
    if (!data) {
      this.$.autocomplete.source = [];
      return;
    }
    var suggestions = data.map((item) => item.url);
    this.$.autocomplete.source = suggestions;
  },
  // Handler called when the context menu has been opened.
  _menuOpened: function() {
    this.fire('send-analytics', {
      type: 'event',
      category: 'Request view',
      action: 'URL widget toggle',
      label: 'Open menu'
    });
  },

  revalidate: function() {
    var nodes = Polymer.dom(this.$$('.params-list')).querySelectorAll('.param-value input');
    if (!nodes) {
      return;
    }
    var fn = (node) => {
      this.async(() => {
        return node.validate && node.validate();
      }, 1);
    };
    nodes.forEach(fn);
    var master = this.$.masterUrl;
    return master.validate && master.validate();
  },

  _elementBlur: function() {
    var url = this.url;
    try {
      new URL(url);
    } catch (e) {
      if (this.hasVariables) {
        return;
      }
      this.$.invalidUrlToast.open();
    }
  },

  _keyDownHandler: function(e) {
    e = Polymer.dom(e);
    if (e.rootTarget.nodeName !== 'INPUT') {
      return;
    }
    if (e.event.keyCode !== 13) {
      return;
    }
    this._onEnter();
  },
  /**
   * Returns a string where all characters that are not valid for a URL
   * component have been escaped. The escaping of a character is done by
   * converting it into its UTF-8 encoding and then encoding each of the
   * resulting bytes as a %xx hexadecimal escape sequence.
   * <p>
   * Note: this method will convert any the space character into its escape
   * short form, '+' rather than %20. It should therefore only be used for
   * query-string parts.
   *
   * <p>
   * The following character sets are <em>not</em> escaped by this method:
   * <ul>
   * <li>ASCII digits or letters</li>
   * <li>ASCII punctuation characters:
   *
   * <pre>- _ . ! ~ * ' ( )</pre>
   * </li>
   * </ul>
   * </p>
   *
   * <p>
   * Notice that this method <em>does</em> encode the URL component delimiter
   * characters:<blockquote>
   *
   * <pre>
   * ; / ? : &amp; = + $ , #
   * </pre>
   *
   * </blockquote>
   * </p>
   *
   * @param {String} str A string containing invalid URL characters
   * @return {String} a string with all invalid URL characters escaped
   */
  encodeQueryString: function(str) {
    if (!str) {
      return str;
    }
    var regexp = /%20/g;
    return encodeURIComponent(str).replace(regexp, '+');
  },
  /**
   * Returns a string where all URL component escape sequences have been
   * converted back to their original character representations.
   *
   * Note: this method will convert the space character escape short form, '+',
   * into a space. It should therefore only be used for query-string parts.
   *
   * @param {String} str string containing encoded URL component sequences
   * @return {String} string with no encoded URL component encoded sequences
   */
  decodeQueryString: function(str) {
    if (!str) {
      return str;
    }
    var regexp = /\+/g;
    return decodeURIComponent(str.replace(regexp, '%20'));
  }
});
})();
