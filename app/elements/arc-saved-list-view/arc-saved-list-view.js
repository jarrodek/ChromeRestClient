(function() {
'use strict';

Polymer({
  is: 'arc-saved-list-view',

  behaviors: [
    ArcBehaviors.RequestsListViewBehavior
  ],

  properties: {
    searchTerm: String,
    isSearch: Boolean,
    usePouchDb: Boolean
  },

  openDrive: function() {
    this.fire('open-drive');
  }

});
})();
