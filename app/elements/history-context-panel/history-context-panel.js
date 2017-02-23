Polymer({
  is: 'history-context-panel',

  behaviors: [
    Polymer.IronOverlayBehavior,
    Polymer.IronScrollTargetBehavior
  ],

  properties: {
    /**
     * A target input field to observe.
     * This may be an ID if the field or an element itself.
     *
     * If this is set the element will not display it's own input field.
     * @type {HTMLElement}
     */
    target: HTMLElement,
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
        return this.$.container;
      }
    },

    sizingTarget: {
      type: HTMLElement,
      value: function() {
        return this.$.container;
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
  },

  observers: [
    '_targetChanged(target, isAttached)',
    '_resetOnClosed(opened)',
    '_checkResults(querying, items)'
  ],

  listeners: {
    'tap': 'acceptSelection'
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
      return;
    }
    this.reset();
  },

  /* Handler for target property change. */
  _targetChanged: function(target, isAttached) {
    if (!isAttached) {
      return;
    }
    this.resetFit();
    if (this._oldTarget) {
      this.unlisten(this._oldTarget, 'focus', '_targetFocus');
      this.unlisten(this._oldTarget, 'input', '_targetInput');
      this._oldTarget = null;
    }
    if (!target) {
      return;
    }
    if (typeof target === 'string') {
      this.target = this.domHost ? this.domHost.$[target] :
            Polymer.dom(this.ownerDocument).querySelector('#' + target);
      //this will call the function again with the element attached.
    } else if (target) {
      this.listen(target, 'focus', '_targetFocus');
      this.listen(target, 'input', '_targetInput');
      this._oldTarget = target;
      if (target === document.activeElement) {
        this._targetFocus();
      }
    }
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
    if (!bottom && index === this.items.length - 1) {
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
    this.opened = false;
  },

  _targetInput: function() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
  },

  _targetFocus: function() {
    if (this.opened) {
      return;
    }
    this.async(this._makeQuery, 1);
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
      this.opened = false;
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
          item.today = true;
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
    var elm = this.$.container;
    if (!elm) {
      return;
    }
    var delta = elm.scrollHeight - (elm.scrollTop + elm.offsetHeight);
    if (delta < 120) {
      this._makeQuery();
    }
  },

  _checkResults: function(querying, items) {
    if (!querying && items && !items.length) {
      this.opened = false;
    }
  },

  _computeHasItems: function(record) {
    var items = record.base;
    return !!(items && items.length);
  }

});
