Polymer({
  is: 'arc-about',

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
