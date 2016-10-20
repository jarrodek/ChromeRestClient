(function() {
'use strict';

Polymer({
  is: 'arc-saved-list-controller',

  properties: {
    usePouchDb: Boolean,
    requestTypeTab: {
      type: Number,
      value: 0
    },

    toolbarFeatures: {
      type: Array,
      value: ['search', 'clearAll', 'export', 'drive']
    },
  },

  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.RequestsListControllerBehavior
  ],

  observers: [
    '_openedChanged(opened,usePouchDb)'
  ],

  listeners: {
    'open-drive': 'onDrive'
  },

  /**
   * Resets current query and perform a new query with new criteria.
   */
  onSearch: function() {
    if (this.usePouchDb) {
      return this._pouchDbQuery();
    }
    this.resetQuery();
    this._setIsSearch(true);
    this.queryPage();
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
  },

  _computePouchDbView: function(opened, usePouchDb) {
    return !!(opened && usePouchDb);
  },

  _computeLegacyView: function(opened, usePouchDb) {
    return !!(opened && !usePouchDb);
  },

  _onQueryingChanged: function(e, detail) {
    this._setQuerying(detail.value);
    this._setIsEmpty(false);
  },

  warnClearAll: function() {
    var panel = this.$$(this.requestTypeTab === 0 ? 'saved-panel' : 'saved-drive-panel');
    panel.warnClearAll();
  },

  _openedChanged: function(opened, usePouchDb) {
    if (!usePouchDb) {
      return;
    }
    var p1 = this.$$('saved-panel');
    var p2 = this.$$('saved-drive-panel');
    if (!opened) {
      if (p1) {
        p1.savedData = [];
      }
      if (p2) {
        p2.driveData = [];
      }
    } else {
      if (p1) {
        p1.refresh();
      }
      if (p2) {
        p2.refresh();
      }
    }
  },

  _pouchDbQuery: function() {
    var p1 = this.$$('saved-panel');
    var p2 = this.$$('saved-drive-panel');
    p1.searchQuery = this.searchQuery;
    p2.searchQuery = this.searchQuery;
  },

  onDrive: function() {
    let ctrl = document.body.querySelector('arc-drive-controller');
    if (!ctrl) {
      StatusNotification.notify({
        message: 'Drive controller not found.'
      });
      return;
    }
    ctrl.selectFile();
  }
});
})();
