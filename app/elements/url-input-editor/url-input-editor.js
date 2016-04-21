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
    suggesionsOpened: Boolean
  },
  observers: [
    '_urlChanged(url)'
  ],
  /**
   * Called when the URL value change.
   *
   * @param {String} newVal New value of the URL.
   */
  _urlChanged: function(newVal) {
    console.log('URL CHANGED', newVal);
    if (this.detailed && !this.internalUrlSet) {
      console.log('FORM UPDATED');
      // clear the form
      this.updateForm();
    }
  },
  /**
   * Toggle the view.
   * TODO: This should change only the `detailed` property value and change observer should
   * make a change.
   */
  toggle: function() {
    this.detailed = !this.detailed;
    var stateName = this.detailed ? 'Details form' : 'Single line';
    if (this.detailed) {
      this.async(() => {
        this.updateForm();
      }, 0);
    } else {
      this.async(() => {
        this.updateUrl();
      }, 0);
    }
    arc.app.analytics.sendEvent('Request view', 'URL widget toggle', stateName);
  },
  /**
   * Update the URL from detailed form values.
   */
  updateUrl: function() {
    var url = this.hostValue;
    if (url.indexOf('://') === -1) {
      // no schema, adding "http" by default
      url = 'http://' + url;
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
    var data = new URLParser(this.url);
    var hostField = '';
    if (!data.protocol) {
      hostField = 'http://';
    } else {
      hostField = data.protocol + '://';
    }
    if (data.authority) {
      hostField += data.authority;
    }
    this.set('hostValue', hostField);
    this.set('pathValue', data.path);
    this.set('anchorValue', data.anchor);
    this.set('paramsList', Array.from(data.paramsList));
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
      case 'replAmpAction':
        this.replaceAmp();
        gaLabel = 'Replace & with ;';
        break;
      case 'replSemiAction':
        this.replaceSemicolon();
        gaLabel = 'Replace ; with &';
        break;
      default:
        console.warn('Unknown action: %s', action);
    }
    if (gaLabel) {
      arc.app.analytics.sendEvent('Request view', 'URL widget context menu action', gaLabel);
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
    if (!this.url) {
      return;
    }
    /* global URI, URLParser */
    URI.escapeQuerySpace = false;
    var data = new URLParser(this.url);
    var isEncode = type === 'encode';
    var result = new Set();
    for (let param of data.paramsList) {
      let key = param.name;
      let value = param.value;

      key = isEncode ? URLParser.encodeQueryString(key) : URLParser.decodeQueryString(key);
      value = isEncode ? URLParser.encodeQueryString(value) : URLParser.decodeQueryString(value);

      param.name = key;
      param.value = value;

      result.add(param);
    }
    data.paramsList = result;
    this._setUrl(data.toString());
  },
  /**
   * Replace `&` with `;`
   */
  replaceAmp: function() {
    this._replaceQueryDelim(';');
  },
  /**
   * Replace `;` with `&`
   */
  replaceSemicolon: function() {
    this._replaceQueryDelim('&');
  },
  /**
   * Replace delimiter for query params.
   *
   * @param {String} delim A new delimiter to be used.
   */
  _replaceQueryDelim: function(delim) {
    if (!this.url) {
      return;
    }
    var data = new URLParser(this.url);
    data.queryDelimiter = delim;
    data.setQueryFromCurrentParams();
    var url = data.toString();
    this._setUrl(url);
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
  onEnter: function() {
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
    this.$.model.objectId = value;
    this.$.model.query();
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
    arc.app.analytics.sendEvent('Request view', 'URL widget toggle', 'Open menu');
  }
});
})();
