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
    name: String
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
    this.fire('save-request', {
      name: this.name
    });
    this.close();
  }
});
