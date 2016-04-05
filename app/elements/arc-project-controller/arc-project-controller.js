Polymer({
  is: 'arc-project-controller',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],

  properties: {
    /**
     * Route params passed from the router.
     */
    routeParams: {
      type: Object,
      observer: '_prepareProject'
    }
  },

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
      StatusNotification.notify({
        message: 'Unable read project details (ID is undefined).'
      });
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
    console.log('_projectReady', project);
    this.$.requestModel.objectId = project.requestIds;
    this.$.requestModel.query();
  },

  _requestReady: function(e) {
    var requests = e.detail.data;
    if (!requests) {
      return;
    }
    console.log('_requestReady', requests);
  },

  _projectError: function(e) {
    console.log('_projectError', e);
  },

  _projectSaved: function(e) {
    console.log('_projectSaved', e);
  }
});
