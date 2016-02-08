'use strict';
/**
 * ARC's behaviors namespace.
 *
 * @namespace
 */
window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * Behavior that highlights stuff.
 *
 * @polymerBehavior
 */
ArcBehaviors.ArcModelBehavior = {
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
     * Can be RequestObject or array of RequestObjects
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
     * Execute query and get an array with the results sorted by given property.
     */
    sortBy: String,
    /**
     * If true the `data` will be saved automatically right after change.
     */
    auto: Boolean
  },
  /**
   * Performs a query when objectId change.
   */
  _objectIdChanged: function() {
    this.query();
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
   */
  genericSave: function(table) {
    arc.app.db.idb.open()
      .then(function(db) {
        db.transaction('rw', db[table], function(table) {
            if (this.data instanceof Array) {
              this.data.forEach((item) => {
                table.put(item);
              });
            } else {
              table.put(this.data);
            }
          }.bind(this))
          .then(() => {
            this.fire('save', {
              data: this.data
            });
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
   * Query the table.
   *
   * @param {String} table A table name to perform query operation on.
   */
  genericQuery: function(table) {
    arc.app.db.idb.open()
      .then(function(db) {
        let result;
        table = db[table];
        if (this.objectId instanceof Array) {
          //db[TABLE-NAME].schema.primKey.keyPath
          result = table.where(':id').anyOf(this.objectId);
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          result = table.toArray();
        }
        if (this.offset) {
          result = result.offset(this.offset);
        }
        if (this.limit) {
          result = result.limit(this.limit);
        }
        if (this.sortBy) {
          result = result.sortBy(this.sortBy);
        }
        return result.finally(function() {
          db.close();
        });
      }.bind(this))
      .then(function(data) {
        if (data.length === 0) {
          data = null;
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
      }.bind(this))
      .catch(function(cause) {
        arc.app.analytics.sendException('arc-model::genericQuery::' + JSON.stringify(cause), false);
        this.fire('error', {
          error: cause
        });
      });
  },
  /**
   * Remove current data from the store.
   * This method will try delete object for given id(s) in `objectId` attribute.
   * If this attribute is empty then it will delete objects from the `data` attribute.
   *
   * @param {String} table A table name to perform delete operation on.
   */
  genericRemove: function(table) {
    arc.app.db.idb.open()
      .then(function(db) {
        db.transaction('rw', db[table], function(table) {
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
          }.bind(this))
          .then(() => {
            this.set('data', null);
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
      }.bind(this));
  }
};
