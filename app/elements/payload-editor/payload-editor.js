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
    filesList: {
      type: Array,
      value: [],
      notify: true
    },
    /**
     * If true form data is visible.
     */
    withForm: {
      type: Boolean,
      value: false,
      computed: '_computeWithForm(contentType)'
    },
    /**
     * Index for filename counter in files editor.
     */
    _fileListIndex: {
      type: Number,
      value: 0
    },
    /**
     * Number of files selected by the user.
     */
    filesCount: {
      type: Number,
      computed: '_countFiles(filesList.*)'
    },
    /**
     * True if file(s) has been selected.
     */
    hasFiles: {
      type: Boolean,
      computed: '_computeHasFiles(filesCount)'
    },

    opened: {
      type: Boolean,
      value: true
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
  /** Append new file form row  */
  appendEmptyFile: function() {
    var fileName = 'fileUpload';
    if (this._fileListIndex) {
      fileName += this._fileListIndex;
    }
    this._fileListIndex++;
    var item = {
      name: fileName,
      files: []
    };
    if (!this.filesList) {
      this.filesList = [];
    }
    this.push('filesList', item);
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
    // if (!this.withForm && this.tabSelected === 1) {
    //   this.set('tabSelected', 0);
    // }
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
        break;
      case 1:
        if (ct !== 'application/x-www-form-urlencoded') {
          this.setContenTypeValue('application/x-www-form-urlencoded');
        }
        this.setFormValues();
        tabName = 'Form tab';
        break;
      case 2:
        if (!ct || !ct.indexOf || ct.indexOf('multipart/form-data') === -1) {
          this.setContenTypeValue('multipart/form-data');
        }
        tabName = 'Files tab';
        break;
      case 3:
        tabName = 'Raw file';
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

  /** Compute if form tab should be shown. */
  _computeWithForm: function(contentType) {
    return contentType && contentType.indexOf('x-www-form-urlencoded') !== -1;
  },

  /** Remove element from the params form */
  _removeParam: function(e) {
    var index = this.$.valuesList.indexForElement(e.target);
    this.splice('valuesList', index, 1);
  },
  _removeFile: function(e) {
    var index = this.$.filesList.indexForElement(e.target);
    this.splice('filesList', index, 1);
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
    } catch (e) {

    }
  },
  /**
   * A handler to choose file button click.
   * This function will find a proper input[type="file"] and programatically click on it to open
   * file dialog.
   */
  _selectFile: function(e) {
    var file = e.target.parentNode.querySelector('input[type="file"]');
    if (!file) {
      return;
    }
    file.click();
  },
  /**
   * A handler to file change event for input[type="file"].
   * This will update files array for corresponding `this.filesList` array object.
   */
  _fileObjectChanged: function(e) {
    var index = this.$.filesList.indexForElement(e.target);
    if (index >= 0) {
      let files = Array.from(e.target.files);
      this.set('filesList.' + index + '.files', files);
    }
  },
  /** Count number of files choosen by the user */
  _countFiles: function() {
    var result = 0;
    if (!this.filesList) {
      return result;
    }
    this.filesList.forEach((item) => {
      result += item.files.length;
    });
    return result;
  },

  _computeHasFiles: function(no) {
    return !!no;
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
