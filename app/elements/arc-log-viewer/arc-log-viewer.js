(function() {
'use strict';
Polymer({
  is: 'arc-log-viewer',

  properties: {
    logs: Array,
    details: Object,
    showDetails: {
      type: Boolean,
      value: false
    },
    levelLog: {
      type: Boolean,
      value: true,
      observer: '_computeFilterArray'
    },
    levelInfo: {
      type: Boolean,
      value: true,
      observer: '_computeFilterArray'
    },
    levelWarning: {
      type: Boolean,
      value: true,
      observer: '_computeFilterArray'
    },
    levelError: {
      type: Boolean,
      value: true,
      observer: '_computeFilterArray'
    },
    allowedLogs: {
      type: Array,
      value: function() {
        return [];
      }
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
      this.set('logs', []);
      this.queryOptions = undefined;
      return;
    }
    this._getLogs();
  },

  _getLogs: function() {
    if (!this.queryOptions) {
      this.queryOptions = {
        limit: 25,
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
        this.queryOptions.startkey = response.rows[response.rows.length - 1];
        this.queryOptions.skip = 1;
        items = response.rows;
      } else {
        items = [];
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
    this.showDetails = false;
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
    this.showDetails = true;
  },

  _computeFilterArray: function() {
    var result = [];
    if (this.levelLog) {
      result.push('log');
    }
    if (this.levelInfo) {
      result.push('info');
    }
    if (this.levelWarning) {
      result.push('warning');
    }
    if (this.levelError) {
      result.push('error');
    }
    this.allowedLogs = result;

    if (this.opened) {
      this._refreshLogs();
    }
  },

  sortList: function(a, b) {
    if (a.time > b.time) {
      return -1;
    }
    if (a.time < b.time) {
      return 1;
    }
    return 0;
  },

  _refreshLogs: function() {
    this.set('logs', []);
    this._getLogs();
  },

  exportLogs: function() {
    this.exportContent = this.logs;
    this.fileSuggestedName = 'arc-log-export.json';
    this.exportMime = 'json';
    this.exportData();
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Export logs as file');
  }
});
})();
