'use strict';

Polymer({
  is: 'arc-request-object-model',
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
      observer: '_requestIdChanged'
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
   * Perform a query on requestId change
   */
  _requestIdChanged: function() {
    this.query();
  },
  /**
   * Gather arguments and perform a query to the datastore.
   */
  query: function() {
    arc.app.db.idb.open()
      .then(function(db) {
        let table = db.requestObject;
        let result;
        if (this.objectId instanceof Array) {
          //db[TABLE-NAME].schema.primKey.keyPath
          result = table.where('id').anyOf(this.objectId);
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          result = table.where('type').equals(this.requestType).toArray();
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
        let transformed = [];
        data.forEach((item) => transformed.push(new RequestObject(item)));
        if (transformed.length === 0) {
          transformed = null;
        }
        this.data = transformed;
        this.fire('data-ready', {
          data: data
        });
      }.bind(this));
  },
  /**
   * Save current `data` to the database.
   */
  save: function() {
    arc.app.db.idb.open()
      .then(function(db) {
        db.transaction('rw', db.requestObject, function() {
            if (this.data instanceof Array) {
              this.data.forEach((item) => {
                db.requestObject.put(item);
              });
            } else {
              db.requestObject.put(this.data);
            }
          }.bind(this))
          .then(() => {
            this.fire('save', {
              data: this.data
            });
          })
          .catch((e) => {
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
      }.bind(this));
  },
  /** Save data if auto is enabled.*/
  _dataChanged: function() {
    if (this.auto) {
      this.save();
    }
  },
  /**
   * Remove current data from the store.
   */
  remove: function() {
    arc.app.db.idb.open()
      .then(function(db) {
        db.transaction('rw', db.requestObject, function() {
            if (this.data instanceof Array) {
              let promises = [];
              this.data.forEach((item) => {
                promises.push(db.requestObject.delete(item.id));
              });
              return Dexie.Promise.all(promises);
            }
            return db.requestObject.delete(this.data.id);
          }.bind(this))
          .then(() => {
            this.set('data', null);
            this.fire('deleted');
          })
          .catch((e) => {
            this.fire('error', {
              error: e
            });
          })
          .finally(function() {
            db.close();
          });
      }.bind(this));
  }
});
