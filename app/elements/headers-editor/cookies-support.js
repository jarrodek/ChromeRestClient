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
    // list of cookies displayed in a form.
    cookies: {
      type: Array,
      value: function() {
        return [];
      }
    }
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
  },

  addEmptyCookie: function() {
    this.push('cookies', {
      'name': '',
      'value': ''
    });
    this.notifyResize();
  },

  _removeCookie: function(e) {
    var index = this.$.list.indexForElement(e.target);
    this.splice('cookies', index, 1);
    // this.updateHeaders();
  },

  _openCookieDetail: function(e) {
    var model = this.$.list.modelForElement(e.target);
    model.set('item.details', !model.get('item.details'));
  }

});
})();
