'use strict';

Polymer({
  is: 'drive-list-view',

  properties: {
    items: {
      type: Array
    },
    query: {
      type: String,
      notify: true
    },
    selectedItem: Object,
    isSelected: {
      type: Boolean,
      value: true,
      computed: '_computeIsSelected(selectedItem)'
    },
    loading: Boolean
  },

  loadMoreData: function() {
    this.fire('more-data');
  },

  ready: function() {
    this.$.list.scrollTarget = this.$.threshold;
  },

  get scrollTarget() {
    return this.$.threshold;
  },

  computeSelectedClass: function(selected) {
    return selected ? 'iron-selected' : '';
  },

  _computeIsSelected: function(selectedItem) {
    return !!selectedItem;
  },

  openSearch: function() {
    if (this.$.searchIcon.icon === 'close') {
      this.$.titleArea.removeAttribute('mode', 'search');
      this.$.searchIcon.icon = 'search';
    } else {
      this.$.titleArea.setAttribute('mode', 'search');
      this.$.searchIcon.icon = 'close';
      this.$.driveSearchInput.focus();
    }
  },

  _searchAction: function() {
    this.fire('search');
  },

  _cancel: function() {
    this.fire('cancel');
  },

  _select: function() {
    if (!this.selectedItem) {
      return;
    }
    this.fire('file-selected', {
      selected: this.selectedItem
    });
  }
});
