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
    },

    page: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_pageChanged(page)'
  ],

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
    var item = {
      name: '',
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
  },

  _onItemRemove: function(e) {
    var index = this.$.filesList.indexForElement(e.target);
    if (!index && index !== 0) {
      return;
    }
    var removed = this.splice('formData', index, 1);
    var name = removed[0].name;
    if (!name) {
      return;
    }
    this.$.formData.removeField(name);
  },

  _togglePage: function() {
    this.page = this.page === 0 ? 1 : 0;
  },

  _pageChanged: function(page) {
    if (page === 0) {
      this.$.formData.clear();
      this.messagePreview = undefined;
    } else {
      this._setFormData();
      this.messagePreview = this.$.formData.generateMessagePreview();
    }
  },

  _setFormData: function() {
    var form = this.formData;
    if (!form.length) {
      return;
    }
    form.forEach((item) => this._updateFormData(item));
  },

  _updateFormData: function(obj) {
    var value;
    var contentType;
    if (obj.file) {
      if (obj.files.length === 1) {
        value = obj.files[0];
      } else {
        value = obj.files;
      }
    } else {
      value = obj.value;
      contentType = obj.contentType;
    }
    this.$.formData.setField(obj.name, value, {
      contentType: contentType
    });
  }

});
})();
