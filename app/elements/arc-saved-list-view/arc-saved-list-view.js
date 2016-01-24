Polymer({
  is: 'arc-saved-list-view',
  properties: {
    requests: {
      type: Array,
      notify: true
    },
    selected: Object,
    sort: String,
    dir: String
  },
  toggleAll: function() {
    if (this.allChecked) {
      this.requests.forEach((item, i) => {
        this.set('requests.' + i + '.checked', true);
      });
    } else {
      this.requests.forEach((item, i) => {
        this.set('requests.' + i + '.checked', false);
      });
    }
  },
  /**
   * Handler for column name click.
   */
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
  /**
   * Sort the table.
   */
  computeSort: function(sortOpt, dir) {
    return function(a, b) {
      let isName = sortOpt === 'title';
      let aProp = isName ? a.har.pages[0][sortOpt] : a[sortOpt];
      let bProp = isName ? b.har.pages[0][sortOpt] : b[sortOpt];
      
      if (aProp > bProp) {
        return dir === 'asc' ? 1 : -1;
      }
      if (aProp < bProp) {
        return dir === 'asc' ? -1 : 1;
      }
      if (aProp === bProp) {
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
  },

  _confirmClearSaved: function() {
    this.$.dataClearDialog.open();
  },

  onClearDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    this.fire('clear-saved');
  }
});
