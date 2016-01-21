'use strict';

Polymer({
  is: 'arc-settings-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],
  properties: {
    values: {
      type: Object
    },
    _storageObserver: {
      type: Function,
      value: function() {
        return this._onStorageChanged.bind(this);
      }
    },
    initialized: {
      type: Boolean,
      value: false
    }
  },
  observers: [
    '_onValueChange(values.*)'
  ],
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
  },
  /**
   * A callback called when the value of any storage change.
   * This view should handle external changes to the store.
   */
  _onStorageChanged: function(changes) {
    var keys = Object.keys(changes);
    var accepted = ['DEBUG_ENABLED', 'HISTORY_ENABLED', 'MAGICVARS_ENABLED',
      'CMH_ENABLED', 'CMP_ENABLED'
    ];
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
    console.log('Setting changed', key, value);
    this.fire('settings-saved', o);
    arc.app.analytics.sendEvent('Settings usage', key, value + '');
  },
  /**
   * Open the dialog with magic variables explanation.
   */
  openMagicVariablesDialog: function() {
    this.$.magicVatDialog.open();
  },

  manageClick: function() {
    page('/dataimport');
  },
  historyClearClick: function() {
    this.$.historyClearDialog.open();
  },
  onClearDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    var _db;
    arc.app.db.idb.open().then((db) => {
      _db = db;
      return db.requestObject.where('type').equals('history').delete();
    })
    .then((deleteCount) => {
      console.log('Deleted ' + deleteCount + ' objects');
    })
    .then(() => {
      _db.close();
    })
    .catch((e) => {
      console.error('Error clearing the history', e);
      throw e;
    });

    arc.app.analytics.sendEvent('Settings usage', 'Clear history', 'true');
  }
});
