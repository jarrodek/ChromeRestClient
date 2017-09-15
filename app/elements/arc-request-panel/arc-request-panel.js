Polymer({
  is: 'arc-request-panel',

  properties: {
    /**
     * Current route params.
     */
    routeParams: Object,
    /**
     * Set by parent element to determine that this view is opened.
     */
    opened: Boolean,
    /**
     * Set by the `chrome-xhr-request` element. True if the proxy extension
     * is installed an connected to the application.
     */
    hasProxyInstalled: Boolean,
    /**
     * Current request object.
     */
    request: Object,
    /**
     * Keeps temp request data restored from the datastore / local store
     * to sync state between different stores and the UI.
     */
    proxyRequest: Object,
    /**
     * If set the panel will use the XHR proxy to send the request
     */
    useXhr: Boolean,
    // Currently selected project.
    projectId: String
  },

  listeners: {
    'transport-request': '_onTransportRequested'
  },

  observers: [
    '_routeChnaged(routeParams, opened)',
    '_openedChanged(opened)',
    '_proxyRequestChanged(proxyRequest.*)',
    '_requestChanged(request.*)',
    '_projectIdChanged(projectId)'
  ],

  _routeChnaged: function(route, opened) {
    if (!opened || !route || !route.type) {
      return;
    }
    switch (route.type) {
      case 'saved':
      case 'history':
        let id = decodeURIComponent(this.routeParams.savedId || this.routeParams.historyId);
        this._restoreRequestData(id, route.type);
        break;
      default:
        this.restoreLatest();
        break;
    }
  },

  _openedChanged: function(opened) {
    if (opened) {
      this._requestFeatures();
    } else {
      this._releaseFeatures();
    }
  },

  _requestFeatures: function() {
    this.fire('request-toolbar-features', {
      features: ['clearAll', 'save', 'xhrtoggle']
    }, {
      cancelable: true
    });
  },

  _releaseFeatures: function() {
    this.fire('release-toolbar-features', {}, {
      cancelable: true
    });
  },

  _onTransportRequested: function(e) {
    this.fire('url-history-store', {
      value: this.request.url
    }, {
      cancelable: true,
      composed: true
    });
    var panel;
    if (this.useXhr) {
      panel = this.$$('chrome-xhr-request');
    } else {
      panel = this.$$('chrome-socket-request');
    }
    panel.send(e.detail)
    .catch(cause => {
      console.error(cause);
    });
  },
  /**
   * Called when the user checked the "Use XHR" button in the toolbar.
   */
  onXhrtoggle: function(e) {
    var requested = e.detail.target.checked;
    if (!this.hasProxyInstalled && requested) {
      e.detail.target.checked = false;
      this.$$('install-proxy-dialog').opened = true;
      return;
    }
    this.useXhr = requested;
    this.fire('send-analytics', {
      type: 'event',
      category: 'Request',
      action: 'Use XHR',
      label: requested + '',
    });
  },
  /**
   * Called when the user click on the "clear all" button.
   */
  onClearAll: function() {
    this.set('request', {
      method: 'GET'
    });
    this._changeTitle('Request');
  },

  _changeTitle: function(title) {
    this.fire('page-title-changed', {
      title: title
    }, {
      cancelable: true
    });
  },
  /**
   * Restores saved in the datastore request data.
   * @param {String} id ID of the record
   * @param {String} type Type of the stored data. Can be `saved`, `history` or
   * `drive`
   */
  _restoreRequestData: function(id, type) {
    type = type || 'saved';
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
          'message': `${type} is not a type of a request.`,
          'level': 'error'
        });
        console.error('Can\'t restore request data. Type is unknown.', type);
        this.fire('send-analytics', {
          type: 'exception',
          description: 'Can\'t restore request of a type: ' + type + ' (ArcRequestPanel)',
          fatal: true
        });
        StatusNotification.notify({
          message: 'Can\'t restore request data. Type is unknown.'
        });
        return;
    }

    var db = new PouchDB(dbName);
    return db.get(id)
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
  /**
   * Sets the `request` object when a proxy change.
   */
  _proxyRequestChanged: function(record) {
    if (!record || !record.base) {
      return;
    }
    var data = record.base;
    var base = {
      _id: data._id,
      type: data.type,
      headers: data.headers,
      legacyProject: data.legacyProject,
      method: data.method,
      name: data.name,
      payload: data.payload,
      url: data.url
    };
    if (data.legacyProject !== this.projectId) {
      this.set('projectId', data.legacyProject);
    }
    this.set('request', base);
  },
  // Restores latest request from local storage.
  restoreLatest: function() {
    this.$.latest.read();
  },

  // Handler for latest rectore call.
  _latestLoaded: function(e) {
    var obj = e.detail.value;
    if (!obj) {
      obj = {
        method: 'GET'
      };
    }
    this.set('request', obj);
  },

  _requestChanged: function(record) {
    if (!record || !record.base) {
      return;
    }
    var request = record.base;
    if (Object.keys(request).length === 1 && request.method && request.method === 'GET') {
      // Default value.
      return;
    }
    this.debounce('request-store', function() {
      this.$.latest.store();
    }, 100);
  },

  onSave: function(opts) {
    if (!this.request.url || !this.request.url.trim()) {
      return;
    }
    var type = this.request.type;
    var isDrive;
    var isSaved;
    if (type) {
      isDrive = type === 'google-drive';
      isSaved = type === 'saved';
    } else {
      isDrive = !!this.routeParams.externalId;
      isSaved = !!this.routeParams.savedId;
    }
    if ((isDrive || isSaved) && opts.source === 'shortcut' && !opts.shift) {
      return this._saveCurrent();
    }

    var ui = this.$$('request-save-dialog');
    ui.noCancelOnOutsideClick = true;
    ui.isDrive = isDrive;
    if (isSaved || isDrive) {
      if (this.request._id) {
        ui.isSaved = true;
      }
      ui.name = this.request.name;
    }
    if (this.projectId) {
      ui.isProject = true;
      ui.projectId = this.projectId;
    }
    ui.opened = true;
    this.fire('send-analytics', {
      'type': 'event',
      'category': 'Engagement',
      'action': 'Click',
      'label': 'Save action initialization'
    });
  },

  _saveCurrent: function() {
    var opts = {
      isDrive: this.request.type === 'google-drive',
      projectId: this.projectId
    };
    this._dispatchSaveRequest(opts);
  },

  _saveRequestDialogHandler: function(e) {
    this._dispatchSaveRequest(e.detail);
  },

  _dispatchSaveRequest: function(opts) {
    var data = Object.assign({}, this.proxyRequest, this.request);
    if (opts.name) {
      data.name = opts.name;
    }
    if (opts.override === false || opts.type === 'history') {
      delete data._id;
      delete data._rev;
    }
    var detail = {
      request: data,
      opts: {
        drive: opts.isDrive ? true : false
      }
    };
    if (opts.isProject) {
      if (opts.projectIsNew) {
        detail.opts.projectName = opts.projectName;
      } else {
        detail.opts.projectId = opts.projectId;
      }
    }

    var event = this.fire('save-request-data', detail, {
      cancelable: true,
      composed: true
    });

    if (!event.defaultPrevented) {
      let message = 'Unable to save current request.\n';
      message += 'The "save-request-data" event is not handled.';
      console.error(message);
      this.fire('app-log', {
        'message': [message],
        'level': 'error'
      });
      this.$.errorToast.text = message;
      this.$.errorToast.opened = true;
      return;
    }

    return event.detail.result
    .then(request => {
      if (request.legacyProject && request.legacyProject !== this.projectId) {
        this.set('projectId', request.legacyProject);
      } else if (!request.legacyProject && this.projectId) {
        this.set('projectId', undefined);
      }
      this.proxyRequest = data;
      var id = request._id;
      try {
        id = encodeURIComponent(id);
      } catch (e) {}
      this.set('routeParams', {
        savedId: id,
        type: 'saved'
      });
    })
    .catch(cause => {
      console.error('Save request error', cause);
      this.fire('app-log', {
        'message': ['Unable to save the request.', cause],
        'level': 'error'
      });
      this.$.errorToast.text = 'Unable to save current request. ' + cause.message;
      this.$.errorToast.opened = true;
    });
  },

  _projectIdChanged: function(id) {
    this.fire('selected-project-changed', {
      value: id
    });
  }
});
