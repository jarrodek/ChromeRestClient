'use strict';

Polymer({
  is: 'arc-history-list-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.ListControllerBehavior,
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
  }
});
