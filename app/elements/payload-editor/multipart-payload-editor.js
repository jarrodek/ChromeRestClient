(function() {
'use strict';
/* global MultipartFormData */
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
      notify: true,
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
      value: false,
      computed: '_computeHasFiles(filesCount)'
    },
    // True if any form data has been added.
    hasFormData: {
      type: Boolean,
      value: false,
      computed: '_computeHasFormData(formData.*)',
      observer: '_hasFormDataChanged'
    },

    page: {
      type: Number,
      value: 0
    },
    // Value of this form
    value: {
      type: Object,
      readOnly: true,
      notify: true,
      value: function() {
        return new MultipartFormData({
          eventNode: this
        });
      }
    }
  },

  observers: [
    '_pageChanged(page)',
    '_formDataChanged(formData.*)'
  ],

  listeners: {
    'multipart-boundary-chnaged': '_boundaryChnaged'
  },

  ready: function() {
    if (this.value.boundary) {
      this._notifyBoundary(this.value.boundary);
    }
  },

  _openedChanged: function(opened) {
    if (opened) {
      this._ensureFormReady();
    }
  },

  _ensureFormReady: function() {
    this.appendEmptyFile();
  },

  /** Append new file form row  */
  appendEmptyFile: function() {
    var item = {
      name: '',
      value: [],
      file: true
    };
    if (!this.formData) {
      this.set('formData', []);
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
      this.set('formData', []);
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
      if (!item.value || !(item.value instanceof Array)) {
        return;
      }
      result += item.value.length;
    });
    return result;
  },

  _computeHasFormData: function(record) {
    return !!(record && record.base && record.base.length);
  },

  _hasFormDataChanged: function(has) {
    if (has && !this.boundary) {
      this.value.updateBoundary();
    } else if (has) {
      this.fire('content-type-changed', {
        value: 'multipart/form-data; boundary=' + this.boundary
      });
    }
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
    this.value.delete(name);
  },

  _togglePage: function() {
    this.page = this.page === 0 ? 1 : 0;
  },

  _pageChanged: function(page) {
    if (page === 0) {
      if (this.value) {
        this.value.clear();
        this.messagePreview = undefined;
      }
    } else {
      this._setFormData();
      this.messagePreview = this.value.generateMessagePreview();
    }
  },

  _setFormData: function() {
    var form = this.formData;
    if (!form || !form.length) {
      return;
    }
    form.forEach((item) => this._updateFormData(item));
    this.fire('value-changed', {
      value: this.value
    }, {
      bubbles: false
    });
  },

  _updateFormData: function(obj) {
    if (!obj || !obj.name) {
      return;
    }
    var value;
    var contentType;
    if (obj.file) {
      if (obj.value.length === 1) {
        value = obj.value[0];
      } else {
        value = obj.value;
      }
    } else {
      value = obj.value;
      contentType = obj.contentType;
    }
    this.value.set(obj.name, value, {
      mime: contentType
    });
  },

  _computeToggleLabel: function(page) {
    return page === 0 ? 'preview message' : 'close preview';
  },

  _computeToggleIcon: function(page) {
    return page === 0 ? 'arc:visibility' : 'arc:visibility-off';
  },
  /**
   * Notifies content type header change when boundary change.
   *
   * @param {String} boundary New boudary.
   */
  _notifyBoundary: function(boundary) {
    this.fire('content-type-changed', {
      value: 'multipart/form-data; boundary=' + boundary
    });
  },

  _boundaryChnaged: function(e) {
    if (!e.detail.value) {
      return;
    }
    this.boundary = e.detail.value;
    this._notifyBoundary(e.detail.value);
  },

  _formDataChanged: function() {
    this._setFormData();
  }

  // _computeValue: function() {
  //   this.debounce('body-value-gen', function() {
  //     this.$.formData.clear();
  //     this._setFormData();
  //     this.$.formData.generateMessage()
  //     .then((buffer) => {
  //       console.log(buffer);
  //     });
  //   }, 50);
  // }
});
})();
