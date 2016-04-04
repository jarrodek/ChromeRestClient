Polymer({
  is: 'arc-status-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  query: function() {
    return this.genericQuery('statuses');
  }
});
