(function() {
  'use strict';
  Polymer({
    is: 'project-list-items',
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
    /**
     * Fired when the name of an item has changed.
     * Handler is responsible for updating the state of the list outside
     * this element (since changes are not propagated outside this element)
     * and for storing relevant data to the datastore.
     *
     * @event saved-list-item-name-changed
     * @param {Object} item An object associated with this item.
     * @param {Number} index Object's index in the list.
     * @param {String} value New value of the name.
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
       * If true, the user selected some elements on list. Check the
       * `this.selectedItems` property to check for the selected elements.
       */
      hasSelection: {
        type: Boolean,
        value: false,
        computed: '_computeHasSelection(selectedItems.length)',
        notify: true
      },

      _nameInput: {
        type: HTMLElement,
        value: function() {
          return this.$.nameChangeInput;
        }
      },

      selectAll: Boolean
    },

    observers: [
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

    _computeRowClass: function(id, record) {
      if (!record || !record.base || !record.base.length) {
        return;
      }
      var index = record.base.findIndex((i) => i._id === id);
      return index !== -1 ? 'selected' : '';
    },

    _deleteItem: function(e) {
      this.fire('saved-list-item-delete', {
        item: e.model.get('item'),
        index: e.model.get('index')
      });
    },

    _navigateItem: function(e) {
      this.fire('saved-list-item-open', {
        item: e.model.get('item'),
        index: e.model.get('index')
      });
    },

    _computeHasSelection: function(length) {
      return !!length;
    },

    _toggleCheckbox: function(e) {
      this.$.selector.select(e.model.get('item'));
    },

    _onSelectItem: function(e) {
      e = Polymer.dom(e);
      var model = this.$.list.modelForElement(e.rootTarget);
      this.fire('saved-list-item-selection-changed', {
        item: model.get('item'),
        index: model.get('index'),
        selected: this.selectedItems.indexOf(model.get('item')) === -1
      });
    },

    _editName: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var name = e.model.get('item.name');
      this.currentEditredModel = e.model;
      this.$.nameChangeInput.value = name;

      e = Polymer.dom(e);
      this.$.nameChange.positionTarget = e.localTarget.parentElement ||
        e.localTarget;
      this.$.nameChange.opened = true;
    },

    _nameKeyDown: function(e) {
      if (e.keyCode !== 13) {
        return;
      }
      var model = this.currentEditredModel;
      var value = this.$.nameChangeInput.value;
      model.set('item.name', value);
      this.fire('saved-list-item-name-changed', {
        item: model.get('item'),
        index: model.get('index'),
        value: value
      });
      this.$.nameChange.opened = false;
    },

    _nameEditorClosed: function() {
      this.currentEditredModel = null;
      this.$.nameChangeInput.value = '';
    },

    _toggleSelectAll: function(selectAll) {
      if (selectAll) {
        if (this.selectedItems.length === this.items.length) {
          return;
        }
        this.items.forEach((i, index) => {
          this.$.selector.select(i);
          this.set(['items', index, 'selected'], true);
        });
      } else {
        if (this.selectedItems.length === 0) {
          return;
        }
        this.items.forEach((i, index) => {
          this.$.selector.deselect(i);
          this.set(['items', index, 'selected'], false);
        });
      }
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
    }
  });
})();
