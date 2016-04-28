(function() {
'use strict';
/* global HeadersBehaviors, Cookies */
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
    if (this.cookies.length === 0) {
      this.addEmptyCookie();
    }
    this.open();
    this.async(() => {
      this.notifyResize();
    }, 1);
  },
  _setCurrentValues: function(currentValue) {
    var cookies = new Cookies(currentValue).cookies;
    if (cookies) {
      cookies.forEach((item) => {
        if (item.expires) {
          let exp = new Date(item.expires);
          if (exp.toString() === 'Invalid Date') {
            item.expires = undefined;
          } else {
            //The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS".
            let y = exp.getFullYear();
            let m = exp.getMonth() + 1;
            let d = exp.getDate();
            let h = exp.getHours();
            let mi = exp.getMinutes();
            let s = exp.getSeconds();
            if (m < 10) {
              m = '0' + m;
            }
            if (d < 10) {
              d = '0' + d;
            }
            if (h < 10) {
              h = '0' + h;
            }
            if (mi < 10) {
              mi = '0' + mi;
            }
            if (s < 10) {
              s = '0' + s;
            }
            let str = `${y}-${m}-${d}T${h}:${mi}:${s}`;
            item.expires = str;
          }
        }
      });
    } else {
      cookies = [];
    }
    this.set('cookies', cookies);
  },

  _cancel: function(e) {
    this.cancel(e);
  },

  _setValue: function() {
    var list = this.cookies;
    var cookies = new Cookies();
    list.forEach((item) => {
      if (!item.name) {
        return;
      }
      let opts = {};
      if (item.domain) {
        opts.domain = item.domain;
      }
      if (item.path) {
        opts.path = item.path;
      }
      if (item.expires) {
        opts.expires = item.expires;
      }
      cookies.set(item.name, item.value, opts);
    });
    var result = cookies.toString(true);
    this.setValue(result);
  },

  addEmptyCookie: function() {
    this.push('cookies', {
      'name': '',
      'value': ''
    });
    this.async(() => {
      this.notifyResize();
    }, 1);
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
