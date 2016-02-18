Polymer({
  is: 'arc-about-view',
  properties: {
    version: String
  },
  showLicensing: function() {
    this.$.licensingDialog.open();
  },
  showDonate: function() {
    this.$.donateDialog.open();
  }
});
