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
      notify: true,
      observer: '_requestChanged'
    },
    response: {
      type: Object
    },
    routeParams: {
      type: Object,
      observer: '_prepareRequest'
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
    console.error('Implement me');
  },

  _prepareRequest: function() {
    if (!this.opened || !this.routeParams) {
      return;
    }
    switch (this.routeParams.type) {
      default:
        this._restoreLatest();
        break;
    }
  },

  _restoreLatest: function() {
    this.$.latest.read();
  },

  _latestLoaded: function() {
    if (!this.$.latest.value) {
      this.set('request', new RequestObject({
        type: 'history',
        url: '',
        method: 'GET'
      }));
    }
  },

  _requestChanged: function() {
    console.log('_requestChanged', this.request);
  }
});
