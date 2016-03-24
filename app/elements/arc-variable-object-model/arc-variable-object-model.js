Polymer({
  is: 'arc-variable-object-model',
  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],
  query: function() {
    return this.genericQuery('variables');
  },
  /**
   * Save current `data` to the database.
   */
  save: function() {
    if (!this.data) {
      return Dexie.Promise.reject(new Error('Nothing to save.'));
    }
    return this.genericSave('variables');
  }
});
