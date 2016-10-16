
Polymer({
  is: 'arc-history-list-controller',

  properties: {
    sortBy: {
      type: String,
      value: 'har.pages.-1.startedDateTime',
      notify: true
    },
    sortDirection: {
      type: String,
      value: 'desc',
      notify: true
    },
    isHistory: {
      type: Boolean,
      value: true
    }
  },

  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.RequestsListControllerBehavior
  ],
  get view() {
    return Polymer.dom(this.root).querySelector('arc-history-list-view');
  },
  _setTitle: function() {
    this._setPageTitle('History');
  },
  /**
   * Generic function to be called on database error.
   */
  _dbError: function(e) {
    this.fire('app-log', {'message': e, 'level': 'error'});
    arc.app.analytics.sendException('History-ctrl::' + JSON.stringify(e));
  },

  resetView: function() {
    var view = this.$$('arc-history-list-view');
    if (!view) {
      this.fire('app-log', {'message': 'History view not present!', 'level': 'warning'});
      return;
    }
    view.closeDetailsPanel();
  }
});
