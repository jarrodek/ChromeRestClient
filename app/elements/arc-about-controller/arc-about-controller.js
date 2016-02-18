'use strict';

Polymer({
  is: 'arc-about-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    version: {
      type: String,
      value: function() {
        return chrome.runtime.getManifest().version;
      }
    }
  },
  onShow: function() {
    this._setPageTitle('Advanced Rest Client Application');
  },
  onHide: function() {
    this._setPageTitle('');
  }
});
