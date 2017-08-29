(function() {
'use strict';

Polymer({
  is: 'arc-saved-list-controller',

  properties: {
    toolbarFeatures: {
      type: Array,
      value: ['search', 'clearAll', 'export']
    },
  },

  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.RequestsListControllerBehavior
  ],

  /**
   * Resets current query and perform a new query with new criteria.
   */
  onSearch: function() {
    var p1 = this.$$('saved-panel');
    p1.searchQuery = this.searchQuery;
  },

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
    this.fire('send-analytics', {
      type: 'event',
      category: 'Saved view',
      action: 'Update',
      label: 'Request name'
    });
  },
  /**
   * Generic function to be called on database error.
   */
  _dbError: function(e) {
    this.fire('app-log', {
      'message': ['Database error', e],
      'level': 'info'
    });
    this.fire('send-analytics', {
      type: 'exception',
      description: e.message,
      fatal: false
    });
  },

  resetView: function() {
    var view = this.$$('arc-saved-list-view');
    if (!view) {
      return;
    }
    view.closeDetailsPanel();
  },

  _onQueryingChanged: function(e, detail) {
    this._setQuerying(detail.value);
    this._setIsEmpty(false);
  },

  warnClearAll: function() {
    var panel = this.$$('saved-panel');
    panel.warnClearAll();
  }
});
})();
