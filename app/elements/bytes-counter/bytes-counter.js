Polymer({
  is: 'bytes-counter',
  properties: {
    // A text that will be evaluated.
    value: String,
    // Number of bytes calculated from the value
    bytes: {
      type: Number,
      notify: true,
      readOnly: true
    }
  },

  observers: [
    '_valueChanged(value)'
  ],

  _valueChanged: function(value) {
    if (!value) {
      this._setBytes(0);
      return;
    }
    if (typeof value !== 'string') {
      this._setBytes(0);
      return;
    }
    var cnt = this.calculateBytes(value);
    this._setBytes(cnt);
  },

  // http://stackoverflow.com/a/23329386/1127848
  calculateBytes: function(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i);
      if (code > 0x7f && code <= 0x7ff) {
        s++;
      } else if (code > 0x7ff && code <= 0xffff) {
        s += 2;
      }
      if (code >= 0xDC00 && code <= 0xDFFF) {
        i--; //trail surrogate
      }
    }
    return s;
  }
});
