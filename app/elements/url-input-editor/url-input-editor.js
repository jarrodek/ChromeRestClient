'use strict';

Polymer({
  is: 'url-input-editor',
  properties: {
    url: {
      type: String,
      notify: true
    },
    detailed: {
      type: Boolean,
      value: false
    },
    hostValue: {
      type: String,
      value: ''
    },
    pathValue: {
      type: String,
      value: ''
    },
    anchorValue: {
      type: String,
      value: ''
    },
    paramsList: {
      type: Array,
      value: []
    }
  },

  toggle: function() {
    this.detailed = !this.detailed;
    if (this.detailed) {
      this.async(() => {
        this.updateForm();
      }, 0);
    } else {
      this.async(() => {
        this.updateUrl();
      }, 0);
    }
  },
  /**
   * Update url from form values.
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
    this.set('url', url);
  },

  /**
   * Crerate / update form data from master URL.
   */
  updateForm: function() {
    var data = new URLParser(this.url);
    var hostField = '';
    if (!data.protocol) {
      hostField = 'http://';
    } else {
      hostField = data.protocol + '://';
    }
    hostField += data.authority;
    this.set('hostValue', hostField);
    this.set('pathValue', data.path);
    this.set('anchorValue', data.anchor);
    this.set('paramsList', Array.from(data.paramsList));
  },

  appendEmptyQueryParam: function() {
    var item = {
      name: '',
      value: ''
    };
    this.push('paramsList', item);
  },

  _removeParam: function(e) {
    var index = this.$.paramsList.indexForElement(e.target);
    this.splice('paramsList', index, 1);
    this.updateUrl();
  },

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
      //category: 'Request view'
      this.fire('ga-event', {
        'action': 'URL widget context menu action',
        'label': gaLabel
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
    this.set('url', data.toString());
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
    this.set('url', url);
  },
  /** Called when URL params form has renederd. */
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

  onEnter: function() {
    this.fire('send');
  }
});
