(function() {
  'use strict';
  Polymer({
    is: 'saved-drive-panel',
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
      driveData: {
        type: Array,
        value: function() {
          return [];
        }
      },
      // current query options
      queryOptions: {
        type: Object,
        readOnly: true,
        value: function() {
          return {
            limit: 15,
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
      isEmpty: Boolean
    },

    behaviors: [
      ArcBehaviors.ArcFileExportBehavior,
      ArcBehaviors.DeleteRevertableBehavior
    ],

    observers: [
      '_observeSelection(hasSelection)',
      '_searchQueryChanged(searchQuery)',
      '_queryComplete(querying,driveData.length)'
    ],

    listeners: {
      'saved-list-item-name-changed': '_savedNameChangeRequested'
    },

    _observeSelection: function(hasSelection) {
      if (hasSelection) {
        this.optionsState = 1;
      } else {
        this.optionsState = 0;
      }
    },

    _getDb: function() {
      return new PouchDB('external-requests');
    },

    _searchQueryChanged: function(searchQuery) {
      delete this.queryOptions.startkey;
      delete this.queryOptions.skip;
      this.set('driveData', []);
      this.query(searchQuery);
    },

    // refreshes the state of the panel.
    refresh() {
      delete this.queryOptions.startkey;
      delete this.queryOptions.skip;
      this.set('driveData', []);
      this.loadNext();
    },

    query(q) {
      if (!q) {
        return this.refresh();
      }
      let encodedQ = encodeURIComponent(q.toLowerCase());
      var db = this._getDb();
      this._setQuerying(true);
      db.allDocs().then((r) => {
        let matches = r.rows.filter((i) => i.id.indexOf(encodedQ) !== -1);
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
          this.push('driveData', item);
        });
        return ids;
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
      })
      .then((ids) => {
        db.close();
        this._fullSearch(q, ids);
      });
    },

    _fullSearch: function(q, ids) {
      this._setQuerying(true);

      var mm = Math.round(100 / q.split(/\s/).length);
      var db = this._getDb();
      db.search({
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
          this.push('driveData', item.doc);
        });
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
      })
      .then(() => {
        db.close();
      });
    },

    loadNext: function() {
      if (this.searchQuery) {
        return;
      }
      this.debounce('saved-drive-load-page', this._loadPage, 200);
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
            this.push('driveData', item);
          });
        }
        this._setQuerying(false);
      })
      .catch((e) => {
        this._setQuerying(false);
        this.fire('app-log', {
          message: ['Query saved', e],
          level: 'error'
        });
        console.error('Query saved', e);
      })
      .then(() => {
        db.close();
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
      var url = 'request/drive/' + encodeURIComponent(e.detail.item._id);
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
      this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-saved-drive.json';
      this.exportMime = 'json';
      this.exportData();
      arc.app.analytics.sendEvent('Engagement', 'Click', 'Export selected saved drive as file');
    },

    deleteItems: function(items) {
      this._deleteRevertable('external-requests', items)
      .then((res) => {
        let items = res.map((i) => i.id);
        this.fire('request-objects-deleted', {
          items: items,
          type: 'external'
        });
        var data = this.driveData;
        data = data.filter((i) => items.indexOf(i._id) === -1);
        this.set('driveData', data);
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
      var res = this.driveData.concat(docs);
      res = this._processResults(res);
      this.set('driveData', res);
      this.fire('request-objects-restored', {
        items: docs,
        type: 'external'
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
      throw 'USE MODEL!!!!!!!!!';
      var db = this._getDb();
      db.put(e.detail.item).then((r) => {
        e.detail.item._id = r.id;
        e.detail.item._rev = r.rev;
        this.driveData[e.detail.index] = e.detail.item;
        this.fire('request-object-changed', {
          value: e.detail.item,
          type: 'external',
          rev: r.rev,
          id: r.id
        });
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
      })
      .then(() => {
        db.close();
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
      this.fire('open-drive');
    }
  });
})();
