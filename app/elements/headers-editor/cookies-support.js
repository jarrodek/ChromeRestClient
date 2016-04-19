(function() {
'use strict';
/* global HeadersBehaviors */
Polymer({
  is: 'cookies-support',
  behaviors: [
    HeadersBehaviors.FillSupportBehavior
  ],
  hostAttributes: {
    'header-support': 'cookie'
  },
  properties: {
    withBackdrop: {
      type: Boolean,
      value: true
    },
    modal: {
      type: Boolean,
      value: true
    },
    // sizingTarget: {
    //   type: Object,
    //   value: function() {
    //     return this.$.scrollable;
    //   }
    // }
  },

  attached: function() {
    this.$.scrollable.dialogElement = this;
  },

  provideSupport: function() {
    var currentValue;
    if (this.model) {
      currentValue = this.model.get('item.value');
    } else if (this.target) {
      currentValue = this.target.value;
    } else {
      currentValue = this.value;
    }
    this._setCurrentValues(currentValue);
    this.open();
  },
  _setCurrentValues: function() {

  },

  _cancel: function(e) {
    this.cancel(e);
  },

  _select: function() {

    this.setValue('');
  }

});
})();
