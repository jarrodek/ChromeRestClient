(function() {
  'use strict';
  Polymer({
    is: 'saved-panel',
    /**
     * Fired when the user clicked on export requests button.
     *
     * @event saved-panel-export-items
     * @property {Array} items Array of items to be deleted
     */
    /**
     * Fired when the user clicked on delete request/s button.
     *
     * @event saved-panel-delete-items
     * @property {Array} items Array of items to be deleted
     */
    /**
     * Fired when the user want to open a request.
     * @event saved-panel-open-item
     * @property {String} id The doc._id of the item.
     */
    properties: {
      // Read requests data.
      savedData: {
        type: Array,
        value: []
      },
      // current query options
      queryOptions: {
        type: Object,
        readOnly: true,
        value: function() {
          return {
            limit: 50,
            descending: true,
            // jscs:disable
            include_docs: true
            // jscs:enable
          };
        }
      },
      optionsState: {
        type: Number,
        value: 0
      },
      // Selected by the user elements on the lists
      currentSelection: {
        type: Array
      },
      detailedRequest: Object,
      narrowDrawer: {
        type: Boolean,
        value: true
      },
      hasSelection: {
        type: Boolean,
        compute: '_hasSelection(currentSelection.length)'
      },
      // If set the panel will show the results matched for given query.
      searchQuery: String,
      querying: {
        type: Boolean,
        readOnly: true,
        notify: true
      },

      isEmpty: {
        type: Boolean,
        value: false
      },
      opened: Boolean
    },

    observers: [
      '_observeSelection(hasSelection)',
      '_searchQueryChanged(searchQuery)',
      '_queryComplete(querying, savedData.length)',
      '_openedChanged(opened)'
    ],

    listeners: {
      'saved-list-item-name-changed': '_savedNameChangeRequested',
      'open-drive': '_openDrive'
    },

    behaviors: [
      ArcBehaviors.ArcFileExportBehavior,
      ArcBehaviors.DeleteRevertableBehavior
    ],

    attached: function() {
      this.listen(window, 'datastrores-destroyed', '_onDatabaseDestroy');
    },

    detached: function() {
      this.unlisten(window, 'datastrores-destroyed', '_onDatabaseDestroy');
    },

    _onDatabaseDestroy: function(e) {
      var databases = e.detail.datastores;
      if (!databases || !databases.length) {
        return;
      }
      if (databases.indexOf('saved-requests') === -1) {
        return;
      }
      var db = this._getDb();
      db.close().then(function() {
        console.log('The saved-requests database has been closed.');
      });
    },

    _openedChanged: function(opened) {
      if (opened) {
        this._searchQueryChanged('');
      } else {
        this.savedData = [];
        this.detailedRequest = undefined;
        this.currentSelection = undefined;
      }
    },

    _observeSelection: function(hasSelection) {
      if (hasSelection) {
        this.optionsState = 1;
      } else {
        this.optionsState = 0;
      }
    },

    _getDb: function() {
      return new PouchDB('saved-requests');
    },

    _searchQueryChanged: function(searchQuery) {
      delete this.queryOptions.startkey;
      delete this.queryOptions.skip;
      this.set('savedData', []);
      this.query(searchQuery);
    },

    // refreshes the state of the panel.
    refresh() {
      delete this.queryOptions.startkey;
      delete this.queryOptions.skip;
      this._setQuerying(true);
      this.set('savedData', []);
      this.loadNext();
    },

    query(q) {
      if (!q) {
        return this.refresh();
      }
      q = q.toLowerCase();
      if (q[0] === '_') {
        q = q.substr(1);
      }
      let encodedQ = encodeURIComponent(q);
      var db = this._getDb();
      this._setQuerying(true);
      db.allDocs()
      .then((r) => {
        let matches = r.rows.filter((i) => i.id.toLowerCase().indexOf(encodedQ) !== -1);
        if (!matches.length) {
          this._setQuerying(false);
          return;
        }
        var p = matches.map((i) => db.get(i.id));
        return Promise.all(p);
      })
      .then((r) => {
        this._setQuerying(false);
        if (!r) {
          return;
        }
        var ids = [];
        r.forEach((item) => {
          ids.push(item._id);
          this.push('savedData', item);
        });
        return this._fullSearch(q, ids)
        .then(() => {

          this.fire('results-page-loaded');
          this.fire('send-analytics', {
            type: 'event',
            category: 'Search',
            action: 'Query history',
            label: 'Saved panel'
          });

        });
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
      });
    },

    _fullSearch: function(q, ids) {
      this._setQuerying(true);

      var mm = Math.round(100 / q.split(/\s/).length);
      var db = this._getDb();
      return db.search({
        query: q,
        fields: ['headers', 'payload'],
        // jscs:disable
        include_docs: true,
        // jscs:enable
        mm: mm + '%'
      }).then((r) => {
        this._setQuerying(false);
        if (!r || !r.rows || !r.rows.length) {
          return;
        }
        if (ids && ids.length) {
          r.rows = r.rows.filter((i) => ids.indexOf(i.id) === -1);
        }
        if (!r.rows.length) {
          return;
        }
        r.rows.forEach((item) => {
          this.push('savedData', item.doc);
        });
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
        this.fire('results-page-error', {
          error: e
        });
      });
    },

    loadNext: function() {
      if (this.searchQuery) {
        return;
      }
      this.debounce('saved-load-page', this._loadPage, 200);
    },

    _loadPage: function() {
      if (this.searchQuery) {
        return;
      }
      var db = this._getDb();
      this._setQuerying(true);
      db.allDocs(this.queryOptions).then((response) => {
        if (response && response.rows.length > 0) {
          this.queryOptions.startkey =
            response.rows[response.rows.length - 1].key;
          this.queryOptions.skip = 1;
          let res = response.rows.map((i) => i.doc);
          res = this._processResults(res);
          res.forEach((item) => {
            this.push('savedData', item);
          });
        }
        this._setQuerying(false);
        this.fire('results-page-loaded');
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
        this.fire('results-page-error', {
          error: e
        });
      });
    },

    _processResults: function(res) {
      // sort by updated
      res.sort((a, b) => {
        if (!a.name || !b.name) {
          return 0;
        }
        return a.name.localeCompare(b.name);
      });
      res = res.filter((i) => i._id.indexOf('_design') !== 0);
      return res;
    },

    _selectionChanged: function(e) {
      var r = e.detail.item;
      if (e.detail.selected) {
        this.detailedRequest = r;
        this.narrowDrawer = false;
        this.$.details.openDrawer();
      } else {
        if (this.detailedRequest === r) {
          this.closeDetailsPanel();
          this.detailedRequest = null;
        }
      }
    },

    closeDetailsPanel: function() {
      this.narrowDrawer = true;
      this.$.details.closeDrawer();
    },

    _onOpenRequested: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var url = 'request/saved/' + encodeURIComponent(e.detail.item._id);
      page(url);
    },

    _hasSelection(length) {
      return !!length;
    },

    _onDeleteRequested: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.deleteItems([e.detail.item]);
    },

    _deleteSelected: function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!this.currentSelection ||
        !this.currentSelection.length) {
        this.$.noSelectionToast.open();
        return;
      }
      this.deleteItems(this.currentSelection);
    },

    _exportSelected: function() {
      if (!this.currentSelection ||
        !this.currentSelection.length) {
        this.$.noSelectionToast.open();
        return;
      }
      this.exportContent = arc.app.importer.createExportObject({
        requests: this.currentSelection,
        type: 'saved'
      });
      var date = new Date();
      var day = date.getDate();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-saved.json';
      this.exportMime = 'json';
      this.exportData();
      this.fire('send-analytics', {
        type: 'event',
        category: 'Data export',
        action: 'Selected saved as file',
        label: 'saved panel'
      });
    },

    deleteItems: function(items) {
      this._deleteRevertable('saved-requests', items)
      .then((res) => {
        let items = res.map((i) => i.id);
        this.fire('request-objects-deleted', {
          items: items,
          type: 'saved'
        });
        var data = this.savedData;
        data = data.filter((i) => items.indexOf(i._id) === -1);
        this.set('savedData', data);
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

    _onDocumentsRestored: function(response) {
      var docs = response.rows.map((i) => i.doc);
      var res = this.savedData.concat(docs);
      res = this._processResults(res);
      this.set('savedData', res);
      this.fire('request-objects-restored', {
        items: docs,
        type: 'saved'
      });
      this.fire('send-analytics', {
        type: 'event',
        category: 'Data delete',
        action: 'Restore deleted from toast',
        label: 'Saved panel'
      });
    },

    _computeOptionsTableClass: function(optionsState) {
      var clazz = 'table-options';
      clazz += (optionsState === 0 ? ' inactive' : '');
      return clazz;
    },

    _savedNameChangeRequested: function(e) {
      e.preventDefault();
      e.stopPropagation();

      let event = this.fire('request-name-changed', {
        type: 'saved-requests',
        name: e.detail.item.name,
        request: e.detail.item
      }, {
        cancelable: true
      });
      if (event.detail.error) {
        throw new Error(event.detail.message);
      }
      event.detail.result
      .then((request) => {
        this.savedData[e.detail.index] = request;
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

    warnClearAll: function() {
      this.$.dataClearDialog.opened = true;
    },

    onClearDialogResult: function(e, detail) {
      if (!detail.confirmed) {
        return;
      }
      var db = this._getDb();
      db.destroy()
      .catch((e) => {
        StatusNotification.notify({
          message: 'Error deleting database. ' + e.message
        });
        this.fire('app-log', {
          message: ['Error deleting database', e],
          level: e
        });
        console.error(e);
      })
      .then(() => {
        this.fire('request-objects-cleared', {
          type: 'saved'
        });
        this.refresh();
      });
    },

    _queryComplete: function(querying, length) {
      var state = false;
      if (!querying && !length) {
        state = true;
      }
      this.set('isEmpty', state);
    },

    _openDrive: function() {
      this.fire('open-drive-selector');
    }
  });
})();
