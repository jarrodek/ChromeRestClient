Polymer({
  is: 'arc-historyurl-model',

  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],

  getObject: function() {
    return this.genericGetObject('historyUrls');
  },

  save: function() {
    return this.genericSave('historyUrls');
  },

  query: function() {
    var opened;
    var context = this;
    return arc.app.db.idb.open()
      .then((db) => {
        opened = db;
        return db.historyUrls.filter((item) => {
          return item.url.indexOf(context.objectId) !== -1;
        })
        .toArray();
      })
      .then((data) => {
        this.data = data;
        this.fire('data-ready', {
          data: data
        });
        return data;
      })
      .catch((error) => {
        console.error('Error in query', cause);
        arc.app.analytics.sendException('arc-historyurl-model::query::' +
          JSON.stringify(cause), false);
        this.fire('error', {
          error: cause
        });
        return Promise.reject(cause);
      })
      .finally(function() {
        opened.close();
      });
  }
});
