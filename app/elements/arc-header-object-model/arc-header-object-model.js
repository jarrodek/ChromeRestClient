Polymer({
  is: 'arc-header-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],

  getObject: function() {
    return this.genericGetObject('headers');
  }
});
