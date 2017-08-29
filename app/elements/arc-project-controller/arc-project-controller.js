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
    projectId: String,
    // True when loading data from the datastore.
    loadingData: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true
    }
  },

  listeners: {
    'name-changed': '_requestNameChanged',
    'saved-list-item-name-changed': '_requestNameChanged',
    'delete': '_deleteRequested',
    'export': 'exportProject',
    'project-related-requests-read': '_projectsRelatedRead',
    'project-name-changed': '_projectNameChangedInView',
    'dom-order-changed': '_updateItemsOrder',
    'saved-list-item-open': '_onOpenRequested',
    'saved-list-item-delete': '_onDeleteRequested',
    'delete-selected': '_deleteSelected'
  },

  observers: [
    '_prepareProject(opened, routeParams.projectId)',
    '_projectChanged(project.*)',
    '_setLoaderState(opened)'
  ],

  onShow: function() {
    this._setPageTitle('Project');
    this._prepareProject();
  },
  onHide: function() {
    this._setPageTitle('');
    this.projectId = undefined;
  },

  _getDb: function() {
    return new PouchDB('legacy-projects');
  },

  _prepareProject: function(opened, projectId) {
    if (!opened || !projectId) {
      return;
    }
    this.requests = [];
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

  _projectError: function(e) {
    this.fire('app-log', {'message': ['Project ctrl', e], 'level': 'error'});
  },

  _projectSaved: function() {

  },

  // Handler for name change in the view.
  _projectNameChangedInView: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.project = e.detail.project;
    this.cancelDebouncer('project-name-change-request');
    this.debounce('project-name-change-request', this._pouchNameChanged.bind(this), 250);
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
    e.stopPropagation();

    this.fire('request-name-change', {
      'dbName': 'saved-requests',
      'name': e.detail.item.name,
      'id': e.detail.item._id
    });
  },

  _requestSaveError: function(e) {
    this.fire('app-log', {'message': ['Request udate', e], 'level': 'error'});
    StatusNotification.notify({
      message: 'Unable to update request data. ' + e.message
    });
    this.fire('send-analytics', {
      type: 'exception',
      description: e.detail.message,
      fatal: false
    });
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
    res.sort((a, b) => {
      if (a.projectOrder > b.projectOrder) {
        return 1;
      }
      if (a.projectOrder < b.projectOrder) {
        return -1;
      }
      return 0;
    });
    this.set('requests', res);
    this.fire('request-objects-restored', {
      items: docs,
      type: 'saved'
    });
  },

  _deleteRequested: function(e, data) {
    this._deleteRequestedNew(e, data);
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
      projects: [this.project],
      type: 'saved'
    });
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.fileSuggestedName = 'arc-project-export-' + day + '-' + month + '-' +
      year + '-export.json';
    this.exportMime = 'json';
    this.exportData();
    this.fire('send-analytics', {
      type: 'event',
      category: 'Engagement',
      action: 'Click',
      label: 'Export project as file'
    });
  },

  onFileSaved: function() {
    StatusNotification.notify({
      message: 'Project saved in file. '
    });
  },

  _projectsRelatedRead: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this._setLoadingData(false);
  },

  _projectChanged: function() {
    var view = Polymer.dom(this).queryDistributedElements('arc-project-view')[0];
    if (!view) {
      return console.error('The project controller view couldn\'t be found.');
    }
    view.project = this.project;
  },

  _updateItemsOrder: function() {
    var items = this.requests;
    var update = [];
    items.forEach((i, index) => {
      if (i.projectOrder !== index) {
        i.projectOrder = index;
        update.push(i);
      }
    });

    var promises = update.map((i) => this._updateItem(i));
    Promise.all(promises)
    .catch((e) => {
      StatusNotification.notify({
        message: 'Unable to update order. ' + e.message
      });
    });
  },

  _updateItem: function(item) {
    var event = this.fire('request-object-change', {
      dbName: 'saved-requests',
      request: item
    });

    if (!event.detail.result) {
      let msg = event.detail.message || 'Model not found';
      return Promise.reject(new Error(msg));
    }
    return event.detail.result;
  },

  _onOpenRequested: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var url = 'request/saved/' + encodeURIComponent(e.detail.item._id);
    page(url);
  },

  _onDeleteRequested: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteItems([e.detail.item]);
  },

  _deleteSelected: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.currentSelection || !this.currentSelection.length) {
      return;
    }
    this.deleteItems(this.currentSelection);
  },

  deleteItems: function(items) {
    this._deleteRevertable('saved-requests', items)
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
        message: 'Unable to deleting entries. ' + e.message
      });
      this.fire('app-log', {
        message: ['Error deleting entries', e],
        level: e
      });
      console.error(e);
    });
  },

  _setLoaderState: function(opened) {
    if (opened) {
      this._setLoadingData(true);
    }
  }
});
})();
