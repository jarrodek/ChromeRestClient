Polymer({
  is: 'saved-menu',

  behaviors: [
    ArcBehaviors.MenuListBehavior
  ],

  properties: {
    scrollTarget: {
      type: Object,
      value: function() {
        return this.$.list;
      }
    }
  },

  attached: function() {
    this.listen(window, 'request-object-changed', '_savedChanged');
    this.listen(window, 'request-objects-deleted', '_savedDeleted');
    this.listen(window, 'data-imported', '_refreshSaved');
    this.listen(window, 'datastrores-destroyed', '_onDatabaseDestroy');
  },

  detached: function() {
    this.unlisten(window, 'history-object-changed', '_savedChanged');
    this.unlisten(window, 'request-objects-deleted', '_savedDeleted');
    this.unlisten(window, 'data-imported', '_refreshSaved');
    this.unlisten(window, 'datastrores-destroyed', '_onDatabaseDestroy');
  },

  _onDatabaseDestroy: function(e) {
    var databases = e.detail.datastores;
    if (!databases || !databases.length) {
      return;
    }
    if (databases.indexOf('saved-requests') === -1) {
      return;
    }
    var db = this._getDb();
    db.close().then(() => {
      this.refresh();
    });
  },

  _refreshSaved: function() {
    this.reset();
    this._makeQuery();
  },
  /**
   * Accepts currently selected items and enters it into a text field.
   */
  _acceptSelection: function(e) {
    if (!this.opened) {
      return;
    }
    var index = this._findDataInPath(e, 'index');
    if (index === undefined) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    index = Number(index);
    if (index !== index) {
      return;
    }
    var value = this.items[index];
    if (!value) {
      return;
    }

    var url = 'request/saved/' + encodeURIComponent(value._id);
    page(url);
  },

  _getDb: function() {
    return new PouchDB('saved-requests');
  },

  _processResults: function(res) {
    res = res.map((item) => {
      //"NAME/URL/METHOD"
      let parts  = item.split('/');
      let name = decodeURIComponent(parts[0]);
      let url = decodeURIComponent(parts[1]);
      let method = decodeURIComponent(parts[2]);
      return {
        _id: item,
        name: name,
        method: method,
        url: url
      };
    });
    // sort by updated
    // res.sort(this._sortFunction);
    return res;
  },

  _sortFunction: function(a, b) {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  },

  _savedChanged: function(e) {
    if (!this.opened) {
      return;
    }
    var changedItem = Object.assign({}, e.detail.request);
    var id = e.detail.oldId || changedItem._id;
    var items = this.items;
    if (!items) {
      this.set('items', []);
    }
    if (!this.items.length) {
      this.push('items', changedItem);
      return;
    }
    var index = items.findIndex((i) => i._id === id);
    if (index === -1) {
      // items.push(changedItem);
      // items.sort(this._sortFunction);
      // this.set('items', items);
      this.push('items', changedItem);
    } else {
      this.set(['items', index], changedItem);
    }
  },

  _savedDeleted: function(e) {
    if (e.detail.type !== 'saved') {
      return;
    }
    if (!e.detail.items || !e.detail.items.length) {
      return;
    }
    e.detail.items.forEach((id) => {
      let index = this.items.findIndex((item) => item._id === id);
      if (index !== -1) {
        this.splice('items', index, 1);
      }
    });
  }

});
