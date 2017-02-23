(function() {
  'use strict';

  Polymer({
    is: 'arc-menu-controller',
    properties: {
      route: String,
      routeParams: Object,
      _historyObserver: {
        type: Function,
        value: function() {
          return this._onStorageChange.bind(this);
        }
      },
      noHistory: {
        type: Boolean,
        value: false
      },
      // Just to pass to the view.
      withToast: Boolean,
      // It will display a loader when set to true
      loading: Boolean,
      selectedProject: String
    },

    ready: function() {
      try {
        this._observeHistoryEnabled();
        this._updateHistoryStatus();
      } catch (e) {
        this.fire('app-log', {
          'message': ['Error occurred constructing the arc-menu', e],
          'level': 'error'
        });
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + e.message,
          fatal: false
        });
      }
    },

    /**
     * User clicked on a navigation element.
     */
    _navigateRequested: function(e) {
      page(e.detail.url);
    },

    /**
     * Attach listener to chrome local storage to listen for history settings change.
     */
    _observeHistoryEnabled: function() {
      try {
        chrome.storage.onChanged.addListener(this._historyObserver);
      } catch (e) {
        this.fire('app-log', {
          'message': ['Error setting up storage listener'.e],
          'level': 'error'
        });
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + e.message,
          fatal: false
        });
      }
    },

    _updateHistoryStatus: function() {
      try {
        chrome.storage.sync.get({
          HISTORY_ENABLED: true
        }, function(result) {
          if (!result.HISTORY_ENABLED) {
            this.noHistory = true;
          } else {
            this.noHistory = false;
          }
        });
      } catch (e) {
        var msg = 'Error setting up storage listener';
        this.fire('app-log', {
          'message': [msg, e],
          'level': 'warning'
        });
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + e.message,
          fatal: false
        });
      }
    },

    _onStorageChange: function(change) {
      var keys = Object.keys(change);
      if (keys.indexOf('HISTORY_ENABLED') !== -1) {
        if (!change.HISTORY_ENABLED.newValue) {
          this.noHistory = true;
        } else {
          this.noHistory = false;
        }
      }
    }
  });
})();
