'use strict';
window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * Behavior for common functions between saved and history controllers.
 *
 * @polymerBehavior
 */
ArcBehaviors.RequestsListControllerBehavior = {
  properties: {
    /**
     * Model's key to sort on.
     */
    sortBy: String,
    /**
     * Selected sort direction.
     * Can be either `acs` for natural order or `desc` for reversed order.
     */
    sortDirection: String,
    /**
     * True if the component is showning in the UI.
     *
     * @type Boolean
     */
    isShowing: {
      type: Boolean,
      value: false
    },

    toolbarFeatures: {
      type: Array,
      value: ['search', 'clearAll']
    }
  },
  onShow: function() {
    this._setTitle();
    this.searchQuery = '';
    this.isShowing = true;
    this.queryPage();
  },
  onHide: function() {
    this._setPageTitle('');
    this.searchQuery = '';
    this.isShowing = false;
    window.setTimeout(function() {
      this.resetQuery();
    }.bind(this), 250);
  },
  queryPage: function() {
    if (!this.isShowing) {
      return;
    }
    this._setQuerying(true);
    this.$.model.query();
  },

  _dataRead: function(e) {
    var list = e.detail.data;
    if (list) {
      list.forEach((item) => item.selected = false);
    }
    this.appendResults(list);
  },

  /** User requested to clear all entries. */
  _clearDataStore: function() {
    this.$.deleteModel.objectId = null;
    this.$.deleteModel.data = null;
    this.$.deleteModel.forceDeleteAll = true;
    this.$.deleteModel.remove();
  },
  /**
   * The user requested to export selected items.
   * List of selection is in e.detail.data.
   */
  _onExportRequested: function(e) {
    var items = e.detail.data;
    if (!items) {
      return;
    }
    this.exportContent = arc.app.importer.createExportObject({
      requests: items
    });
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-export.json';
    this.exportMime = 'json';
    this.exportData();
  },

  onFileSaved: function() {
    this.exportContent = null;
  },

  onFileError: function() {
    this.exportContent = null;
  },
  /**
   * The user requested to delete selected items.
   * List of selection is in e.detail.data.
   */
  _onDeleteRequested: function(e) {
    var items = e.detail.data;
    if (!items) {
      return;
    }
    this.removedCopy = Array.from(items);
    this.$.deleteModel.data = items;
    this.$.deleteModel.remove();
  },

  _selectedRemoveError: function(e) {
    this.removedCopy = null;
    console.error('_dbError', e);
    StatusNotification.notify({
      message: 'Unable remove data from storage.'
    });
    arc.app.analytics.sendException('DeleteSavedSelected::' + e.detail.message);
  },

  _selectedRemoved: function() {
    if (!this.removedCopy) {
      //removed all
      this.set('listData', []);
      this.$.model.data = null;
      this.resetQuery();
      this.queryPage();
      return;
    }
    this.removedCopy.forEach((item) => {
      for (var i = 0; i < this.listData.length; i++) {
        if (this.listData[i].id === item.id) {
          this.splice('listData', i, 1);
          break;
        }
      };
    });
    this.view.$.selector.clearSelection();
    StatusNotification.notify({
      message: 'Removed selected items.',
      timeout: StatusNotification.TIME_MEDIUM,
      actionName: 'Revert'
    }, function() {
      this._revertDeleted();
    }.bind(this));
  },
  _revertDeleted: function() {
    this.$.saveModel.data = this.removedCopy;
  },
  _requestSaved: function() {
    if (this.removedCopy) {
      var view = this.view;
      this.removedCopy.forEach((item) => {
        this.push('listData', item);
        view.$.selector.select(item);
      });
      view.$.requestList.render();
    }
    this.removedCopy = null;
  },

  _viewScrolling: function(e) {
    if (!this.isShowing) {
      return;
    }
    this.computeScroll(e.target.scroller);
  },

  _sortChanged: function(e) {
    if (!this.isShowing) {
      return;
    }
    this.sortBy = e.detail.sort;
    this.sortDirection = e.detail.dir;
    this.resetQuery();
    this.queryPage();
  },

  onClearAll: function() {
    if (this.view) {
      this.view.warnClearAll();
    }
  }
};
