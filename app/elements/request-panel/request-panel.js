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
      statusMessage: String
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
      '_getRequestData(externalId)'
    ],

    listeners: {
      'send': 'sendRequest',
      'abort': 'abortRequest',
      'save-file': '_saveToFile',
      'save-request': '_onSaveRequest',
      'request-first-byte-received': '_requestStatusChanged',
      'request-load-end': '_requestStatusChanged',
      'request-headers-sent': '_requestStatusChanged'
    },

    attached: function() {
      // See <legacyproject-related-requests>
      this.listen(document, 'project-related-requests-read', '_onLegacyProjectRelatedRead');
      this.listen(document, 'request-object-changed', '_onRequestChangedDb');
    },

    detached: function() {
      this.$.latest.auto = false;
      this.unlisten(document, 'project-related-requests-read', '_onLegacyProjectRelatedRead');
      this.unlisten(document, 'request-object-changed', '_onRequestChangedDb');
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
          this.requestType = this.routeParams.type;
          this._restoreDrive(this.routeParams.driveId);
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
          dbName = 'external-requests';
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
      console.log('_proxyRequestChanged', r);
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
        } else {
          console.error('Unable restore project', e);
        }
      });
    },

    onXhrtoggle: function(e) {
      if (!this.xhrConnected && e.target.checked) {
        e.target.checked = false;
        this.$.proxyDialog.open();
        return;
      }
      this.useXhr = e.target.checked;
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
        isDrive = type === 'drive';
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
      var isDrive = !!this.externalId;
      var isSaved = !!this.savedId;
      if (toProject && !newProjectName && !projectId) {
        StatusNotification.notify({
          message: 'You must enter new project name or select one from the list. Aborting.'
        });
        return;
      }

      var data;
      if (override) {
        if (isSaved || isDrive) {
          data = Object.assign({}, this.proxyRequest, this.request);
        } else {
          data = Object.assign({}, this.request);
          if (data._id) {
            delete data._id;
          }
          if (data.driveId) {
            delete data.driveId;
          }
        }
      } else {
        data = Object.assign({}, this.request);
        if (data._id) {
          delete data._id;
        }
        if (data.driveId) {
          delete data.driveId;
        }
      }
      data.name = name;
      if (!data._id) {
        data._id = encodeURIComponent(data.name) + '/' + encodeURIComponent(data.url) + '/' +
          data.method;
        if (toProject) {
          data._id += '/' + (newProjectName ? encodeURIComponent(newProjectName) : projectId);
        }
      }

      var p;
      if (toProject) {
        if (newProjectName) {
          p = this._saveNewProject(newProjectName)
          .then((result) => {
            this.fire('project-saved');
            projectId = result._id;
            newProjectName = undefined;
            data.legacyProject = result.id;
          });
        } else {
          data.legacyProject = projectId;
          p = Promise.resolve();
        }
      } else {
        p = Promise.resolve();
      }

      p.then(() => {
        this.proxyRequest = data;
        if (toDrive) {
          return this._saveDrive(data, name).then((insertResult) => {
            var driveId = insertResult.id;
            if (driveId) {
              this.proxyRequest.driveId = driveId;
            }
            return this._saveRequest('external-requests', this.proxyRequest)
            .catch((e) => {
              if (e.status === 404) {
                // It wasn't in the external data, put it there.
                let copy = Object.assign({}, this.proxyRequest);
                delete copy._id;
                delete copy._rev;
                return this._saveRequest('external-requests', copy)
                .then(() => {
                  if (override) {
                    return this._saveRequest('saved-requests', copy);
                  }
                });
              } else {
                throw e;
              }
            });
          });
        } else {
          return this._saveRequest('saved-requests', this.proxyRequest);
        }
      })
      .then((res) => {
        this.requestType = toDrive ? 'drive' : 'saved';
        this.set('savedId', toDrive ? undefined : res.id);
        this.set('historyId', undefined);
        this.set('externalId', toDrive ? res.id : undefined);
        this.proxyRequest.rev = res.rev;
        if (toProject) {
          this.set('projectId', this.proxyRequest.legacyProject);
        }
      })
      .then(() => {
        var saveType = [];
        if (override) {
          saveType.push('override');
        }
        if (toDrive) {
          saveType.push('drive');
        }
        if (toProject) {
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
      })
      .catch((e) => {
        this.fire('app-log', {'message': ['Unable save data.', e], 'level': 'error'});
        StatusNotification.notify({
          message: 'Unable to save the file. ' + e.message
        });
      });
    },
    // Requested to save request in project
    _saveAsProject: function(opts) {
      var override = opts.override || false;

    },

    _saveDrive: function(request, name) {
      var ctrl = document.body.querySelector('arc-drive-controller');
      if (!ctrl) {
        //this.fire('app-log', {'message': ['Drive controller not found!'], 'level': 'error'});
        return Promise.reject(new Error('Drive controller not found!'));
      }
      return ctrl.exportDrive(request, name);
    },

    _saveNewProject: function(projectName) {
      if (!projectName) {
        return Promise.reject(new Error('Can not add new project without a name.'));
      }
      var t = Date.now();
      var _doc = {
        _id: this.$.uuid.generate(),
        created: t,
        updated: t,
        order: 0,
        name: projectName
      };
      var e = this.fire('arc-database-insert', {
        store: 'legacy-projects',
        docs: _doc
      });
      if (!e.detail.result) {
        return Promise.reject(new Error('Database is missing.'));
      }
      return e.detail.result;
    },

    _readRequestData: function() {

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
        isDrive = type === 'drive';
        isSaved = type === 'saved';
      } else {
        isDrive = !!this.externalId;
        isSaved = !!this.savedId;
      }
      var data = Object.assign({}, this.proxyRequest, this.request);
      this.proxyRequest = data;
      var p;
      if (isSaved) {
        // this.$.savedRequest.data = this.proxyRequest;
        // p = this.$.savedRequest.save();
        p = this._saveRequest('saved-requests', this.proxyRequest);
      } else if (isDrive) {
        p = this._saveDrive(data, data.name).then((insertResult) => {
          var driveId = insertResult.id;
          if (driveId) {
            this.proxyRequest.driveId = driveId;
          }
          // this.$.extRequest.data = this.proxyRequest;
          // return this.$.extRequest.save();
          return this._saveRequest('external-requests', this.proxyRequest);
        });
      } else {
        p = Promise.reject(new Error('Called quick save but it\'s not restored request'));
      }
      p.then((r) => {
        this.proxyRequest._rev = r.rev;
        this.$.requestSavedToast.open();
      })
      .catch((e) => {
        this.fire('app-log', {
          'message': ['Magic variables', e],
          'level': 'error'
        });
      });
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
      var cm = [{
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
        cm[cm.length] = {
          index: 10,
          value: this.contentType
        };
      }
      this.fire('send-analytics', {
        'type': 'event',
        'category': 'Engagement',
        'action': 'Click',
        'label': 'Request start',
        'customDimensions': cm
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
      this._applyMagicVariables(Object.assign({}, this.request))
      .then((request) => this._applyCookies(request))
      .then((request) => this.$.authSaver.applyAuthorization(request))
      .then((request) => this._filterHeaders(request))
      .then((request) => {
        // Make it async so errors will be handled by socket object.
        this.async(() => {
          if (this.$.authSaver.auth) {
            request.auth = this.$.authSaver.auth;
            this.$.authSaver.auth = undefined;
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
          })
          .catch((e) => {
            this.fire('app-log', {
              'message': ['Magic variables', e],
              'level': 'error'
            });
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
    }
  });
})();
