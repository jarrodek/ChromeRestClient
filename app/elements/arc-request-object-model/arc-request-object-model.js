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
          result = table.where(':id').anyOf(this.objectId);
        } else if (this.objectId) {
          result = table.get(this.objectId);
        } else {
          result = table.where('type').equals(this.requestType);
        }
        if (this.sortBy) {
          result = result.sortBy(this.sortBy);
        }
        if (result.toArray) {
          result = result.toArray();
        }
        return result.finally(function() {
          db.close();
        });
      }.bind(this))
      .then(function(data) {
        if (data.length === 0) {
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
          data.forEach((item) => item._har = new HAR.Log(item._har));
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
      }.bind(this)).catch((err) => {
        console.error(cause);
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
    this.genericRemove('requestObject');
  },
  /**
   * Removed unescessary data from the object before save.
   */
  _cleanObject: function() {
    delete this.data.selected;
    delete this.data.kind;
  }
});
