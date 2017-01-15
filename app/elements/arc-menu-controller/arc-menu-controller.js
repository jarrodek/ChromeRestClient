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
      },

      selectedProject: String,
      // Just to pass to the view.
      withToast: Boolean,
      // It will display a loader when set to true
      loading: Boolean
    },

    observers: [
      '_usePouchDbChanged(usePouchDb)',
      '_projectsListChanged(projects.*)'
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
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + e.message,
          fatal: false
        });
      }
    },

    attached: function() {
      this.listen(document.body, 'project-removed', 'refreshProjects');
      this.listen(document, 'project-object-deleted', '_projectDeleted');
      this.listen(document, 'project-object-changed', '_updateProject');
      this.listen(document.body, 'project-name-changed', '_updateProjectName');
      this.listen(document, 'selected-project', '_updateProjectSelection');
    },

    detached: function() {
      this.unlisten(document.body, 'project-removed', 'refreshProjects');
      this.unlisten(document, 'project-object-deleted', '_projectDeleted');
      this.unlisten(document, 'project-object-changed', '_updateProject');
      this.unlisten(document.body, 'project-name-changed', '_updateProjectName');
      this.unlisten(document, 'selected-project', '_updateProjectSelection');
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

    _getDb: function() {
      return new PouchDB('legacy-projects');
    },

    _queryProjects: function() {
      this._getDb().allDocs({
        // jscs:disable
        include_docs: true
        // jscs:enable
      })
      .then((result) => {
        result = result.rows.map((i) => i.doc);
        result = result.sort((a, b) => {
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
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + err.message,
          fatal: false
        });
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
        this.fire('send-analytics', {
          type: 'exception',
          description: 'arc-menu:' + e.message,
          fatal: false
        });
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

    _updateProject: function(e, detail) {
      var p = detail.project;
      p.id = p._id;
      if (!this.projects || !this.projects.length) {
        this.push('projects', p);
        return;
      }
      var index = this.projects.findIndex((i) => i._id === p._id);
      if (index === -1) {
        this.push('projects', p);
        return;
      }
      this.set('projects.' + index + '.name', p.name);
      this.set('projects.' + index + '.order', p.order);
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
    },

    _authRequested: function() {
      this.$.auth.signIn();
    },

    _signOutRequested: function() {
      this.$.auth.signOut();
    },

    _updateProjectName: function(e) {
      var projectId = e.detail.projectId;
      var index = this.projects.findIndex((i) => i._id === projectId);
      if (index === -1) {
        return;
      }
      this.set('projects.' + index + '.name', e.detail.name);
    },

    _updateProjectSelection: function(e, detail) {
      this.set('selectedProject', detail.id);
    },

    _projectDeleted: function(e) {
      var id = e.detail.id;
      var list = this.projects;
      var index = list.findIndex((item) => item.id === id);
      if (index === -1) {
        return;
      }
      this.splice('projects', index, 1);
    },

    _projectsListChanged: function(record) {
      if (!record || !record.base) {
        return;
      }
      if (record.path !== 'projects') {
        // Only when refresing the projects.
        return;
      }
      var projects = record.base;
      if (!projects || !projects.length) {
        return;
      }
      var projectIds = projects.map((item) => {
        return item.id;
      });
      this._findEmptyProjects(projectIds);
    },
    /**
     * The function will iterate over the request object keys and check
     * if projects has any request that exists.
     * If it doesn't exists it will mark it as a project without request.
     *
     * @param {Array<String>} projectIds A list of project IDs.
     */
    _findEmptyProjects: function(projectIds) {
      this.debounce('find-empty-projects', function() {
        if (!this._processEmptyWorker) {
          var blob = new Blob([this.$.emptyProjectsProcess.textContent]);
          this._processEmptyWorkerUrl = window.URL.createObjectURL(blob);
          this._processEmptyWorker = new Worker(this._processEmptyWorkerUrl);
          this._processEmptyWorker.onmessage =
            this._processWorkerResponse.bind(this);
        }
        this._processEmptyWorker.postMessage({
          projects: projectIds
        });
      }, 1500);
    },
    // Processes the response form the web worker.
    _processWorkerResponse: function(e) {
      var data = e.data;
      if (data.error) {
        return console.error(data.message);
      }
      this._setEmptyProjects(data.result);
    },
    // Updates the list of projects and sets the `isEmpty` property.
    _setEmptyProjects: function(ids) {
      if (!ids || !ids.length) {
        return;
      }
      var list = this.projects;
      list.forEach((item, i) => {
        if (ids.indexOf(item.id) !== -1) {
          this.set(['projects', i, 'isEmpty'], true);
        }
      });
    }
  });
})();
