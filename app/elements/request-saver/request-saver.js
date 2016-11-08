(function() {
  'use strict';

  Polymer({
    is: 'request-saver',

    properties: {
      // A request object to save.
      request: Object,
      // If set to true it will override current request
      override: Boolean,
      // Name of the request, can be unset if just overridin the request
      requestName: String,
      // If set, the request will be saved to Google drive.
      saveToDrive: Boolean,
      /**
       * If true the `save` function will save project data with request
       * Either `saveToProjectId` or `saveToProjectName` must be set then.
       * If `saveToProjectId` is set the ID will be used. Otherwise new project with name
       * `saveToProjectName` will be created.
       */
      saveToProject: Boolean,
      // Set to true if current request is a Google Drive saved request
      currentIsDrive: Boolean,
      // Set to true if current request is already saved in the store.
      currentIsSaved: Boolean,
      // Project ID associated with the request.
      saveToProjectId: String,
      // Name of the new project to create.
      saveToProjectName: String
    },

    save: function() {
      if (this.override) {
        return this._override();
      } else {
        return this._saveNew();
      }
    },

    _override: function() {
      // When project change then request ID must change as weel.
      // Because the project change is before request save I need a flag to determine chnage.
      var projectHasChanged = false;
      var r = this.request;
      if (!r._id) {
        return this.fire('error', {
          error: new Error('The _id property must be set to override request.')
        });
      }
      r.type = 'saved';
      if (this.requestName) {
        r.name = this.requestName;
      }
      var p;
      if (this.saveToProject) {
        if (this.saveToProjectId) {
          if (r.legacyProject !== this.saveToProjectId) {
            projectHasChanged = true;
            r.legacyProject  = this.saveToProjectId;
          }
        } else if (this.saveToProjectName) {
          p = this._createProject()
          .then((result) => {
            projectHasChanged = true;
            r.legacyProject = result._id;
          });
        }
      } else if (r.legacyProject) {
        projectHasChanged = true;
        delete r.legacyProject;
      }
      if (!p) {
        p = Promise.resolve();
      }

      return p.then(() => {
        if (this.saveToDrive) {
          delete r.driveId;
          let data = Object.assign({}, r);
          delete data.legacyProject;
          return this._saveDrive(data, this.requestName || r.name)
          .then((insertResult) => {
            var driveId = insertResult.id;
            if (driveId) {
              r.driveId = driveId;
              r.type = 'google-drive';
            }
          });
        }
        return Promise.resolve();
      })
      .then(() => {
        // If the name changed then if must change the entire object because ID must change
        // In this case the old request must be deleted.
        let newName = encodeURIComponent(r.name);
        let oldName = r._id.split('/')[0];
        if (oldName !== newName || projectHasChanged) {
          let event = this.fire('request-objects-delete', {
            items: [r._id],
            dbName: 'saved-requests'
          });
          return event.detail.result.then(() => {
            let id = encodeURIComponent(r.name) + '/' + encodeURIComponent(r.url) + '/' + r.method;
            if (this.saveToProject) {
              id += '/' + r.legacyProject;
            }
            r._id = id;
            delete r._rev;
          });
        }
        return Promise.resolve();
      })
      .then(() => {
        // At this point there is a reference to project (if needed) and Google Drive (if added)

        let event = this.fire('request-object-change', {
          request: r,
          dbName: 'saved-requests'
        });
        return event.detail.result;
      })
      .then((request) => {
        this.fire('request-saved', {
          request: request,
          override: this.override,
          toDrive: this.saveToDrive,
          toProject: this.saveToProject
        });
      })
      .catch((e) => {
        this.fire('error', {
          error: e
        });
      });
    },

    _saveNew: function() {
      var r = this.request;
      delete r._rev;
      delete r._id;
      delete r.driveId;
      delete r.legacyProject;
      r.name = this.requestName;
      r.type = 'saved';

      var p;
      if (this.saveToProject) {
        if (this.saveToProjectId) {
          r.legacyProject  = this.saveToProjectId;
        } else if (this.saveToProjectName) {
          p = this._createProject()
          .then((result) => {
            r.legacyProject = result._id;
          });
        }
      }
      if (!p) {
        p = Promise.resolve();
      }

      return p.then(() => {
        if (this.saveToDrive) {
          delete r.driveId;
          let data = Object.assign({}, r);
          delete data.legacyProject;
          return this._saveDrive(data, this.requestName || r.name)
          .then((insertResult) => {
            var driveId = insertResult.id;
            if (driveId) {
              r.driveId = driveId;
              r.type = 'google-drive';
            }
          });
        }
        return Promise.resolve();
      })
      .then(() => {
        // At this point there is a reference to project (if needed) and Google Drive (if added)
        r._id = encodeURIComponent(r.name) + '/' + encodeURIComponent(r.url) + '/' + r.method;
        if (this.saveToProject) {
          r._id += '/' + r.legacyProject;
        }
        let event = this.fire('request-object-change', {
          request: r,
          dbName: 'saved-requests'
        });
        return event.detail.result;
      })
      .then((request) => {
        this.fire('request-saved', {
          request: request,
          override: this.override,
          toDrive: this.saveToDrive,
          toProject: this.saveToProject
        });
      })
      .catch((e) => {
        this.fire('error', {
          error: e
        });
      });
    },

    _createProject: function() {
      var obj = {
        _id: this.$.uuid.generate(),
        name: this.saveToProjectName,
        order: 0,
        created: Date.now()
      };

      var event = this.fire('project-object-change', {
        project: obj
      });

      return event.detail.result;
    },

    _saveDrive: function(request, name) {
      var ctrl = document.body.querySelector('arc-drive-controller');
      if (!ctrl) {
        //this.fire('app-log', {'message': ['Drive controller not found!'], 'level': 'error'});
        return Promise.reject(new Error('Drive controller not found!'));
      }
      return ctrl.exportDrive(request, name);
    },
  });
})();
