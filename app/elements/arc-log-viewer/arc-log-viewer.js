(function() {
'use strict';
Polymer({
  is: 'arc-log-viewer',

  properties: {
    logs: {
      type: Array,
      value: function() {
        return [];
      }
    },
    details: Object,
    // Either 0 (list of logs) or 1 (log details)
    viewId: {
      type: Number,
      value: 0
    },
    // Number of records per page.
    pageLimit: {
      type: Number,
      value: 30
    }
  },

  behaviors: [
    Polymer.PaperDialogBehavior,
    ArcBehaviors.ArcFileExportBehavior
  ],

  observers: [
    'updateLogs(opened)'
  ],

  attached: function() {
    this.$.scrollable.dialogElement = this;
  },

  updateLogs: function(opened) {
    if (!opened) {
      this.reset();
      return;
    }
    this._getLogs();
  },

  reset: function() {
    this.set('logs', []);
    this.queryOptions = undefined;
    this.noMoreLogs = false;
  },

  _getLogs: function() {
    if (!this.queryOptions) {
      this.queryOptions = {
        limit: this.pageLimit,
        descending: true,
        // jscs:disable
        include_docs: true
        // jscs:enable
      };
    }

    this.$.db.db.allDocs(this.queryOptions)
    .then((response) => {
      var items = [];
      if (response && response.rows.length > 0) {
        this.queryOptions.startkey = response.rows[response.rows.length - 1].key;
        this.queryOptions.skip = 1;
        items = response.rows;
      } else {
        items = [];
      }
      if (items.length === 0) {
        this.noMoreLogs = true;
        return;
      } else if (items.length < this.pageLimit) {
        this.noMoreLogs = true;
      }
      items = items.concat(this.logs);
      this.set('logs', items);
    })
    .catch((e) => {
      this.fire('app-log', {
        message: e,
        level: 'error'
      });
    });
  },

  hideDetails: function() {
    this.viewId = 0;
    this.notifyResize();
  },

  _computeLog: function(logs) {
    if (typeof logs === 'string') {
      try {
        logs = JSON.parse(logs);
      } catch (e) {
        return logs;
      }
    }
    if (typeof logs === 'string') {
      return logs;
    }
    if (!(logs instanceof Array)) {
      return JSON.stringify(logs);
    }
    var result = '';
    logs.forEach((item) => {
      if (result !== '') {
        result += ' ';
      }
      if (typeof item !== 'string') {
        item = JSON.stringify(item);
      }
      result += item;
    });
    return result;
  },

  _computeFile: function(stack) {
    if (!stack) {
      return 'unknown file';
    }
    var list = stack.split('\n');
    var file = list.find((i) => i.indexOf('app-logger.js') === -1);
    return file || 'unknown file';
  },

  _showDetails: function(e) {
    var item = this.$.list.itemForElement(e.target);
    if (!item) {
      return;
    }
    this.set('details', item.doc);
    this.viewId = 1;
  },

  _refreshLogs: function() {
    this.reset();
    this._getLogs();
  },

  exportLogs: function() {
    this.exportContent = this.logs;
    this.fileSuggestedName = 'arc-log-export.json';
    this.exportMime = 'json';
    this.exportData();
    this.fire('send-analytics', {
      type: 'event',
      category: 'Data export',
      action: 'Logs as file',
      label: 'Log viewer'
    });
  }
});
})();
