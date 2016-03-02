'use strict';

Polymer({
  is: 'arc-project-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  /**
   * List projects.
   */
  query: function() {
    return this.genericQuery('projectObjects');
  },

  save: function() {
    return this.genericSave('projectObjects')
    .then(() => {
      this.fire('project-saved');
    });
  },

  remove: function() {
    return this.genericRemove('projectObjects')
    .then(() => {
      this.fire('project-removed');
    });
  },

  getObject: function() {
    return this.genericGetObject('projectObjects');
  },
  /**
   * Retreives information about project that is associated with given requestId
   *
   * @param {Number} requestId A request id to look for.
   */
  getForRequest: function(requestId) {
    return arc.app.db.idb.open()
      .then((db) => {
        return db.projectObjects
          .where('requestIds')
          .equals(requestId)
          .first()
          .finally(() => {
            db.close();
          });
      });
  },

  /**
   * Get a list requests associated with the project.
   * The promise will always result with array.
   *
   * @return {Promise} Fulfiled promise will result with list of associated requests.
   */
  getRequests: function() {
    let requests = [];
    if (!this.data) {
      return Promise.resolve(requests);
    }
    let ids = [];
    if (this.data instanceof Array) {
      this.data.forEach((item) => {
        if (item.requestIds) {
          ids = ids.concat(item.requestIds);
        }
      });
    } else {
      ids = this.data.requestIds;
    }
    return arc.app.db.idb.open()
      .then(function(db) {
        return db.requestObject
          .where(':id').anyOf(ids)
          .toArray()
          .finally(function() {
            db.close();
          });
      });
  },
  /**
   * Associate a {@link requestObject} with this {@link ProjectObject}.
   * If the request wasn't saved before it will be stored first.
   * If the operation fails nothing change in the datastore.
   *
   * @param {RequestObject|Array<RequestObject>} requests A request to be associated with
   * this project
   * @return {Promise} Fulfiled promise will result with {@link RequestObject} or list of
   * {@link RequestObject}s if passed argument is an array.
   */
  addRequests: function(requests) {
    if (this.data instanceof Array) {
      throw new Error('A `request` can be added to only one project.');
    }
    let autoValue = this.auto;
    this.auto = false;
    return arc.app.db.idb.open()
      .then(function(db) {
        return db.transaction('rw', db.requestObject, db.projectObjects, function() {
            return new Dexie.Promise(function(resolve, reject) {
                if (requests instanceof Array) {
                  let promises = [];
                  requests.forEach((item) => promises.push(db.requestObject.put(item)));
                  Dexie.Promise.all(promises)
                    .then(() => {
                      resolve();
                    })
                    .catch((e) => {
                      reject(e);
                    });
                } else {
                  db.requestObject.put(requests)
                    .then(() => {
                      resolve();
                    })
                    .catch((e) => {
                      reject(e);
                    });
                }
              })
              .then(function() {
                if (!this.data.requestIds) {
                  this.data.requestIds = [];
                }
                if (requests instanceof Array) {
                  let list = [];
                  requests.forEach((item) => list.push(item.id));
                  this.data.requestIds = this.data.requestIds.concat(list);
                } else {
                  this.data.requestIds.push(requests.id);
                }
                return db.projectObjects.put(this.data)
                  .then(function() {
                    this.auto = autoValue;
                    this.fire('save', {
                      data: this.data
                    });
                    this.fire('project-appended');
                    return requests;
                  }.bind(this));
              }.bind(this));
          }.bind(this))
          .finally(function() {
            db.close();
          });
      }.bind(this));
  }

});
