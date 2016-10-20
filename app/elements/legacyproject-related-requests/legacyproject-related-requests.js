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
        notify: true
      }
    },

    observers: [
      '_query(projectId)'
    ],

    _query: function(projectId) {
      if (!projectId) {
        return;
      }
      if (!this.db) {
        this.db = new PouchDB('saved-requests');
      }
      this.db.createIndex({
        index: {
          fields: ['legacyProject']
        }
      })
      .then(() => {
        return this.db.find({
          selector: {
            legacyProject: projectId
          },
          fields: ['_id', 'name']
        });
      })
      .then((r) => this.__processData(r))
      .then((r) => this.set('relatedRequests', r))
      .then(() => {
        return this.db.close();
      })
      .then(() => {
        this.db = null;
      });
    },

    __processData: function(result) {
      if (!result.docs.length) {
        return [];
      }
      return result.docs.map((i) => {
        i.id = i._id;
        return i;
      });
    }
  });
})();
