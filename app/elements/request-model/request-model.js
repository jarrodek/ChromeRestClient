(function() {
  'use strict';
  Polymer({
    is: 'request-model',

    attached: function() {
      this.listen(document, 'request-name-change', '_handleNameChange');
      this.listen(document, 'request-object-change', '_handleObjectSave');
      this.listen(document, 'request-object-delete', '_handleObjectDelete');
      this.listen(document, 'request-objects-delete', '_handleObjectsDelete');
    },

    detached: function() {
      this.unlisten(document, 'request-name-change', '_handleNameChange');
      this.unlisten(document, 'request-object-change', '_handleObjectSave');
      this.unlisten(document, 'request-object-delete', '_handleObjectDelete');
      this.unlisten(document, 'request-objects-delete', '_handleObjectsDelete');
    },

    _getDb: function(dbName) {
      return new PouchDB(dbName);
    },

    _handleNameChange: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();

      if (!detail.dbName) {
        e.detail.error = true;
        e.detail.message = 'Store name must be provided';
        return;
      }

      if (!detail.name) {
        e.detail.error = true;
        e.detail.message = 'New name must be set';
        return;
      }

      if (!detail.request && !detail.id) {
        e.detail.error = true;
        e.detail.message = 'You must set either request object or request id.';
        return;
      }
      var request = detail.request;
      var requestId = detail.id;
      if (!request || !request._id || !request._rev) {
        if (!detail.id) {
          e.detail.error = true;
          e.detail.message = 'You must set either request object or request id.';
          return;
        }
        if (!requestId) {
          requestId = request._id;
        }
        request = null;
      }
      var db = this._getDb(detail.dbName);
      var p;
      if (!request) {
        p = db.get(requestId);
      } else {
        p = Promise.resolve(request);
      }
      e.detail.result = p
      .then((r) => {
        r.name = detail.name;
        request = r;
        return db.remove(r._id, r._rev);
      })
      .then(() => {
        let r = request;
        let id = encodeURIComponent(r.name) + '/' + encodeURIComponent(r.url) + '/' + r.method;
        if (this.saveToProject) {
          id += '/' + r.legacyProject;
        }
        r._id = id;
        delete r._rev;
        return db.put(r);
      })
      .then((insertResult) => {
        var oldRev = request._rev;
        request._rev = insertResult.rev;
        this.fire('request-object-changed', {
          request: request,
          oldRev: oldRev
        });
        return request;
      })
      // .then((request) => {
      //   return db.close()
      //   .then(() => request);
      // })
      .catch((e) => this._handleException(e));
    },

    _handleObjectSave: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();
      if (!detail.dbName) {
        e.detail.error = true;
        e.detail.message = 'Store name must be provided';
        return;
      }
      if (!detail.request) {
        e.detail.error = true;
        e.detail.message = 'You must set request object';
        return;
      }
      var db = this._getDb(detail.dbName);
      var p;
      var request = detail.request;
      if (!request._rev) {
        p = db.get(request._id).catch((e) => {
          if (e.status === 404) {
            // create new
            return {};
          }
          this._handleException(e);
        });
      } else {
        p = Promise.resolve(request);
      }
      e.detail.result = p
      .then((r) => {
        request = Object.assign({}, r, request);
        request.updated = Date.now();
        return db.put(request);
      })
      .then((insertResult) => {

        if (!insertResult.ok) {
          var e = new Error('Insert result is not OK.');
          this.fire('error', {
            error: e
          });
          return Promise.reject(e);
        }

        var oldRev = request._rev;
        request._rev = insertResult.rev;
        this.fire('request-object-changed', {
          request: request,
          oldRev: oldRev
        });
        return request;
      })
      // .then((request) => {
      //   return db.close()
      //   .then(() => request);
      // })
      .catch((e) => this._handleException(e));
    },

    _handleObjectDelete: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();
      if (!detail.dbName) {
        e.detail.error = true;
        e.detail.message = 'Store name must be provided';
        return;
      }
      var id = detail.id;
      var rev = detail.rev;
      if (!id || !rev) {
        e.detail.error = true;
        e.detail.message = 'You must set request id and rev';
        return;
      }
      var db = this._getDb(detail.dbName);
      e.detail.result = db.remove(id, rev)
      .then((result) => {
        if (!result.ok) {
          var e = new Error('Delete result is not OK.');
          this.fire('error', {
            error: e
          });
          return Promise.reject(e);
        }
        let returnData = {
          id: result.id,
          rev: result.rev,
          oldRev: rev
        };
        this.fire('request-object-deleted', returnData);
        return returnData;
      })
      .catch((e) => this._handleException(e));
    },

    _handleException: function(e) {
      this.fire('app-log', {
        'message': ['Change request name', e],
        'level': 'error'
      });
      console.error('Change request name', e);
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
      this.fire('error', {
        error: e
      });
      throw e;
    },

    _handleObjectsDelete: function(e, detail) {
      e.preventDefault();
      e.stopPropagation();
      if (!detail.dbName) {
        e.detail.error = true;
        e.detail.message = 'Store name must be provided';
        return;
      }

      if (!detail.items) {
        e.detail.error = true;
        e.detail.message = 'Provide items ids to delete.';
        return;
      }

      var db = this._getDb(detail.dbName);
      var oldData = [];
      e.detail.result = db.allDocs({
        keys: detail.items
      })
      .then((res) => {
        res = res.rows.filter((i) => {
          if (i.error) {
            console.error(i);
            return false;
          }
          return true;
        });
        oldData = res;
        return Promise.all(res.map((i) => db.remove(i.id, i.value.rev)));
      })
      .then(() => {
        oldData.forEach((i) => {
          this.fire('request-object-deleted', {
            id: i._id,
            oldRev: i._rev
          });
        });
      })
      .catch((e) => this._handleException(e));
    }
  });
})();
