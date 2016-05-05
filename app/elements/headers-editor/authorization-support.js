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
  // Sets values in form from current inpits in headers editor
  _setCurrentValues: function(currentValue) {
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
  },

  _cancel: function(e) {
    this.cancel(e);
  },

  _select: function() {
    var enc = `${this.login}:${this.password}`;
    var value = 'Basic ' + btoa(enc);
    this.setValue(value);
  },

  authTogglePassword: function(e) {
    var input = this.$.authDialogPassword;
    var icon = e.target;
    if (input.type === 'password') {
      input.type = 'text';
      icon.icon = 'visibility-off';
    } else {
      input.type = 'password';
      icon.icon = 'visibility';
    }
  },
});
})();
