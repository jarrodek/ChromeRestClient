(function() {
  'use strict';
  Polymer({
    is: 'request-panel',
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
      // Current request data.
      request: {
        type: Object,
        notify: true
      },
      /**
       * app-pouchdb-document initializes object with empty value and it
       * ovverides latest request in local store. So the documents must be kept in different
       * variable. Besides, other elements do not need to know the database parameters of this
       * object.
       */
      proxyRequest: Object,
      // A response object.
      response: {
        type: Object,
        notify: true,
        readOnly: true
      },
      // True if the response is ready.
      hasResponse: {
        type: Boolean,
        value: false,
        notify: true,
        computed: '_computeHasResponse(response)'
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
       * Active request is an object returned from `socket-fetch` library.
       * It is a original Request object used to make a request containing all final
       * request data like headers ans payload.
       */
      activeRequest: {
        type: Object,
        notify: true,
        readOnly: true
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
       * Route params passed from the router.
       */
      routeParams: Object,
      // Currently selected project.
      projectId: String,
      projectRelatedRequests: Array,
      // Current request ID. It's related to project's list. It can be changed from the outside.
      selectedRequest: String,
      /**
       * Endpoints related to current legacy project.
       */
      currentProjectEndpoints: Array,
      requestControllerOpened: {
        type: Boolean,
        value: false,
        computed: '_computeControllerOpened(opened, routeParams.type)'
      },
      // Either 'saved', 'history' or 'drive'
      requestType: String,
      // An id of restored saved request.
      savedId: String,
      // An id of restored history request.
      historyId: String,
      // An id of a request from the external source
      externalId: String,
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
      xhrConnected: Boolean,
      contentType: String,
      // Status mesage to pass to the request panel.
      statusMessage: String,
      exporeAssistantActive: Boolean,
      /**
       * Display menu as there is a toast in the bottom displayed.
       */
      withToast: {
        type: Boolean,
        reflectToAttribute: true
      },
      // Selected environment for variables.
      currentEnvironment: String,
      hasSelectedEnvironment: {
        type: Boolean,
        value: false,
        computed: '_computeEnvSelected(currentEnvironment)'
      },

      narrowLayout: {
        type: Boolean,
        reflectToAttribute: true
      },
      // An URL value for the assistant
      assistantUrl: {
        type: String,
        readOnly: true
      }
    },

    observers: [
      '_routeChanged(routeParams)',
      '_requestNameChanged(request.name)',
      '_projectEndpointsChanged(currentProjectEndpoints.*)',
      '_projectIdChanged(projectId)',
      '_requestIdChanged(request._id)',
      '_proxyRequestChanged(proxyRequest.*)',
      '_getRequestData(historyId)',
      '_getRequestData(savedId)',
      '_getRequestData(externalId)',
      '_exporeAssistantActiveChanged(exporeAssistantActive)',
      '_wholeRequestChanged(request)'
    ],

    listeners: {
      'send': 'sendRequest',
      'abort': 'abortRequest',
      'save-file': '_saveToFile',
      'save-request': '_onSaveRequest',
      'request-first-byte-received': '_requestStatusChanged',
      'request-load-end': '_requestStatusChanged',
      'request-headers-sent': '_requestStatusChanged',
      'is-payload-changed': '_isPayloadChanged'
    },

    attached: function() {
      // See <legacyproject-related-requests>
      this.listen(document, 'project-related-requests-read', '_onLegacyProjectRelatedRead');
      this.listen(document, 'request-object-changed', '_onRequestChangedDb');
      this.listen(window, 'variables-environment-changed', '_onVarsEnvChanged');
      this.listen(window, 'url-input-changed', '_urlInputChanged');
    },

    detached: function() {
      this.$.latest.auto = false;
      this.unlisten(document, 'project-related-requests-read', '_onLegacyProjectRelatedRead');
      this.unlisten(document, 'request-object-changed', '_onRequestChangedDb');
      this.unlisten(window, 'variables-environment-changed', '_onVarsEnvChanged');
      this.unlisten(window, 'url-input-changed', '_urlInputChanged');
    },

    onShow: function() {
      this._setPageTitle('Request');
      this._routeChanged();
    },

    onHide: function() {
      this._setPageTitle('');
    },

    onProjectEndpoints: function(e) {
      if (this.request && String(this.request.id) === String(e.detail)) {
        return;
      }
      // this one is not going throught the router.
      this.fire('send-analytics', {
        'type': 'screenview',
        'name': 'Request - project endpoint'
      });
      this.requestType = 'saved';
      this.set('savedId', e.detail);
    },

    _computeControllerOpened(opened) {
      if (!opened) {
        return false;
      }
      if (!this.routeParams || !this.routeParams.type) {
        return false;
      }
      return true;
    },

    _routeChanged: function() {
      if (!this.requestControllerOpened) {
        return;
      }
      this.reset();
      switch (this.routeParams.type) {
        case 'saved':
          this.requestType = this.routeParams.type;
          // decode and encode this because router is parsing it wong!
          this.set('savedId', decodeURIComponent(this.routeParams.savedId));
          break;
        case 'history':
          this.requestType = this.routeParams.type;
          this.set('historyId', decodeURIComponent(this.routeParams.historyId));
          break;
        case 'drive':
          // This is not really a request. It ment to open a drive item.
          // Drive data will be called via /current route.
          let id = this.routeParams.driveId;
          let ctrl = document.body.querySelector('arc-drive-controller');
          if (!ctrl) {
            StatusNotification.notify({
              message: 'Drive controller not found.'
            });
            return;
          }
          ctrl.openItemAsRequest(id);
          break;
        case 'project':
          this.requestType = 'saved';
          this.set('projectId', this.routeParams.projectid);
          break;
        case 'current':
          console.log('What to do???');
          break;
        default:
          this.restoreLatest();
          break;
      }
    },
    // Resets the panel.
    reset: function() {
      this._setResponse(null);
      this.set('projectId', undefined);
      this.set('savedId', null);
      this.set('historyId', null);
      this.set('externalId', null);
      this._setIsError(false);
      this.showCookieBanner = false;
    },

    _getRequestData: function(id) {
      if (!id) {
        return;
      }
      var type = this.requestType || 'saved';
      var dbName;
      switch (type) {
        case 'saved':
          dbName = 'saved-requests';
          break;
        case 'history':
          dbName = 'history-requests';
          break;
        case 'drive':
          dbName = 'saved-requests';
          break;
        default:
          this.fire('app-log', {
            'message': `${type} is not recognizable type of the request.`,
            'level': 'error'
          });
          console.error('Can\'t restore request data. Type is unknown.', type);
          this.fire('send-analytics', {
            type: 'exception',
            description: 'Can\'t restore request of a type: ' + type + ' (RequestPanel)',
            fatal: true
          });
          StatusNotification.notify({
            message: 'Enter URL first.'
          });
          return;
      }
      var db = new PouchDB(dbName);
      db.get(id)
      .then((r) => {
        r.type = type;
        this.set('proxyRequest', r);
      })
      .catch((e) => {
        this.fire('app-log', {
          'message': e,
          'level': 'error'
        });
        console.error('Can\'t restore request data', e);
        StatusNotification.notify({
          message: 'Request do not exists in local database.'
        });
      });
    },

    _saveRequest: function(dbName, data) {
      var db = new PouchDB(dbName);
      var p;
      if (!data._rev) {
        // avoid conflicts.
        p = db.get(data._id).then((r) => {
          data._rev = r._rev;
        })
        .catch((e) => {
          if (e.status === 404) {
            // object do not exists and can be created.
            return;
          }
          throw e;
        });
      } else {
        p = Promise.resolve();
      }
      return p.then(() => db.put(data))
      .then((r) => {
        return r;
      });
    },

    // Returns true when passed object is trully.
    _computeHasResponse: function(response) {
      return !!response;
    },

    _proxyRequestChanged: function() {
      var r = this.proxyRequest;
      // console.log('_proxyRequestChanged', r);
      if (!r || !r._id) {
        return;
      }
      var base = {
        type: r.type,
        headers: r.headers,
        legacyProject: r.legacyProject,
        method: r.method,
        name: r.name,
        payload: r.payload,
        url: r.url,
        _id: r._id
      };
      this.set('request', base);
    },

    // Restores latest request from local storage.
    restoreLatest: function() {
      this.$.latest.read();
    },
    // Handler for latest rectore call.
    _latestLoaded: function() {
      var obj = this.$.latest.value;
      if (!obj) {
        obj = {
          method: 'GET'
        };
      }
      if (obj.isDrive) {
        this.requestType = 'drive';
      } else if (obj.isSaved) {
        this.requestType = 'saved';
      } else {
        this.requestType = 'history';
      }
      this.set('request', obj);
    },
    // Sets a title if name has changed.
    _requestNameChanged: function(name) {
      if (!this.requestControllerOpened) {
        return;
      }
      if (name) {
        this._setPageTitle(name);
      }
    },
    // Informs other element that the request ID has changed.
    _requestIdChanged: function(id) {
      this.fire('selected-request', {
        id: id
      });
      if (!id) {
        return;
      }
      this.associateProject();
      // this.debounce('history-analyser', () => {
      //   this.$.historyAnalyser.url = this.request.url;
      //   this.$.historyAnalyser.method = this.request.method;
      // }, 500);
    },

    associateProject: function() {
      if (this.request.legacyProject && this.request.legacyProject !== this.projectId) {
        this.set('projectId', this.request.legacyProject);
      }
    },

    _projectEndpointsChanged: function() {
      if (this.request && this.request.legacyProject === this.projectId) {
        return;
      }
      if (this.currentProjectEndpoints && this.currentProjectEndpoints.length) {
        console.info('Setting project\'s first endpoint', this.currentProjectEndpoints[0]._id);
        this.requestType = 'saved';
        this.set('savedId', this.currentProjectEndpoints[0]._id);
      }
    },

    _projectIdChanged: function(id) {
      this.fire('selected-project', {
        id: id
      });
      if (!id) {
        return;
      }
      var event = this.fire('project-read', {
        id: id
      });
      if (event.detail.error) {
        console.error(event.detail.message);
        return;
      }
      event.detail.result.then((result) => {
        console.info('Setting project data', result);
        this.set('currentProjectData', result);
      })
      .catch((e) => {
        if (e.status === 404) {
          this.set('request.legacyProject', null);
          this.set('proxyRequest.legacyProject', null);
          this.set('projectId', undefined);
          this.fire('app-log', {
            'message': ['Project is not in database.', e],
            'level': 'warn'
          });
        } else {
          console.error('Unable restore project', e);
        }
      });
    },

    onXhrtoggle: function(e) {
      if (!this.xhrConnected && e.detail.target.checked) {
        e.detail.target.checked = false;
        this.$.proxyDialog.open();
        return;
      }
      this.useXhr = e.detail.target.checked;
      this.fire('send-analytics', {
        type: 'event',
        category: 'Request',
        action: 'Use XHR',
        label: this.useXhr + '',
      });
    },

    onClearAll: function() {
      this.oldRequest = this.request;
      this.oldHash = location.hash.substr(1);
      this.reset();

      let base = {
        url: '',
        method: 'GET',
        headers: '',
        payload: ''
      };
      this.set('request', base);
      this._setResponse(null);
      this._setPageTitle('Request');

      page('/request/current');
      this.fire('send-analytics', {
        type: 'event',
        category: 'Engagement',
        action: 'Click',
        label: 'Clear all',
      });
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

    /**
     * Handler for save request click / shortcut.
     * Save UI will call `_saveRequest()` function.
     */
    onSave: function(opts) {
      if (!this.request.url || !this.request.url.trim()) {
        StatusNotification.notify({
          message: 'Enter URL first.'
        });
        return;
      }

      var type = this.request.type;
      var isDrive;
      var isSaved;
      if (type) {
        isDrive = type === 'google-drive';
        isSaved = type === 'saved';
      } else {
        isDrive = !!this.externalId;
        isSaved = !!this.savedId;
      }
      if ((isDrive || isSaved) && opts.source === 'shortcut' && !opts.shift) {
        return this._saveCurrent();
      }

      var ui = this.$.saveRequestUi;
      ui.reset();
      ui.isDrive = isDrive;
      if (isSaved || isDrive) {
        if (this.request._id) {
          ui.isOverride = true;
        }
        ui.name = this.request.name;
      }
      if (this.projectId) {
        ui.isProject = true;
        ui.projectId = this.projectId;
      }
      ui.usePouchDb = true;
      ui.open();
      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Engagement',
        'action': 'Click',
        'label': 'Save action initialization'
      });
    },
    // Handler for save dialog close.
    _onSaveRequest: function(e) {
      var name = e.detail.name;
      var override = e.detail.override || false;
      var toDrive = e.detail.isDrive || false;
      var toProject = e.detail.isProject || false;
      var projectId = toProject ? e.detail.projectId : undefined;
      var newProjectName = toProject ? projectId ? undefined : e.detail.projectName : undefined;
      var isDrive = this.request.type === 'google-drive';
      var isSaved = !!this.savedId;
      if (toProject && !newProjectName && !projectId) {
        StatusNotification.notify({
          message: 'You must enter new project name or select one from the list. Aborting.'
        });
        return;
      }

      this.$.requestSaver.override = override;
      this.$.requestSaver.requestName = name;
      this.$.requestSaver.saveToDrive = toDrive;
      this.$.requestSaver.saveToProject = toProject;
      this.$.requestSaver.saveToProjectId = projectId;
      this.$.requestSaver.saveToProjectName = newProjectName;
      this.$.requestSaver.currentIsDrive = isDrive;
      this.$.requestSaver.currentIsSaved = isSaved;
      this.$.requestSaver.save();
    },

    _requestSavedHandler: function(e, detail) {
      e.stopPropagation();
      var r = detail.request;
      this.requestType = 'saved';
      this.set('savedId', r._id);
      this.set('historyId', undefined);
      if (r.legacyProject && r.legacyProject !== this.projectId) {
        this.set('projectId', r.legacyProject);
      } else if (!r.legacyProject && this.projectId) {
        this.set('projectId', undefined);
      }
      this.$.requestSavedToast.open();
      this.request = r;

      var saveType = [];
      if (detail.override) {
        saveType.push('override');
      }
      if (detail.toDrive) {
        saveType.push('drive');
      }
      if (detail.toProject) {
        saveType.push('project');
      }
      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Engagement',
        'action': 'Click',
        'label': 'Save request'
      });
      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Request',
        'action': 'Save type',
        'label': saveType.join(',')
      });
    },

    _requestSaveErrorHandler: function(e) {
      console.error('Save request error', e);
      this.fire('app-log', {
        'message': ['Unable to save the request.', e],
        'level': 'error'
      });
      StatusNotification.notify({
        message: 'Unable to save the request. ' + e.message
      });
    },

    /**
     * Shortcut for save current request without the UI dialog.
     * It's only called when the user restored saved request (also works with drive).
     *
     * To bring the save dialog user must press ctrl+shift+s / Shift-Command-S or click on the
     * ui icon.
     */
    _saveCurrent: function() {
      var type = this.request.type;
      var isDrive;
      var isSaved;
      if (type) {
        isDrive = type === 'google-drive';
        isSaved = type === 'saved';
      } else {
        isDrive = false;
        isSaved = !!this.savedId;
      }
      var data = Object.assign({}, this.proxyRequest, this.request);
      this.proxyRequest = data;

      this.$.requestSaver.override = true;
      this.$.requestSaver.saveToDrive = isDrive;
      this.$.requestSaver.saveToProject = !!data.legacyProject;
      this.$.requestSaver.saveToProjectId = data.legacyProject;
      this.$.requestSaver.saveToProjectName = undefined;
      this.$.requestSaver.currentIsDrive = isDrive;
      this.$.requestSaver.currentIsSaved = isSaved;
      this.$.requestSaver.save();

      //this.$.requestSavedFastToast.open();
    },
    /**
     * Sends current request.
     */
    sendRequest: function() {
      this.set('statusMessage', '');
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
      this.$.urlHistory.url = this.request.url; // Save URL history
      this._callRequest();
      this.showCookieBanner = false;
      // Deta below will be send to GA server as a custom data.
      // They will help arrange the UI according to importance of elements and usage.
      // method (6), hasHeaders (7), hasPayload (8), hasFiles (9), contentType (10)
      var cd = [{
        index: 6,
        value: this.request.method
      },{
        index: 7,
        value: this.request.headers ? 'Yes' : 'No'
      },{
        index: 8,
        value: this.request.payload ? 'Yes' : 'No'
      },{
        index: 9,
        value: (this.request.files && this.request.files.length) ? 'Yes' : 'No'
      }];
      if (this.contentType) {
        cd[cd.length] = {
          index: 10,
          value: this.contentType
        };
      }
      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Engagement',
        'action': 'Click',
        'label': 'Request start',
        'customDimensions': cd
      });
    },

    abortRequest: function() {
      this._setRequestLoading(false);
      if (this.useXhr) {
        this.$.xhr.abort();
      } else {
        this.$.socket.abort();
      }

      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Engagement',
        'action': 'Click',
        'label': 'Request abort'
      });
    },

    // Make a request.
    _callRequest: function() {
      // Copy the object so MagicVariables will not alter the view
      var request = Object.assign({}, this.request);
      var self = this;
      var executed = false;
      var run = function(request) {
        if (executed) {
          return;
        }
        executed = true;
        // Make it async so errors will be handled by socket object.
        self.async(() => {
          if (self.$.authSaver.auth) {
            request.auth = self.$.authSaver.auth;
            self.$.authSaver.auth = undefined;
          }
          if (self.useXhr) {
            self.$.xhr.request = request;
            self.$.xhr.run();
          } else {
            self.$.socket.request = request;
            self.$.socket.run();
          }
        });
      };
      // A failsafe if there's an issue with the DB. It will give 2.5s to execute queries
      // and if code below do not return in that time the request will be executed
      // without applying variables, cookies etc
      var timeout = window.setTimeout(function() {
        run(request);
      }, 2500);

      this._applyMagicVariables(request)
      .then((request) => this._applyCookies(request))
      .then((request) => this.$.authSaver.applyAuthorization(request))
      .then((request) => this._filterHeaders(request))
      .then((request) => this._cleanReqestToSend(request))
      .then((request) => {
        window.clearTimeout(timeout);
        run(request);
      });
    },

    _isPayloadChanged: function(e) {
      this.isPayload = e.detail.value;
    },

    _cleanReqestToSend: function(request) {
      if (typeof this.isPayload !== 'undefined' && !this.isPayload) {
        delete request.files;
        request.payload = '';
      }
      return request;
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
          this.$.magicVariables.environment = this.currentEnvironment || 'default';
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
            resolve(request);
          })
          .catch((e) => {
            this.fire('app-log', {
              'message': ['Magic variables', e],
              'level': 'error'
            });
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
      try {
        this.$.cookieExchange.applyCookies(request);
      } catch (e) {}
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
            this.fire('app-log', {
              'message': ['Cookies to send with the request:', cookie],
              'level': 'info'
            });
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
            this.fire('app-log', {
              'message': ['Unable to apply cookies to the request', e],
              'level': 'error'
            });
            resolve(request);
          });
        });
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

    // Returns url without query parameters and fragment part.
    _computeUrlPath: function(url) {
      return new URI(url).fragment('').search('').toString();
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

    // Handler called the the socket report success
    _responseReady: function(e) {
      if (e.detail.auth) {
        this.$.authSaver.processAuthResponse(e.detail.auth);
        this.showCookieBanner = true;
      }
      this._setRequestLoading(false);
      this._setResponse(e.detail.response);
      this._setActiveRequest(e.detail.request);
      this._saveHistory();
      this._saveCookies();
    },

    _resendAuthRequest: function() {
      this.sendRequest();
    },

    _saveHistory: function() {
      chrome.storage.sync.get({'HISTORY_ENABLED': true}, (r) => {
        if (r.HISTORY_ENABLED) {
          this.$.responseSaver.saveHistory(this.request, this.response)
          .catch((e) => {
            this.fire('app-log', {'message': ['Unable save history.', e], 'level': 'error'});
          });
        }
      });
    },

    _saveCookies: function() {
      this.$.cookieJar.response = this.response;
      this.$.cookieJar.store();
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
      this.set('statusMessage', 'Unsuccessful request');
      //there will be no history save since there's nothing to save.
    },

    _requestStatusChanged: function(e) {
      var msg = '';
      switch (e.type) {
        case 'request-headers-sent':
          msg = 'Headers sent (' + e.detail.bytesWritten + ' bytes). Waiting for data.';
          break;
        case 'request-first-byte-received':
          msg = 'Receiving data';
          break;
        case 'request-load-end':
          msg = '';
          break;
        default: return;
      }
      this.set('statusMessage', msg);
    },

    _onLegacyProjectRelatedRead: function(e) {
      if (e.detail.projectId !== this.projectId) {
        return;
      }
      this.set('currentProjectEndpoints', e.detail.items);
    },

    _onRequestChangedDb: function(e, detail) {
      if (detail.request._id !== this.request._id) {
        return;
      }
      this.set('request', detail.request);
    },

    _requestsStatsAnalysed: function() {
      if (!this.$.historyAnalyser.hasAnyData) {
        // force close assistant panel ?? or empty info screen?
        this.exporeAssistantActive = false;
        return;
      }
    },

    _onVarsEnvChanged: function(e) {
      this.set('currentEnvironment', e.detail.env);
    },

    _computeEnvSelected: function(currentEnvironment) {
      return !!currentEnvironment;
    },

    _exporeAssistantActiveChanged: function(exporeAssistantActive) {
      this.fire('send-analytics', {
        type: 'event',
        category: 'Request',
        action: 'Explore assistant activated',
        label: exporeAssistantActive + ''
      });
    },
    /**
     * Handler for the change event sent bu the url editor.
     * When the value change (not the input as a change to any character) it sets an URL for
     * the assistant so it can perform a search only if the URL is final.
     */
    _urlInputChanged: function(e) {
      this._setAssistantUrl(e.detail.url);
    },

    _wholeRequestChanged: function(request) {
      this._setAssistantUrl(request.url);
    }
  });
})();
