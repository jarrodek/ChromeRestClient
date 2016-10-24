(function() {
'use strict';

Polymer({
  is: 'arc-settings-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior
  ],
  properties: {
    /**
     * System settings object.
     * This keeps values saved in sync storage.
     *
     * @type {Object.<string, boolean>}
     */
    values: {
      type: Object
    },
    // Currently displayed page.
    page: {
      type: Number,
      value: 0
    },
    /**
     * A handler for a storage change event.
     *
     * @type {Function}
     */
    _storageObserver: {
      type: Function,
      value: function() {
        return this._onStorageChanged.bind(this);
      }
    },
    /**
     * True when the settings object has been initialized.
     */
    initialized: {
      type: Boolean,
      value: false
    },
    /**
     * State of the GA tracking.
     * It's outside the regular app's settings system since it's controled by the library.
     * Therefore it must be set in the UI as a different object.
     *
     * @type {Boolean}
     */
    gaEnabled: {
      type: Boolean,
      value: true
    },

    showNotifications: {
      type: Boolean,
      value: false,
      readOnly: true
    },

    notificationsEnabled: {
      type: Boolean,
      value: false
    }
  },
  observers: [
    '_onValueChange(values.*)',
    '_settingsPageChanged(page)'
  ],

  onShow: function() {
    this._setPageTitle('Settings');
    this.set('gaEnabled', arc.app.analytics.enabled);
  },

  onHide: function() {
    this._setPageTitle('');
  },

  onBack: function() {
    this.page = 0;
  },

  _settingsPageChanged: function(page) {
    if (!this.opened) {
      return;
    }
    this.releaseFeatures();
    this.set('toolbarFeatures', []);
    switch (page) {
      case 0:
        this._setPageTitle('Settings');
        break;
      case 1:
        this._setPageTitle('Timeout settings');
        this.push('toolbarFeatures', 'back');
        this.requestFeatures();
        break;
      case 2:
        this._setPageTitle('Magic variables settings');
        this.push('toolbarFeatures', 'back');
        this.requestFeatures();
        break;
    }
  },

  ready: function() {
    if (!arc.app.settings || !arc.app.settings.getConfig) {
      throw new Error('The arc.app.settings library not ready');
    }
    arc.app.settings.getConfig()
      .then(function(values) {
        this.set('values', values);
        //propagate value changes first on initialize time.
        window.setTimeout(function() {
          this.initialized = true;
        }.bind(this), 0);
      }.bind(this));
    chrome.storage.onChanged.addListener(this._storageObserver);
    var channel  = arc.app.utils.releaseChannel;
    if (channel !== 'stable') {
      this._setShowNotifications(true);
      this._checkNotificationsPermissions();
    }
  },
  /**
   * Check if user allowed desktop notifications.
   */
  _checkNotificationsPermissions: function() {
    chrome.permissions.contains({permissions: ['notifications']}, (granted) => {
      this.set('notificationsEnabled', granted);
    });
  },

  /**
   * A callback called when the value of any storage change.
   * This view should handle external changes to the store.
   */
  _onStorageChanged: function(changes) {
    var keys = Object.keys(changes);
    var accepted = ['HISTORY_ENABLED', 'MAGICVARS_ENABLED'];
    keys.forEach(function(key) {
      if (accepted.indexOf(key) !== -1 && this.values[key] !== changes[key].newValue) {
        this.set('values.' + key, changes[key].newValue);
      }
    }.bind(this));
  },

  /**
   * A function called when any value change.
   */
  _onValueChange: function(changeRecord) {
    if (!this.initialized) {
      return;
    }
    var key = changeRecord.path.replace('values.', '');
    var value = changeRecord.value;
    arc.app.settings.saveConfig(key, value);
    var o = {
      'key': key,
      'value': value
    };
    this.fire('settings-saved', o);
    arc.app.analytics.sendEvent('Settings usage', key, value + '');
  },

  showTutorial: function() {
    var tutorial = document.querySelector('#onboarding');
    if (!tutorial) {
      return;
    }
    tutorial.open();
  },

  historyClearClick: function() {
    this.$.historyClearDialog.open();
  },

  passwordsClearClick: function() {
    this.$.passwordsClearDialog.open();
  },

  cookiesClearClick: function() {
    this.$.cookieClearDialog.open();
  },

  onClearDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    var p;
    /* global app */
    if (app.usePouchDb) {
      p = this._clearHistory();
    } else {
      p = this._clearHistoryLegacy();
    }
    p.then(() => {
      StatusNotification.notify({
        message: 'History has been cleared'
      });
    });
    arc.app.analytics.sendEvent('Settings usage', 'Clear history', 'true');
  },

  _clearHistoryLegacy: function() {
    var _db;
    return arc.app.db.idb.open().then((db) => {
      _db = db;
      return db.requestObject.where('type').equals('history').delete();
    })
    .then(() => {
      _db.close();
      this.fire('request-objects-cleared', {
        type: 'history'
      });
    })
    .catch((e) => {
      this.fire('app-log', {
        'message': ['Unable to clear history.', e],
        'level': 'error'
      });
      StatusNotification.notify({
        message: 'Unable to clear history. ' + e.message
      });
      throw e;
    });
  },

  _clearHistory: function() {
    var db = new PouchDB('history-requests');
    return db.destroy()
    .catch((e) => {
      StatusNotification.notify({
        message: 'Unable to clear history. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting database', e],
        level: e
      });
      console.error(e);
    })
    .then(() => {
      this.fire('request-objects-cleared', {
        type: 'history'
      });
    });
  },

  onClearPasswordsResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    var p;
    /* global app */
    if (app.usePouchDb) {
      p = this._clearPasswords();
    } else {
      p = this._clearPasswordsLegacy();
    }
    p.then(() => {
      StatusNotification.notify({
        message: 'Passwords has been cleared'
      });
    });
  },

  _clearPasswordsLegacy: function() {
    var _db;
    return arc.app.db.idb.open()
    .then((db) => {
      _db = db;
      return db.table('basicAuth').clear();
    })
    .then(() => {
      _db.close();
    })
    .catch((e) => {
      this.fire('app-log', {
        'message': ['Error to clear passwords.', e],
        'level': 'error'
      });
      StatusNotification.notify({
        message: 'Unable to clear passwords data. ' + e.message
      });
      throw e;
    });
  },

  _clearPasswords: function() {
    var db = new PouchDB('auth-data');
    return db.destroy()
    .catch((e) => {
      StatusNotification.notify({
        message: 'Unable to clear passwords data. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting database', e],
        level: e
      });
      console.error(e);
    });
  },

  onClearCookiesResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    var p;
    /* global app */
    if (app.usePouchDb) {
      p = this._clearCookies();
    } else {
      p = this._clearCookiesLegacy();
    }
    p.then(() => {
      StatusNotification.notify({
        message: 'Cookies data has been cleared'
      });
    });
  },

  _clearCookiesLegacy: function() {
    var _db;
    return arc.app.db.idb.open().then((db) => {
      _db = db;
      return db.table('cookies').clear();
    })
    .then(() => {
      _db.close();
    })
    .catch((e) => {
      this.fire('app-log', {
        'message': ['Error clearing cookies storage.', e],
        'level': 'error'
      });
      StatusNotification.notify({
        message: 'Unable to clear cookies store'
      });
      throw e;
    });
  },

  _clearCookies: function() {
    var db = new PouchDB('cookies');
    return db.destroy()
    .catch((e) => {
      StatusNotification.notify({
        message: 'Unable to clear cookies data. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting database', e],
        level: e
      });
      console.error(e);
    });
  },

  _gaSettingTapped: function() {
    arc.app.analytics.setAnalyticsPermitted(this.gaEnabled);
  },

  _notificationsTapped: function() {
    if (this.notificationsEnabled) {
      chrome.permissions.request({permissions: ['notifications']}, (granted) => {
        if (!granted) {
          this.set('notificationsEnabled', false);
        }
      });
    } else {
      chrome.permissions.remove({permissions: ['notifications']});
    }
  },

  _showAddToDesktopTutotial: function() {
    this.$.addShortcutsToDesktop.open();
  },

  _openApps: function() {
    window.open('chrome://apps');
  },

  computeTimeoutLabel(requestDefaultTimeout) {
    return requestDefaultTimeout > 0 ?
      `Timeout request after ${requestDefaultTimeout} seconds`  : 'No timeout';
  },

  computeMvLabel: function(mvEnabled) {
    return mvEnabled > 0 ?
      'Enabled'  : 'Disabled';
  },

  _showPage: function(e) {
    var path = e.path;
    var page = null;
    while (true) {
      let _elm = path.shift();
      if (!_elm) {
        return;
      }
      if (_elm.nodeName === 'PAPER-ITEM') {
        page = _elm.dataset.page;
        break;
      }
    }
    if (page === null) {
      return;
    }
    page = Number(page);
    if (page !== page) {
      return;
    }
    this.page = page;
  },

  openPrivacyPolicy: function() {
    window
    .open('https://docs.google.com/document/d/1BzrKQ0NxFXuDIe2zMA-0SZBNU0P46MHr4GftZmoLUQU/edit');
  },

  dumpClick: function() {
    arc.app.importer.prepareExport({
      type: 'all'
    }).then((data) => {
      this.exportContent = data;
      var date = new Date();
      var day = date.getDate();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-all.json';
      this.exportMime = 'json';
      this.exportData();
      arc.app.analytics.sendEvent('Engagement', 'Click', 'Export saved as file');
    }).catch((e) => {
      this.fire('app-log', {
        'message': ['Export data.', e],
        'level': 'error'
      });
      StatusNotification.notify({
        message: 'Unable to export data :(',
        timeout: StatusNotification.TIME_MEDIUM
      });
    });
  }
});
})();
