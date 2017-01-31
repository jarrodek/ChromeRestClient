(function() {
'use strict';
Polymer({
  is: 'multipart-payload-editor',

  properties: {
    // Hosting element / app should tell this element when it is visible to the user.
    opened: {
      type: Boolean,
      value: false,
      observer: '_openedChanged'
    },
    /**
     * Map of current form values.
     */
    formData: {
      type: Array,
      value: function() {
        return [];
      }
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
      computed: '_countFiles(formData.*)'
    },
    /**
     * True if file(s) has been selected.
     */
    hasFiles: {
      type: Boolean,
      computed: '_computeHasFiles(filesCount)'
    }
  },

  listeners: {
    'remove-item': '_onItemRemove'
  },

  _openedChanged: function(opened) {
    if (opened) {
      this._ensureFormReady();
    }
  },

  _ensureFormReady: function() {
    var fd = this.formData;
    if (!fd) {
      this.set('formData', []);
    }
    if (fd.length) {
      return;
    }

    this.appendEmptyFile();
  },

  /** Append new file form row  */
  appendEmptyFile: function() {
    var fileName = 'formData';
    if (this._fileListIndex) {
      fileName += this._fileListIndex;
    }
    this._fileListIndex++;
    var item = {
      name: fileName,
      files: [],
      file: true
    };
    if (!this.formData) {
      this.formData = [];
    }
    this.push('formData', item);
  },

  appendEmptyText: function() {
    var item = {
      name: '',
      value: '',
      contentType: 'text/plain',
      text: true
    };
    if (!this.formData) {
      this.formData = [];
    }
    this.push('formData', item);
  },

  /** Count number of files choosen by the user */
  _countFiles: function(record) {
    var result = 0;
    if (!record || !record.base || !record.base.length) {
      return result;
    }
    record.base.forEach((item) => {
      if (!item.files) {
        return;
      }
      result += item.files.length;
    });
    return result;
  },

  _computeHasFiles: function(no) {
    return !!no;
  }

});
})();
