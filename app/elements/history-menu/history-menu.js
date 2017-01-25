Polymer({
  is: 'history-menu',

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
          descending: true,
          // jscs:disable
          include_docs: true
          // jscs:enable
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
    this.listen(window, 'history-object-changed', '_historyChanged');
    this.listen(window, 'request-objects-deleted', '_historyDeleted');
    this.listen(window, 'data-imported', '_refreshHistory');
  },

  detached: function() {
    this.unlisten(window, 'history-object-changed', '_historyChanged');
    this.unlisten(window, 'request-objects-deleted', '_historyDeleted');
    this.unlisten(window, 'data-imported', '_refreshHistory');
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

  _refreshHistory: function() {
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
    var url = 'request/history/' + encodeURIComponent(value._id);
    page(url);
  },

  _makeQuery: function() {
    this.debounce('history-load-page', this._loadPage, 200);
  },

  _getDb: function() {
    return new PouchDB('history-requests');
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
        let res = response.rows.map((i) => i.doc);
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
      if (!item.updated || item.updated !== item.updated) {
        if (item.created && item.created === item.created) {
          item.updated = item.created;
        } else {
          item.updated = Date.now();
        }
      }
      return item;
    });
    // sort by updated
    res.sort((a, b) => {
      if (a.updated > b.updated) {
        return -1;
      }
      if (a.updated < b.updated) {
        return 1;
      }
      return 0;
    });

    var _now = new Date();
    _now.setMilliseconds(0);
    _now.setSeconds(0);
    _now.setMinutes(0);
    _now.setHours(0);
    var today = _now.getTime();
    var yesterday = today - 86400000; // 24 h milliseconds

    // The results must be sorted before here.
    var days = [];
    res = res.map((item) => {
      let info = this._computeHistoryTime(item._id.split('/')[0]);
      if (!info) {
        return null;
      }
      let date = info.formatted;
      if (days.indexOf(date) === -1) {
        days[days.length] = date;

        let time = info.time;
        if (time === today) {
          date = 'Today';
        } else if (time === yesterday) {
          date = 'Yesterday';
        }
        item.hasHeader = true;
        item.header = date;
      }
      return item;
    })
    .filter((i) => !!i);

    return res;
  },

  _computeHistoryTime: function(date) {
    var d = new Date(Number(date));
    var _t = d.getTime();
    if (_t !== _t) {
      return '';
    }
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return {
      formatted: new Intl.DateTimeFormat(undefined, options).format(d),
      time: _t
    };
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

  _historyChanged: function(e) {
    var id = e.detail.id;
    var items = this.items;
    if (!items) {
      this.set('items', []);
    }
    if (!this.items.length) {
      this.push('items', e.detail.item);
      return;
    }
    var index = items.findIndex((i) => i._id === id);
    if (index === -1) {
      items = [e.detail.item].concat(items);
      this.set('items', items);
    }
  },

  _historyDeleted: function(e) {
    if (e.detail.type !== 'history') {
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
