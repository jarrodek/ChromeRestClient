Polymer({
  is: 'arc-header-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  query: function() {
    return this.genericQuery('headers');
  }
});
