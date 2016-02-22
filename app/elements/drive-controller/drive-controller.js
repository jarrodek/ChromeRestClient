Polymer({
  is: 'drive-controller',
  behaviors: [
    Polymer.IronOverlayBehavior,
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
    authHeaders: Object,
    items: {
      type: Array,
      value: []
    },
    nextPageToken: String
  },

  selectFile: function() {
    if (!this.appAuthorized) {
      this.$.userProvider.authorize(true)
      .then((authToken) => {
        this.selectFile();
      })
      .catch(() => {
        console.error('Fix me pls.');
      });
    } else {
      this.withBackdrop = true;
      this.open();
      this.loadMoreData();
    }
  },

  loadMoreData: function() {
    if (!this.opened) {
      return;
    }
    //mimeType="application/restclient+data" and 
    var q = `trashed = false`;
    if (this.query) {
      q += ` and title contains '${this.query}'`;
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

  handleListResponse: function(e) {
    var response = this.$.query.lastResponse;
    if ('files' in response) {
      this.items = this.items.concat(response.files);
    }
    if ('nextPageToken' in response) {
      this.nextPageToken = response.nextPageToken;
    }
  },
  handleListError: function(e) {
    console.log('handleListError', e);
  }
});
