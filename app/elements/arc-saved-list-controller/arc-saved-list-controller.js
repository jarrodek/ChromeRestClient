(function() {
'use strict';

Polymer({
  is: 'arc-saved-list-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.RequestsListControllerBehavior
  ],
  get view() {
    return Polymer.dom(this.root).querySelector('arc-saved-list-view');
  },
  _setTitle: function() {
    this._setPageTitle('Saved');
  },
  /**
   * Request name has changed by the user in a view.
   * After setting up new data the model will store data automatically.
   */
  _requestNameChanged: function(e) {
    var item = e.detail.item;
    this.$.saveModel.data = item;
    arc.app.analytics.sendEvent('Saved view', 'Update', 'Request name');
  },
  /**
   * Generic function to be called on database error.
   */
  _dbError: function(e) {
    this.fire('app-log', {
      'message': ['Database error', e],
      'level': 'info'
    });
    arc.app.analytics.sendException('Saved-ctrl::' + JSON.stringify(e));
  },

  resetView: function() {
    var view = this.$$('arc-saved-list-view');
    if (!view) {
      this.fire('app-log', {
        'message': ['Saved view not present'],
        'level': 'warn'
      });
      return;
    }
    view.closeDetailsPanel();
  }
});
})();
