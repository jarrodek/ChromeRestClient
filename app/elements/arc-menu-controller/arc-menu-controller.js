(function() {
  'use strict';

  Polymer({
    is: 'arc-menu-controller',
    properties: {
      route: String,
      baseUrl: String,
      _historyObserver: {
        type: Function,
        value: function() {
          return this._onStorageChange.bind(this);
        }
      },
      projects: Array,
      noHistory: {
        type: Boolean,
        value: false
      },
      // If set, the controller will use pouch db as a database connector and new database schema.
      usePouchDb: {
        type: Boolean
      }
    },

    observers: [
      '_usePouchDbChanged(usePouchDb)'
    ],

    ready: function() {
      try {
        this._observeHistoryEnabled();
        this._updateHistoryStatus();
      } catch (e) {
        this.fire('app-log', {
          'message': ['Error occurred constructing the arc-menu', e],
          'level': 'error'
        });
        arc.app.analytics.sendException('arc-menu::ready::' + e.message, false);
      }
    },
    attached: function() {
      this.listen(document.body, 'project-removed', 'refreshProjects');
    },
    detached: function() {
      this.unlisten(document.body, 'project-removed', 'refreshProjects');
    },
    /**
     * User clicked on a navigation element.
     */
    _navigateRequested: function(e) {
      page(e.detail.url);
    },
    _usePouchDbChanged: function() {
      this.refreshProjects();
    },
    /**
     * Refresh projects list and display new list.
     */
    refreshProjects: function() {
      if (this.usePouchDb) {
        this._queryProjects();
      } else {
        this.$.model.query();
      }
    },

    _queryProjects: function() {
      let e = this.fire('arc-database-query', {
        store: 'legacy-projects',
        selector: '_id $exists true',
        sort: ['_id'],
        fields: ['_id', 'order', 'name']
      });
      e.detail.result
      .then((result) => {
        result.sort((a, b) => {
          if (a.order === b.order) {
            return 0;
          }
          if (a.order > b.order) {
            return 1;
          }
          if (a.order < b.order) {
            return -1;
          }
        });
        result = result.map((i) => {
          i.id = i._id;
          return i;
        });
        this.set('projects', result);
      })
      .catch((err) => {
        arc.app.analytics.sendException(err.message, true);
        this.fire('app-log', {'message': err, 'level': 'error'});
      });
    },

    /**
     * Attach listener to chrome local storage to listen for history settings change.
     */
    _observeHistoryEnabled: function() {
      try {
        chrome.storage.onChanged.addListener(this._historyObserver);
      } catch (e) {
        this.fire('app-log', {
          'message': ['Error setting up storage listener'. e],
          'level': 'error'
        });
        arc.app.analytics.sendException('arc-menu::ready::' + e.message, false);
      }
    },
    /**
     * Update project name in the UI.
     *
     * @param {Number} projectId A project id from the database
     * @param {String} projectName Project new name
     */
    updateProjectName: function(projectId, projectName) {
      if (this.project === null) {
        var msg = 'Trying to update a project name when project list is empty. ' +
          'Try insert new project first.';
        this.fire('app-log', {'message': msg, 'level': 'error'});
        return;
      }
      this.projects.forEach((project, i) => {
        if (project.id === projectId) {
          this.set('projects.' + i + '.name', projectName);
        }
      });
    },
    /**
     * Add newly created project to the list.
     *
     * @param {Number} projectId Database id for the project
     */
    appendProject: function(/*projectId*/) {
      if (this.usePouchDb) {
        this._queryProjects();
      } else {
        this.$.model.query();
      }
    },
    /**
     * Remove project from the UI.
     */
    removeProject: function(projectId) {
      if (this.project === null) {
        var msg = 'Trying to remove a project when project list is empty. ' +
          'Try insert new project first.';
        this.fire('app-log', {'message': msg, 'level': 'warning'});
        return;
      }
      this.projects.forEach((project, i) => {
        if (project.id === projectId) {
          this.splice('projects', i, 1);
        }
      });
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
        this.fire('app-log', {'message': [msg, e], 'level': 'warning'});
        arc.app.analytics.sendException('arc-menu::ready::' + e.message, false);
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
    },

    _authRequested: function() {
      this.$.auth.signIn();
    },

    _signOutRequested: function() {
      this.$.auth.signOut();
    }
  });
})();
