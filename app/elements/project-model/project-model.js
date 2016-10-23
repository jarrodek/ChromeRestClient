(function() {
  'use strict';
  Polymer({
    is: 'project-model',

    attached: function() {
      this.listen(document, 'project-read', '_handleRead');
      this.listen(document, 'project-name-change', '_handleNameChange');
      this.listen(document, 'project-object-change', '_handleObjectSave');
      this.listen(document, 'project-object-delete', '_handleObjectDelete');
    },

    detached: function() {
      this.unlisten(document, 'project-read', '_handleRead');
      this.unlisten(document, 'project-name-change', '_handleNameChange');
      this.unlisten(document, 'project-object-change', '_handleObjectSave');
      this.unlisten(document, 'project-object-delete', '_handleObjectDelete');
    },

    _getDb: function() {
      return new PouchDB('legacy-projects');
    },

    _handleRead: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.id) {
        e.detail.error = true;
        e.detail.message = 'You must set project id.';
        return;
      }

      var db = this._getDb();
      e.detail.result = db.get(detail.id)
      // .then((project) => {
      //   return db.close()
      //   .then(() => project);
      // })
      .catch((e) => this._handleException(e));
    },

    _handleNameChange: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.name) {
        e.detail.error = true;
        e.detail.message = 'New name must be set';
        return;
      }

      if (!detail.project && !detail.id) {
        e.detail.error = true;
        e.detail.message = 'You must set either project object or project id.';
        return;
      }
      var project = detail.project;
      var projectId = detail.id;
      if (!project || !project._id || !project._rev) {
        if (!projectId) {
          e.detail.error = true;
          e.detail.message = 'You must set either project object or project id.';
          return;
        }
        if (!projectId) {
          projectId = project._id;
        }
        project = null;
      }
      var db = this._getDb();
      var p;
      if (!project) {
        p = db.get(projectId);
      } else {
        p = Promise.resolve(project);
      }
      e.detail.result = p
      .then((r) => {
        r.name = detail.name;
        project = r;
        return db.put(r);
      })
      .then((insertResult) => {
        var oldRev = project._rev;
        project._rev = insertResult.rev;
        this.fire('project-object-changed', {
          project: project,
          oldRev: oldRev
        });
        return project;
      })
      // .then((project) => {
      //   return db.close()
      //   .then(() => project);
      // })
      .catch((e) => this._handleException(e));
    },

    _handleObjectSave: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.project || !detail.project._id) {
        e.detail.error = true;
        e.detail.message = 'You must set project object';
        return;
      }
      var db = this._getDb();
      var p;
      var project = detail.project;
      if (!project._rev) {
        p = db.get(project._id).catch((e) => {
          if (e.status === 404) {
            // create new
            return {};
          }
          this._handleException(e);
        });
      } else {
        p = Promise.resolve({});
      }
      e.detail.result = p
      .then((r) => {
        project = Object.assign({}, r, project);
        project.updated = Date.now();
        return db.put(project);
      })
      .then((insertResult) => {
        var oldRev = project._rev;
        project._rev = insertResult.rev;
        this.fire('project-object-changed', {
          project: project,
          oldRev: oldRev
        });
        return project;
      })
      // .then((project) => {
      //   return db.close()
      //   .then(() => project);
      // })
      .catch((e) => this._handleException(e));
    },

    _handleObjectDelete: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      var id = detail.id;
      var rev = detail.rev;
      if (!id || !rev) {
        e.detail.error = true;
        e.detail.message = 'You must set project id and rev';
        return;
      }
      var db = this._getDb();
      e.detail.result = db.remove(id, rev)
      .then(() => {
        this.fire('project-object-deleted', {
          id: id,
          oldRev: rev
        });
      })
      .catch((e) => this._handleException(e));
    },

    _handleException: function(e) {
      this.fire('app-log', {
        'message': ['Project model', e],
        'level': 'error'
      });
      console.error('Project model', e);
      var message;
      if (e instanceof Error) {
        message = e.message;
      } else {
        message = JSON.stringify(e);
      }
      this.fire('send-analytics', {
        type: 'exception',
        description: message,
        fatal: true
      });
      throw e;
    }
  });
})();
