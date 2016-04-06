(function() {
'use strict';

/* global HeadersBehaviors */

Polymer({
  is: 'authorization-support',
  behaviors: [
    HeadersBehaviors.FillSupportBehavior
  ],
  hostAttributes: {
    'header-support': 'authorization'
  },
  properties: {
    login: String,
    password: String
  },

  provideSupport: function() {
    var currentValue = this.target.value;
    if (currentValue) {
      currentValue = currentValue.replace('Basic ', '');
      currentValue = currentValue.replace('basic ', '');
      currentValue = currentValue.trim();
      let enc;
      try {
        enc = atob(currentValue);
      } catch (e) {}
      if (enc) {
        let parts = enc.split(':');
        if (parts.length) {
          this.set('login', parts[0]);
          if (parts[1]) {
            this.set('password', parts[1]);
          }
        }
      }
    }
    this.open();
  },

  _cancel: function() {
    this.close();
  },

  _select: function() {
    var enc = `${this.login}:${this.password}`;
    var value = 'Basic ' + btoa(enc);
    this.setValue(value);
  }
});
})();
