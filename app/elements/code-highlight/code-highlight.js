'use strict';

Polymer({
  is: 'code-highlight',
  properties: {
    code: String,
    mode: String,
    _loaded: {
      type: Array,
      value: []
    },
    _parsed: {
      type: Array,
      value: []
    },
    col: {
      type: Number,
      readOnly: true
    }
  },
  observers: [
    '_changed(code, mode)'
  ],
  _changed: function() {
    this.$.output.innerHTML = '';
    var val = this.mode.split(';')[0];
    var m = /.+\.([^.]+)$/.exec(val);
    var mode;
    var spec;
    if (m) {
      var info = CodeMirror.findModeByExtension(m[1]);
      if (info) {
        mode = info.mode;
        spec = info.mime;
      }
    } else if (/\//.test(val)) {
      var info = CodeMirror.findModeByMIME(val);
      if (info) {
        mode = info.mode;
        spec = val;
      }
    } else {
      mode = spec = val;
    }
    if (this._loaded.indexOf(mode) !== -1) {
      CodeMirror.runMode(this.code, mode, this._appendParsed.bind(this));
    } else {
      this._loadMode(mode);
    }
  },
  /**
   * Load mode JavaScript library.
   */
  _loadMode: function(mode) {
    CodeMirror.modeURL = '/bower_components/codemirror/mode/%N/%N.js';
    CodeMirror.requireMode(mode, () => {
      CodeMirror.runMode(this.code, mode, this._appendParsed.bind(this));
      this._loaded.push(mode);
    });
  },

  _appendParsed: function(text, style) {
    if (text === '\n') {
      this.$.output.appendChild(document.createTextNode(text));
      this._setCol(0);
      return;
    }
    var content = '';
    var col = this.col || 0;
    // replace tabs
    for (var pos = 0;;) {
      let idx = text.indexOf('\t', pos);
      if (idx == -1) {
        content += text.slice(pos);
        col += text.length - pos;
        break;
      } else {
        col += idx - pos;
        content += text.slice(pos, idx);
        var size = CodeMirror.defaults.tabSize - col % CodeMirror.defaults.tabSize;
        col += size;
        for (var i = 0; i < size; ++i) {
          content += ' ';
        };
        pos = idx + 1;
      }
    }
    this._setCol(col);
    if (style) {
      var sp = this.$.output.appendChild(document.createElement('span'));
      sp.className = 'cm-' + style.replace(/ +/g, ' cm-');
      sp.appendChild(document.createTextNode(content));
    } else {
      this.$.output.appendChild(document.createTextNode(content));
    }
  }
});
