'use strict';
/* global drive */
/**
 * TODO: View informing that the user is not signed in to Chrome
 * TODO: Error message handling
 */
Polymer({
  is: 'arc-drive-controller',
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
    /**
     * True if the app is authorized.
     */
    appAuthorized: Boolean,
    /**
     * True if the user is not signed in to the Chrome.
     * In this case use of identity API is not possible.
     */
    notSignedIn: Boolean,
    /**
     * Indicating that the component is working.
     */
    loading: {
      type: Boolean,
      value: false
    },
    /**
     * Query parameters to be set with a file query call.
     */
    queryParams: {
      type: Object
    },
    /**
     * File search term entered by the user.
     */
    query: String,
    /**
     * Auth headers set by <user-provider> element.
     */
    authHeaders: Object,
    /**
     * List of files retreived from Drive API.
     */
    items: {
      type: Array,
      value: []
    },
    /**
     * Used during pagination, returned from Drive API.
     */
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
     * Current drive file ID.
     */
    fileId: {
      type: String,
      notify: true
    },
    /**
     * View to display.
     * By default it will be files list view.
     */
    viewSelected: {
      type: Number,
      value: 0
    },
    /**
     * An error message from the API if any.
     */
    errorMessage: {
      type: String,
      readOnly: true
    }
  },
  listeners: {
    'restore-view': '_restoreDefaulView'
  },
  /**
   * Opens a Google Drive file picker.
   */
  selectFile: function() {
    this._setErrorMessage(null);
    this.viewSelected = 0;
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
  /**
   * Query the Drive API to download files list.
   * This function will only download files created aby the app (with app's contant type).
   */
  loadMoreData: function() {
    if (!this.opened || this.loading) {
      return;
    }
    this._setErrorMessage(null);
    this.viewSelected = 0;
    this.set('loading', true);
    var q = `mimeType="application/restclient+data" and trashed = false`;
    if (this.query) {
      q += ` and name contains '${this.query}'`;
    }
    var params = {
      'q': q,
      'pageSize': 50,
      'fields': 'files(capabilities/canEdit,createdTime,id,name,shared),nextPageToken',
      'orderBy': 'createdTime desc',
      'key': '592877543090-6tqu3mbhcbc3437cfj5f0ahjtui5tjac.apps.googleusercontent.com'
    };
    if (this.nextPageToken) {
      params.pageToken = this.nextPageToken;
    }
    this.queryParams = params;
    this.$.query.generateRequest();
  },
  /**
   * Handle AJAX call to the Drive api querying for files list.
   */
  _handleListResponse: function() {
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
  /**
   * Called when user accept search query.
   */
  _onSearch: function() {
    this.debounce('query', function() {
      this._resetQuery();
    }, 300);
  },
  /**
   * Reset current query data.
   */
  _resetQuery: function() {
    this.nextPageToken = null;
    this.items = [];
    this.loadMoreData();
  },
  /**
   * Handler when user select a file from file picker.
   */
  _fileSelected: function(e) {
    this.set('loading', true);
    this.set('fileId', e.detail.selected.id);
    this.$.download.generateRequest();
  },
  /**
   * Cancel current view and close the dialog.
   */
  _cancel: function() {
    this.close();
  },
  /**
   * Ajax call success handler for file download
   */
  _handleDownloadResponse: function() {
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
    delete obj.id;
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
  /**
   * Ajax call to Drive API error handler
   */
  _handleDriveApiError: function(e) {
    console.log('_handleDriveApiError', e);
    this.set('loading', false);
    var message = null;
    switch (e.detail.request.status) {
      case 400:
        /*
        User error. This can mean that a required field or parameter has not been provided,
        the value supplied is invalid, or the combination of provided fields is invalid.

        This error can be thrown when trying to add a duplicate parent to a Drive item. It can
        also be thrown when trying to add a parent that would create a cycle in the directory graph.
        */
        message = 'The app caused the error in request: ' +
          e.detail.request.xhr.response.error.errors[0].message;
        break;
      case 401:
        message = 'The access token is either expired or invalid';
        break;
      case 403:
        switch (e.detail.request.xhr.response.error.errors[0].reason) {
          case 'dailyLimitExceeded':
            message = 'API calls limit for the app has been reqached. Try again tomorrow.';
            break;
          case 'userRateLimitExceeded':
            message = 'You reached your requests limit for the app. Try again tomorrow.';
            break;
          case 'rateLimitExceeded':
            message = 'You reached your requests limit for Drive. Try again tomorrow.';
            break;
          case 'appNotAuthorizedToFile':
            //The requesting app is not on the ACL for the file. The user never explicitly opened
            //the file with this Drive app.
            this.viewSelected = 2;
            return;
          case 'dailyLimitExceeded':
            message = 'You do not have sufficient permissions for the file.';
            break;
          case 'domainPolicy':
            //The policy for the user's domain does not allow access to Google Drive by your app.
            message = 'The policy for your domain does not allow access to Google Drive ' +
              'by your app.';
            break;
        }
        break;
      case 404:
        message = 'File not found (404)';
        break;
      case 500:
        message = 'Backend error: an unexpected error occurred while processing the request.';
        break;
    }
    this._setErrorMessage(message);
    this.viewSelected = 1;
  },

  exportDrive: function(requestObject, fileName) {
    var driveId = null;
    if (requestObject.driveId) {
      driveId = requestObject.driveId;
      delete requestObject.driveId;
    }

    this._setErrorMessage(null);
    this.viewSelected = 0;
    var exportObj = arc.app.importer.createExportObject({
      requests: [requestObject],
      projects: []
    });
    if (driveId) {
      return drive.file.update(driveId, {
        resource: {},
        media: {
          mimeType: 'application/json',
          body: exportObj
        }
      })
      .catch((e) => {
        console.error('PATCH error', e);
      });
    }
    return drive.file.create({
      resource: {
        name: fileName + '.arc',
        description: 'Advanced REST client exported file.'
      },
      media: {
        mimeType: 'application/json',
        body: exportObj
      }
    });
  },
  /**
   * Click handler for "Back" action in error message view.
   */
  _restoreDefaulView: function() {
    this.viewSelected = 0;
    this._setErrorMessage(null);
  }
});
