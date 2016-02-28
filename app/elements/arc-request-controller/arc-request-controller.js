Polymer({
  is: 'arc-request-controller',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior,
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
    routeParams: {
      type: Object,
      observer: '_prepareRequest'
    },
    /**
     * True if request is loading at the moment.
     * Will display a progress bar.
     */
    requestLoading: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true
    },
    /**
     * A response object.
     */
    response: {
      type: Object,
      notify: true,
      readOnly: true
    },
    hasResponse: {
      type: Boolean,
      value: false,
      notify: true,
      computed: '_computeHasResponse(response)'
    }
  },

  listeners: {
    'send': 'sendRequest',
    'abort': 'abortRequest',
    'save-file': '_saveToFile'
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
  },

  sendRequest: function() {
    if (!this.request.url) {
      StatusNotification.notify({
        message: 'Add URL to the request first'
      });
      return;
    }
    this._setResponse(null);
    this._setRequestLoading(true);
    this._saveUrl();
    this._callRequest();
  },

  abortRequest: function() {
    this._setRequestLoading(false);
    this.$.socket.abort();
  },
  /**
   * Saves request and response in the history store.
   */
  _saveHistory: function() {

  },
  /**
   * Save an URL in URL's history store for autofill helper.
   */
  _saveUrl: function() {

  },

  _callRequest: function() {
    var request = Object.assign(this.request);
    this.$.socket.request = request;
    this.$.socket.run();
  },

  _responseReady: function(e) {
    this._setRequestLoading(false);
    this._setResponse(e.detail.response);
  },

  _computeHasResponse: function(response) {
    return !!response;
  },
  /**
   * Save current payload to file.
   */
  _saveToFile: function() {
    if (!this.hasResponse) {
      return;
    }
    var ct = arc.app.headers.getContentType(this.response.headers);
    this.exportContent = this.response.body;
    this.exportMime = ct || 'text';
    var ext = 'log';
    if (this.exportMime.indexOf('xml') !== -1) {
      ext = 'xml';
    } else if (this.exportMime.indexOf('json') !== -1) {
      ext = 'json';
    } else if (this.exportMime.indexOf('html') !== -1) {
      ext = 'html';
    } else if (this.exportMime.indexOf('javascript') !== -1) {
      ext = 'js';
    }

    this.fileSuggestedName = 'response-export.' + ext;
    this.exportData();
  },

  onFileSaved: function() {
    StatusNotification.notify({
      message: 'File saved'
    });
  }
});
