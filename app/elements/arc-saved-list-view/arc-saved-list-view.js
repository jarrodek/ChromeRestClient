'use strict';

Polymer({
  is: 'arc-saved-list-view',

  behaviors: [
    ArcBehaviors.RequestsListViewBehavior
  ],

  openDrive: function() {
    this.fire('open-drive');
  }
});
