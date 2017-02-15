Polymer({
  is: 'arc-project-view',
  /**
   * Event fired when delete project requested.
   * @event delete
   * @param {Object} project Project object to be deleted
   */
  properties: {
    project: {
      type: Object
    },
    requests: Array,
    // Selected by the user elements on the lists
    currentSelection: {
      type: Array,
      notify: true
    },
    optionsState: {
      type: Number,
      value: 0
    }
  },

  observers: [
    '_observeSelection(hasSelection)'
  ],

  // Handler to export ptoject click.
  exportProject: function() {
    this.fire('export');
  },
  // Handler to delete project click.
  deleteProject: function() {
    this.$.projectDeleteDialog.open();
  },
  /**
   * User confirm removing all data.
   * Send an event to the controller to remove all items.
   */
  onDeleteDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    this.fire('delete', {
      project: this.project
    });
  },
  /**
   * Sends an event that will be catched by the **controller** and the controller will request
   * name change from model. Controller must be aware of change and view should not operate
   * on data directly.
   */
  _projectNameChanged: function() {
    this.fire('project-name-changed', {
      project: this.project
    });
  },

  _isEmptyArray: function(obj) {
    if (!obj || !obj.length) {
      return true;
    }
    return false;
  },

  _deleteEmptyProject: function() {
    this.fire('delete', {
      project: this.project
    });
  },

  _computeOptionsTableClass: function(optionsState) {
    var clazz = 'table-options';
    clazz += (optionsState === 0 ? ' inactive' : '');
    return clazz;
  },

  _observeSelection: function(hasSelection) {
    if (hasSelection) {
      this.optionsState = 1;
    } else {
      this.optionsState = 0;
    }
  },

  _deleteSelected: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.currentSelection || !this.currentSelection.length) {
      this.$.noSelectionToast.open();
      return;
    }
    this.fire('delete-selected');
  }
});
