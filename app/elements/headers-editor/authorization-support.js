(function() {
'use strict';
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
    var value = btoa(enc);
    this.setValue(value);
  }
});
})();
