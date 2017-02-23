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
      _lastReadProjectId: String,
      // If set to false the database query will be disabled on project id change.
      active: {
        type: Boolean
      },

      // If true then it's making query to the datastore.
      querying: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true
      }
    },

    observers: [
      '_query(active, projectId)'
    ],

    attached: function() {
      this.listen(window, 'request-object-changed', '_requestObjectChanged');
      this.listen(window, 'request-object-deleted', '_requestObjectDeleted');
      this.listen(window, 'request-objects-deleted', '_requestObjectsDeleted');
      this.listen(window, 'request-objects-restored', '_requestObjectsRestored');
    },

    detached: function() {
      this.unlisten(window, 'request-object-changed', '_requestObjectChanged');
      this.unlisten(window, 'request-object-deleted', '_requestObjectDeleted');
      this.unlisten(window, 'request-objects-deleted', '_requestObjectsDeleted');
      this.unlisten(window, 'request-objects-restored', '_requestObjectsRestored');
    },

    _requestObjectChanged: function(e) {
      var request = e.detail.request;
      if (!request || !request.legacyProject || request.legacyProject !== this.projectId) {
        return; // not related.
      }
      var items = this.relatedRequests;
      if (!items || !items.length) {
        this.set('relatedRequests', [request]);
        return;
      }
      var oldId = e.detail.oldId;
      var updated = false;
      for (let i = 0, len = items.length; i < len; i++) {
        if (items[i]._id === oldId) {
          items[i] = e.detail.request;
          updated = true;
          break;
        }
      }
      if (!updated) {
        // new request
        items.push(request);
      }
      items = this.__processData(items);
      this.set('relatedRequests', items);
    },

    _requestObjectDeleted: function(e) {
      if (!e.detail.id) {
        return;
      }
      this._checkDeleted([e.detail.id]);
    },

    _requestObjectsDeleted: function(e) {
      var ids = e.detail.items;
      if (!ids || !ids.length) {
        return;
      }
      this._checkDeleted(ids);
    },

    _checkDeleted: function(ids) {
      var items = this.relatedRequests;
      if (!items || !items.length) {
        return;
      }
      for (let i = items.length - 1; i >= 0; i--) {
        if (~ids.indexOf(items[i]._id)) {
          this.splice('relatedRequests', i, 1);
        }
      }
    },

    _requestObjectsRestored: function(e) {
      if (e.detail.type !== 'saved') {
        return;
      }
      var pid = this.projectId;
      if (!pid) {
        return;
      }
      var restoredItem = e.detail.items;
      var items = this.relatedRequests;
      var currentProjectsItems = restoredItem.filter((item) => {
        if (item.legacyProject === pid) {
          let has = false;
          for (let i = 0, len = items.length; i < len; i++) {
            if (items[i]._id === item._id) {
              has = true;
              break;
            }
          }
          return !has;
        }
        return false;
      });
      if (!currentProjectsItems.length) {
        return;
      }
      if (!items) {
        items = [];
      }
      items = items.concat(currentProjectsItems);
      items = this.__processData(items);
      this.set('relatedRequests', items);
    },

    _query: function(active, projectId) {
      if (!active || !projectId) {
        return;
      }
      // if (projectId === this._lastReadProjectId) {
      //   return;
      // }
      // console.time('Related request query');

      this._setQuerying(true);
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
          this._setQuerying(false);
          this.set('relatedRequests', r);
          // console.timeEnd('Related request query');
          this.fire('project-related-requests-read', {
            projectId: projectId,
            items: r
          });
        })
        .catch((e) => {
          this._setQuerying(false);
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
      result.sort((a, b) => {
        if (a.projectOrder > b.projectOrder) {
          return 1;
        }
        if (a.projectOrder < b.projectOrder) {
          return -1;
        }
        return 0;
      });
      return result.map((i) => {
        i.id = i._id;
        return i;
      });
    }
  });
})();
