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
    this.genericSave('requestObject');
  },
  /**
   * Remove current data from the store.
   */
  remove: function() {
    this.genericRemove('requestObject');
  }
  
});
