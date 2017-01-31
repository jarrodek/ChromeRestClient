(function() {
'use strict';
Polymer({
  is: 'file-form-item',

  properties: {
    file: {
      type: Object,
      notify: true
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
    var files = Array.from(e.target.files);
    this.set(['file', 'files'], files);
  },

  _removeFile: function() {
    this.fire('remove-item', null, {
      bubbles: false
    });
  }
});
})();
