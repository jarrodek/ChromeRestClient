'use strict';

Polymer({
  is: 'arc-request-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  properties: {
    /**
     * RequestObject type.
     * Can be either `saved` or `history`
     */
    requestType: {
      type: String,
      value: 'saved'
    },
    /**
     * If specified the model will not look by keys but but will try
     * to find by paseed term in available keys.
     */
    searchTerm: {
      type: String
    }
  },
  /**
   * Gather arguments and perform a query to the datastore.
   */
  query: function() {
    var manualSort = false;
    var excludedRequests = [];
    return this._getProjectRequestsList()
      .then((excluded) => excludedRequests = excluded)
      .then(arc.app.db.idb.open)
      .then((db) => {
        let type = this.requestType;
        let table = db.requestObject;
        let result;
        let indexes = [];
        table.schema.indexes.forEach((item) => {
          if (typeof item.keyPath === 'string') {
            indexes.push(item.keyPath);
          }
        });
        if (this.searchTerm) {
          let term = String(this.searchTerm).toLowerCase();
          result = table.filter((ro) => {
            if (ro.type !== type) {
              return false;
            }
            if (ro.url.toLowerCase().indexOf(term) !== -1) {
              return true;
            }
            if (ro._name && ro._name.indexOf(term) !== -1) {
              return true;
            }
            if (ro.method.toLowerCase().indexOf(term) !== -1) {
              return true;
            }
            return false;
          });
        } else if (this.objectId instanceof Array) {
          result = table.where(':id').anyOf(this.objectId);
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          //result = table.where('type').equals(this.requestType);
          result = table.where(':id').noneOf(excludedRequests)
            .and((item) => {
              return item.type === type;
            });
        }
        if (this.sortBy) {
          if (indexes.indexOf(this.sortBy) === -1) {
            manualSort = true;
          } else {
            result = result.sortBy(this.sortBy);
          }
        }
        if (result.toArray) {
          result = result.toArray();
        }
        return result.catch((cause) => {
            console.error(cause);
            this.fire('error', {
              error: cause
            });
          })
          .finally(function() {
            db.close();
          });
      })
      .then((data) => {
        if (data.length === 0) {
          data = null;
        } else {
          let dir = this.direction;
          if (!dir) {
            dir = 'asc';
          }
          if (this.sortBy && manualSort) {
            data = this._sortData(data, this.sortBy, dir);
          } else if (dir && dir === 'desc') {
            data.reverse();
          }
          if (this.offset || this.limit) {
            let limit = this.limit;
            let offset = this.offset;
            if (!Number.isInteger(offset)) {
              offset = 0;
            }
            if (!Number.isInteger(limit)) {
              limit = data.length;
            }
            data = data.slice(offset, offset + limit);
          }
          data.forEach((item) => item._har = new HAR.Log(item._har));
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
      }).catch((cause) => {
        console.error(cause);
        this.fire('error', {
          error: cause
        });
      });
  },
  /**
   * Save current `data` to the database.
   */
  save: function() {
    if (!this.data) {
      return Dexie.Promise.reject(new Error('Nothing to save.'));
    }
    this._cleanObject();
    this.genericSave('requestObject');
  },
  /**
   * Remove current data from the store.
   */
  remove: function() {
    // if the whole table is to be removed, use custom query.
    // if this is history clear all type history
    // if this is saved clear all type saved and not in any project.
    if (!this.data && !this.objectId) {
      if (this.forceDeleteAll) {
        return this._deleteAll();
      } else {
        console.warn('Nothing to delete.');
      }
    }
    this.genericRemove('requestObject');
  },
  /** Custom function to datae all objects by type. */
  _deleteAll: function() {
    var type = this.requestType;
    if (this.requestType === 'history') {
      return arc.app.db.idb.open()
        .then((db) => {
          return db.transaction('rw', db.requestObject, (table) => {
              return table
                .where('type')
                .equals(type)
                .toCollection()
                .delete();
            })
            .then(() => {
              this.fire('deleted');
            })
            .catch((e) => {
              arc.app.analytics.sendException('request-model::_deleteAll::' +
                JSON.stringify(e), false);
              this.fire('error', {
                error: e
              });
            })
            .finally(function() {
              db.close();
            });
        });
    } else {
      return arc.app.db.idb.open()
        .then((db) => {
          return this._getProjectRequestsList()
            .then((excluded) => {
              return db.transaction('rw', db.requestObject, (table) => {
                return db.requestObject
                  .where(':id').noneOf(excluded)
                  .and((item) => {
                    return item.type === type;
                  })
                  .delete();
              })
              .then(() => {
                this.fire('deleted');
              });
            })
            .catch((e) => {
              arc.app.analytics.sendException('request-model::_deleteAll2::' +
                JSON.stringify(e), false);
              this.fire('error', {
                error: e
              });
            })
            .finally(function() {
              db.close();
            });
        });
    }
  },
  /**
   * Get IDs of all requests belonging to any project.
   */
  _getProjectRequestsList: function() {
    return arc.app.db.idb.open()
      .then((db) => {
        return db.projectObjects.reverse().toArray()
          .then((projects) => {
            let excluded = [];
            projects.forEach((project) => excluded = excluded.concat(project.requestIds));
            return excluded;
          })
          .catch((e) => {
            arc.app.analytics.sendException('request-model::_deleteAll2::' +
              JSON.stringify(e), false);
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
      });
  },
  /**
   * Removed unescessary data from the object before save.
   */
  _cleanObject: function() {
    delete this.data.selected;
    delete this.data.kind;
  },
  /**
   * Manually sort data in an array.
   *
   * @example
   * this._sortData(obj, 'har.pages.0.time', 'asc');
   *
   * @param {Array} data An array to sort
   * @param {String} sort Apath to the property to sort on
   * @param {String} dir A direction of sorting. Can be `asc` or `desc`.
   */
  _sortData: function(data, sort, dir) {
    data.sort((a, b) => {
      let aProp = _.get(a, sort);
      let bProp = _.get(b, sort);
      if (isNaN(aProp)) {
        let aTime = new Date(aProp).getTime();
        if (!isNaN(aTime)) {
          aProp = aTime;
        } else if (typeof aProp !== 'string') {
          aProp = aProp.toString();
        }
      }
      if (isNaN(bProp)) {
        let bTime = new Date(bProp).getTime();
        if (!isNaN(bTime)) {
          bProp = bTime;
        } else if (typeof bProp !== 'string') {
          bProp = bProp.toString();
        }
      }
      if (aProp > bProp) {
        return dir === 'asc' ? 1 : -1;
      }
      if (aProp < bProp) {
        return dir === 'asc' ? -1 : 1;
      }
      if (aProp === bProp) {
        return 0;
      }
    });
    return data;
  }
});
