(function() {
  'use strict';

  Polymer({
    is: 'arc-saved-list-controller',
    behaviors: [
      ArcBehaviors.ArcControllerBehavior,
      ArcBehaviors.ArcFileExportBehavior
    ],
    properties: {
      /**
       * List of requests
       */
      requests: Array,
      /**
       * If the view has requests
       */
      hasRequests: {
        type: Boolean,
        value: false,
        computed: '_computeHasRequests(requests)'
      }
    },
    onShow: function() {
      // window.setTimeout(() => {
      //
      // }, 250);
      this.$.model.query();
    },
    onHide: function() {
      window.setTimeout(function() {
        this.requests = undefined;
      }.bind(this), 100);
    },
    /** Compute if the view has requests */
    _computeHasRequests: function(requests) {
      return !!requests;
    },

    _requestNameChanged: function(e) {
      var item = e.detail.item;
      this.$.saveModel.data = item;
    },
    /** User requested to clear all entries. */
    _clearSavedStore: function() {
      this.$.model.remove();
    },
    /**
     * Generic function to be called on database error.
     */
    _dbError: function(e) {
      console.error('_dbError', e);
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
      this.removedCopy.forEach((item) => {
        for (var i = 0; i < this.requests.length; i++) {
          if (this.requests[i].id === item.id) {
            this.splice('requests', i, 1);
            break;
          }
        };
      });
      var view = Polymer.dom(this.root).querySelector('arc-saved-list-view');
      view.$.selector.clearSelection();
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
        var view = Polymer.dom(this.root).querySelector('arc-saved-list-view');
        this.removedCopy.forEach((item) => {
          this.push('requests', item);
          view.$.selector.select(item);
        });
        view.$.requestList.render();
      }
      this.removedCopy = null;
    }

  });
})();
