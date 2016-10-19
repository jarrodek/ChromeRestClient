
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

  observers: [
    '_queryPagePouchDbChanged(queryPagePouchDb)'
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
  },

  _computePouchDbView: function(opened, usePouchDb) {
    return !!(opened && usePouchDb);
  },

  _computeLegacyView: function(opened, usePouchDb) {
    return !!(opened && !usePouchDb);
  },

  _onQueryingChanged: function(e, detail) {
    this._setQuerying(detail.value);
    this._queryingpdbinternall = detail.value;
    if (!detail.value) {
      this.set('queryPagePouchDb', false);
    }
  },

  _queryPagePouchDbChanged: function(queryPagePouchDb) {
    if (this._queryingpdbinternall === undefined) {
      return;
    }
    var panel = this.$$('history-panel');
    if (!panel) {
      return;
    }
    if (queryPagePouchDb) {
      if (this.searchQuery) {
        panel.searchQuery = this.searchQuery;
      } else {
        panel.searchQuery = undefined;
        panel.refresh();
      }
    } else {
      if (!panel.historyData.length) {
        this._setIsEmpty(true);
      } else {
        this._setIsEmpty(false);
      }
    }
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
    Promise.all(p).then(() => {
      var panel = this.$$('history-panel');
      panel.refresh();
    }).catch((e) => {
      StatusNotification.notify({
        message: 'Error deleting entries. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting entries', e],
        level: error
      });
      console.error(e);
    })
    .then(() => {
      db.close();
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
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Export selected history as file');
  },

  warnClearAll: function() {
    this.$.dataClearDialog.opened = true;
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
        level: error
      });
      console.error(e);
    });
  },

  _onItemOpenRequested: function(e, detail) {
    var url = 'request/history/' + encodeURIComponent(detail.id);
    page(url);
  }
});
