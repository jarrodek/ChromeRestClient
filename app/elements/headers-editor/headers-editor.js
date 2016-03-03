'use strict';
/* global CodeMirror */
Polymer({
  is: 'headers-editor',

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
    }
  },
  observers: [
    '_headerValuesChanged(headersList.*)'
  ],
  ready: function() {
    this.$.cm.setOption('extraKeys', {
      'Ctrl-Space': function(cm) {
        CodeMirror.showHint(cm, CodeMirror.hint['http-headers'], {
          container: Polymer.dom(this.root)
        });
      }.bind(this)
    });
  },

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
    var arr = arc.app.headers.toJSON(this.headers);
    var ct = arc.app.headers.getContentType(arr);
    if (!!ct) {
      return;
    }
    if (!this.contentType) {
      this.displayWarning('content-type-missing');
      return;
    }
    arr.push({
      name: 'Content-Type',
      value: this.contentType
    });
    var headers = arc.app.headers.toString(arr);
    this.set('headers', headers);
  },
  /**
   * Display a dialog with error message.
   *
   * @param {String} type A predefined type to display.
   */
  displayWarning: function(type) {
    console.warn('Content type header not present but it should be: ' + type);
  },
  /**
   * Update headers array from form values to the HTTP string.
   */
  updateHeaders: function() {
    if (!this.headersList) {
      return;
    }
    var headers = arc.app.headers.toString(this.headersList);
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
      return;
    }
    var ct = arc.app.headers.getContentType(this.headers);
    if (!ct) {
      return;
    }
    this.set('contentType', ct);
  },

  _isPayloadChanged: function() {
    if (this.isPayload) {
      this.ensureContentTypeHeader();
    }
  },
  _onContentTypeChanged: function() {
    if (!this.isPayload) {
      return;
    }
    var arr = arc.app.headers.toJSON(this.headers);
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
    var headers = arc.app.headers.toString(arr);
    this.set('headers', headers);
  },
  /** Called when tab selection changed */
  _selectedTabChanged: function() {
    switch (this.tabSelected) {
      case 0:
        this.updateHeaders();
        this.$.cm.editor.refresh();
        break;
      case 1:
        var arr = arc.app.headers.toJSON(this.headers);
        this.set('headersList', arr);
        break;
    }
  },

  _removeHeader: function(e) {
    var index = this.$.headersList.indexForElement(e.target);
    this.splice('headersList', index, 1);
    this.updateHeaders();
  },

  _headerValuesChanged: function(record) {
    // if path == 'headersList' it means the object was initialized.
    if (!record || !record.path || record.path === 'headersList') {
      return;
    }
    this.updateHeaders();
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
  }
});
