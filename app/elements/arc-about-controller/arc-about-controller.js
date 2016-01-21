'use strict';

Polymer({
  is: 'arc-about-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    version: String
  },
  attached: function() {
    this.version = chrome.runtime.getManifest().version;
  },
  showLicensing: function() {
    this.$.licensingDialog.open();
  },
  showDonate: function() {
    this.$.donateDialog.open();
  }
});
