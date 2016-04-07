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
    }
  },

  listeners: {
    'name-changed': '_requestNameChanged',
    'delete': '_deleteRequested',
    'export': 'exportProject'
  },

  observers: [
    '_projectNameChanged(project.name)'
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
    var projectId = Number(this.routeParams.projectId);
    if (projectId !== projectId) {
      // NaN !== NaN
      return;
    }
    this.$.project.objectId = projectId;
  },

  _projectReady: function(e) {
    var project = e.detail.data;
    if (!project) {
      StatusNotification.notify({
        message: 'Project not found in the datastore.'
      });
      return;
    }
    // console.log('_projectReady', project);
    this.set('project', project);
    this.$.requestModel.objectId = project.requestIds;
    this.$.requestModel.query();
  },

  _requestReady: function(e) {
    var requests = e.detail.data;
    if (!requests) {
      return;
    }
    // console.log('_requestReady', requests);
    this.set('requests', requests);
  },

  _projectError: function(e) {
    console.log('_projectError', e);
  },

  _projectSaved: function() {
    console.log('_projectSaved');
  },

  _projectNameChanged: function(a,b) {
    this.$.project.save();
    // this.$.project.data = this.project;
    // console.log('_projectNameChanged',a,b);
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
    console.error('Error updating the request', e);
    StatusNotification.notify({
      message: 'Unable to update request data. ' + e.message
    });
    arc.app.analytics.sendException('UpdateProjectRequest::' + e.detail.message);
  },

  _requestSaved: function() {
    // console.info('The request has been updated');
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
        console.error('Error deleting the request', e);
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
        console.log('Requests has been deleted.');
        this.$.requestSaveModel.auto = true;
        this.$.project.auto = false;
        return this.$.project.remove();
      })
      .then(() => {
        console.log('Project has been deleted.');
        this.$.project.auto = true;
        this.async(() => {
          StatusNotification.notify({
            message: 'Project deleted. '
          });
          arc.app.router.redirect('/');
        });
      })
      .catch((e) => {
        console.error('Error deleting the project', e);
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
