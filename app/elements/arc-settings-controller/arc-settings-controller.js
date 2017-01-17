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
    this.set('gaEnabled', !app.analyticsDisabled);
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
    var accepted = ['HISTORY_ENABLED', 'MAGICVARS_ENABLED', 'apiAssistant'];
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
    this.fire('send-analytics', {
      type: 'event',
      category: 'Settings usage',
      action: key,
      label: value + ''
    });
  },

  showTutorial: function() {
    var tutorial = document.querySelector('#onboarding');
    if (!tutorial) {
      return;
    }
    tutorial.open();
  },

  _gaSettingTapped: function() {
    this.fire('analytics-permitted-change', {
      permitted: Boolean(this.gaEnabled)
    });
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
  // Handler to click on the "show tutorial" action.
  _showAddToDesktopTutotial: function() {
    this.$.addShortcutsToDesktop.open();
  },
  // Computes label for the timeout settings control.
  computeTimeoutLabel: function(requestDefaultTimeout) {
    return requestDefaultTimeout > 0 ?
      `Timeout request after ${requestDefaultTimeout} seconds`  : 'No timeout';
  },
  // Computes magic variables switch button label.
  computeMvLabel: function(mvEnabled) {
    return mvEnabled > 0 ?
      'Enabled'  : 'Disabled';
  },
  // Shows internall sub-page 
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
      this.fire('send-analytics', {
        type: 'event',
        category: 'Engagement',
        action: 'Click',
        label: 'Export saved as file'
      });
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
  },

  /**
   * Handler to be called on clear data action.
   * Opens the settings & confirmation dialog.
   */
  clearDatastore: function() {
    this.$.clearDatastoreDialog.open();
  },
  /**
   * Handler to be called when the user selects to delete requests data.
   * It will select and disable "projects" option as required when clearing the requests.
   * If the state is deselected then the "clear projects" option will become active again.
   */
  _deleteSavedChanged: function(e) {
    this.$.deleteProjectsOption.disabled = e.target.checked;
    if (e.target.checked) {
      this.$.deleteProjectsOption.checked = true;
    }
  },
  /**
   * Handler to be called when the clear data dialog has been closed.
   * It it's not canceled then it will clear (destroy) selected datastores.
   */
  _onClearDatastoreDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    var clear = this.$.clearForm.serialize();
    var dbs = Object.keys(clear);
    if (dbs.indexOf('saved-requests') !== -1) {
      dbs.push('legacy-projects');
    }
    StatusNotification.notify({
      message: 'Removing data from the store...'
    });
    var p = dbs.map((db) => new PouchDB(db).destroy());
    Promise.all(p).then(() => {
      StatusNotification.notify({
        message: 'Data cleared'
      });
      this.fire('datastrores-destroyed', {
        datastores: dbs
      });
    }).catch((e) => {
      StatusNotification.notify({
        message: 'Data clear error: ' + e.message
      });
    });
  }
});
})();
