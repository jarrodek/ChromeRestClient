Polymer({
  is: 'arc-historyurl-model',

  behaviors: [
    ArcBehaviors.ArcModelBehavior
  ],

  getObject: function() {
    return this.genericGetObject('historyUrls');
  },

  save: function() {
    return this.genericSave('historyUrls');
  }
});
