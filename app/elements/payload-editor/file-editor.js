Polymer({
  is: 'file-editor',

  behaviors: [
    Polymer.IronFormElementBehavior,
    Polymer.IronValidatableBehavior
  ],

  properties: {
    /**
     * The value of the control is an array of files that has been selected by the user.
     *
     */
    value: {
      type: Array,
      value: function() {
        return [];
      },
      notify: true
    },
    // Computed value, true if the control has files.
    hasFile: {
      type: Boolean,
      computed: '_computeHasFile(value.*)'
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
   * This will update files array for corresponding `this.value` array object.
   */
  _fileObjectChanged: function(e) {
    this.set('value', e.target.files[0]);
  },

  _getValidity: function() {
    return !!(this.value && this.value.name);
  },

  _computeHasFile: function(record) {
    return !!(record && record.base && record.base.name);
  },

  removeFile: function() {
    this.value = undefined;
    var file = this.$$('input[type="file"]');
    file.value = '';
  }
});
