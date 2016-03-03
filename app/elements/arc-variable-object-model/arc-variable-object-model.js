Polymer({
  is: 'arc-variable-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  query: function() {
    return this.genericQuery('variables');
  }
});
