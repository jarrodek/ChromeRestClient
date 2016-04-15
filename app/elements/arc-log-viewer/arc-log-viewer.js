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
      return;
    }
    this._getLogs();
  },

  _getLogs: function() {
    arc.app.db.idb.open().then((db) => {
      let start = this.logs && this.logs.length ? this.logs.length - 1 : 0;
      // console.log('--no-save', 'start', start);
      db.logs
        //.where('type').anyOf(this.allowedLogs)
        .reverse()
        .offset(start)
        .limit(200)
        .sortBy('time')
        //.toArray() // do not use with sortBy
        .then((logs) => {
          if (!logs || !logs.length) {
            return;
          }
          this.async(() => {
            if (!this.logs) {
              this.logs = [];
            }
            // console.log('--no-save', logs);
            logs = logs.concat(this.logs);
            // console.log('--no-save', logs);
            this.set('logs', logs);
          });
        })
        .finally(() => {
          db.close();
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
    return stack[0];
  },

  _showDetails: function(e) {
    var item = this.$.list.itemForElement(e.target);
    if (!item) {
      return;
    }
    this.set('details', item);
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
    // console.log('--no-save', '_computeFilterArray', result);
    this.allowedLogs = result;

    if (this.opened) {
      this._refreshLogs();
    }
  },

  sortList: function(a, b) {
    // console.log('--no-save', 'sortList', a, b);
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
