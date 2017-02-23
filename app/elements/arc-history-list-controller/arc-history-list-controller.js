
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
    },

    usePouchDb: Boolean
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
    this.fire('send-analytics', {
      type: 'exception',
      description: 'History-ctrl:' + e.message,
      fatal: false
    });
  },

  resetView: function() {
    var view = this.$$('arc-history-list-view');
    if (!view) {
      return;
    }
    view.closeDetailsPanel();
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

  _computePouchDbView: function(opened, usePouchDb) {
    return !!(opened && usePouchDb);
  },

  _computeLegacyView: function(opened, usePouchDb) {
    return !!(opened && !usePouchDb);
  },

  _onQueryingChanged: function(e, detail) {
    this._setQuerying(detail.value);
  },

  _getDb: function() {
    return new PouchDB('history-requests');
  },

  _onItemDeleteRequested: function(e) {
    if (!e.detail.items || !e.detail.items.length) {
      return;
    }
    var db = this._getDb();
    var p = e.detail.items.map((i) => db.remove(i));
    Promise.all(p)
    .then(() => {
      var panel = this.$$('history-panel');
      panel.refresh();
    })
    .catch((e) => {
      StatusNotification.notify({
        message: 'Error deleting entries. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting entries', e],
        level: e
      });
      console.error(e);
    });
  },

  _onItemExportRequested: function(e) {
    if (!e.detail.items || !e.detail.items.length) {
      return;
    }
    this.exportContent = arc.app.importer.createExportObject({
      requests: e.detail.items
    });
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-history.json';
    this.exportMime = 'json';
    this.exportData();
    this.fire('send-analytics', {
      type: 'event',
      category: 'Data export',
      action: 'selected history as file',
      label: 'History panel'
    });
  },

  _pouchDbQuery: function() {
    var p1 = this.$$('history-panel');
    p1.searchQuery = this.searchQuery;
  },

  warnClearAll: function() {
    if (this.usePouchDb) {
      this.warnClearAllPouchDb();
    } else {
      this.$.dataClearDialog.opened = true;
    }
  },

  warnClearAllPouchDb: function() {
    var panel = this.$$('history-panel');
    panel.warnClearAll();
  },

  onClearDialogResult: function(e, detail) {
    if (!detail.confirmed) {
      return;
    }
    var db = this._getDb();
    db.destroy().then(() => {
      this.async(() => {
        var panel = this.$$('history-panel');
        panel.refresh();
      }, 1);
      // this._setIsEmpty(true);
    })
    .catch((e) => {
      StatusNotification.notify({
        message: 'Error deleting database. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting database', e],
        level: e
      });
      console.error(e);
    });
  },

  _onItemOpenRequested: function(e, detail) {
    var url = 'request/history/' + encodeURIComponent(detail.id);
    page(url);
  }
});
