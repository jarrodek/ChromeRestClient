Polymer({
  is: 'arc-save-dialog-view',
  behaviors: [
    Polymer.IronOverlayBehavior,
    Polymer.IronResizableBehavior
  ],
  hostAttributes: {
    'role': 'dialog',
    'tabindex': '-1'
  },
  properties: {
    name: String,
    /**
     * True when overriding previous request
     */
    isOverride: {
      type: Boolean,
      value: false
    },
    /**
     * True when saving request to Google Drive.
     */
    isDrive: {
      type: Boolean,
      value: false
    },
    /**
     * True when the request has been or will be attached to the project.
     */
    isProject: {
      type: Boolean,
      value: false
    }
  },
  /**
   * Resets the UI.
   */
  reset: function() {
    this.isOverride = false;
    this.isDrive = false;
    this.name = '';
  },

  _cancel: function() {
    this.close();
  },

  _save: function() {
    if (!this.name) {
      StatusNotification.notify({
        message: 'Enter name'
      });
      return;
    }
    this._saveRequested({
      name: this.name,
      isDrive: this.isDrive,
      isProject: this.isProject
    });
  },

  _override: function() {
    this._saveRequested({
      name: this.name,
      override: true,
      isDrive: this.isDrive
    });
  },

  _saveRequested: function(details) {
    this.fire('save-request', details);
    this.close();
  }
});
