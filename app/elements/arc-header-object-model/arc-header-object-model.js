(function() {
'use strict';
Polymer({
  is: 'arc-header-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],

  queryAutocomplete: function() {
    return arc.app.db.idb.open()
      .then((db) => {
        let query = this.objectId.toLowerCase();
        return db.headers
          .where('type')
          .equalsIgnoreCase('request')
          .and((item) => item.key.toLowerCase().indexOf(query) !== -1)
          .toArray()
          .finally(() => {
            db.close();
          });
      })
      .then((data) => {
        if (!data || !data.length) {
          data = [];
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((cause) => {
        this.fire('app-log', {'message': cause, 'level': 'error'});
        this.fire('send-analytics', {
          type: 'exception',
          description: cause.message,
          fatal: true
        });
        this.fire('error', {
          error: cause
        });
        throw cause;
      });
  },

  getObject: function() {
    return arc.app.db.idb.open()
      .then((db) => {
        return db.headers
          .where('key')
          .equalsIgnoreCase(this.objectId[0])
          .and((item) => item.type === this.objectId[1])
          .toArray()
          // .get(this.objectId)
          .finally(() => {
            db.close();
          });
      })
      .then((data) => {
        if (data && data.length) {
          data = data[0];
        } else {
          data = null;
        }
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((cause) => {
        this.fire('app-log', {'message': cause, 'level': 'error'});
        this.fire('send-analytics', {
          type: 'exception',
          description: 'genericGetObject:' + cause.message,
          fatal: false
        });
        this.fire('error', {
          error: cause
        });
        throw cause;
      });
  }
});
})();
