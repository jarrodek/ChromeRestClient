Polymer({
  is: 'arc-about',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    version: String
  },
  attached: function() {
    this.version = (chrome && chrome.runtime) ? chrome.runtime.getManifest().version : 'Unknown';
  },
  showLicensing: function() {
    this.$.licensingDialog.open();
  },
  showDonate: function() {
    this.$.donateDialog.open();
  }
});
