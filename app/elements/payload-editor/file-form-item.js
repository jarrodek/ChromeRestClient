(function() {
'use strict';
Polymer({
  is: 'file-form-item',

  behaviors: [ArcBehaviors.ArcPayloadFormItemBehavior],

  properties: {
    /**
     * The value of the control is an array of files that has been selected by the user.
     *
     */
    value: {
      type: Array,
      value: function() {
        return [];
      }
    },
    // Computed value, true if the control has files.
    hasFiles: {
      type: Boolean,
      computed: '_computeHasFiles(value.*)'
    },
    // Set to true to open the files list preview
    opened: {
      type: Boolean,
      value: false
    }
  },

  /**
   * A handler to choose file button click.
   * This function will find a proper input[type="file"] and programatically click on it to open
   * file dialog.
   */
  _selectFile: function() {
    var file = this.$$('input[type="file"]');
    file.click();
  },

  /**
   * A handler to file change event for input[type="file"].
   * This will update files array for corresponding `this.filesList` array object.
   */
  _fileObjectChanged: function(e) {
    var files = Array.from(e.target.files);
    this.set('value', files);
  },

  _getValidity: function() {
    return !!(this.name && this.value && this.value.length);
  },

  _computeHasFiles: function(record) {
    return !!(record && record.base && record.base.length);
  },

  _toggleFilesList: function(e) {
    this.opened = !this.opened;
    e.preventDefault();
    e.stopPropagation();
  }
});
})();
