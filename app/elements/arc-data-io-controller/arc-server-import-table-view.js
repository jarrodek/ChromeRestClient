'use strict';

Polymer({
  is: 'arc-server-import-table-view',
  properties: {
    requests: Object,
    selected: Object,
    sort: String,
    dir: String
  },
  importTap: function() {
    var selected = this.requests.filter(function(item) {
      return item.checked === true;
    });
    this.fire('import-action', {
      action: 'import',
      'items': selected
    });
  },
  cancelTap: function() {
    this.fire('import-action', {
      action: 'cancel'
    });
  },
  toggleSelection: function(event) {
    var item = this.$.requestsList.itemForElement(event.target);
    this.$.selector.select(item);
  },

  toggleAll: function() {
    if (this.allChecked) {
      this.requests.forEach(function(item, i) {
        this.set('requests.' + i + '.checked', true);
      });
    } else {
      this.requests.forEach(function(item, i) {
        this.set('requests.' + i + '.checked', false);
      });
    }
  },

  displayDate: function(time) {
    var options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    };
    var date = new Date(time);
    return date.toLocaleString('en-US', options);
    //return new Intl.DateTimeFormat(options).format(new Date(time));
  },

  _computeTableRowClass: function(checked) {
    var cls = 'table-values layout horizontal center';
    if (checked) {
      cls += ' checked';
    }
    return cls;
  },
  sortColumn: function(e) {
    e = Polymer.dom(e);
    if (!e.rootTarget.dataset.sort) {
      return;
    }
    var sortOpt = e.rootTarget.dataset.sort;
    var dir = 'asc';
    if (this.sort === sortOpt) {
      dir = this.dir === 'asc' ? 'desc' : 'asc';
    }
    this.set('sort', sortOpt);
    this.set('dir', dir);
  },
  computeSort: function(sortOpt, dir) {
    return function(a, b) {
      if (a[sortOpt] > b[sortOpt]) {
        return dir === 'asc' ? 1 : -1;
      }
      if (a[sortOpt] < b[sortOpt]) {
        return dir === 'asc' ? -1 : 1;
      }
      if (a[sortOpt] === b[sortOpt]) {
        return 0;
      }
    };
  },

  /**
   * Compute if adding data-sort attribute to the column name is required.
   *
   */
  computeSortColumn: function(sort, dir, column) {
    if (column !== sort) {
      return null;
    }
    return dir;
  }
});
