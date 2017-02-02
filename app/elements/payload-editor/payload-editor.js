(function() {
'use strict';

Polymer({
  is: 'payload-editor',
  properties: {
    /**
     * A HTTP body message part.
     *
     * @type {String}
     */
    value: {
      type: String,
      value: '',
      notify: true
    },
    /**
     * A value of a Content-Type header.
     *
     * @type {Stirng}
     */
    contentType: {
      type: String,
      observer: '_onContentTypeChanged'
      // notify: true
    },
    /**
     * Currently selected tab.
     */
    tabSelected: {
      type: Number,
      value: 0,
      observer: '_selectedTabChanged'
    },
    /**
     * List of form values.
     * May be empty, even if `this.value` is not, when this.tabSelected != 1.
     */
    valuesList: {
      type: Array,
      value: []
    },
    /**
     * List of files to be send with the multipart/form-data request
     */
    formData: {
      type: Array,
      notify: true
    },

    opened: {
      type: Boolean,
      value: true
    },
    /**
     * The source panel of the body value.
     * It's a text representation of the `tabSelected` property.
     */
    bodySource: {
      type: String,
      notify: true,
      readOnly: true
    }
  },
  observers: [
    '_valuesListChanged(valuesList.*)',
    '_valueChanged(value)'
  ],

  attached: function() {
    this.listen(window, 'content-type-changed', '_contentTypeHandler');
  },

  detached: function() {
    this.unlisten(window, 'content-type-changed', '_contentTypeHandler');
  },

  /**
   * Update headers array from form values to the HTTP string.
   */
  updateValue: function() {
    if (!this.valuesList) {
      return;
    }
    if (!this.contentType || this.contentType.indexOf('x-www-form-urlencoded') === -1) {
      return;
    }
    var value = PayloadParser.arrayToString(this.valuesList);
    this.internalChange = true;
    this.set('value', value);
    this.internalChange = false;
  },
  /** Append empty param row. */
  appendEmptyParam: function() {
    var item = {
      name: '',
      value: ''
    };
    this.push('valuesList', item);
  },
  /** Encode payload button press handler */
  encodePaylod: function() {
    var value = PayloadParser.encodeUrlEncoded(this.value);
    this.internalChange = true;
    this.set('value', value);
    this.internalChange = false;
    if (this.tabSelected === 1) {
      let arr = PayloadParser.stringToArray(value);
      this.set('valuesList', arr);
    }
  },
  /** Decode payload button press handler */
  decodePaylod: function() {
    var value = PayloadParser.decodeUrlEncoded(this.value);
    this.internalChange = true;
    this.set('value', value);
    this.internalChange = false;
    if (this.tabSelected === 1) {
      let arr = PayloadParser.stringToArray(value);
      this.set('valuesList', arr);
    }
  },
  /**
   * Change CodeMirror mode on change.
   * Also, if the Content-Type is not x-www-form-urlencoded and form editor is shown hide it.
   */
  _onContentTypeChanged: function(ct) {
    if (!ct) {
      return;
    }
    this.$.cm.mode = ct;
    if (ct === 'application/x-www-form-urlencoded') {
      this.set('tabSelected', 1);
    } else if (ct.indexOf('multipart/form-data') !== -1) {
      this.set('tabSelected', 2);
    } else if (ct === 'application/octet-stream') {
      this.set('tabSelected', 3);
    } else {
      this.set('tabSelected', 0);
    }
  },
  /** Set value if has form */
  _selectedTabChanged: function() {
    var tabName;
    var ct = this.contentType;
    switch (this.tabSelected) {
      case 0:
        this.updateValue();
        this.$.cm.editor.refresh();
        tabName = 'Raw tab';
        this._setBodySource('raw');
        break;
      case 1:
        if (ct !== 'application/x-www-form-urlencoded') {
          this.setContenTypeValue('application/x-www-form-urlencoded');
        }
        this.setFormValues();
        tabName = 'Form tab';
        this._setBodySource('form');
        break;
      case 2:
        if (!ct || !ct.indexOf || ct.indexOf('multipart/form-data') === -1) {
          this.setContenTypeValue('multipart/form-data');
        }
        tabName = 'Files tab';
        this._setBodySource('multipart');
        break;
      case 3:
        tabName = 'Raw file';
        this._setBodySource('file');
        break;
    }
    if (this.isAttached) {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Payload editor',
        action: 'Tab switched',
        label: tabName
      });
    }
  },
  // Sets the form editor from current value.
  setFormValues: function() {
    var arr = PayloadParser.stringToArray(this.value);
    this.set('valuesList', arr);
  },

  /** Remove element from the params form */
  _removeParam: function(e) {
    var index = this.$.valuesList.indexForElement(e.target);
    this.splice('valuesList', index, 1);
  },

  /** called when valuesList deep changed. */
  _valuesListChanged: function(record) {
    // if path == 'valuesList' it means the object was initialized.
    if (!record || !record.path || record.path === 'valuesList') {
      return;
    }
    this.updateValue();
  },
  /** Called when params form has renederd. */
  _onParamsRender: function() {
    if (!this.root) {
      return;
    }
    var row = Polymer.dom(this.root).querySelectorAll('.params-list .form-row');
    if (!row || !row.length) {
      return;
    }
    row = row.pop();
    try {
      row.children[0].children[0].focus();
    } catch (e) {}
  },

  _updateContentType: function(e) {
    var ct = e.target.dataset.ct;
    if (!ct) {
      return;
    }
    this.contentType = ct;
    this.fire('content-type-changed', {
      value: ct
    });
  },

  _valueChanged: function() {
    if (this.internalChange) {
      return;
    }
    if (this.tabSelected === 1) {
      this.setFormValues();
    }
  },

  _computeFileBageClass: function(cnt) {
    return cnt === 0 ? 'empty' : '';
  },

  // Toggles body panel.
  toggle: function() {
    this.opened = !this.opened;
  },
  // Computes class for the toggle's button icon.
  _computeToggleIconClass: function(opened) {
    var clazz = 'toggle-icon';
    if (opened) {
      clazz += ' opened';
    }
    return clazz;
  },

  _computeToggleLabel: function(opened) {
    return opened ? 'Hide panel' : 'Show panel';
  },

  _contentTypeSelected: function(e) {
    var ct = e.detail.item.dataset.type;
    this.setContenTypeValue(ct);
  },

  _contentTypeHandler: function(e) {
    var event = Polymer.dom(e);
    if (event.rootTarget === this) {
      return;
    }
    var ct = e.detail.value;
    this.set('contentType', ct);
  },

  /**
   * When chanding the editor it mey require to also change the content type header.
   * This function updates Content-Type.
   */
  setContenTypeValue: function(ct) {
    this.set('contentType', ct);
    this.fire('content-type-changed', {
      value: ct
    });
  }
});
})();
