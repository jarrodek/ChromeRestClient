
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
    console.error('_dbError', e);
    arc.app.analytics.sendException('History-ctrl::' + JSON.stringify(e));
  },

  resetView: function() {
    var view = this.$$('arc-history-list-view');
    view.closeDetailsPanel();
  }
});
