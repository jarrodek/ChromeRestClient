(function() {
'use strict';

/* global CodeMirror */
Polymer({
  is: 'headers-editor',

  behaviors: [ArcBehaviors.HeadersParserBehavior],

  properties: {
    /**
     * A HTTP headers message part as defined in HTTP spec.
     *
     * @type {String}
     */
    headers: {
      type: String,
      notify: true
    },
    /**
     * A value of a Content-Type header.
     * This can be changed externally and the editor will reflect the change.
     *
     * @type {Stirng}
     */
    contentType: {
      type: String,
      notify: true,
      observer: '_onContentTypeChanged'
    },

    isPayload: {
      type: Boolean,
      observer: '_isPayloadChanged'
    },
    tabSelected: {
      type: Number,
      value: 0,
      observer: '_selectedTabChanged'
    },
    headersList: {
      type: Array,
      value: []
    },
    headersDefaults: {
      type: String,
      computed: '_computeHeadersDefaults(isPayload)'
    },
    /**
     * It is currently focused input field for header name.
     * This field will receive autocomplete support.
     * @type {HTMLElement}
     */
    activeHeaderNameField: {
      type: HTMLElement,
      readOnly: true
    },
    /**
     * Active autocomplete element.
     *
     * @type {HTMLElement}
     */
    activeAutocompleteNameField: {
      type: HTMLElement,
      readOnly: true
    },
    // True when the headers are valid HTTP headers
    valid: {
      type: Boolean,
      notify: true
    },
    // Error message to diplay when the headers are not valid.
    errorMessage: String,
  },
  observers: [
    '_headerValuesChanged(headersList.*)',
    '_headersChanged(headers)'
  ],

  listeners: {
    'iron-overlay-closed': '_headersSupportClosed',
    'headers-set-selected': '_headersSetSelected'
  },

  ready: function() {
    this.$.cm.setOption('extraKeys', {
      'Ctrl-Space': function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint['http-headers'], {
          container: Polymer.dom(this.root)
        });
      }.bind(this)
    });
    // this data will help prioritize code-mirror support for headers.
    this.$.cm.editor.on('header-value-selected', (e) => {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Headers editor',
        action: 'CM value picked',
        label: e
      });
    });
    this.$.cm.editor.on('header-key-selected', (e) => {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Headers editor',
        action: 'CM name picked',
        label: e
      });
    });
    this.$.cm.editor.on('header-value-support', (e) => this.onCodeMirrorHeadersSupport(e));
  },
  // Handler for code-mirror header hints selected.
  onCodeMirrorHeadersSupport: function(init) {
    if (!init.type || !init.type.call) {
      return;
    }
    var openResult;
    switch (init.type.call) {
      case 'authorizationBasic':
        openResult = this._openCmBasicAuth();
        break;
      case 'cookie':
        openResult = this._openCmCookies();
        break;
    }
    if (openResult) {
      this.cmSupportData = init;
    } else {
      this.cmSupportData = null;
    }
  },

  _headersSupportClosed: function(e) {
    if (e.detail.canceled) {
      if (this.cmSupportData) {
        this.cmSupportData = null;
      }
      return;
    }
    var init = this.cmSupportData;
    this.cmSupportData = null;
    if (!init) {
      return;
    }
    var elm;
    var value;
    switch (init.type.call) {
      case 'authorizationBasic':
        elm = this.__getSupportElmForHeader('authorization');
        if (elm) {
          value = elm.value;
          if (value) {
            value = value.replace('Basic ', '');
          }
        }
        break;
      case 'cookie':
        elm = this.__getSupportElmForHeader('cookie');
        if (elm) {
          value = elm.value;
        }
    }
    if (!elm || !value) {
      return;
    }
    this.$.cm.editor.replaceSelection(value);
  },
  // Open basic auth support for code mirror.
  _openCmBasicAuth: function() {
    var elm = this.__getSupportElmForHeader('authorization');
    if (!elm) {
      return false;
    }
    elm.target = undefined;
    elm.model = undefined;
    elm.provideSupport();
    return true;
  },

  // Open cookies support for code mirror.
  _openCmCookies: function() {
    var elm = this.__getSupportElmForHeader('cookie');
    if (!elm) {
      return false;
    }
    elm.target = undefined;
    elm.model = undefined;
    elm.provideSupport();
    return true;
  },

  /**
   * Called by CodeMirror editor.
   * When something change n the headers list, detect content type header.
   */
  valueChanged: function() {
    this._detectContentType();
  },
  /**
   * Insert a Content-Type header into a headers list if it is not on the list already.
   *
   * This function uses `contentType` value for the header.
   * If it is not defined then an warning message will be shown.
   */
  ensureContentTypeHeader: function() {
    var arr = this.headersToJSON(this.headers);
    var ct = this.getContentType(arr);
    if (!!ct) {
      this.hideWarningn('content-type-missing');
      return;
    }
    if (!this.contentType) {
      this.displayWarning('content-type-missing');
      return;
    } else {
      this.hideWarningn('content-type-missing');
    }
    arr.push({
      name: 'Content-Type',
      value: this.contentType
    });
    var headers = this.headersToString(arr);
    this.set('headers', headers);
  },
  /**
   * Display a dialog with error message.
   *
   * @param {String} type A predefined type to display.
   */
  displayWarning: function(type) {
    this.fire('app-log', {
      'message': ['Content type header not present but it should be: ' + type],
      'level': 'warn'
    });
  },

  hideWarningn: function(type) {
    this.fire('app-log', {
      'message': ['Content type header is present now: ' + type],
      'level': 'warn'
    });
  },
  /**
   * Update headers array from form values to the HTTP string.
   */
  updateHeaders: function() {
    if (!this.headersList) {
      return;
    }
    var headers = this.headersToString(this.headersList);
    this.set('headers', headers);
  },

  appendEmptyHeader: function() {
    var item = {
      name: '',
      value: ''
    };
    this.push('headersList', item);
  },

  _detectContentType: function() {
    if (!this.headers && this.contentType) {
      this.set('contentType', null);
      return;
    }
    if (!this.headers) {
      if (this.isPayload) {
        this.displayWarning('content-type-missing');
      }
      return;
    }
    var ct = this.getContentType(this.headers);
    if (!ct) {
      if (this.isPayload) {
        this.displayWarning('content-type-missing');
      }
      return;
    }
    this.set('contentType', ct);
    this.hideWarningn('content-type-missing');
  },

  _isPayloadChanged: function() {
    if (this.isPayload) {
      this.ensureContentTypeHeader();
    }
  },

  _onContentTypeChanged: function() {
    if (!this.isPayload || !this.contentType) {
      return;
    }
    var arr = this.headersToJSON(this.headers);
    var updated = false;
    var notChanged = false; //True when values are equal, no change needed.
    arr.map(function(item) {
      if (updated || item.name.toLowerCase() !== 'content-type') {
        return item;
      }
      updated = true;
      if (item.value === this.contentType) {
        notChanged = true;
        return item;
      }
      item.value = this.contentType;
      return item;
    }.bind(this));
    if (notChanged) {
      return;
    }
    if (!updated) {
      arr.push({
        name: 'Content-Type',
        value: this.contentType
      });
    }
    var headers = this.headersToString(arr);
    this.set('headers', headers);
  },
  /** Called when tab selection changed */
  _selectedTabChanged: function(newVal, oldVal) {
    var tabName;
    switch (newVal) {
      case 0:
        if (oldVal === 1) {
          this.updateHeaders();
        }
        this.$.cm.editor.refresh();
        tabName = 'Raw tab';
        break;
      case 1:
        this._setHeadersList();
        tabName = 'Form tab';
        break;
      case 2:
        tabName = 'Predefined tab';
        break;
    }
    if (this.isAttached) {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Headers editor',
        action: 'Tab switched',
        label: tabName
      });
    }
  },

  _removeHeader: function(e) {
    var index = this.$.headersList.indexForElement(e.target);
    this.splice('headersList', index, 1);
    this.updateHeaders();
  },

  _headersChanged: function(headers) {
    if (this.tabSelected !== 1) {
      return;
    }
    // it may come from updating a form value or from swithing to different request.
    // See: https://github.com/jarrodek/ChromeRestClient/issues/439
    var listHeaders = this.headersToString(this.headersList);
    if (listHeaders !== headers) {
      this._setHeadersList();
    }
  },
  // Populate form with current headers.
  _setHeadersList: function() {
    var arr = this.headersToJSON(this.headers);
    if (!arr || !arr.length) {
      arr = [{
        name: '',
        value: ''
      }];
    }
    this.set('headersList', arr);
  },

  _headerValuesChanged: function(record) {
    if (record && record.path && record.path === 'headersList.length') {
      // Not interested in it.
      return;
    }
    // path == 'headersList' means the object was initialized.
    if (!record || !record.path || record.path === 'headersList') {
      //initilize headers support
      this.async(() => {
        record.value.forEach((header, index) => {
          this.__provideSupport(header.name, index);
        });
      });
      return;
    }
    this.updateHeaders();
    this._provideSupport(record);
  },
  /** Called when headers form has renederd. */
  _onHeadersFormRender: function() {
    if (!this.root) {
      return;
    }
    var row = Polymer.dom(this.root).querySelectorAll('.headers-list .form-row');
    if (!row || !row.length) {
      return;
    }
    row = row.pop();
    try {
      row.children[0].children[0].focus();
    } catch (e) {

    }
  },
  /* Compute default headers string. */
  _computeHeadersDefaults: function(isPayload) {
    var txt = `accept: application/json
accept-encoding: gzip, deflate
accept-language: en-US,en;q=0.8\n`;
    if (isPayload) {
      txt += 'content-type: application/json\n';
    }
    txt += `user-agent: ${navigator.userAgent}`;
    return txt;
  },
  // Insert predefined default set into the editor
  _insertDefaultSet: function() {
    var headers = this.headers;
    if (headers && headers[headers.length - 1] !== '\n') {
      headers += '\n';
    }
    headers += this.headersDefaults;
    this.set('headers', headers);
    this.tabSelected = 0;
    // this.$.cm.editor.setValue(headers);
    // this.headers = headers;
  },

  _headerNameFocus: function(e) {
    var index = this.$.headersList.indexForElement(e.target);
    var elm = Polymer.dom(this.root)
      .querySelector('.headers-form .form-row:nth-child(' + (index + 1) + ') paper-autocomplete');
    if (!elm) {
      this.fire('app-log', {
        'message': ['Autocomplete element not found.'],
        'level': 'warn'
      });
      return;
    }
    elm.target = e.target;
    this._setActiveHeaderNameField(e.target);
    this._setActiveAutocompleteNameField(elm);
  },
  /**
   * Handler for autosuggestion element.
   * It takes value from currently focused header name element (input) and query the datastore
   * for suggestions.
   *
   * @param {Event} e Autocomplete event
   */
  _queryHeaderName: function(e) {
    var value = e.detail.value;
    if (!value) {
      this.activeAutocompleteNameField.source = [];
      return;
    }
    let event = this.fire('query-headers', {
      'type': 'request',
      'query': value
    });
    let headers = event.detail.headers;
    var suggestions = headers.map((item) => item.key);
    this.activeAutocompleteNameField.source = suggestions;
  },

  /**
   * A handler called when the user selects a suggestion.
   * @param {[type]} e [description]
   * @return {[type]}
   */
  _onHeaderNameSelected: function(e) {
    var value = e.detail.value;
    var index = this.$.headersList.indexForElement(this.activeHeaderNameField);
    if (index || index === 0) {
      this.set(['headersList', index, 'name'], value);
    }

    this.fire('send-analytics', {
      type: 'event',
      category: 'Headers editor',
      action: 'Fill support',
      label: 'Name selected'
    });
  },
  /**
   * Called when the headers list has changed.
   * Detect header name and check if support for this header exists.
   */
  _provideSupport: function(record) {
    var path = record.path;
    if (path.indexOf('name') === -1) {
      return;
    }
    var value = record.value;
    if (value) {
      value = value.toLowerCase();
    }

    var all = record.base;
    var len = all.length;
    var index;
    for (var i = 0; i < len; i++) {
      if (all[i].name === record.value) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      return;
    }
    this.__provideSupport(value, index);
  },
  __provideSupport: function(headerName, index) {
    var parent = Polymer.dom(this.root)
      .querySelector('.headers-form .form-row:nth-child(' + (index + 1) + ')');
    if (!parent) {
      return;
    }
    var elm = this.__getSupportElmForHeader(headerName);
    if (!elm) {
      parent.classList.remove('has-support');
    } else {
      parent.classList.add('has-support');
    }
  },

  __getSupportElmForHeader: function(headerName) {
    if (headerName) {
      headerName = headerName.toLowerCase();
    }
    var query = `*[header-support="${headerName}"]`;
    return Polymer.dom(this.root).querySelector(query);
  },

  _openHeaderSupport: function(e) {
    var item = this.$.headersList.itemForElement(e.target);
    var elm = this.__getSupportElmForHeader(item.name);
    if (!elm) {
      this.fire('app-log', {
        'message': ['No support for given header.', e],
        'level': 'error'
      });
      return;
    }
    var index = this.$.headersList.indexForElement(e.target);
    var input = Polymer.dom(this.root)
      .querySelector('.headers-form .form-row:nth-child(' + (index + 1) +
        ') input[name="headerValue"]');
    if (!input) {
      this.fire('app-log', {
        'message': ['Input field has not been found.'],
        'level': 'error'
      });
      return;
    }
    var model = this.$.headersList.modelForElement(e.target);
    elm.target = input;
    elm.model = model;
    elm.provideSupport();
  },

  _headersSetSelected: function(e, detail) {
    var headers = this.headers;
    if (headers && headers[headers.length - 1] !== '\n') {
      headers += '\n';
    }
    headers += detail.set;
    this.set('headers', headers);
    this.tabSelected = 0;
  }
});
})();
