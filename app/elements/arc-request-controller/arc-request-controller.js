'use strict';

Polymer({
  is: 'arc-request-controller',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    toolbarFeatures: {
      type: Array,
      value: ['clearAll', 'loader', 'save', 'projectEndpoints']
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
    },
    isError: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    errorMessage: {
      type: String,
      readOnly: true
    },
    /**
     * If set, current request has asssociated project data.
     */
    project: {
      type: Object,
      readOnly: true
    }
  },

  listeners: {
    'send': 'sendRequest',
    'abort': 'abortRequest',
    'save-file': '_saveToFile',
    'save-request': '_saveRequest'
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
    this._setProject(undefined);
    app.projectEndpoints = [];
    app.selectedRequest = null;
    this._setPageTitle('Request');
    page('/request/current');
  },

  onSave: function() {
    var ui = document.body.querySelector('#saveRequestUi');
    if (!ui) {
      StatusNotification.notify({
        message: 'UI element not found'
      });
    }
    ui.reset();
    ui.isDrive = this.request.isDrive;
    if (this.request.isSaved || this.request.isDrive) {
      if (this.request.id) {
        ui.isOverride = true;
      }
      ui.name = this.request.name;
    }
    if (this.project) {
      ui.isProject = true;
      ui.projectId = this.project.id;
    }
    ui.open();
  },

  onProjectEndpoints: function(enpointId) {
    if (this.request && String(this.request.id) === String(enpointId)) {
      return;
    }
    this._restoreSaved(enpointId);
  },

  _prepareRequest: function() {
    if (!this.opened || !this.routeParams) {
      return;
    }
    this._setResponse(null);
    this._setProject(undefined);
    switch (this.routeParams.type) {
      case 'saved':
        this._restoreSaved(this.routeParams.savedId);
        break;
      case 'history':
        this._restoreSaved(this.routeParams.historyId);
        break;
      case 'project':
        this._restoreProject(this.routeParams.projectid);
        break;
      case 'current':
        this.$.requestQueryModel.data = this.request;
        let request = this.$.requestQueryModel.toLocalRequest(true);
        if ('driveId' in request) {
          if (request.driveId && !request.id) {
            this.$.requestModel.data = this.request;
            this.$.requestModel.save();
          }
        }
        this.set('request', request);
        break;
      default:
        this._restoreLatest();
        break;
    }
  },
  /**
   * A `_latestLoaded` function will be called when ready.
   */
  _restoreLatest: function() {
    this.$.latest.read();
  },
  /**
   * Restore saved request from the local storage.
   * The model will call `_requestObjectRestored` function when ready.
   */
  _restoreSaved: function(id) {
    id = parseInt(id);
    if (!id || id !== id) {
      StatusNotification.notify({
        message: 'Not found. Id is undefined.'
      });
      return;
    }
    this.$.requestQueryModel.objectId = id;
    this.$.requestQueryModel.getObject();
  },
  /**
   * Datastore has read restored request data.
   */
  _requestObjectRestored: function(e) {
    if (e.detail.data) {
      this.debounce('restore.request', function() {
        let request = this.$.requestQueryModel.toLocalRequest(this.routeParams.type === 'history');
        console.info('Restored request', request);
        /*TODO:70 There is some error here. Sometimes headers are not fully restored.
        Need to investigate.*/
        this.set('request', request);
        if (request.name) {
          this._setPageTitle(request.name);
        }
        if (this.routeParams && this.routeParams.type !== 'project') {
          this.associateProject();
        }
      }, 200);
    } else {
      StatusNotification.notify({
        message: 'Request data not found in a storage.'
      });
    }
  },

  _restoreProject: function(id) {
    id = parseInt(id);
    if (!id || id !== id) {
      StatusNotification.notify({
        message: 'Project not found. Id is undefined.'
      });
      return;
    }
    this.$.projects.objectId = id;
    this.$.projects.getObject()
    .then((project) => {
      this._setProject(project);
      this._restoreSaved(project.requestIds[0]);
      this.async(() => {
        this._propagateProjectData();
      });
    })
    .catch((cause) => {
      console.error('_restoreProject', cause);
      StatusNotification.notify({
        message: 'Project data not found in the datastore.'
      });
      return;
    });
  },
  /**
   * Setup endpoinds in the UI.
   */
  _propagateProjectData: function() {
    this.$.projectQueryModel.objectId = this.project.requestIds;
    this.$.projectQueryModel.query();
  },

  /**
   * TODO:210 this should not work this way.
   * Controllers should keep their data on their own and do not use global scope.
   */
  _projectEndpointsRestored: function(e) {
    /* global app */
    app.projectEndpoints = e.detail.data;
    app.selectedRequest = this.request.id;
  },

  _latestLoaded: function() {
    if (!this.$.latest.value) {
      let base = new RequestLocalObject({
        url: '',
        method: 'GET'
      });
      this.set('request', base);
    } else {
      if (this.routeParams && this.routeParams.type !== 'project') {
        this.associateProject();
      }
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
   * Model will call `_requestObjectReady`
   */
  _saveHistory: function() {
    if (this.request.id) {
      this.$.requestModel.objectId = this.request.id;
      this.$.requestModel.getObject();
    } else {
      this.$.requestModel.getByMethodUrl(this.request.url, this.request.method);
    }
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
      this.exportContent = JSON.stringify(this.exportContent);
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
   * This function is called only when updating history data in object.
   */
  _requestObjectReady: function(e) {
    var request = e.detail.data;
    if (!request) {
      request = this.$.requestModel.fromData(this.request, this.response);
      this.$.requestModel.requestType = 'history';
    } else {
      if (request instanceof Array) {
        request = request[0];
      }
      request.har = this.$.requestModel.appendHarResponse(request.har, this.request, this.response);
      this.$.requestModel.requestType = request.type;
    }
    this.$.requestModel.data = request;
    this.$.requestModel.save();
  },

  _onHistorySave: function(e) {
    var id = e.detail.data.id;
    this.set('request.id', id);
    switch (e.detail.data.type) {
      case 'saved':
        this.set('request.isSaved', true);
        break;
      case 'drive':
        this.set('request.isDrive', true);
        break;
      default:
        break;
    }
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

  _saveRequest: function(e) {
    var name = e.detail.name;
    var override = e.detail.override || false;
    var toDrive = e.detail.isDrive || this.request.isDrive;
    if (toDrive) {
      this.request.type = 'save';
      this.request.isDrive = true;
    }
    //always save to local store, origin is not important.
    this._saveLocal(toDrive, name, override)
    .then((insertId) => {
      if (e.detail.isProject) {
        this.async(() => {
          this._saveProject(e.detail.projectName, insertId, e.detail.projectId);
        });
      }
    });
  },
  /**
   * Save/update project with the request.
   * TODO:140 fire event to update projects list in the menu.
   *
   * @param {String} name A name of the request. It's only relevant when creating new project.
   * @param {Number} requestId A request ID to be associated with the project.
   * @param {Number} projectId A project ID to update. It's only relevan when the project already
   * exists and should just insert new requestId to existing object.
   */
  _saveProject: function(name, requestId, projectId) {
    // update or create?
    if (projectId) {
      this.$.projects.objectId = projectId;
      this.$.projects.query()
      .then((project) => {
        if (!project.requestIds) {
          project.requestIds = [];
        }
        project.requestIds.push(requestId);
        this.$.projects.save();
      })
      .catch(() => {
        StatusNotification.notify({
          message: 'Request was saved but not added to the project'
        });
      });
    } else {
      let project = new ProjectObject({
        name: name,
        requestIds: [requestId]
      });
      this.$.projects.data = project;
      this.$.projects.save();
    }
  },

  /**
   * Save request data in local storage.
   */
  _saveLocal: function(isDrive, name, override) {
    var current = this.request;
    // override existing item
    if (current.id && override) {
      this.$.requestModel.objectId = current.id;
      return this.$.requestModel.getObject()
      .then((result) => {
        if (!result) {
          StatusNotification.notify({
            message: 'Override object not found'
          });
          return Promise.reject('Object not found');
        }
        current.name = result.name = name;
        this.set('request', current);
        result = this.$.requestModel.replaceData(result, current, this.response);
        this.$.requestModel.requestType = current.type;
        this.$.requestModel.data = result;
        return this.$.requestModel.save()
        .then((insertId) => {
          if (result.type === 'drive') {
            // Go outside Dexie promise
            this.async(() => {
              this._saveDrive(result);
            });
          }
          return insertId;
        });
      });
    }
    // create new object
    let request = this.$.requestModel.fromData(current, this.response);
    request.name = name;
    request.type = isDrive ? 'drive' : 'saved';
    // this will be propagated into the store after IDB save.
    this.set('request.name', name);
    this.$.requestModel.requestType = request.type;
    this.$.requestModel.data = request;
    return this.$.requestModel.save()
    .then((insertId) => {
      if (request.type === 'drive') {
        // Go outside Dexie promise
        this.async(() => {
          this._saveDrive(request);
        });
      }
      return insertId;
    });
  },

  _saveDrive: function(request) {
    var ctrl = document.body.querySelector('arc-drive-controller');
    if (!ctrl) {
      console.warn('Drive controller not found!');
      return;
    }
    ctrl.exportDrive(request, request.name)
    .then((insertResult) => {
      var driveId = insertResult.id;
      this.set('request.driveId', driveId);
      request.driveId = driveId;
      this.$.requestModel.data = request;
      this.$.requestModel.save();
      StatusNotification.notify({
        message: 'File saved'
      });
    }).catch((error) => {
      console.error('Unable insert to Drive.', error);
      StatusNotification.notify({
        message: 'Unable upload file to Drive'
      });
    });
  },

  _projectSaveError: function() {
    StatusNotification.notify({
      message: 'Request was saved but not added to the project'
    });
  },
  /**
   * Associate project with current request.
   * If the request has been added to the project, this function will restore project information
   * and update the UI.
   */
  associateProject: function() {
    var requestId = this.request.id;
    if (!requestId) {
      return;
    }
    this.$.projects.getForRequest(requestId)
    .then((project) => {
      if (!project) {
        return;
      }
      this._setProject(project);
      this.async(() => {
        this._propagateProjectData();
      });
    });
  }
});
