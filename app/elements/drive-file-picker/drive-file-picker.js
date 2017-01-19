Polymer({
  is: 'drive-file-picker',
  /**
   * Fired when the file has been downloaded from the Google Drive and the content
   * has been read.
   *
   * @event drive-file-picker-data
   * @param {String} content Content of the downloaded file
   * @param {String} driveId Google Drive file ID.
   */
  properties: {
    // True if Google Drive operation pending
    loading: {
      type: Boolean,
      notify: true
    },
    /**
     * File search term entered by the user.
     */
    query: String,
    /**
     * List of files retreived from Drive API.
     */
    items: {
      type: Array,
      value: []
    },
    /**
     * An error message from the API if any.
     */
    errorMessage: {
      type: String
    },
    // Set to true to initialize the Drive query
    opened: {
      type: Boolean
    },
    /**
     * If set it will generate a query to Google Drive that contains
     * qurty to file properies.
     * E.g. (part of the query):
     * ```
     * and properties has { key='propertyKey' and value='propertyValue'}
     * ```
     *
     * Keys of this object wilol be put into the `key` part of query and value of the key to the
     * `value` property.
     * For example:
     * ```
     * queryProperties = {
     *   'isExport': true
     * }
     * ```
     */
    queryProperties: Object,
    /**
     * If true then it will use a negation for `queryProperties`
     */
    queryPropertiesNot: Boolean,
    /**
     * Mime type of the file to search.
     * By default it's internal ARC's mime type.
     */
    queryMimeType: {
      type: String,
      value: 'application/restclient+data'
    },
    /**
     * View to display.
     * By default it will be files list view.
     */
    _viewSelected: {
      type: Number,
      value: 0
    },
    /**
     * Query parameters to be set with a file query call.
     */
    _queryParams: Object,
    /**
     * Used when paginating over results, returned from Drive API.
     */
    _nextPageToken: String,
    /**
     * Current drive file ID.
     */
    _fileId: String,
    /**
     * True if the app is authorized.
     */
    _appAuthorized: Boolean,
    // True if user is not signed in to Chrome.
    _chromeSignedIn: Boolean
  },

  listeners: {
    'restore-view': 'reset',
    'cancel': 'reset'
  },

  observers: [
    '_openedChanged(opened)'
  ],

  reset: function() {
    this._viewSelected = 0;
    this.errorMessage = undefined;
    this.query = undefined;
    this.loading = false;
    this._queryParams = undefined;
    this._nextPageToken = undefined;
    this.items = [];
  },

  _openedChanged: function(opened) {
    if (opened) {
      this.selectFile();
    } else {
      this.reset();
    }
  },

  /**
   * Initializes file listing.
   */
  selectFile: function() {
    this.reset();
    if (!this._chromeSignedIn) {
      this._viewSelected = 3;
      return;
    }
    if (!this._appAuthorized) {
      this._viewSelected = 4;
      return;
    }
    this._viewSelected = 0;
    if (!this.items || !this.items.length) {
      this._queryFiles();
    }
  },

  /**
   * Query for the files on Google Drive.
   */
  _queryFiles: function() {
    if (this.loading || !this.opened) {
      return;
    }
    this.loading = true;
    var q = `mimeType="${this.queryMimeType}" `;
    q += 'and trashed = false';

    var qp = this.queryProperties;
    if (qp) {
      Object.keys(qp).forEach((key) => {
        let negation = this.queryPropertiesNot ? ' not' : '';
        q += ` and${negation} properties has {key='${key}' and value='${qp[key]}'}`;
      });
    }
    if (this.query) {
      q += ` and name contains '${this.query}'`;
    }
    var params = {
      'q': q,
      'pageSize': 50,
      'fields': 'files(capabilities/canEdit,createdTime,id,name,shared),nextPageToken',
      'orderBy': 'modifiedTime desc',
      'key': '592877543090-6tqu3mbhcbc3437cfj5f0ahjtui5tjac.apps.googleusercontent.com'
    };
    if (this.nextPageToken) {
      params.pageToken = this.nextPageToken;
    }
    this._queryParams = params;
    this.$.query.headers = {
      'Authorization': 'Bearer ' + this.$.chromeSigninAware.accessToken
    };
    this.$.query.generateRequest();
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
    this._nextPageToken = null;
    this.items = [];
    this._queryFiles();
  },

  /**
   * Handler for the Drive list response.
   */
  _onDriveListResponse: function() {
    var response = this.$.query.lastResponse;
    if (!this.items) {
      this.items = [];
    }
    if ('files' in response) {
      response.files.forEach((item) => {
        this.push('items', item);
      });
    }
    if ('nextPageToken' in response) {
      this._nextPageToken = response.nextPageToken;
    }
    this.loading = false;
  },

  /**
   * Ajax call to Drive API error handler
   */
  _handleDriveApiError: function(e) {
    this.loading = false;
    var message = null;
    switch (e.detail.request.status) {
      case 0:
        message = 'You are offline.';
        break;
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
        this._viewSelected = 4;
        return;
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
            this._viewSelected = 2;
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
    this.errorMessage = message;
    this._viewSelected = 1;
  },

  _signinHandler: function() {
    switch (this._viewSelected) {
      case 4:
        this.selectFile();
        break;
    }
  },

  _handleSignOut: function() {
    if (!this._chromeSignedIn) {
      this._viewSelected = 3;
    }
  },

  /**
   * Handler when user select a file from file picker.
   */
  _fileSelected: function(e) {
    this._downloadFile(e.detail.selected.id);
  },
  /**
   * Download and read a Google Drive item.
   *
   * @param {String} id An item ID. This will show an error if the file wasn't created by this app
   * (e.g. old version of the app).
   */
  _downloadFile: function(id) {
    if (!id) {
      this.fire('app-log', {'message': 'Trying to open Drive item without ID', 'level': 'warning'});
      return;
    }
    if (!this.opened) {
      return;
    }
    this.loading = true;
    this._fileId = id;
    this.$.download.headers = {
      'Authorization': 'Bearer ' + this.$.chromeSigninAware.accessToken
    };
    this.$.download.generateRequest();
  },

  /**
   * Ajax call success handler for file download.
   */
  _handleDownloadResponse: function() {
    var response = this.$.download.lastResponse;
    this.fire('drive-file-picker-data', {
      content: response,
      diveId: this._fileId
    });
    this.reset();
  }
});
