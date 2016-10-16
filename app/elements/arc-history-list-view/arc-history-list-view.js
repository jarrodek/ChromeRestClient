
Polymer({
  is: 'arc-history-list-view',
  behaviors: [
    ArcBehaviors.RequestsListViewBehavior
  ],

  _computeTimeSort: function(usePouchDb) {
    return usePouchDb ? 'created' : 'har.pages.-1.startedDateTime';
  }
});
