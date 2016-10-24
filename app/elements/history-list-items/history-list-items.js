Polymer({
  is: 'history-list-items',
  /**
   * Fired when the user clicked on a delete button on an item.
   *
   * @event history-list-item-delete
   * @param {Object} item An object associated with this item.
   * @param {Number} index Object's index in the list.
   */
  /**
   * Fired when the user clicked on an open button on an item.
   *
   * @event history-list-item-open
   * @param {Object} item An object associated with this item.
   * @param {Number} index Object's index in the list.
   */
  /**
   * Fired when the user nearly scrolled to the ened of the list.
   * It usually means that the app should load more results.
   *
   * @event history-list-threshold
   */
  /**
   * Fired when the selection of an item changed.
   *
   * @event history-list-item-selection-changed
   * @param {Object} item An object associated with this item.
   * @param {Number} index Object's index in the list.
   * @param {Boolean} selected True if the item is currently being selected.
   * This mey not yet be reflected in other object states since this event
   * is fired while selection is happening.
   */
  properties: {
    // The list of history items to render.
    items: {
      type: Array,
      value: function() {
        return [];
      }
    },
    // List of selected items on the list.
    selectedItems: {
      type: Array,
      notify: true
    },
    /**
     * A list lower treshold when the `history-list-threshold` will be
     * fired. It should informa the app that the user nearly reached
     * the end of the list and new items should be loaded.
     */
    threshold: {
      type: Number,
      value: 80
    },
    /**
     * If true, the user selected some elements on list. Check the
     * `this.selectedItems` property to check for the selected elements.
     */
    hasSelection: {
      type: Boolean,
      value: false,
      computed: '_computeHasSelection(selectedItems.length)',
      notify: true
    },
    /**
     * If set meanins that the input data has grouping.
     * Each group will display a header and date will be limited to time only.
     * Header should display date for the group.
     *
     * Group item (first item of the group) should have `hasHeader` property set to `true`
     * and `header` property as a header label.
     */
    hasGrouping: {
      type: Boolean
    },
    // If provided it will highlight given word(s) on the list
    query: String,
    // Set this if the list is a search result
    isSearchResults: {
      type: Boolean,
      value: false
    },

    selectAll: Boolean
  },

  behaviors: [ArcBehaviors.TextSearchBehavior],

  observers: [
    '_sizeChanged(items.length)',
    '_toggleSelectAll(selectAll)'
  ],

  listeners: {
    'iron-select': '_onSelectItem',
    'iron-deselect': '_onSelectItem',
    'iron-activate': '_onSelectItem',
    'iron-changed': '_onSelectItem',
    'iron-change': '_onSelectItem'
  },

  hostAttributes: {
    'role': 'list'
  },

  _sizeChanged: function(length) {
    if (length) {
      this.async(() => {
        // this.$.list.notifyResize();
        this.$.scrollTheshold.clearTriggers();
      }, 2);
    }
  },

  _computeHistoryTime: function(timestamp, isSearchResults) {
    if (!timestamp) {
      return '';
    }
    var d = new Date(Number(timestamp));
    var options = {
      hour: 'numeric',
      minute: 'numeric'
    };
    if (isSearchResults) {
      options = Object.assign(options, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    try {
      return new Intl.DateTimeFormat(undefined, options).format(d);
    } catch (e) {
      console.warn(e);
      return '';
    }
  },

  _computeRowClass: function(selected) {
    var clazz = 'history-item';
    if (selected) {
      clazz += ' selected';
    }
    return clazz;
  },

  _deleteItem: function(e) {
    this.fire('history-list-item-delete', {
      item: e.model.get('item'),
      index: e.model.get('index')
    });
  },

  _navigateItem: function(e) {
    this.fire('history-list-item-open', {
      item: e.model.get('item'),
      index: e.model.get('index')
    });
  },

  _thresholdReached: function() {
    this.fire('history-list-threshold');
  },

  _computeHasSelection: function(length) {
    return !!length;
  },
  _toggleCheckbox: function(e) {
    this.$.list.toggleSelectionForItem(e.model.index);
  },
  /**
   * Use this method to add new items to the `items` array.
   * It will prohibit list jumping while changing the list object manually
   *
   * @param {Array} items List of items to add.
   */
  addItems: function(items) {
    if (!items || !items.length) {
      return;
    }
    items.forEach((i) => this.push('items', i));
  },

  _onSelectItem: function(e) {
    e = Polymer.dom(e);
    var model = this.$.list.modelForElement(e.rootTarget);
    this.fire('history-list-item-selection-changed', {
      item: model.get('item'),
      index: model.get('index'),
      selected: this.selectedItems.indexOf(model.get('item')) === -1
    });
  },

  _toggleSelectAll: function(selectAll) {
    if (selectAll) {
      if (this.selectedItems.length === this.items.length) {
        return;
      }
      this.items.forEach((i) => this.$.list.selectItem(i));
    } else {
      if (this.selectedItems.length === 0) {
        return;
      }
      this.items.forEach((i) => this.$.list.deselectItem(i));
    }
  },
});
