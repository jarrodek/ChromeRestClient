(function() {
'use strict';
/**
 * ARC's behaviors namespace.
 *
 * @namespace
 */
window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * Base behaviors for all models in ARC.
 * This behaviors contains genering CRUD methods that the models can implement. Models can also
 * override this methods to implement their own agorithm.
 *
 * ARC is using Dexie.js libarary as a wrapper for IDB. Dexie has many convienient methods to manage
 * database version, structure and keys. Also it simplifies querying the database.
 * Note however that the Dexie has it's own Promises implementation. It works like standard Promise
 * function but sometimes results are not as expected to be.
 *
 * @polymerBehavior
 */
window.ArcBehaviors.ArcModelBehavior = {
  /**
   * Fired when current data object or data objects has been deleted.
   *
   * @event deleted
   */
  /**
   * Fired when there was an error during datastore operation
   *
   * @event error
   * @param {Error} error An error description object.
   */
  /**
   * Fired when data has been read from the datastore and set to `data` attribute.
   *
   * @event data-ready
   * @param {Any} data Data read from the datastore
   */
  /**
   * Fired when data has been read from the datastore and set to `data` attribute.
   *
   * @event save
   * @param {Any} data Data saved to the datastore
   */
  properties: {
    /**
     * Current data.
     * It doesn't mean that the data are saved in the datastore. Them may be saved at the moment
     * or save function have never been called.
     * It's a genner for read data and setter for new / changed data.
     */
    data: {
      type: Object,
      notify: true,
      observer: '_dataChanged'
    },
    /**
     * RequestObject's id or array of ids.
     * When populated / changed the element will automatically query datastore for data.
     * Result will be in `data` attribute and `data-ready` event will be fired.
     */
    objectId: {
      type: Object,
      observer: '_objectIdChanged'
    },
    /**
     * Limit the result to given number of items
     */
    limit: Number,
    /**
     * Ignore N items before given offset and return the rest
     */
    offset: Number,
    /**
     * `data` will be sorted for given key.
     * Note that this should be a database key. If not, manual sorting is performed which may
     * influance performance. If sort is made on exising datastore key, native IDB sort is
     * performed using IDB cursor.
     */
    sortBy: String,
    /**
     * If true the `data` are read/saved automatically after key/data change.
     */
    auto: Boolean,
    /**
     * Query direction.
     * Set to `asc` (default) for from lowest primary key or `desc` otherwise.
     */
    direction: {
      type: String,
      value: 'asc'
    },
    /**
     * To clear the data store, before calling `genericRemove()` this must
     * be set to `true` or the model do not delete datastore and console.warn will be printed.
     * It's just additional layer of security to be sure that the operation was intentional.
     */
    forceDeleteAll: {
      type: Boolean,
      value: false
    }
  },
  /**
   * Performs a query when objectId change.
   */
  _objectIdChanged: function() {
    if (this.auto) {
      this.query();
    }
  },
  /**
   * Save data if auto is enabled.
   */
  _dataChanged: function() {
    if (this.auto) {
      this.save();
    }
  },
  /**
   * Perform a query on the store.
   */
  query: function() {
    console.warn('Model should implement its own `query` method');
    this.genericQuery();
  },
  /**
   * Save data into datastore.
   * This method will throw an error when the program will try to call it.
   * Model must implement it's own `save` function.
   */
  save: function() {
    throw new Error('Model must implement `save` method');
  },
  /**
   * Save current `data` to the database.
   *
   * @param {String} table A table name to perform save operation on.
   * @return {Promise} Fulfiled promise will result with saved id.
   */
  genericSave: function(table) {
    //console.log(this.data);
    return arc.app.db.idb.open()
      .then(function(db) {
        return db.transaction('rw', db[table], function(table) {
            if (this.data instanceof Array) {
              let promises = [];
              this.data.forEach((item) => {
                promises.push(table.put(item));
              });
              return Dexie.Promise.all(promises);
            }
            return table.put(this.data);
          }.bind(this))
          .then((id) => {
            let auto = this.auto;
            this.auto = false;
            this.objectId = id;
            this.auto = auto;
            this.fire('save', {
              data: this.data
            });
            return id;
          })
          .catch((e) => {
            arc.app.analytics.sendException('arc-model::genericSave::' +
              JSON.stringify(e), false);
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
      }.bind(this));
  },
  /**
   * Get object by it's primary key.
   *
   * @param {String} table A table name to perform query operation on.
   * @return {Promise} Fulfiled promise will result with get results.
   */
  genericGetObject: function(table) {
    return arc.app.db.idb.open()
      .then((db) => {
        return db[table]
          .get(this.objectId)
          .finally(() => {
            db.close();
          });
      })
      .then((data) => {
        let auto = this.auto;
        this.auto = false;
        this.data = data;
        this.auto = auto;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((cause) => {
        console.error(cause);
        arc.app.analytics.sendException('arc-model::genericGetObject::' +
          JSON.stringify(cause), false);
        this.fire('error', {
          error: cause
        });
        throw cause;
      });
  },
  /**
   * Query the table.
   *
   * @param {String} table A table name to perform query operation on.
   * @return {Promise} Fulfiled promise will result with query results.
   */
  genericQuery: function(table) {
    var opened;
    return arc.app.db.idb.open()
      .then((db) => {
        opened = db;
        let result;
        table = db[table];
        if (this.objectId instanceof Array) {
          if (table.schema.primKey.keyPath instanceof Array) {
            result = table.get(this.objectId);
          } else {
            result = table.where(':id').anyOf(this.objectId);
          }
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          result = table.toCollection();
        }
        if (this.sortBy) {
          result = result.sortBy(this.sortBy);
        }
        if (result.toArray) {
          result = result.toArray();
        }
        return result;
      })
      .then((data) => {
        if (!data) {
          data = null;
        } else if (data.length === 0) {
          data = null;
        } else {
          if (this.direction && this.direction === 'desc') {
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
        }
        let auto = this.auto;
        this.auto = false;
        this.data = data;
        this.auto = auto;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((cause) => {
        console.error('Error in generic query', cause);
        arc.app.analytics.sendException('arc-model::genericQuery::' +
          JSON.stringify(cause), false);
        this.fire('error', {
          error: cause
        });
        return Promise.reject(cause);
      })
      .finally(() => {
        if (opened) {
          opened.close();
        }
      });
  },
  /**
   * Remove current data from the store.
   * This method will try delete object for given id(s) in `objectId` attribute.
   * If this attribute is empty then it will delete objects from the `data` attribute.
   *
   * @param {String} table A table name to perform delete operation on.
   * @return {Promise} Fulfiled promise when object is deleted.
   */
  genericRemove: function(table) {
    return arc.app.db.idb.open()
      .then((db) => {
        return db.transaction('rw', db[table], (table) => {
          if (this.objectId) {
            if (this.objectId instanceof Array) {
              let promises = [];
              this.objectId.forEach((id) => {
                promises.push(table.delete(id));
              });
              return Dexie.Promise.all(promises);
            }
            return table.delete(this.objectId);
          }
          if (this.data) {
            let keyPath = table.schema.primKey.keyPath;
            if (this.data instanceof Array) {
              let promises = [];
              this.data.forEach((item) => {
                promises.push(table.delete(item[keyPath]));
              });
              return Dexie.Promise.all(promises);
            }
            return table.delete(this.data[keyPath]);
          }
          if (this.forceDeleteAll) {
            return table.toCollection().delete();
          }
          console.warn('nothing to delete...');
        })
        .then(() => {
          this.set('data', null);
          this.set('objectId', null);
          this.fire('deleted');
        })
        .catch((e) => {
          arc.app.analytics.sendException('arc-model::genericRemove::' +
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
};
})();
