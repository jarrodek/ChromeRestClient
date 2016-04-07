Polymer({
  is: 'arc-project-view',
  /**
   * Event fired when delete project requested.
   * @event delete
   * @param {Object} project Project object to be deleted
   */
  properties: {
    project: {
      type: Object,
      notify: true
    },
    requests: Array
  },
  // Handler to export ptoject click.
  exportProject: function() {
    this.fire('export');
  },
  // Handler to delete ptoject click.
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
});
