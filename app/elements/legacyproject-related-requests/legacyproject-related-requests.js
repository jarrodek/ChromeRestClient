(function() {
  'use strict';
  /**
   * Element that is responsible for restoring associated to current project request data.
   */
  Polymer({
    is: 'legacyproject-related-requests',

    properties: {
      projectId: String,
      relatedRequests: {
        type: Array,
        notify: true,
        value: function() {
          return [];
        }
      }
    },

    observers: [
      '_projectChanged(projectId)'
    ],

    _projectChanged: function() {
      this.set('relatedRequests', []);
      let e = this.fire('arc-database-query', {
        store: 'saved-requests',
        selector: 'legacyProject $eq \'' + this.projectId + '\'',
        sort: ['_id'],
        fields: ['_id', 'name']
      });
      e.detail.result
      .then((result) => {
        result.sort((a, b) => {
          if (a.name === b.name) {
            return 0;
          }
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
        });
        result = result.map((i) => {
          i.id = i._id;
          return i;
        });
        this.set('relatedRequests', result);
      })
      .catch((err) => {
        arc.app.analytics.sendException(err.message, true);
        this.fire('app-log', {
          'message': err,
          'level': 'error'
        });
        this.fire('error', {
          'error': err
        });
      });
    }
  });
})();
