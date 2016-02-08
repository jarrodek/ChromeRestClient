Polymer({
  is: 'arc-project-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  /**
   * List projects.
   */
  query: function() {
    this.genericQuery('projectObjects');
  }
});
