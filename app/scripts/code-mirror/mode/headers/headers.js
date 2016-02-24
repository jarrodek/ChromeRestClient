// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object') { // CommonJS
    mod(require('../../lib/codemirror'));
  } else if (typeof define == 'function' && define.amd) {// AMD
    define(['../../lib/codemirror'], mod);
  } else { // Plain browser env
    mod(CodeMirror);
  }
})(function(CodeMirror) {
'use strict';

CodeMirror.defineMode('http-headers', function() {

  function failFirstLine(stream, state) {
    stream.skipToEnd();
    state.cur = header;
    return 'error';
  }

  function start(stream, state) {
    if (stream.match(/^[A-Z]+/) && /[ \t]/.test(stream.peek())) {
      state.cur = requestPath;
      return 'keyword';
    } else {
      return failFirstLine(stream, state);
    }
  }

  function requestPath(stream, state) {
    stream.eatWhile(/\S/);
    state.cur = header;
    return 'string-2';
  }

  function header(stream) {
    if (stream.sol() && !stream.eat(/[ \t]/)) {
      if (stream.match(/^.*?:/)) {
        return 'atom';
      } else {
        stream.skipToEnd();
        return 'error';
      }
    } else {
      stream.skipToEnd();
      return 'string';
    }
  }

  function body(stream) {
    stream.skipToEnd();
    return null;
  }

  return {
    token: function(stream, state) {
      var cur = state.cur;
      if (cur !== header && cur !== body && stream.eatSpace()) {
        return null;
      }
      return cur(stream, state);
    },

    blankLine: function(state) {
      state.cur = body;
    },

    startState: function() {
      return {cur: start};
    }
  };
});

CodeMirror.defineMIME('message/http-headers', 'http-headers');

});
