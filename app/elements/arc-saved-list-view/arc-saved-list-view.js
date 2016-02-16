'use strict';

Polymer({
  is: 'arc-saved-list-view',
  properties: {
    /**
     * A list of requests to display.
     */
    requests: {
      type: Array,
      notify: true
    },
    /**
     * A list of selected items.
     */
    selected: Object,
    /**
     * Table sort property.
     * Name property requires special treatment since the `title` property for the object
     * is deep inside HAR object.
     */
    sort: {
      type: String,
      value: 'title'
    },
    /**
     * Table sort direction
     */
    dir: {
      type: String,
      value: 'asc'
    },
    /**
     * Determined which header state to show.
     */
    tableHeaderState: {
      type: Number,
      value: 0,
      computed: '_computeTableHeaderState(hasSelectedItems)'
    },
    /**
     * True if there are some items selected.
     */
    hasSelectedItems: {
      type: Boolean,
      value: false,
      computed: '_computeHasSelected(selected.length)'
    },
    /**
     * A request to show in detailed view.
     *
     * @type {RequestObject}
     */
    detailedRequest: Object,

    querying: {
      type: Boolean,
      value: true
    },

    // headerAnimationConfig: {
    //   value: function() {
    //     return {
    //       'entry': {
    //         name: 'slide-from-right-animation',
    //         node: this.$.tableTitle,
    //         timing: {
    //           delay: 0,
    //           duration: 150
    //         }
    //       },
    //       'exit': {
    //         name: 'slide-left-animation',
    //         node: this.$.tableTitle
    //       }
    //     };
    //   }
    // },
    /**
     * If true the details drowe will narrow.
     */
    narrowDrawer: {
      type: Boolean,
      value: true
    },

    allChecked: Boolean
  },

  // observers: [
  //   '_sortChanged(sort,dir)'
  // ],

  get scroller() {
    return this.$.table;
  },

  _sortChanged: function(sort, dir) {
    this.fire('sort-option-changed', {
      'sort': sort,
      'dir': dir
    });
  },

  /** Toggle all checkboxes in the list */
  toggleAll: function() {
    if (this.allChecked) {
      this.requests.forEach((item, i) => {
        this.set('requests.' + i + '.selected', true);
        this.$.selector.select(this.requests[i]);
      });
    } else {
      this.requests.forEach((item, i) => {
        this.set('requests.' + i + '.selected', false);
        this.$.selector.deselect(this.requests[i]);
      });
    }
  },
  /** Called on selection change. It will select / deselect an item in an ArraySelector. */
  _onItemToggle: function(e) {
    var item = this.$.requestList.itemForElement(e.target);
    if (typeof item.selected === 'undefined') {
      item.selected = true;
    }
    if (item.selected) {
      this.$.selector.select(item);
    } else {
      this.$.selector.deselect(item);
    }
  },
  /** Compute, based on number of `selected` if action header should be shown */
  _computeTableHeaderState: function() {
    return this.hasSelectedItems ? 1 : 0;
  },
  /**
   * Compute table header class name.
   * If there are some selected items it should have `selected` state.
   */
  _computeTableHeaderClass: function() {
    var cls = 'table-header';
    if (this.selected && this.selected.length > 0) {
      cls += ' active';
    }
    return cls;
  },
  /** Set attribute `hasSelectedItems` when the user selected items. */
  _computeHasSelected: function(len) {
    return len;
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
      let aProp = a[sortOpt];
      let bProp = b[sortOpt];

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
   */
  computeSortColumn: function(sort, dir, column) {
    if (column !== sort) {
      return null;
    }
    return dir;
  },
  /**
   * Open a dialog box with confirmation message before clearing the storage.
   */
  _confirmClearSaved: function() {
    this.$.dataClearDialog.open();
  },
  /**
   * User confirm removing all data.
   * Send an event to the controller to remove all items.
   */
  onClearDialogResult: function(e) {
    if (e.detail.canceled || !e.detail.confirmed) {
      return;
    }
    this.fire('clear-saved');
  },
  /**
   * Export selected items to file.
   */
  exportSelected: function() {
    if (this.selected.length === 0) {
      this.$.noSelectionToast.open();
      return;
    }
    this.fire('export-requested', {
      data: this.selected
    });
  },

  deleteSelected: function() {
    if (this.selected.length === 0) {
      this.$.noSelectionToast.open();
      return;
    }
    this.fire('delete-requested', {
      data: this.selected
    });
  },

  _showRequestDetails: function(e) {
    var item = this.$.requestList.itemForElement(e.target);
    var index = this.$.requestList.indexForElement(e.target);
    this.set('detailedRequest', item);
    this.set('requests.' + index + '.selected', true);
    this.narrowDrawer = false;
    this.$.details.openDrawer();
  },

  closeDetailsPanel: function() {
    this.narrowDrawer = true;
    this.$.details.closeDrawer();
  },

  _tableScroll: function() {
    this.fire('scroll');
  }
});
