(function() {
'use strict';

window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * The `RequestsListViewBehavior` contains a method for fiews that contain a list of requests.
 *
 * @polymerBehavior ArcBehaviors.RequestsListViewBehavior
 */
window.ArcBehaviors.RequestsListViewBehaviorImpl = {
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
      notify: true
    },
    /**
     * Table sort direction
     */
    dir: {
      type: String,
      value: 'asc',
      notify: true
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
      type: Boolean
    },
    /**
     * If true the details drowe will narrow.
     */
    narrowDrawer: {
      type: Boolean,
      value: true
    },
    /** True if all items are checked */
    allChecked: Boolean,
    /** Idndicates that this is a history view */
    isHistory: {
      type: Boolean,
      value: false
    }
  },

  attached: function() {
    this.scrollTarget = document.querySelector('#headerPanelMain').scroller;
    this.listen(this.scrollTarget, 'scroll', '_scrollHandler');
  },

  detached: function() {
    this.unlisten(this.scrollTarget, 'scroll', '_scrollHandler');
  },

  /**
   * Get scroll target element.
   *
   * @return {Element} an elemet that is a scroll target.
   */
  get scroller() {
    return this.scrollTarget;
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
  warnClearAll: function() {
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
    this.fire('clear-data', {
      isHistory: this.isHistory
    });
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

  _scrollHandler: function() {
    this.fire('content-scroll');
  }
};

window.ArcBehaviors.RequestsListViewBehavior = [
  Polymer.IronScrollTargetBehavior,
  ArcBehaviors.RequestsListViewBehaviorImpl
];
})();
