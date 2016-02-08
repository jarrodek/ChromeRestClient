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
    }
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
        if (data.length === 0) {
          data = null;
        }
        this.data = data;
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
  /**
   * Remove current data from the store.
   */
  remove: function() {
    this.genericRemove(db.requestObject);
  }
});
