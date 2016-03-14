Polymer({
  is: 'arc-header-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],

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
        console.error(cause);
        arc.app.analytics.sendException('arc-model::genericGetObject::' +
          JSON.stringify(cause), false);
        this.fire('error', {
          error: cause
        });
        throw cause;
      });
  }
});
