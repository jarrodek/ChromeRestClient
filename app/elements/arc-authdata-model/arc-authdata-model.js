Polymer({
  is: 'arc-authdata-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  query: function(url, type) {
    return arc.app.db.idb.open()
      .then((db) => {
        url = url.toLowerCase();
        return db.basicAuth
          .where('url')
          .startsWithIgnoreCase(url)
          .and((item) => item.type === type)
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
        this.fire('app-log', {'message': cause.message, stack: cause.stack, 'level': 'error'});
        this.fire('send-analytics', {
          type: 'exception',
          description: cause.message,
          fatal: false
        });
        this.fire('error', {
          error: cause
        });
        throw cause;
      });
  },
  /**
   * Save current `data` to the database.
   */
  save: function() {
    if (!this.data) {
      return Dexie.Promise.reject(new Error('Nothing to save.'));
    }
    return this.genericSave('basicAuth');
  }
});
