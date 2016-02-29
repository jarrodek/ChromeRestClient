'use strict';

/**
 * TODO: View informing that the user is not signed in to Chrome
 * TODO: Error message handling
 */
Polymer({
  is: 'drive-controller',
  behaviors: [
    Polymer.IronOverlayBehavior,
    Polymer.IronResizableBehavior,
    ArcBehaviors.ListControllerBehavior
  ],
  hostAttributes: {
    'role': 'dialog',
    'tabindex': '-1'
  },
  properties: {
    appAuthorized: Boolean,
    notSignedIn: Boolean,
    /**
     * Indicating that the component is working.
     */
    loading: {
      type: Boolean,
      value: false
    },
    queryParams: {
      type: Object
    },
    /**
     * File search term entered by the user.
     */
    query: String,
    authHeaders: Object,
    items: {
      type: Array,
      value: []
    },
    nextPageToken: String,
    /**
     * If true it will restore a request when the file data has been received automatically.
     * If till fire file-ready otherwise
     */
    restoreOnFile: {
      type: Boolean,
      value: false
    },
    /**
     * Drive file ID.
     */
    fileId: {
      type: String,
      notify: true
    }
  },

  // ready: function() {
  //   var i = 500;
  //   var res = [];
  //   var result = [];
  //   while (i--) {
  //     result.push({name: 'aaaaa ' + i, 'createdTime': i});
  //   }
  //   this.set('items', result);
  // },

  selectFile: function() {
    if (!this.appAuthorized) {
      this.$.userProvider.authorize(true)
      .then(() => {
        this.selectFile();
      })
      .catch(() => {
        console.error('Fix me pls.');
      });
    } else {
      //this.withBackdrop = true;
      this.open();
      if (!this.items || this.items.length === 0) {
        this.loadMoreData();
      }
    }
  },

  loadMoreData: function() {
    if (!this.opened || this.loading) {
      return;
    }
    this.set('loading', true);
    var q = `mimeType="application/restclient+data" and trashed = false`;
    if (this.query) {
      q += ` and name contains '${this.query}'`;
    }
    var params = {
      'q': q,
      'pageSize': 50,
      'fields': 'files(createdTime,iconLink,id,name),nextPageToken',
      'key': '592877543090-6tqu3mbhcbc3437cfj5f0ahjtui5tjac.apps.googleusercontent.com'
    };
    if (this.nextPageToken) {
      params.pageToken = this.nextPageToken;
    }
    this.queryParams = params;
    this.$.query.generateRequest();
  },

  handleListResponse: function() {
    var response = this.$.query.lastResponse;
    if ('files' in response) {
      this.set('items', this.items.concat(response.files));
      this.refit();
    }
    if ('nextPageToken' in response) {
      this.nextPageToken = response.nextPageToken;
    }
    this.set('loading', false);
  },

  handleListError: function(e) {
    console.log('handleListError', e);
    this.set('loading', false);
  },

  _onSearch: function() {
    this.debounce('query', function() {
      this._resetQuery();
    }, 300);
  },

  _resetQuery: function() {
    this.nextPageToken = null;
    this.items = [];
    this.loadMoreData();
  },

  _fileSelected: function(e) {
    this.set('loading', true);
    this.set('fileId', e.detail.selected.id);
    this.$.download.generateRequest();
  },

  _cancel: function() {
    this.close();
  },

  handleDownloadResponse: function() {
    var response = this.$.download.lastResponse;
    if (response.kind && response.requests) {
      response = response.requests[0];
    }
    let obj = arc.app.importer.normalizeRequest(response);
    obj.type = 'drive';
    obj.driveId = this.fileId;
    obj.isDrive = true;
    this.set('loading', false);
    this.close();
    if (this.restoreOnFile) {
      this.fire('restore-request', {
        request: obj
      });
    } else {
      this.fire('file-ready', {
        file: obj
      });
    }
  },

  handleDownloadError: function(e) {
    console.log('handleDownloadError', e);
    this.set('loading', false);
  },

  exportDrive: function(requestObject, fileName) {
    if (!this.appAuthorized) {
      return this.$.userProvider.authorize(true)
      .then(() => {
        return this._exportDrive(requestObject, fileName);
      })
      .catch(() => {
        console.error('Fix me pls.');
      });
    } else {
      return this._exportDrive(requestObject, fileName);
    }

  },

  _exportDrive: function(requestObject, fileName) {
    var exportObj = arc.app.importer.createExportObject({
      requests: [requestObject],
      projects: []
    });
    var payload = arc.app.drive.createInsertPayload(exportObj, fileName);
    var headers = Object.assign(this.authHeaders, {
      'Content-Type': 'multipart/related; boundary="' + boundary + '"'
    });
    this.$.upload.body = payload;
    this.$.upload.headers = headers;
    this.$.upload.generateRequest();
    return new Promise((resolve, reject) => {
      this._uploadPromise = {
        resolve: resolve,
        reject: reject
      };
    });
  },

  _handleInsertResponse: function(e) {
    if (this._uploadPromise.resolve) {
      this._uploadPromise.resolve(e.target.lastResponse);
    }
    delete this._uploadPromise;
  },

  _handleInsertError: function(e) {
    if (this._uploadPromise.reject) {
      this._uploadPromise.reject(e.target.lastResponse);
    }
    delete this._uploadPromise;
  }
});
