(function() {
'use strict';
/* global CodeMirror */

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
      readOnly: true,
      value: 0
    },
    /**
     * True when content is parsing.
     */
    loading: {
      type: Boolean,
      notify: true,
      readOnly: true,
      value: false
    },
    timeout: Number
  },
  observers: [
    '_changed(code, mode)'
  ],
  _changed: function() {
    this._setLoading(true);
    this.$.output.innerHTML = '';
    var val = this.mode.split(';')[0];
    var m = /.+\.([^.]+)$/.exec(val);
    var mode;
    var spec;
    if (m) {
      let info = CodeMirror.findModeByExtension(m[1]);
      if (info) {
        mode = info.mode;
        spec = info.mime;
      }
    } else if (/\//.test(val)) {
      let info = CodeMirror.findModeByMIME(val);
      if (info) {
        mode = info.mode;
        spec = val;
      }
    } else {
      mode = spec = val;
    }
    if (this._loaded.indexOf(mode) !== -1) {
      this._runParser(mode);
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
      this._runParser(mode);
      this._loaded.push(mode);
    });
  },

  _runParser: function(mode) {
    console.time('CodeMirror highlight');
    CodeMirror.runMode(this.code, mode, this._appendParsed.bind(this));
    console.timeEnd('CodeMirror highlight');
  },

  _callLoadedEnd: function() {
    if (this.loading) {
      this._setLoading(false);
    }
  },

  _appendParsed: function(text, style) {
    if (this.timeout) {
      this.cancelAsync(this.timeout);
    }
    if (!this.loading) {
      this._setLoading(true);
    }
    this.async(function() {
      this.__appendParsed(text, style);
    });
    this.async(this._callLoadedEnd, 200);
  },

  __appendParsed: function(text, style) {
    if (text === '\n') {
      this.$.output.appendChild(document.createTextNode(text));
      this._setCol(0);
      return;
    }
    // var content = '';
    // var col = this.col;
    // // replace tabs
    // for (var pos = 0;;) {
    //   let idx = text.indexOf('\t', pos);
    //   if (idx === -1) {
    //     content += text.slice(pos);
    //     col += text.length - pos;
    //     break;
    //   } else {
    //     col += idx - pos;
    //     content += text.slice(pos, idx);
    //     var size = CodeMirror.defaults.tabSize - col % CodeMirror.defaults.tabSize;
    //     col += size;
    //     for (var i = 0; i < size; ++i) {
    //       content += ' ';
    //     }
    //     pos = idx + 1;
    //   }
    // }
    // this._setCol(col);
    var content = text;
    if (style) {
      // console.log(style);
      var sp = this.$.output.appendChild(document.createElement('span'));
      sp.className = 'cm-' + style.replace(/ +/g, ' cm-');
      sp.appendChild(document.createTextNode(content));
    } else {
      this.$.output.appendChild(document.createTextNode(content));
    }
  }
});
})();
