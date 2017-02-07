Polymer({
  is: 'history-menu',

  behaviors: [
    ArcBehaviors.MenuListBehavior
  ],

  properties: {
    scrollTarget: {
      type: Object,
      value: function() {
        return this.$.list;
      }
    },

    includeDocs: {
      type: Boolean,
      value: true
    }
  },

  attached: function() {
    this.listen(window, 'history-object-changed', '_historyChanged');
    this.listen(window, 'request-objects-deleted', '_historyDeleted');
    this.listen(window, 'data-imported', 'refresh');
  },

  detached: function() {
    this.unlisten(window, 'history-object-changed', '_historyChanged');
    this.unlisten(window, 'request-objects-deleted', '_historyDeleted');
    this.unlisten(window, 'data-imported', 'refresh');
  },
  /**
   * Accepts currently selected suggestion and enters it into a text field.
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
    var url = 'request/history/' + encodeURIComponent(value._id);
    page(url);
  },

  _getDb: function() {
    return new PouchDB('history-requests');
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

  _historyChanged: function(e) {
    if (!this.opened) {
      return;
    }
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
      this._pushHistoryItem(e.detail.item);
    }
  },

  _pushHistoryItem: function(item) {
    item.hasHeader = true;
    item.header = 'Today';
    item.today = true;

    var firstItem = this.get(['items', 0]);
    if (firstItem && firstItem.today) {
      delete firstItem.hasHeader;
      delete firstItem.header;
      this.set(['items', 0], firstItem);
    }
    var items = [item].concat(this.items);
    this.set('items', items);
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
