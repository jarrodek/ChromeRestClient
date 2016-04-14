(function() {
  'use strict';
  Polymer({
    is: 'search-bar',
    behaviors: [
      Polymer.IronOverlayBehavior,
      Polymer.IronResizableBehavior
    ],
    properties: {
      noCancelOnOutsideClick: {
        type: Boolean,
        value: true
      },
      // Current text search value
      value: {
        type: String,
        value: '',
        notify: true
      },

      searchCount: {
        type: Number,
        value: 0,
        readOnly: true
      },

      selected: {
        type: Number,
        value: 0,
        readOnly: true
      },

      /**
       * Last target for `search-counted`. The `search-mark` event will be fired back with
       * this value.
       */
      target: HTMLElement,
      // A search input element
      input: {
        type: Object,
        value: function() {
          return this.$.input;
        }
      }
    },

    observers: [
      '_searchOpened(opened)',
      '_valueChanged(value)'
    ],

    // listeners: {
    //   'search-counted': '_onSearchCount'
    // },

    attached: function() {
      this.listen(document.body, 'search-counted', '_onSearchCount');
    },

    detached: function() {
      this.unlisten(document.body, 'search-counted', '_onSearchCount');
    },

    _searchOpened: function(opened) {
      var value = null;
      if (opened) {
        value = this.value;
      }
      this.fire('iron-signal', {
        name: 'search-bar-opened-changed',
        data: {
          opened: opened,
          value: value
        }
      });
    },

    _valueChanged: function(value) {
      // console.log('--no-save', 'Search value changed (search bar)', value);
      this.fire('iron-signal', {
        name: 'search-input-changed',
        data: {
          value: value,
          lastTarget: this.target
        }
      });
    },
    /**
     * A handler for event fired by elements that implement search in text functionality.
     * Number received in `e.detail` will be used in display as a number of occuances.
     *
     * If more than one element may fire the event at the same time, a controller element should
     * intersept the event, cancel it and in debuncer fire sum of the events.
     *
     * @param {CustomEvent} e e.detail contains a number of occuances.
     */
    _onSearchMarkCount: function(e) {
      var n = Number(e.detail.count);
      if (n !== n) {
        n = 0;
      }
      if (this.searchCount === 0 && n > 0) {
        this.fire('iron-signal', {
          name: 'search-position-changed',
          data: {
            position: 0,
            searchTarget: this.target
          }
        });
        this._setSelected(1);
      } else if (n === 0) {
        this._setSelected(0);
      }
      this._setSearchCount(n);
      this.target = e.detail.searchTarget;
    },

    // Send signal to highlight next occuance.
    highlightPrevious: function() {
      var pos = this.selected;
      if (pos <= 1) {
        pos = this.searchCount;
      } else {
        pos--;
      }
      this._setSelected(pos);
      this.fire('iron-signal', {
        name: 'search-position-changed',
        data: {
          position: pos - 1,
          searchTarget: this.target
        }
      });
    },
    // Send signal to highlight previous occuance.
    highlightNext: function() {
      var pos = this.selected;
      if (pos >= this.searchCount) {
        pos = 1;
      } else {
        pos += 1;
      }
      this._setSelected(pos);
      this.fire('iron-signal', {
        name: 'search-position-changed',
        data: {
          position: pos - 1,
          searchTarget: this.target
        }
      });
    }
  });
})();
