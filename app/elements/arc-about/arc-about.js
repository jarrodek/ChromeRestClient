Polymer({
  is: 'arc-about',

  behaviors: [ArcBehaviors.OpenablePanelBehavior],

  properties: {
    version: {
      type: String,
      value: function() {
        return chrome.runtime.getManifest().version;
      }
    }
  },

  showLicensing: function() {
    this.fire('display-license');
  }
});
