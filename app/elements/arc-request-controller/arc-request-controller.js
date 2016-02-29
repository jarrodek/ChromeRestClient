Polymer({
  is: 'arc-request-controller',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    toolbarFeatures: {
      type: Array,
      value: ['clearAll', 'loader', 'save']
    },

    request: {
      type: Object,
      notify: true,
      observer: '_requestChanged'
    },

    routeParams: {
      type: Object,
      //observer: '_prepareRequest'
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
    },
    isError: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    errorMessage: {
      type: String,
      readOnly: true
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
    let base = new RequestLocalObject({
      url: '',
      method: 'GET'
    });
    this.set('request', base);
    this._setResponse(null);
    page('/request/current');
  },

  onSave: function() {

  },

  _prepareRequest: function() {
    if (!this.opened || !this.routeParams) {
      return;
    }
    switch (this.routeParams.type) {
      case 'history':
        this._restoreHistory(this.routeParams.historyId);
        break;
      default:
        this._restoreLatest();
        break;
    }
  },

  _restoreLatest: function() {
    debugger;
    this.$.latest.read();
  },

  _restoreHistory: function(id) {
    id = parseInt(id);
    if (!id || id !== id) {
      this._restoreLatest();
      StatusNotification.notify({
        message: 'Not found'
      });
      return;
    }
    this.$.requestQueryModel.objectId = id;
    this.$.requestQueryModel.requestType = 'history';
    this.$.requestQueryModel.getObject();
  },

  _latestLoaded: function() {
    if (!this.$.latest.value) {
      let base = new RequestLocalObject({
        url: '',
        method: 'GET'
      });
      this.set('request', base);
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
    this._setIsError(false);
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
    this.$.requestModel.getByMethodUrl(this.request.url, this.request.method);
  },
  /**
   * Save an URL in URL's history store for autofill helper.
   */
  _saveUrl: function() {
    var url = this.request.url;
    this.$.historyurlModel.data = new HistoryUrlObject({
      url: url,
      time: Date.now()
    });
    this.$.historyurlModel.save();
  },

  _callRequest: function() {
    var request = Object.assign({}, this.request);
    this.$.socket.request = request;
    this.$.socket.run();
  },

  _responseReady: function(e) {
    this._setRequestLoading(false);
    this._setResponse(e.detail.response);
    this._saveHistory();
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
  },

  _historyUrlSaved: function() {
    console.info('History URL has been saved.');
  },

  _historyUrlSaveError: function(e) {
    console.warn('Error saving into URLs history.', e);
  },
  /**
   * Called when the request object has been read from the datastore.
   * This function is called only when updating hitory data in object.
   */
  _requestObjectReady: function(e) {
    var request = e.detail.data;
    if (!request) {
      request = this.$.requestModel.fromData(this.request, this.response);
      this.$.requestModel.requestType = 'history';
    } else {
      request = request[0];
      request.har = this.$.requestModel.appendHarResponse(request.har, this.request, this.response);
      this.$.requestModel.requestType = request.type;
    }
    this.$.requestModel.data = request;
    this.$.requestModel.save();
  },

  _onHistorySave: function(e) {
    console.info('Saved history object', e.detail);
  },
  /** Called then transport not finished the request because of error. */
  _onRequestError: function(e) {
    var msg = e.detail.message;
    if (typeof message !== 'string') {
      //it could be an Error object
      if (msg.message) {
        msg = msg.message;
      } else {
        msg = null;
      }
    }
    this._setIsError(true);
    this._setErrorMessage(msg);
    this._setRequestLoading(false);
    //there will be no history save since there's nothing to save.
  },

  _requestObjectRestored: function(e) {
    if (e.detail.data) {
      let request = this.$.requestQueryModel.toLocalRequest();
      this.set('request', request);
    } else {
      StatusNotification.notify({
        message: 'Not found'
      });
    }
  }
});
