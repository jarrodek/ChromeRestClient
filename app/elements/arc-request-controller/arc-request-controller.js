Polymer({
  is: 'arc-request-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    toolbarFeatures: {
      type: Array,
      value: ['clearAll', 'loader','open','save']
    },
    request: {
      type: Object,
      notify: true
    },
    response: {
      type: Object
    },
    routeParams: {
      type: Object
    },

  },

  onShow: function() {
    this._setPageTitle('Request');
    this._prepareRequest();
  },
  onHide: function() {
    this._setPageTitle('');
  },
  onClearAll: function() {

  },

  _prepareRequest: function() {
    if (!this.opened) {
      return;
    }
    if (this.request) {
      return;
    }

  },

  _latestLoaded: function() {
    // if (this.restoredSet) {
    //   // infinite loop
    //   return;
    // }
    if (!(this.request instanceof RequestObject)) {
      this.set('request', new RequestObject(this.request));
      this.restoredSet = true;
    }
  }
});
