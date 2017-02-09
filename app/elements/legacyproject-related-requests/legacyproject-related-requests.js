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
      },
      // If true then a request object will contain all data. Otherwise only name and id.
      allData: Boolean,
      _lastReadProjectId: String
    },

    observers: [
      '_query(projectId)'
    ],

    attached: function() {
      this.listen(window, 'request-object-changed', '_requestObjectChanged');
    },

    detached: function() {
      this.unlisten(window, 'request-object-changed', '_requestObjectChanged');
    },

    _requestObjectChanged: function(e) {
      var items = this.relatedRequests;
      if (!items || !items.length) {
        return;
      }
      var oldId = e.detail.oldId;
      for (let i = 0, len = items.length; i < len; i++) {
        if (items[i]._id === oldId) {
          this.set(['relatedRequests', i], e.detail.request);
          break;
        }
      }
    },

    _query: function(projectId) {
      if (!projectId) {
        return;
      }
      // if (projectId === this._lastReadProjectId) {
      //   return;
      // }
      // console.time('Related request query');
      this._lastReadProjectId = projectId;
      var db = new PouchDB('saved-requests');

      db.allDocs()
        .then((r) => {
          return r.rows.filter((i) => i.id.indexOf(projectId) !== -1);
        })
        .then((r) => Promise.all(r.map((i) => db.get(i.id))))
        .then((r) => {
          if (!this.allData) {
            r = r.map((i) => {
              return {
                _id: i._id,
                _rev: i._rev,
                name: i.name
              };
            });
          }
          return r;
        })
        .then((r) => this.__processData(r))
        .then((r) => {
          this.set('relatedRequests', r);
          // console.timeEnd('Related request query');
          this.fire('project-related-requests-read', {
            projectId: projectId,
            items: r
          });
        })
        .catch((e) => {
          this.fire('app-log', {
            'message': ['Query for project\'s related requests', e],
            'level': 'error'
          });
          console.error('Query for project\'s related requests', e);
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
          this.fire('legacyproject-related-requests-error', {
            message: e.message
          });
        });
    },

    __processData: function(result) {
      if (!result.length) {
        return [];
      }
      return result.map((i) => {
        i.id = i._id;
        return i;
      });
    }
  });
})();
