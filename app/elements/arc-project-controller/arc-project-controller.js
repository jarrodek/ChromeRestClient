(function() {
'use strict';

Polymer({
  is: 'arc-project-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior
  ],

  properties: {
    /**
     * Route params passed from the router.
     */
    routeParams: {
      type: Object,
      observer: '_prepareProject'
    },
    toolbarFeatures: {
      type: Array,
      value: []
    },
    project: {
      type: Object,
      notify: true
    },
    requests: {
      type: Array,
      notify: true
    },
    usePouchDb: Boolean,
    projectId: String
  },

  listeners: {
    'name-changed': '_requestNameChanged',
    'delete': '_deleteRequested',
    'export': 'exportProject'
  },

  observers: [
    '_projectNameChanged(project.name)',
    '_prepareProjectNew(opened, usePouchDb, routeParams.projectId)'
  ],

  onShow: function() {
    this._setPageTitle('Project');
    this._prepareProject();
  },
  onHide: function() {
    this._setPageTitle('');
  },
  // prepare project data to show.
  _prepareProject: function() {
    if (!this.opened || !this.routeParams) {
      return;
    }
    if (this.usePouchDb) {
      return;
    }
    var projectId = Number(this.routeParams.projectId);
    if (projectId !== projectId) {
      // NaN !== NaN
      return;
    }
    this.$.project.objectId = projectId;
  },

  _getDb: function() {
    return new PouchDB('legacy-projects');
  },

  _prepareProjectNew: function(opened, usePouchDb, projectId) {
    if (!opened || !usePouchDb || !projectId) {
      return;
    }
    this.set('projectId', projectId);
    // var db = this._getDb();
    // db.get(projectId)
    // .then((project) => {
    //   this.set('project', project);
    // })
    // .catch((e) => {
    //   this.fire('app-log', {
    //     'message': e,
    //     'level': 'error'
    //   });
    //   console.error('Unable to find project data', e);
    //   StatusNotification.notify({
    //     message: 'Unable to find project data in local database.'
    //   });
    // });
    // console.log('opened, usePouchDb, projectId', opened, usePouchDb, projectId);
  },

  _projectReady: function(e) {
    var project = e.detail.data;
    if (!project) {
      StatusNotification.notify({
        message: 'Project not found in the datastore.'
      });
      return;
    }
    this.set('project', project);
    this.$.requestModel.objectId = project.requestIds;
    this.$.requestModel.query();
  },

  _requestReady: function(e) {
    var requests = e.detail.data;
    if (!requests) {
      return;
    }
    this.set('requests', requests);
  },

  _computeAuto: function(usePouchDb) {
    return usePouchDb === false;
  },

  _projectError: function(e) {
    this.fire('app-log', {'message': ['Project ctrl', e], 'level': 'error'});
  },

  _projectSaved: function() {

  },

  _projectNameChanged: function() {
    if (this.usePouchDb) {
      return;
    }
    this.$.project.save();
  },

  _requestNameChanged: function(e) {
    e.preventDefault();
    var request = e.detail.item;
    if (!request) {
      return;
    }
    this.$.requestSaveModel.data = request;
  },

  _requestSaveError: function(e) {
    this.fire('app-log', {'message': ['Request udate', e], 'level': 'error'});
    StatusNotification.notify({
      message: 'Unable to update request data. ' + e.message
    });
    arc.app.analytics.sendException('UpdateProjectRequest::' + e.detail.message);
  },

  _requestSaved: function() {
  },

  _deleteRequested: function(e) {
    var data = e.detail;
    if (data.request) {
      // delete request
      let requestId = data.request.id;
      this.$.requestSaveModel.auto = false;
      this.$.requestSaveModel.data = data.request;
      this.$.requestSaveModel.remove()
      .then(() => {
        this.$.requestSaveModel.auto = true;
        var all = this.requests;
        for (var i = all.length - 1; i >= 0; i--) {
          if (all[i].id === requestId) {
            this.splice('requests', i, 1);
            break;
          }
        }
        this.removedRequestCopy = data.request;
        StatusNotification.notify({
          message: 'Request deleted.',
          timeout: StatusNotification.TIME_MEDIUM,
          actionName: 'Revert'
        }, function() {
          this._revertDeletedRequest();
        }.bind(this));
      })
      .catch((e) => {
        this.fire('app-log', {'message': ['Request delete', e], 'level': 'error'});
        StatusNotification.notify({
          message: 'Unable to delete the request. ' + e.message
        });
        arc.app.analytics.sendException('DeleteProjectRequest::' + e.detail.message);
      });
      arc.app.analytics.sendEvent('Engagement', 'Click', 'Delete project request');
    } else if (data.project) {
      // delete project
      var requestToRemove = data.project.requestIds;
      this.$.requestSaveModel.auto = false;
      this.$.requestSaveModel.objectId = requestToRemove;
      this.$.requestSaveModel.remove()
      .then(() => {
        this.$.requestSaveModel.auto = true;
        this.$.project.auto = false;
        return this.$.project.remove();
      })
      .then(() => {
        this.$.project.auto = true;
        this.async(() => {
          StatusNotification.notify({
            message: 'Project deleted. '
          });
          arc.app.router.redirect('/');
        });
      })
      .catch((e) => {
        this.fire('app-log', {'message': ['Deleting project::', e], 'level': 'error'});
        StatusNotification.notify({
          message: 'Unable to delete the project. ' + e.message
        });
        arc.app.analytics.sendException('DeleteProject::' + e.detail.message);
      });
      arc.app.analytics.sendEvent('Engagement', 'Click', 'Delete project');
    }
  },

  _revertDeletedRequest: function() {
    this.$.restoreRequestModel.data = this.removedRequestCopy;
  },

  _requestRestored: function() {
    if (this.removedRequestCopy) {
      this.push('requests', this.removedRequestCopy);
    }
    this.removedRequestCopy = null;
  },

  exportProject: function() {
    this.exportContent = arc.app.importer.createExportObject({
      requests: this.requests,
      projects: [this.project]
    });
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.fileSuggestedName = 'arc-project-export-' + day + '-' + month + '-' +
      year + '-export.json';
    this.exportMime = 'json';
    this.exportData();
    arc.app.analytics.sendEvent('Engagement', 'Click', 'Export project as file');
  },

  onFileSaved: function() {
    StatusNotification.notify({
      message: 'Project saved in file. '
    });
  }
});
})();
