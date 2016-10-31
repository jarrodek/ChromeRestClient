Polymer({
  is: 'variable-item',

  properties: {
    docId: String,
    /**
     * A variable database object.
     * Initially it will contain an _id and _rev object and data will be get from the database.
     * Special case is when creating new variable. It will then contain an initial data but no ID.
     */
    item: Object,

    reservedNames: {
      type: Array,
      value: function() {
        return ['now', 'random'];
      }
    }
  },

  listeners: {
    'change': '_somethingChanged',
    'input': '_somethingChanged'
  },

  _somethingChanged: function() {
    var i = this.item;
    if (!i || i._id || this._saveInited) {
      // only react if this is new object.
      return;
    }
    if (i.variable && i.value) {
      this._saveInited = true;
      this.set('item.enabled', true);
      this.$.doc.save();
    }
  },

  _removeVariable: function() {
    var id = this.item._id;
    this.$.doc.destroy().catch(() => {});
    this.$.doc.transactionsComplete.then(() => {
      // Doc will try to call internal function and error will be thrown because
      // the doc is not attached to the document anymore (removed by parent). So the remove
      // event must be fired outside the promise.
      this.async(() => {
        this.fire('variable-deleted', {
          id: id
        });
      }, 1);
    });
  }
});
