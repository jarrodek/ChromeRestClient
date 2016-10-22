(function() {
'use strict';

Polymer({
  is: 'arc-project-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior,
    ArcBehaviors.ArcFileExportBehavior,
    ArcBehaviors.DeleteRevertableBehavior
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
    'export': 'exportProject',
    'project-related-requests-read': '_cancelEvent'
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
    var event = this.fire('project-read', {
      id: projectId
    });
    if (event.detail.error) {
      console.error(event.detail.message);
      return;
    }
    event.detail.result.then((result) => {
      this.set('project', result);
    });
    this.set('projectId', projectId);
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
      this.cancelDebouncer('project-name-change-request');
      this.debounce('project-name-change-request', this._pouchNameChanged.bind(this), 250);
      return;
    }
    this.$.project.save();
  },

  _pouchNameChanged: function() {
    var event = this.fire('project-name-change', {
      projectId: this.projectId,
      project: this.project,
      name: this.project.name
    });
    if (event.detail.error) {
      console.error(event.detail.message);
      return;
    }
    event.detail.result.then((result) => {
      this.project._rev = result._rev;
    });
  },

  _requestNameChanged: function(e) {
    e.preventDefault();
    if (this.usePouchDb) {

      let event = this.fire('request-name-change', {
        'dbName': 'saved-requests',
        'name': e.detail.item.name,
        'id': e.detail.item.id
      });
      if (event.detail.error) {
        console.error(event.detail.message);
        return;
      }
      event.detail.result
      .then((request) => {
        let index = this.requests.findIndex((i) => i._id === request._id);
        if (index === -1) {
          console.error('Unable to find index.');
          return;
        }
        this.set('requests.' + index + '._rev', request._rev);
      })
      .catch((e) => {
        StatusNotification.notify({
          message: e.message
        });
      });
      return;
    }
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

  _deleteRequestedNew: function(e, detail) {
    if (detail.request) {
      return this._deleteRequest(detail);
    } else if (detail.project) {
      this._deleteProjectNew();
    }
  },

  _deleteProjectNew: function() {
    var requests = [];
    if (this.requests && this.requests.length) {
      requests = this.requests.map((i) => i._id);
    }
    var event = this.fire('request-objects-delete', {
      dbName: 'saved-requests',
      items: requests
    });

    if (event.detail.error) {
      console.error(event.detail.message);
      return;
    }
    event.detail.result
    .then(() => {
      let e = this.fire('project-object-delete', {
        id: this.project._id,
        rev: this.project._rev
      });
      if (e.detail.error) {
        throw e.detail.message;
      }
      return e.detail.result;
    })
    .then(() => {
      page('request/latest');
    });
  },

  _deleteRequest: function(detail) {
    this._deleteRevertable('saved-requests', [detail.request])
    .then((res) => {
      let items = res.map((i) => i.id);
      this.fire('request-objects-deleted', {
        items: items,
        type: 'saved'
      });
      var data = this.requests;
      data = data.filter((i) => items.indexOf(i._id) === -1);
      this.set('requests', data);
    })
    .catch((e) => {
      StatusNotification.notify({
        message: 'Error deleting entries. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting entries', e],
        level: e
      });
      console.error(e);
    });
  },

  _onDocumentsRestored: function(response) {
    var docs = response.rows.map((i) => i.doc);
    var res = this.requests.concat(docs);
    this.set('requests', res);
    this.fire('request-objects-restored', {
      items: docs,
      type: 'saved'
    });
  },

  _deleteRequested: function(e, data) {
    if (this.usePouchDb) {
      this._deleteRequestedNew(e, data);
      return;
    }

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
  },

  _cancelEvent: function(e) {
    e.preventDefault();
    e.stopPropagation();
  }
});
})();
