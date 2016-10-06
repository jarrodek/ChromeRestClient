(function() {
'use strict';
/* global ArcRequest, URI */
Polymer({
  is: 'arc-request-controller',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    /**
     * Toolbar features to ask for.
     */
    toolbarFeatures: {
      type: Array,
      value: ['clearAll', 'loader', 'save', 'projectEndpoints', 'xhrtoggle']
    },
    /**
     * Current request data.
     * It's a RequestLocalObject type.
     */
    request: {
      type: Object,
      notify: true,
      // observer: '_requestChanged'
    },
    /**
     * Route params passed from the router.
     */
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
    /**
     * Active request is an object returned from `socket-fetch` library.
     * It is a original Request object used to make a request containing all final
     * request data like headers ans payload.
     */
    activeRequest: {
      type: ArcRequest,
      notify: true,
      readOnly: true
    },
    /**
     * Set to true if the response is ready.
     */
    hasResponse: {
      type: Boolean,
      value: false,
      notify: true,
      computed: '_computeHasResponse(response)'
    },
    /**
     * There was an error during latest operation if set to true.
     */
    isError: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    /**
     * Relevan if `isError` is set to true.
     * Last error message to display.
     */
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
    },
    /**
     * A list that holds auth data used in current session.
     * When the user pass an authentication data to the request (as a reaction to 401 response)
     * the auth data are in this list for further use in the same session and apply them to
     * the request automatically.
     */
    authDataList: {
      type: Array,
      value: function() {
        return [];
      }
    },
    // Try when the view shout display a cookie exchange extension banner.
    showCookieBanner: {
      type: Boolean,
      value: false
    },
    // True if the proxy extension is installed.
    xhrConnected: Boolean
  },

  listeners: {
    'send': 'sendRequest',
    'abort': 'abortRequest',
    'save-file': '_saveToFile',
    'save-request': '_saveRequest'
  },

  observers: [
    '_requestNameChanged(request.name)',
    '_requestIdChanged(request.id)'
  ],

  onShow: function() {
    this._setPageTitle('Request');
    this._prepareRequest();
  },

  onHide: function() {
    this._setPageTitle('');
  },

  onClearAll: function() {
    this.oldRequest = this.request;
    this.oldHash = location.hash.substr(1);
    let base = new RequestLocalObject({
      url: '',
      method: 'GET'
    });
    this.set('request', base);
    this._setResponse(null);
    this._setUpProject(undefined);
    this._setPageTitle('Request');
    this._setIsError(false);
    this.showCookieBanner = false;
    page('/request/current');
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Clear all');
    this.$.clearRollback.open();
  },

  _undoClear: function() {
    if (this.oldRequest) {
      this.set('request', this.oldRequest);
    }
    if (this.oldHash) {
      page(this.oldHash);
    }
    this.$.clearRollback.close();
  },

  _clearUndoClear: function() {
    this.async(() => {
      this.oldRequest = undefined;
      this.oldHash = undefined;
    }, 1000);
  },

  onXhrtoggle: function(e) {
    if (!this.xhrConnected && e.target.checked) {
      e.target.checked = false;
      this.$.proxyDialog.open();
      return;
    }
    this.useXhr = e.target.checked;
    arc.app.analytics.sendEvent('Request', 'Use XHR', this.useXhr + '');
  },
  /**
   * Handler for save request click / shortcut.
   * Save UI will call `_saveRequest()` function.
   */
  onSave: function() {
    if (!this.request.url || !this.request.url.trim()) {
      StatusNotification.notify({
        message: 'Enter URL first.'
      });
      return;
    }

    var ui = document.body.querySelector('#saveRequestUi');
    if (!ui) {
      StatusNotification.notify({
        message: 'UI element not found'
      });
      return;
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
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Save action initialization');
  },

  /**
   * Sends current request.
   */
  sendRequest: function() {
    if (!this.request) {
      StatusNotification.notify({
        message: 'Request not ready'
      });
      return;
    }
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
    this.showCookieBanner = false;
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Request start');
    // Will help arrange methods bar according to importance of elements.
    arc.app.analytics.sendEvent('Request', 'Method', this.request.method);
  },

  abortRequest: function() {
    this._setRequestLoading(false);
    if (this.useXhr) {
      this.$.xhr.abort();
    } else {
      this.$.socket.abort();
    }

    arc.app.analytics.sendEvent('Engagement', 'Click', 'Request abort');
  },

  get requestControllerOpened() {
    return !!(this.opened && this.routeParams && this.routeParams.type);
  },

  onProjectEndpoints: function(enpointId) {
    if (this.request && String(this.request.id) === String(enpointId)) {
      return;
    }
    // this one is not going throught the router.
    arc.app.analytics.sendScreen('Request - project endpoint');
    this._restoreSaved(enpointId);
  },

  _prepareRequest: function() {
    if (!this.requestControllerOpened) {
      return;
    }
    this._setResponse(null);
    this._setProject(undefined);
    app.projectEndpoints = [];
    app.selectedRequest = null;

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
      case 'drive':
        let id = this.routeParams.driveId;
        let ctrl = document.body.querySelector('arc-drive-controller');
        if (!ctrl) {
          StatusNotification.notify({
            message: 'Drive controller not found.'
          });
          return;
        }
        // console.log('Opening drive', id);
        ctrl.openItemAsRequest(id);
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
        // console.info('Restored request', request);
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
      if (!project) {
        StatusNotification.notify({
          message: 'Project not found.'
        });
        return;
      }
      this._restoreSaved(project.requestIds[0]);
      this._setUpProject(project);
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
   * Set ups project data and propagate changes
   */
  _setUpProject: function(project) {
    this.async(() => {
      this._setProject(project);
      this._propagateProjectData();
    });
  },

  /**
   * Setup endpoinds in the UI.
   */
  _propagateProjectData: function() {
    var project = this.project;
    if (!project) {
      app.projectEndpoints = [];
      app.selectedRequest = null;
      return;
    }
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
    app.set('selectedRequest', this.request.id);
  },

  _requestIdChanged: function(id) {
    if (!id || !this.project) {
      return;
    }
    app.set('selectedRequest', id);
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

  // _requestChanged: function() {
  // console.log('_requestChanged', this.request);
  //this.request.name
  // },

  _requestNameChanged: function(name) {
    if (name) {
      this._setPageTitle(name);
    }
  },

  /**
   * Saves request and response in the history store.
   * Model will call `_requestObjectReady`
   */
  _saveHistory: function() {
    chrome.storage.sync.get({'HISTORY_ENABLED': true}, (r) => {
      if (r.HISTORY_ENABLED) {
        this.$.requestModel.getByMethodUrl(this.request.url, this.request.method);
      }
    });
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
  // Make a request.
  _callRequest: function() {
    // Copy the object so MagicVariables will not alter the view
    this._applyMagicVariables(Object.assign({}, this.request))
    .then((request) => this._applyCookies(request))
    .then((request) => this._applyAuthorization(request))
    .then((request) => this._filterHeaders(request))
    .then((request) => {
      // Make it async so errors will be handled by socket object.
      this.async(() => {
        if (this.auth) {
          request.auth = this.auth;
          this.auth = undefined;
        }
        if (this.useXhr) {
          this.$.xhr.request = request;
          this.$.xhr.run();
        } else {
          this.$.socket.request = request;
          this.$.socket.run();
        }
      });
    });
  },
  // If turned on - apply magic variables to the request.
  _applyMagicVariables: function(request) {
    return new Promise((resolve) => {
      chrome.storage.sync.get({'MAGICVARS_ENABLED': true}, (r) => {
        if (!r.MAGICVARS_ENABLED) {
          resolve(request);
          return;
        }
        this.$.magicVariables.clear();
        this.$.magicVariables.value = request.url;
        this.$.magicVariables.parse()
        .then((result) => {
          request.url = result;
          this.$.magicVariables.value = request.headers;
          return this.$.magicVariables.parse();
        })
        .then((result) => {
          request.headers = result;
          this.$.magicVariables.value = request.payload;
          return this.$.magicVariables.parse();
        })
        .then((result) => {
          request.payload = result;
          // console.log('Request with magic variables', request);
        })
        .catch((e) => {
          console.error('Magic variables apply', e);
        })
        .finally(() => {
          resolve(request);
        });
      });
    });
  },
  /**
   * Find and apply cookies to this request.
   */
  _applyCookies: function(request) {
    return this._applySessionCookies(request)
      .then((request) => this._applyCookiesExchange(request));
  },

  // Applies cookies from the proxy extension (from Chrome).
  _applyCookiesExchange: function(request) {
    if (!this.$.cookieExchange.connected) {
      return Promise.resolve(request);
    }
    this.$.cookieExchange.applyCookies(request);
    return Promise.resolve(request);
  },

  // Applies cookies from internall session management.
  _applySessionCookies: function(request) {
    return new Promise((resolve) => {
      chrome.storage.sync.get({'useCookieStorage': true}, (r) => {
        if (!r.useCookieStorage) {
          resolve(request);
          return;
        }

        this.$.cookieJar.getCookies()
        .then(() => {
          let cookie = this.$.cookieJar.cookie;
          if (!cookie) {
            resolve(request);
            return;
          }
          cookie = cookie.trim();
          if (!cookie) {
            resolve(request);
            return;
          }
          console.info('Cookies to send with the request: ', cookie);
          let headers = arc.app.headers.toJSON(request.headers);
          let found = false;
          headers.forEach((header) => {
            if (header.name.toLowerCase() === 'cookie') {
              found = true;
              header.value = header.value + '; ' + cookie;
            }
          });
          if (!found) {
            headers.push({
              name: 'cookie',
              value: cookie
            });
          }
          request.headers = arc.app.headers.toString(headers);
          resolve(request);
        })
        .catch((e) => {
          console.error('Unable to apply cookies to the request', e);
          resolve(request);
        });
      });
    });
  },

  _applyAuthorization: function(request) {
    var rl = this.authDataList;
    if (!rl || !rl.length) {
      return Promise.resolve(request);
    }
    return new Promise((resolve) => {
      let url = request.url.toLowerCase();
      let auth = null;
      for (var i = 0, len = rl.length; i < len; i++) {
        let cn = rl[i].url.toLowerCase();
        if (cn[cn.length - 1] === '/') {
          cn = cn.substr(0, cn.length - 1);
        }
        if (url.indexOf(cn) === 0) {
          auth = rl[i];
          break;
        }
      }

      if (!auth) {
        resolve(request);
        return;
      }

      switch (auth.type) {
        case 'ntlm':
          this._setNtlmAuthData(auth.uid, auth.passwd, auth.domain);
          resolve(request);
          return;
        case 'basic':
          if (!auth.encoded) {
            resolve(request);
            return;
          }
          let authData = atob(auth.encoded).split(':');
          let login = null;
          let passwd = null;
          if (authData[0]) {
            login = authData[0];
          }
          if (authData[1]) {
            passwd = authData[1];
          }
          if (!login || !passwd) {
            resolve(request);
            return;
          }
          this._setBasicAuthData(login, passwd);
          resolve(request);
          return;
      }

    });
  },

  /**
   * Filter headers that should not be passed to the transport.
   * See https://github.com/jarrodek/ChromeRestClient/issues/771
   *
   * @param {Object} request Current request
   * @return {[type]}
   */
  _filterHeaders: function(request) {
    return new Promise((resolve) => {
      let headers = arc.app.headers.toJSON(request.headers);
      if (!headers || !headers.length) {
        resolve(request);
        return;
      }
      let forbidden = ['host'];
      headers = headers.filter((item) => {
        let name = item.name;
        if (!name) {
          return false;
        }
        name = name.toLowerCase();
        return forbidden.indexOf(name) === -1;
      });
      request.headers = arc.app.headers.toString(headers);
      resolve(request);
    });
  },

  // Handler called the the socket report success
  _responseReady: function(e) {
    if (e.detail.auth) {
      switch (e.detail.auth.method) {
        case 'basic':
          this._openBasicAuthDialog();
          break;
        case 'digest':
          this.auth = e.detail.auth;
          this._openBasicAuthDialog();
          break;
        case 'ntlm':
          this._openNtlmAuthDialog();
          break;
      }
      this.showCookieBanner = true;
    }
    this._setRequestLoading(false);
    this._setResponse(e.detail.response);
    this._setActiveRequest(e.detail.request);
    this._saveHistory();
    this._saveCookies();
  },
  // Returns true when passed object is trully.
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
  // Handler for file save success.
  onFileSaved: function() {
    StatusNotification.notify({
      message: 'File saved'
    });
  },
  // Success handler for history object model.
  _historyUrlSaved: function() {
    console.info('History URL has been saved.');
  },
  // Error handler for history object model.
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
      let request2save = Object.assign({}, this.request);
      if (this.request.id) {
        delete request2save.id;
        delete request2save.driveId;
        request2save.type = 'history';
        request2save.order = 0;
        request2save.name = undefined;
      }
      request = this.$.requestModel.fromData(request2save, this.response);
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
  /** Called then transport not finished the request because of error. */
  _onRequestError: function(e) {
    var msg = e.detail.message;
    if (typeof msg !== 'string') {
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

  // Called when the user saves current request.
  _saveRequest: function(e) {
    var name = e.detail.name;
    var override = e.detail.override || false;
    var toDrive = e.detail.isDrive || false;
    // Check if current request object is a history object.
    // If yes, override it.
    var isHistory = this.request.id && !this.request.isSaved && !this.request.isDrive;
    if (isHistory) {
      override = true;
    }
    this.set('request.type', 'saved');
    if (toDrive) {
      this.set('request.isDrive', true);
    } else {
      this.set('request.isDrive', false);
      this.set('request.isSaved', true);
      this.set('request.driveId', undefined);
    }
    if (!override) {
      this.set('request.id', undefined);
      if (toDrive) {
        this.set('request.driveId', undefined);
      }
    }
    this.set('request.name', name);
    //always save to local store, origin is not important.
    this._saveLocal()
    .then((insertId) => {
      if (e.detail.isProject) {
        this.async(() => {
          this._saveProject(e.detail.projectName, insertId, e.detail.projectId);
        });
      } else {
        this._setUpProject(undefined);
      }
    });
    var saveType = [];
    if (override) {
      saveType.push('override');
    }
    if (toDrive) {
      saveType.push('drive');
    }
    if (e.detail.isProject) {
      saveType.push('project');
    }
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Save request');
    // weill help arrange UI according to importance of elements.
    arc.app.analytics.sendEvent('Request', 'Save type', saveType.join(','));
  },
  /**
   * Save/update project with the request.
   *
   * @param {String} name A name of the request. It's only relevant when creating new project.
   * @param {Number} requestId A request ID to be associated with the project.
   * @param {Number} projectId A project ID to update. It's only relevan when the project already
   * exists and should just insert new requestId to existing object.
   */
  _saveProject: function(name, requestId, projectId) {
    // update or create?
    if (projectId) {
      this.$.projects.objectId = Number(projectId);
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
   * A handler for project data save event.
   */
  _projectSavedHandler: function(e) {
    var project = e.detail.data;
    this._setUpProject(project);
  },

  /**
   * Save request data in local storage.
   */
  _saveLocal: function() {
    var current = this.request;
    // override existing item
    if (current.id) {
      this.$.requestModel.objectId = current.id;
      return this.$.requestModel.getObject()
      .then((result) => {
        if (!result) {
          StatusNotification.notify({
            message: 'Override object not found'
          });
          return Promise.reject('Object not found');
        }
        result.name = current.name;
        // this.set('request', current);
        result = this.$.requestModel.replaceData(result, current, this.response);
        result.type = current.type;
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
    // request.name = current.name;
    request.type = current.isDrive ? 'drive' : 'saved';
    // this will be propagated into the store after IDB save.
    // this.set('request.name', current.name);
    this.$.requestModel.requestType = request.type;
    this.$.requestModel.data = request;
    return this.$.requestModel.save()
    .then((insertId) => {
      if (insertId) {
        this.set('request.id', insertId);
      }
      if (request.type === 'drive') {
        // Go outside Dexie promise
        this.async(() => {
          this._saveDrive(request);
        });
      }
      return insertId;
    });
  },
  // Save object to Google Drive.
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
      arc.app.analytics.sendException(JSON.stringify(error), false);
    });
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Save request to Drive');
  },
  // Error handler for projects store.
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
      this._setUpProject(project);
    });
  },
  /**
   * This function mimics chrome basic auth dialog.
   * When the request return with 401 status and basic auth is required the app will open
   * auth dialog for basic authentication.
   *
   * Login data are stored locally in the app so it will be prefilled when calling the same URL
   * again.
   *
   * User can clear login and passwords in settings.
   */
  _openBasicAuthDialog: function() {
    this.$.basicAuthDialog.open();
    var uri = this._computeUrlPath(this.request.url);
    this.$.authDataModel.query(uri, 'basic')
    .then((data) => {
      if (data && data.length) {
        let auth = data[0];
        if (!auth) {
          return;
        }
        if (this.auth && this.method === 'digest') {
          if (!auth.uid || !auth.passwd) {
            return;
          }
          this.$.authDialogLogin.value = auth.uid;
          this.$.authDialogPassword.value = auth.passwd;
        } else {
          if (!auth.encoded) {
            return;
          }
          let authData = atob(auth.encoded).split(':');
          if (authData[0]) {
            this.$.authDialogLogin.value = authData[0];
          }
          if (authData[1]) {
            this.$.authDialogPassword.value = authData[1];
          }
        }
      }
    });
  },

  _openNtlmAuthDialog: function() {
    this.$.ntlmAuthDialog.open();
    var uri = this._computeUrlPath(this.request.url);
    this.$.authDataModel.query(uri, 'ntlm')
    .then((data) => {
      if (data && data.length) {
        let auth = data[0];
        if (!auth) {
          return;
        }
        this.$.ntlmAuthDialog.login = auth.uid;
        this.$.ntlmAuthDialog.password = auth.passwd;
        this.$.ntlmAuthDialog.domain = auth.domain;
      }
    });
  },

  /**
   * Toggle password visibility in basic auth dialog.
   * TODO: Auth dialog should be an element and it's functionality should be enclosed in it.
   */
  authTogglePassword: function(e) {
    var input = this.$.authDialogPassword;
    var icon = e.target;
    if (input.type === 'password') {
      input.type = 'text';
      icon.icon = 'visibility-off';
    } else {
      input.type = 'password';
      icon.icon = 'visibility';
    }
  },
  // A handler for closing basic auth dialog.
  _basicAuthDialogHandler: function(e) {
    var detail = e.detail;
    if (detail.canceled) {
      return;
    }
    if (detail.confirmed) {
      //append the auth header and send the request again.
      this._reRunWithBasic();
      // if (this.auth && this.auth.method === 'digest') {
      //   this._reRunWithDigest();
      // } else {
      //   this._reRunWithBasic();
      // }
    }
  },
  // Re-run current request with basic auth value from the auth dialog.
  _reRunWithBasic: function() {
    var login = this.$.authDialogLogin.value;
    var password = this.$.authDialogPassword.value;
    var encoded = this._setBasicAuthData(login, password);
    this.sendRequest();

    var uri = this._computeUrlPath(this.request.url);
    var authData = {
      'url': uri,
      'encoded': encoded,
      'type': 'basic'
    };

    this.$.authDataModel.data = authData;
    this.$.authDataModel.save()
    .catch((e) => {
      console.warn('Unable save auth basic data to the store', e);
    });
    this.authDataList.push(authData);
  },

  _setBasicAuthData: function(uid, passwd) {
    var enc = `${uid}:${passwd}`;
    var encoded = btoa(enc);
    var value = 'Basic ' + encoded;
    var headers = arc.app.headers.replace(this.request.headers, 'authorization', value);
    this.set('request.headers', headers);
    return encoded;
  },

  //TODO: create new model for storing digest login and passwords.
  _reRunWithDigest: function() {
    this.auth.uid = this.$.authDialogLogin.value;
    this.auth.passwd = this.$.authDialogPassword.value;
    this.sendRequest();

    var uri = this._computeUrlPath(this.request.url);
    var authData = {
      'url': uri,
      'uid': this.auth.uid,
      'passwd': this.auth.passwd,
      'type': 'digest'
    };
    this.$.authDataModel.data = authData;
    this.$.authDataModel.save()
    .catch((e) => {
      console.warn('Unable save auth basic data to the store', e);
    });
    this.authDataList.push(authData);
  },
  // Called when NTLM auth dialog closes.
  _ntlmAuthDataReady: function(e) {
    var d = e.detail;
    this._setNtlmAuthData(d.uid, d.passwd, d.domain);
    this.sendRequest();

    var uri = this._computeUrlPath(this.request.url);
    var authData = {
      'url': uri,
      'uid': d.uid,
      'passwd': d.passwd,
      'domain': d.domain,
      'type': 'ntlm'
    };
    this.$.authDataModel.data = authData;
    this.$.authDataModel.save()
    .catch((e) => {
      console.warn('Unable save auth basic data to the store', e);
    });
    this.authDataList.push(authData);
  },

  _setNtlmAuthData: function(uid, passwd, domain) {
    this.auth = {};
    this.auth.uid = uid;
    this.auth.passwd = passwd;
    this.auth.domain = domain;
    this.auth.method = 'ntlm';
  },

  // Returns url without query parameters and fragment part.
  _computeUrlPath: function(url) {
    return new URI(url).fragment('').search('').toString();
  },

  // Returns response view element.
  _getResponseView: function() {
    var children = Polymer.dom(this).getEffectiveChildNodes();
    children = children.filter((node) => node.nodeName === 'ARC-RESPONSE-VIEW');
    if (!children[0]) {
      // no response view
      return null;
    }
    return children[0];
  },

  _saveCookies: function() {
    // var responses = [];
    // if (this.response.redirects && this.response.redirects.length) {
    //   this.response.redirects.forEach((r) => {
    //     // let redirectHeaders = arc.app.headers.toJSON(r.headers);
    //     responses.push(r);
    //   });
    // }
    // responses.push(this.response);
    this.$.cookieJar.response = this.response;
    // debugger;
    this.$.cookieJar.store();
  }
});
})();
