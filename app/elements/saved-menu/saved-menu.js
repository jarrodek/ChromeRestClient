Polymer({
  is: 'saved-menu',

  behaviors: [
    Polymer.IronScrollTargetBehavior
  ],

  properties: {
    /**
     * Currently selected item on a history items list.
     * @type {Number}
     */
    selectedItem: {
      type: Number,
      value: 0
    },

    scrollTarget: {
      type: Object,
      value: function() {
        return this;
      }
    },
    /**
     * History items found in the datastore.
     */
    items: Array,

    hasItems: {
      type: Boolean,
      value: false,
      computed: '_computeHasItems(items.*)'
    },

    isAttached: Boolean,

    querying: {
      type: Boolean,
      readOnly: true
    },

    // current query options
    queryOptions: {
      type: Object,
      readOnly: true,
      value: function() {
        return {
          limit: 25,
          descending: true
        };
      }
    },

    opened: {
      type: Boolean,
      value: false
    }
  },

  observers: [
    '_resetOnClosed(opened)'
  ],

  listeners: {
    'tap': 'acceptSelection'
  },

  attached: function() {
    this.listen(window, 'request-object-changed', '_savedChanged');
    this.listen(window, 'request-objects-deleted', '_savedDeleted');
    this.listen(window, 'data-imported', '_refreshSaved');
  },

  detached: function() {
    this.unlisten(window, 'history-object-changed', '_savedChanged');
    this.unlisten(window, 'request-objects-deleted', '_savedDeleted');
    this.unlisten(window, 'data-imported', '_refreshSaved');
  },

  reset: function() {
    if (!this.queryOptions) {
      return; // not ready
    }
    delete this.queryOptions.startkey;
    delete this.queryOptions.skip;
    this._setQuerying(false);
    this.set('items', []);
    this.$.selector.selected = -1;
  },

  _resetOnClosed: function(opened) {
    if (opened) {
      this._makeQuery();
      return;
    }
    this.reset();
  },

  _refreshSaved: function() {
    this.reset();
    this._makeQuery();
  },

  /**
   * Highlight previous suggestion
   */
  selectPrevious: function() {
    if (!this.opened) {
      return;
    }
    this.$.selector.selectPrevious();
    this.ensureItemVisible(false);
  },
  /**
   * Highlight next suggestion
   */
  selectNext: function() {
    if (!this.opened) {
      return;
    }
    this.$.selector.selectNext();
    this.ensureItemVisible(true);
  },
  /**
   * Ensure that the selected item is visible in the scroller.
   * When there is more elements to show than space available (height)
   * then some elements will be hidden. When the user use arrows to navigate
   * the selection may get out from the screen. This function ensures that
   * currently selected element is visible.
   *
   * @param {Boolean} bottom If trully it will ensure that the element is
   * visible at the bottom of the container. On the top otherwise.
   */
  ensureItemVisible: function(bottom) {
    if (!this.opened) {
      return;
    }
    var container = this.scrollTarget;
    var index = this.$.selector.selected;
    if (bottom && index === 0) {
      this.scroll(0);
      return;
    }
    var toMove;
    if (!bottom && index === this.suggestions.length - 1) {
      toMove = container.scrollHeight - container.offsetHeight;
      this.scroll(0, toMove);
      return;
    }
    var item = this.$.selector.selectedItem;
    var containerOffsetHeight = bottom ? container.offsetHeight : 0;
    var itemOffsetHeight = bottom ? item.offsetHeight : 0;
    var visible = containerOffsetHeight + container.scrollTop;
    var treshold = item.offsetTop + itemOffsetHeight;
    if (bottom && treshold > visible) {
      toMove = item.offsetHeight + item.offsetTop - container.offsetHeight;
      this.scroll(0, toMove);
    } else if (!bottom && visible > treshold) {
      this.scroll(0, treshold);
    }
  },
  /**
   * Accepts currently selected suggestion and enters it into a text field.
   */
  acceptSelection: function() {
    if (!this.opened) {
      return;
    }
    var value = this.$.repeater.itemForElement(this.$.selector.selectedItem);
    var url = 'request/saved/' + encodeURIComponent(value._id);
    page(url);
  },

  _makeQuery: function() {
    this.debounce('saved-load-page', this._loadPage, 200);
  },

  _getDb: function() {
    return new PouchDB('saved-requests');
  },

  _loadPage: function() {
    var db = this._getDb();
    this._setQuerying(true);
    if (!this.items) {
      this.set('items', []);
    }

    if (!this.opened) {
      this.opened = true;
    }
    db.allDocs(this.queryOptions)
    .then((response) => {
      if (response && response.rows.length > 0) {
        this.queryOptions.startkey = response.rows[response.rows.length - 1].key;
        this.queryOptions.skip = 1;
        let res = response.rows.map((i) => i.id);
        res = this._processResults(res);
        res.forEach((item) => {
          this.push('items', item);
        });
      }
      this._setQuerying(false);
    })
    .catch((e) => {
      this._setQuerying(false);
      this.fire('app-log', {
        message: ['Query history', e],
        level: 'error'
      });
      console.error('Query history', e);
    });
  },

  _processResults: function(res) {
    res = res.map((item) => {
      //"NAME/URL/METHOD"
      let parts  = item.split('/');
      let name = decodeURIComponent(parts[0]);
      // let url = decodeURIComponent(parts[1]);
      let method = decodeURIComponent(parts[2]);
      return {
        _id: item,
        name: name,
        method: method
      };
    });
    // sort by updated
    res.sort(this._sortFunction);
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

  _computeMethodClass: function(method) {
    if (!method) {
      return;
    }
    method = method.toLowerCase();
    var clazz = 'method ';
    switch (method) {
      case 'get':
      case 'post':
      case 'put':
      case 'delete':
      case 'patch':
        clazz += method;
        break;
    }
    return clazz;
  },

  _scrollHandler: function() {
    if (this.querying || !this.opened) {
      return;
    }
    var elm = this;
    if (!elm) {
      return;
    }
    var delta = elm.scrollHeight - (elm.scrollTop + elm.offsetHeight);
    if (delta < 120) {
      this._makeQuery();
    }
  },

  _computeHasItems: function(record) {
    if (!record || !record.base || !record.base.length) {
      return false;
    }
    return true;
  },

  _computeShowEmptyMessage: function(hasItems, querying) {
    return !hasItems && !querying;
  },

  _savedChanged: function(e) {
    var changedItem = e.detail.request;
    var id = changedItem._id;
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
      items.push(changedItem);
      items.sort(this._sortFunction);
      this.set('items', items);
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
